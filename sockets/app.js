// TODO : 何が送られてきても例外で落ちないようにする
// TODO : 想定外のmessage送って来たクライアントは切断する
// TODO : init以外はroomとuserを必ずチェック。不正なら処理しない(&キック?)
// TODO : playerの認証をroomNameとplayerNameから、部屋が生成される度に変わるワンタイムのトークンに変える？
// TODO : 未使用トークンの（定期的な？）無効化処理をどこかでやる
// TODO : エラーログをファイルに出力

// TODO : 別のファイルに切り出して共有
var idLengthLimit = 36;
var roomNameLengthLimit = 20;
var commentLengthLimit = 40;
var playerNameLengthLimit = 20;
var passwordLengthLimit =  20;

var uuid = require('node-uuid');
var Room = require('./room.js').Room;
var Player = require('./player.js').Player;

// room を管理するオブジェクト
var rooms = {};
// 入室に使用するtokenを管理するオブジェクト
var reservedTokens = {};

// タイマー処理用オブジェクト
// TODO : 遅延が酷いようなら別の管理方法を検討する
var previousTime = new Date();
var roomTimer = setInterval(function () {
  "use strict";
  var newTime = new Date();
  // TODO : DEBUG
  if (Math.abs(newTime - previousTime - 1000) >= 50) {
    console.log('[delay]' + (newTime - previousTime));
  }
  // roomの時間経過タイマー処理を呼び出す
  timerProc();
  previousTime = newTime;
}, 1000);

/**
 * タイマー処理の中身
 */
function timerProc() {
  'use strict';
  // TODO : チェックを追加 jshint
  Object.keys(rooms).forEach(function (key) {
    rooms[key].timerProc();
  });
}

/**
 * socket.ioのコネクション設定
 */
exports.onConnection = function (client) {
  'use strict';
  // console.log('connected');

  client.emit('connected');

  //------------------------------
  // メッセージハンドラ定義(lobby)
  //------------------------------

  /**
   * lobby 初期化処理
   */
  client.on('init lobby', function () {
    // console.log("init lobby");

    client.join('lobby');

    updateLobby(client);
  });

  /**
   * 新規roomの作成を受け付ける
   */
  client.on('create room', function (data, fn) {
    // console.log('create room : ' + data.roomName);

    // パラメータチェック
    // TODO : dictionaryの仕様が決まったらチェック サイズ、単語数、etc
    if (typeof data === 'undefined' ||
        data === null ||
        !checkParamLength(data.roomName, roomNameLengthLimit,   true) ||
        !checkParamLength(data.userName, playerNameLengthLimit, true) ||
        !checkParamLength(data.comment,  commentLengthLimit,    false) ||
        !checkParamLength(data.password, passwordLengthLimit,   false)) {
      console.log('[create][bad param]');

      fn({ result: 'bad param' });
      return;
    }

    // 部屋名の重複チェック
    var keys = Object.keys(rooms);
    keys.forEach(function (key) {
      var room = rooms[key];
      if (room.name === data.roomName) {
        // console.log('create room exist')
  
        fn({ result: 'room exist' });
        return;
      }
    });

    // 作成OK

    // roomを作成
    var id = uuid.v4();
    rooms[id] = new Room(id, data.roomName, data.comment, data.password, data.dictionary);

    // 認証用トークン発行
    var token = uuid.v4();
    reservedTokens[token] = { roomID: id, userName: data.userName };

    fn({ result: 'ok', token: token });
  });

  /**
   * 既存roomへの入室を受け付ける
   */
  client.on('enter room', function (data, fn) {
    // console.log('enter room : ' + data.roomName);

    // TODO : 処理をRoomクラスに移動
    console.log(data.id);

    // パラメータチェック
    if (typeof data === 'undefined' ||
        data === null ||
        !checkParamLength(data.id, idLengthLimit, true) ||
        !checkParamLength(data.userName, playerNameLengthLimit, true) ||
        !checkParamLength(data.password, passwordLengthLimit, false)) {
      console.log('[enter][bad param]');

      fn({ result: 'bad param' });
      return;
    }

    // 部屋の存在チェック
    if (!rooms[data.id]) {
      // console.log('[enter][not exist]');

      fn({ result: 'not exist' });
      return;
    }

    var room = rooms[data.id];

    // パスワードチェック
    // TODO : パスワード未設定の場合はチェックしない。ブラウザ側で入力させないようにするか？
    if (room.password !== data.password) {
      // console.log('[enter][password ng]');

      fn({ result: 'password ng' });
      return;
    }

    // 部屋定員チェック
    if (room.isFull()) {
      // console.log('[enter][full]');

      fn({ result: 'full' });
      return;
    }

    // 名前重複チェック
    for (var i = 0; i < room.users.length; i += 1) {
      if (room.users[i].name === data.userName) {
        // console.log('[enter][name exist]');

        fn({ result: 'name exist' });
        return;
      }
    }

    // 入室OK

    // 認証用トークン発行
    var token = uuid.v4();
    reservedTokens[token] = { roomID: data.id, userName: data.userName };

    fn({ result: 'ok', token: token });
  });

  //------------------------------
  // メッセージハンドラ定義(room)
  //------------------------------

  /**
   * room 初期化処理
   */
  client.on('init room', function (data, callback) {
    // console.log('init room');

    // パラメータチェック
    if (typeof data === 'undefined' ||
        data === null ||
        typeof data.token === 'undefined' ||
        data.token === null ||
        typeof reservedTokens[data.token] === 'undefined' ||
        typeof reservedTokens[data.token] === null) {
      console.log('[init][bad param]');

      callback({ result: 'bad param' });
      return;
    }

    // TODO : 処理をRoomクラスに移す

    // 認証成功

    var roomID   = reservedTokens[data.token].roomID;
    var userName = reservedTokens[data.token].userName;
    var room = rooms[roomID];

    room.log('[enter]' + userName);

    // 認証token削除
    delete reservedTokens[data.token];

    // 部屋定員チェック
    if (room.users.length === room.playerCountMax) {
      // console.log('init room full');

      callback({ result: 'full' });
      return;
    }

    // 部屋にユーザー情報を登録
    var isReady = room.mode !== 'chat';
    room.users.push(new Player(userName, isReady, client));

    // socketに部屋とプレイヤーの情報を持たせておく
    client.set('roomID', roomID);
    client.set('userName', userName);

    // socketをroom毎にグループ化する
    client.join(roomID);

    if (room.imagelog.length > 0) {
      client.emit('push image first', room.imagelog);
    }

    // turn中ならヒントも送る
    if (room.mode === 'turn') {
      callback({ result: 'ok', mode: room.mode, theme: room.lastHint });
    } else {
      callback({ result: 'ok', mode: room.mode });
    }

    room.pushSystemMessage(userName + ' さんが入室しました');
    room.updateMember();
    updateLobby();
  });

  /**
   * chat の発言を処理する
   */
  client.on('send chat', function(message, fn) {
    // console.log('send chat');

    // TODO : ↓get 取得できなくてもエラーにならない？
    // 部屋IDとプレイヤー名をsocketから取り出す
    var roomID;
    client.get('roomID', function(err, _roomID) {
      if (err || !_roomID) { return; }
      roomID = _roomID;
    });
    var userName;
    client.get('userName', function(err, _userName) {
      if (err || !_userName) { return; }
      userName = _userName;
    });

    // TODO : 部屋の存在チェックはいらないか？存在しなくてもエラーにはならないはず？

    var room = rooms[roomID];

    if (!room.isValidMessage(message)) {
      // 無視する
      return;
    }

    room.procMessage(userName, message);
    // callbackで成功を通知
    // TODO : callbackの名前変える？
    fn();
  });

  /**
   *
   */
  client.on('send image', function (data) {
    // TODO : こまかいところ

    // 部屋IDとプレイヤー名をsocketから取り出す
    var roomID;
    client.get('roomID', function (err, _roomID) {
      if (err || !_roomID) { return; }
      roomID = _roomID;
    });
    var userName;
    client.get('userName', function (err, _userName) {
      if (err || !_userName) { return; }
      userName = _userName;
    });

    rooms[roomID].procImage(data, userName);
  });

  /**
   *
   */
  client.on('ready', function (fn) {
    // TODO : この処理定型的だから共通化したい
    // 部屋IDとプレイヤー名をsocketから取り出す
    var roomID;
    client.get('roomID', function (err, _roomID) {
      if (err || !_roomID) { return; }
      roomID = _roomID;
    });
    var userName;
    client.get('userName', function(err, _userName) {
      if (err || !_userName) { return; }
      userName = _userName;
    });

    if (!rooms[roomID]) {
      // TODO : room存在チェック === 比較に変更。他のメソッドにも追加
      // 代入してからのチェックでいいのか？
      return;
    }

    var room = rooms[roomID];

    // TODO : Roomで処理する
    for (var i = 0; i < room.users.length; i += 1) {
      if (room.users[i] !== null && room.users[i].name === userName) {
        // console.log('ready ' + userName);
        room.users[i].isReady = true;
        break;
      }
    }

    // callbackで成功を通知
    fn();

    room.updateMember();

    if (room.users.length >= 2 && room.isReady()) {
      room.changeModeReady();
    }
  });

  /**
   * バグ報告受付
   */
  client.on('send bug', function (message, callback) {
    console.log('[bug]' + '[' + message.from + ']' + message.message);
    callback();
  });

  // TODO : ↓見直し

  /**
   * socket切断時の後始末
   */
  client.on('disconnect', function() {
    // console.log('disconnect');

    var roomID;
    client.get('roomID', function (err, _roomID) {
      if (err || !_roomID) { return; }
      roomID = _roomID;
    });
    var userName;
    client.get('userName', function(err, _userName) {
      if (err || !_userName) { return; }
      userName = _userName;
    });

    // lobbyの場合 後始末不要
    if (!roomID || !userName) { return; }

    console.log('[disconnect]' + '[id:' + roomID + '][room:' + rooms[roomID].name + '][player:' + userName + ']');

    rooms[roomID].playerExit(userName);

    // playerがいなくなったらroomも削除する
    if (rooms[roomID].users.length === 0) {
      delete rooms[roomID];
    }

    updateLobby();
  });
};

//------------------------------
// メソッド定義
//------------------------------

/**
 * HTMLエスケープ処理 
 */
function escapeHTML (str) {
  'use strict';
  return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/**
 * client送信用のroom情報を取得する
 */
function getRoomsInfo () {
  'use strict';

  var roomsInfo = [];
  var keys = Object.keys(rooms);
  keys.forEach(function (key) {
    var room = rooms[key];
    roomsInfo.push({
      id:             room.id,
      name:           escapeHTML(room.name),
      comment:        escapeHTML(room.comment),
      password:       room.password ? true : false,
      dictionaryName: escapeHTML(room.dictionary.name),
      playerCount:    room.users.length,
      playerCountMax: room.playerCountMax
    });
  });
  return roomsInfo;
}

/**
 * lobby のユーザーに lobby 情報を送信する
 */
function updateLobby (client) {
  'use strict';

  if (typeof client === 'undefined' ||
      client === null) {
    // console.log('[update lobby][lobby all]');
    // ブロードキャスト
    sockets.to('lobby').emit('update lobby', getRoomsInfo());
  } else {
    // console.log('[update lobby][user]');
    // 要求ユーザーのみ
    client.emit('update lobby', getRoomsInfo());
  }
}

/**
 * nullとundefinedと文字数のチェック
 */
function checkParamLength (data, maxLength, required) {
  'use strict';

  if (required) {
    return typeof data !== 'undefined' &&
           data !== null &&
           data.length !== 0 &&
           data.length <= maxLength;
  } else {
    return typeof data === 'undefined' ||
           data === null ||
           data.length === 0 ||
           data.length <= maxLength;
  }
}
