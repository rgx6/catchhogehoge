
// TODO : XSS / XSRF 対策忘れずに
// TODO : 何が送られてきても例外で落ちないようにする
// TODO : cl側、cssでデザインを切り替えられると面白いかも
// TODO : 想定外のmessage送って来たクライアントは切断する？
// TODO : init以外はroomとuserを必ずチェック。不正なら処理しない＆キック
// TODO : in を使う？でもundefined/nullチェックするなら最初からそっちやればいい？

// TODO : 見直し
function Room(roomName, comment, password, dictionary) {
  this.roomName       = roomName,
  this.comment        = comment,
  this.password       = password,
  this.dictionary     = dictionary,
  this.tokens         = {},
  this.users          = [],
  this.imagelog       = [],
  this.mode           = 'chat',
  this.round          = 0,
  this.roundMax       = 2,
  this.playerCountMax = 8,
  this.timeLeft       = 0,
  this.turnSecond     = 120;
  // TODO : roomに関する処理をメソッドにするか？
};

// room を管理するオブジェクト
var rooms = {};

// タイマー処理用オブジェクト
// TODO : 遅延が酷いようなら別の管理方法を検討する
var previousTime = new Date();
var roomTimer = setInterval(function() {
  var newTime = new Date();
  // TODO : DEBUG
  if (Math.abs(newTime - previousTime - 1000) >= 10) {
    console.log('call interval ' + (newTime - previousTime));
  }
  // roomの時間経過タイマー処理本体を呼び出す
  roomTimerProc();
  previousTime = newTime;
}, 1000);

/**
 * タイマー処理の中身
 */
function roomTimerProc() {
  Object.keys(rooms).forEach(function(key) {
    var room = rooms[key];

    switch(room.mode) {
      // お絵描きチャットモード
      case 'chat':
        // do nothing
        break;

      // 準備完了 ゲーム開始カウントダウン
      case 'ready':
        room.timeLeft--;
        if (room.timeLeft == 0) {
          // ゲーム開始
          changeModeTurn(room);
        } else {
          // TODO : 残り時間を送信
        }
        break;

      // ターン中
      case 'turn':
        room.timeLeft--;
        if (room.timeLeft == 0) {
          // 時間切れでターン終了
          changeModeInterval(room);
        } else {
          // TODO : 残り時間を送信
          // TODO : 特定のタイミングでヒントを表示
        }
        break;

      // ターンとターンの間
      case 'interval':
        room.timeLeft--;
        if (room.timeLeft == 0) {
          // ターン開始
          changeModeTurn(room);
        } else {
          // TODO : 残り時間を送信
        }
        break;

      // 該当なし ありえないケース
      default:
        // TODO : exceptionにする？
        console.log('room mode error : ' + room.mode);
        break;
    }

    console.log('room:' + rooms[key].roomName + ' ' + rooms[key].timeLeft);
  });
};

function startTurn(room) {
  room.mode = 'turn';
  room.round = 1;
  room.timeLeft = room.turnSecond;
  
  // TODO : painter/answererの設定 いなければゲーム開始 いれば次にすすめる
  // TODO : clientに送る情報 mode painter お題 ヒント 
  // TODO : 
  // TODO : 
  // TODO : 
  // TODO : 
  // TODO : 
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
  client.on('init lobby', function () {
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
    // TODO : パスワードはセキュリティ強化したいけどhttpsめんどくさそうだしどうしよう？
    if (data.roomName == null ||
        data.userName == null) {
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

    // TODO : XSS対策
    rooms[data.roomName] = new Room(data.roomName, data.comment, data.password, data.dictionary);

    // 認証用トークン発行
    var token = Math.random();
    rooms[data.roomName].tokens[data.userName] = token;

    client.emit('create room ok', {
      roomName: data.roomName,
      userName: data.userName,
      token: token
    });
  });

  /**
   * 既存roomへの入室を受け付ける
   */
  client.on('enter room', function(data) {
    console.log('enter room : ' + data.roomName);
    
    // パラメータチェック
    // TODO : 長さチェックも必要
    if (data.roomName == null ||
        data.userName == null) {
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

    // パスワードチェック
    if (rooms[data.roomName].password != data.password) {
      console.log('enter room password ng');
      client.emit('enter room password ng');
      return;
    }

    // TODO : うまく動いてない？
    // 名前重複チェック
    for (var user in rooms[data.roomName].users) {
      if (user.userName == data.userName) {
        console.log('enter room name exist');
        client.emit('enter room name exist');
        return;
      }
    }

    // 部屋定員チェック
    if (rooms[data.roomName].users.length == rooms[data.roomName].playerCountMax) {
      console.log('enter room full');
      client.emit('enter room full');
      return;
    }

    // 入室OK
    console.log('enter room ok');

    // 認証用トークン発行
    // TODO : 未使用トークンの（定期的な？）無効化処理をどこかでやる
    var token = Math.random();
    rooms[data.roomName].tokens[data.userName] = token;

    client.emit('enter room ok', {
      roomName: data.roomName,
      userName: data.userName,
      token: token
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

    // token 削除
    delete rooms[data.roomName].tokens[data.userName];

    // 部屋定員チェック
    if (rooms[data.roomName].users.length == rooms[data.roomName].playerCountMax) {
      console.log('init room full');
      client.emit('init room full');
      return;
    }

    // 部屋にユーザー情報を登録
    // TODO : 必要なプロパティを検討
    rooms[data.roomName].users.push({ name: data.userName, score: 0, ready: false, role: 'answerer' });

    // socket に部屋名とプレイヤー名を持たせておく
    client.set('roomName', data.roomName);
    client.set('userName', data.userName);

    // TODO : push system message 送信 ↓に含めるか？

    // TODO : lobbyのroomNameとかぶるといけない。が、prefixは付けたくない
    client.join(data.roomName);

    // TODO : 描画データ送信
    // TODO : ゲームの状態によってはお題なども表示
    // TODO : チャットログは送らなくてもいいか？

    updateMember(rooms[data.roomName]);
    updateLobby();
  });

  /**
   * chat の発言を処理する
   */
  client.on('send chat', function(message) {
    console.log('send chat');

    // パラメータチェック
    // TODO : 空白もチェックしたい。lenght == 0だけでいいか？nullは？
    if (message.length == 0) {
      // 無視する
      return;
    };

    // TODO : ↓get 取得できなくてもエラーにならない？
    // 部屋名とプレイヤー名を socket から取り出す
    var roomName;
    client.get('roomName', function(err, _roomName) {
      if (err || !_roomName) return;
      roomName = _roomName;
    });
    var userName;
    client.get('userName', function(err, _userName) {
      if (err || !_userName) return;
      userName = _userName;
    });

    // TODO : 部屋の存在チェックはいらないか？存在しなくてもエラーにはならないはず？

    // message を push する
    // TODO : painter / answerer の管理方法次第では個別送信が必要
    sockets.to(roomName).emit('push chat', { userName: userName, message: message });
  });

  /**
   * 
   */
  client.on('send image', function(data) {
    // TODO : こまかいところ

    // 部屋名とプレイヤー名を socket から取り出す
    var roomName;
    client.get('roomName', function(err, _roomName) {
      if (err || !_roomName) return;
      roomName = _roomName;
    });
    var userName;
    client.get('userName', function(err, _userName) {
      if (err || !_userName) return;
      userName = _userName;
    });

    // TODO : dataをためる。ただしclear, fillが送られてきた場合はためたdataを破棄する
    sockets.to(roomName).emit('push image', {
      userName: userName,
      data: data
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
      if (err || !_roomName) return;
      roomName = _roomName;
    });
    var userName;
    client.get('userName', function(err, _userName) {
      if (err || !_userName) return;
      userName = _userName;
    });

    if (!rooms[roomName]) {
      // TODO : room存在チェック
      return;
    }

    var room = rooms[roomName];

    for (var i = 0; i < room.users.length; i++) {
      if (room.users[i] != null &&
          room.users[i].name == userName) {
        console.log('ready ' + userName);
        room.users[i].ready = true;
        break;
      }
    }

    // TODO : readyチェック メソッドにわけたい
    // TODO : 毎回走査するのは面倒だからreadyのカウンタでもつくるか？
    // TODO : 人数制限の値を2にするか3にするか？
    if (room.users.length >= 2) {
      var i;
      for (i = 0; i < room.users.length; i++) {
        if (!room.users[i].ready) break;
      }
      if (i == room.users.length) {
        changeModeReady(room);
      }
    }
  });

  /**
   * 
   */
  client.on('ready cancel', function() {
    // TODO : そもそも ready cancel 自体が不要だったりするか？本家は対応していない。
    // 部屋名とプレイヤー名を socket から取り出す
    var roomName;
    client.get('roomName', function(err, _roomName) {
      if (err || !_roomName) return;
      roomName = _roomName;
    });
    var userName;
    client.get('userName', function(err, _userName) {
      if (err || !_userName) return;
      userName = _userName;
    });

    if (!rooms[roomName]) {
      // TODO : room存在チェック
      return;
    }

    var room = rooms[roomName];

    for (var i = 0; i < room.users.length; i++) {
      // TODO : nullチェックは不要か？Roomオブジェクトしか追加しない＆splice使用が前提なら
      if (room.users[i] != null &&
          room.users[i].name == userName) {
        console.log('ready cancel ' + userName);
        room.users[i].ready = false;
        break;
      }
    }
    // TODO : c/s間でreadyが一致しない可能性はあるか？c側でcallbackでフラグ管理していれば大丈夫か？
    // 不正操作の場合はどうか？
    changeModeChat(room);
  });

  // TODO : ↓見直し

  /**
   * socket切断時の後始末
   */
  client.on('disconnect', function() {
    console.log('disconnect');

    var roomName;
    client.get('roomName', function(err, _roomName) {
      if (err || !_roomName) return;
      roomName = _roomName;
    });
    var userName;
    client.get('userName', function(err, _userName) {
      if (err || !_userName) return;
      userName = _userName;
    });

    // lobbyの場合 後始末不要
    if (roomName == null || userName == null) return;

    console.log('disconnect ' + roomName + ' ' + userName);

    // roomからuserを削除
    for (var i = 0; i < rooms[roomName].users.length; i++) {
      if (rooms[roomName].users[i] != null &&
          rooms[roomName].users[i].name == userName) {
        console.log('disconnect delete ' + userName);
        rooms[roomName].users.splice(i, 1);
        break;
      }
    }
    // userがいなくなったらroomも削除する
    if (rooms[roomName].users.length == 0) {
      delete rooms[roomName];
      // room情報の変更をlobbyに通知
      updateLobby();
      return;
    }

    // roomにuser情報を通知
    updateMember(rooms[roomName]);
    // room情報の変更をlobbyに通知
    updateLobby();

    // TODO : ゲーム進行の調整
    // TODO : システムメッセージ
    // TODO : ユーザーは切断を検知できる？
    
    // for (var user in rooms[roomName].users) {
      // if (user.userName == userName) {
//         
      // }
    // }
    
    // var sockets = socketsOf[client.roomId];
    // if(sockets != null) {
      // delete sockets[client.userName];
    // }
    // console.log('user ' + client.userName + '@' + client.roomId + ' disconnected');
    // var members = Object.keys(sockets);
    // if (members.length === 0) {
      // delete socketsOf[client.roomId];
    // } else {
      // // 既存クライアントにメンバーの変更を通知する
      // emitToRoom(client.roomId, 'update members', members);
      // var message = {
        // from: 'システムメッセージ',
        // body: client.userName + 'さんが退室しました',
        // roomId: client.roomId
      // }
      // var shasum = crypto.createHash('sha1')
      // message.date = _formatDate(new Date());
      // shasum.update('-' + message.roomId);
      // message.id = (new Date()).getTime() + '-' + shasum.digest('hex');
      // emitToRoom(message.roomId, 'push message', message);

    //}
  });
};

//------------------------------
// メソッド定義
//------------------------------

/**
 * lobby のユーザーに lobby 情報を送信する
 */
function updateLobby(client) {
  console.log('updateLobby()');
  // TODO : 送る情報を限定する
  if (client == null) {
    // ブロードキャスト
    sockets.to('lobby').emit('update lobby', rooms);
  }
  else {
    // 要求ユーザーのみ
    client.emit('update lobby', rooms);
  }
}

/**
 * 
 */
function updateMember(room) {
  console.log('updateMember()');

  if (room == null) {
    return;
  }

  // TODO : 送る情報を限定する
  sockets.to(room.roomName).emit('update member', room.users);
}

/**
 * モード変更 Chat
 */
function changeModeChat(room) {
  console.log('change mode chat ' + room.roomName);

  room.mode = 'chat';
  room.timeLeft = 0;
}

/**
 * モード変更 Ready
 */
function changeModeReady(room) {
  console.log('change mode ready ' + room.roomName);

  room.mode = 'ready';
  room.timeLeft = 3;
}

/**
 * モード変更 Turn
 */
function changeModeTurn(room) {
  console.log('change mode turn ' + room.roomName);

  // TODO :一文処理はcahngeModeIntervalの開始時に！
  if (room.round == 0) {
    // ゲーム開始時
    room.round = 1;
    room.users[0].role = 'painter';
  } else {
    var i;
    for (i = 0; i < room.users.length; i++) {
      if (room.users[i].role == 'painter') {
        break;
      }
    }

    // TODO : 不要なチェックか？
    if (i == room.users.length) {
      console.log('painter not exist ' + room.roomName);
      throw 'painter not exist ' + room.roomName;
      return;
    }

    if (i == room.users.length - 1) {
      // round終了
      if (room.round == room.roundMax) {
        // ゲーム終了
        room.round = 0;
        room.users[i].role = 'answerer';
        // TODO : ゲームの結果
        // TODO : user情報の初期化は開始時に行うか？roleも含めて？
        changeModeChat(room);
      } else {
        // 次のroundに
        room.round += 1;
        room.users[i].role = 'answerer';
        room.users[0].role = 'painter';
      }
    } else {
      // 次のturnに
      room.users[i].role = 'answerer';
      room.users[i+1].role = 'painter';
    }
  }
  
  room.mode = 'turn';
  room.timeLeft = 3;
}

/**
 * モード変更 Interval
 */
function changeModeInterval(room) {
  console.log('change mode interval ' + room.roomName);

  room.mode = 'interval';
  room.timeLeft = 3;
}



// TODO : 見直し
// 指定したroomIdに属するクライアントすべてに対しイベントを送信する
function emitToRoom(roomId, event, data, fn) {
  if (socketsOf[roomId] == null) {
    return;
  }
  var sockets = socketsOf[roomId];
  Object.keys(sockets).forEach(function (key) {
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
