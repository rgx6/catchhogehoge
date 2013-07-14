// TODO : XSS対策
// TODO : 何が送られてきても例外で落ちないようにする
// TODO : 想定外のmessage送って来たクライアントは切断する
// TODO : init以外はroomとuserを必ずチェック。不正なら処理しない(&キック?)
// TODO : playerの認証をroomNameとplayerNameから、部屋が生成される度に変わるワンタイムのトークンに変える？

var Room = require('./room.js').Room;
var Player = require('./player.js').Player;

// room を管理するオブジェクト
var rooms = {};

// タイマー処理用オブジェクト
// TODO : 遅延が酷いようなら別の管理方法を検討する
var previousTime = new Date();
var roomTimer = setInterval(function() {
  var newTime = new Date();
  // TODO : DEBUG
  if (Math.abs(newTime - previousTime - 1000) >= 10) {
    console.log('call interval ' + (newTime - previousTime) + ' ' + newTime.toLocaleTimeString());
  }
  // roomの時間経過タイマー処理本体を呼び出す
  timerProc();
  previousTime = newTime;
}, 1000);

/**
 * タイマー処理の中身
 */
function timerProc() {
  Object.keys(rooms).forEach(function(key) {
    rooms[key].timerProc();
  });
};

/**
 * socket.ioのコネクション設定
 */
exports.onConnection = function(client) {
  console.log('connected');

  client.emit('connected');

  //------------------------------
  // メッセージハンドラ定義(lobby)
  //------------------------------

  /**
   * lobby 初期化処理
   */
  client.on('init lobby', function() {
    console.log("init lobby");

    // lobby に join する
    client.join('lobby');

    // lobby 情報を送信
    updateLobby(client);
  });

  /**
   * 新規roomの作成を受け付ける
   */
  client.on('create room', function(data) {
    console.log('create room : ' + data.roomName);

    // パラメータチェック
    // TODO : dictionaryの仕様が決まったらチェック
    // TODO : 長さ上限もチェック必要
    // TODO : 長さチェックはパスワードにも必要
    if (data.roomName == null || data.userName == null) {
      console.log('create room bad param');
      client.emit('create room bad param');
      return;
    }

    // 部屋の存在チェック
    if (rooms[data.roomName] != null) {
      console.log('create room exist')
      client.emit('create room exist');
      return;
    }

    // 作成OK
    console.log('create room ok');

    // TODO : room作成のタイミングは画面遷移後に移すか？
    // TODO : XSS対策
    rooms[data.roomName] = new Room(data.roomName, data.comment, data.password);

    // 認証用トークン発行
    var token = Math.random();
    rooms[data.roomName].tokens[data.userName] = token;

    client.emit('create room ok', {
      roomName : data.roomName,
      userName : data.userName,
      token : token
    });
  });

  /**
   * 既存roomへの入室を受け付ける
   */
  client.on('enter room', function(data) {
    console.log('enter room : ' + data.roomName);

    // パラメータチェック
    // TODO : 長さチェックも必要
    if (data.roomName == null || data.userName == null) {
      console.log('enter room bad param');
      client.emit('enter room bad param');
      return;
    }

    // 部屋の存在チェック
    if (rooms[data.roomName] == null) {
      console.log('enter room not exist');
      client.emit('enter room not exist');
      return;
    }

    var room = rooms[data.roomName];

    // パスワードチェック
    if (room.password != data.password) {
      console.log('enter room password ng');
      client.emit('enter room password ng');
      return;
    }

    // TODO : うまく動いてない？
    // 名前重複チェック
    for (var user in room.users) {
      if (user.userName == data.userName) {
        console.log('enter room name exist');
        client.emit('enter room name exist');
        return;
      }
    }

    // 部屋定員チェック
    if (room.users.length == room.playerCountMax) {
      console.log('enter room full');
      client.emit('enter room full');
      return;
    }

    // 入室OK
    console.log('enter room ok');

    // 認証用トークン発行
    // TODO : 未使用トークンの（定期的な？）無効化処理をどこかでやる
    var token = Math.random();
    room.tokens[data.userName] = token;

    client.emit('enter room ok', {
      roomName : data.roomName,
      userName : data.userName,
      token : token
    });
  });

  //------------------------------
  // メッセージハンドラ定義(room)
  //------------------------------

  /**
   * room 初期化処理
   */
  client.on('init room', function(data) {
    console.log('init room');

    // パラメータチェック
    // TODO : 長さチェックも必要か？通常のフローではチェックの必要はないが……
    if (rooms[data.roomName] == null ||
        rooms[data.roomName].tokens[data.userName] == null ||
        rooms[data.roomName].tokens[data.userName] != data.token) {
      console.log('init room ng');
      client.emit('init room ng');
      return;
    }

    // 認証成功

    var room = rooms[data.roomName];

    // 認証token削除
    delete room.tokens[data.userName];

    // 部屋定員チェック
    if (room.users.length == room.playerCountMax) {
      console.log('init room full');
      client.emit('init room full');
      return;
    }

    // 部屋にユーザー情報を登録
    // TODO : 必要なプロパティを検討
    room.users.push(new Player(data.userName, client));

    // socket に部屋名とプレイヤー名を持たせておく
    client.set('roomName', data.roomName);
    client.set('userName', data.userName);

    // TODO : push system message 送信 ↓に含めるか？

    // TODO : lobbyのroomNameとかぶるといけない。が、prefixは付けたくない
    client.join(data.roomName);

    // TODO : 描画データ送信
    // TODO : ゲームの状態によってはお題なども表示

    client.emit('change mode', room.mode);
    room.pushSystemMessage(data.userName + ' さんが入室しました。');
    room.updateMember();
    updateLobby();
  });

  /**
   * chat の発言を処理する
   */
  client.on('send chat', function(message, fn) {
    console.log('send chat');

    // TODO : ↓get 取得できなくてもエラーにならない？
    // 部屋名とプレイヤー名を socket から取り出す
    var roomName;
    client.get('roomName', function(err, _roomName) {
      if (err || !_roomName)
        return;
      roomName = _roomName;
    });
    var userName;
    client.get('userName', function(err, _userName) {
      if (err || !_userName)
        return;
      userName = _userName;
    });

    // TODO : 部屋の存在チェックはいらないか？存在しなくてもエラーにはならないはず？

    var room = rooms[roomName];

    if (!room.isValidMessage(message)) {
      // 無視する
      return;
    };

    room.procMessage(userName, message);
    fn();
  });

  /**
   *
   */
  client.on('send image', function(data) {
    // TODO : こまかいところ

    // 部屋名とプレイヤー名を socket から取り出す
    var roomName;
    client.get('roomName', function(err, _roomName) {
      if (err || !_roomName)
        return;
      roomName = _roomName;
    });
    var userName;
    client.get('userName', function(err, _userName) {
      if (err || !_userName)
        return;
      userName = _userName;
    });

    // TODO : dataをためる。ただしclear, fillが送られてきた場合はためたdataを破棄する
    sockets.to(roomName).emit('push image', {
      userName : userName,
      data : data
    });
  });

  /**
   *
   */
  client.on('ready', function() {
    // TODO : この処理定型的だから共通化したい
    // 部屋名とプレイヤー名を socket から取り出す
    var roomName;
    client.get('roomName', function(err, _roomName) {
      if (err || !_roomName)
        return;
      roomName = _roomName;
    });
    var userName;
    client.get('userName', function(err, _userName) {
      if (err || !_userName)
        return;
      userName = _userName;
    });

    if (!rooms[roomName]) {
      // TODO : room存在チェック
      return;
    }

    var room = rooms[roomName];

    // TODO : Roomで処理する
    for (var i = 0; i < room.users.length; i++) {
      if (room.users[i] != null && room.users[i].name == userName) {
        console.log('ready ' + userName);
        room.users[i].isReady = true;
        break;
      }
    }

    room.updateMember();

    // TODO : readyチェック メソッドにわけたい
    // TODO : 毎回走査するのは面倒だからreadyのカウンタでもつくるか？
    // TODO : 人数制限の値を2にするか3にするか？
    if (room.users.length >= 2) {
      var i;
      for ( i = 0; i < room.users.length; i++) {
        if (!room.users[i].isReady)
          break;
      }
      if (i == room.users.length) {
        room.changeModeReady();
      }
    }
  });

  // TODO : ↓見直し

  /**
   * socket切断時の後始末
   */
  client.on('disconnect', function() {
    console.log('disconnect');

    var roomName;
    client.get('roomName', function(err, _roomName) {
      if (err || !_roomName)
        return;
      roomName = _roomName;
    });
    var userName;
    client.get('userName', function(err, _userName) {
      if (err || !_userName)
        return;
      userName = _userName;
    });

    // lobbyの場合 後始末不要
    if (roomName == null || userName == null)
      return;

    console.log('disconnect ' + roomName + ' ' + userName);

    var room = rooms[roomName];
    room.playerExit(userName);

    // playerがいなくなったらroomも削除する
    // TODO : 1人になった時点でゲームを終了させるか？painterの引き継ぎも合わせて考える
    if (room.users.length == 0) {
      delete rooms[roomName];
    } else {
      room.pushSystemMessage(userName + ' さんが退室しました。');
    }

    room.updateMember();
    updateLobby();
  });
};

//------------------------------
// メソッド定義
//------------------------------

/**
 * client送信用のroom情報を取得する
 */
function getRoomsInfo() {
  console.log('get rooms info');

  var roomsInfo = [];
  var keys = Object.keys(rooms);
  keys.forEach(function (key) {
    var room = rooms[key];
    roomsInfo.push({
      name:           room.name,
      comment:        room.comment,
      password:       room.password ? true : false,
      dictionary:     room.dictionary.name,
      playerCount:    room.users.length,
      playerCountMax: room.playerCountMax
    });
  });
  return roomsInfo;
}

/**
 * lobby のユーザーに lobby 情報を送信する
 */
function updateLobby(client) {
  console.log('update lobby');
  // TODO : 送る情報を限定する
  console.log(getRoomsInfo());
  if (client == null) {
    // ブロードキャスト
    sockets.to('lobby').emit('update lobby', getRoomsInfo());
  } else {
    // 要求ユーザーのみ
    client.emit('update lobby', getRoomsInfo());
  }
}

// TODO : 見直し
// 指定したroomIdに属するクライアントすべてに対しイベントを送信する
function emitToRoom(roomId, event, data, fn) {
  if (socketsOf[roomId] == null) {
    return;
  }
  var sockets = socketsOf[roomId];
  Object.keys(sockets).forEach(function(key) {
    sockets[key].emit(event, data, fn);
  });
};

// TODO : 見直し
// Dateオブジェクトから日時を表す文字列を生成する
function _formatDate(date) {
  var mm = date.getMonth();
  var dd = date.getDate();
  var HH = date.getHours();
  var MM = date.getMinutes();
  if (HH < 10) {
    HH = '0' + HH;
  }
  if (MM < 10) {
    MM = '0' + MM;
  }
  return mm + '/' + dd + ' ' + HH + ':' + MM;
};
