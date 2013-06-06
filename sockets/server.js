var crypto = require('crypto');

// TODO : 見直し
// 指定したroomIdに属するクライアントすべてに対しイベントを送信する
function emitToRoom(roomId, event, data, fn) {
  if (socketsOf[roomId] === undefined) {
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

// TODO : 見直し

// socket.ioのソケットを管理するオブジェクト
var socketsOf = {};

// room を管理するオブジェクト
var rooms = {};

// socket.ioのコネクション設定
exports.onConnection = function (socket) {
  console.log('connected');
  // TODO : socketの中身は？

  // コネクションが確立されたら'connected'メッセージを送信する
  socket.emit('connected', {});

  //------------------------------
  // メッセージハンドラ定義(lobby)
  //------------------------------

  // lobby に登録する
  socket.on('enter lobby', function () {
    console.log("enter lobby");

    // lobby に join する
    socket.join('lobby');

    // lobby に入室できたことを通知する
    socket.emit('entered lobby');
  });

  // 新規roomの作成を受け付ける
  socket.on('create room', function(data) {
    // TODO : null比較はnull?undefined?
    // TODO : パラメータチェック
    // TODO : 既存ルームとの重複チェック
    rooms[data.roomName] = {
      roomName:   data.roomName,
      comment:    data.comment,
      password:   data.password,
      dictionary: data.dictionary,
      tokens:     {},
      users:      [],
      chatlog:    [],
      imagelog:   []
    };
    
    // 認証用トークン
    // TODO : 未使用トークンの無効化処理をどこかでやる
    var token = Math.random();
    rooms[data.roomName].tokens[data.userName] = token;
    
    // 新規roomの作成成功を通知する
    socket.emit('create room ok', {
      roomName: data.roomName,
      userName: data.userName,
      token: token
    });
  });

  //------------------------------
  // メッセージハンドラ定義(room)
  //------------------------------

  socket.on('enter room', function(data) {
    console.log('enter room');
    // TODO : パラメータチェック ===? ==?
    if (rooms[data.roomName] === undefined ||
        rooms[data.roomName].tokens[data.userName] === undefined ||
        rooms[data.roomName].tokens[data.userName] != data.token) {
      // TODO : エラー tokenも可能であれば無効化しておく？
      socket.emit('enter room ng');
      return;
    }
    // 認証成功
    // TODO : token無効化 これでいい？
    rooms[data.roomName].tokens[data.userName] = undefined;
    // TODO : roomの人数上限チェック ここと、lobbyの認証時にも
    rooms[data.roomName].users.push({ name: data.userName, score: 0, ready: false });
    // TODO : push system message 送信 ↓に含めるか？
    // TODO : update member 送信
    socket.join('room:' + data.roomName + ':answerer');
    socket.emit('enter room ok');
  });

  // TODO : コメント チャットログのリクエスト
  socket.on('request chat', function(roomName) {
    console.log('request chat');
    socket.emit('push chat', rooms[roomName].chatlog);
  });

  socket.on('send chat', function(message) {
    console.log('send chat');
    var a = { userName: message.userName, message: message.body };
    rooms[message.roomName].chatlog.push(a);
    // TODO : 配列化しなくても受信側で同じように処理できないか？
    socket.to('room:' + message.roomName + ':answerer').emit('push chat', [a]);
    // TODO : painter にも送る
  });

  // TODO : ↓見直し

  // lobby 情報を送る
  socket.on('update lobby', function () {
    
  });

  // 認証情報を確認する
  socket.on('hash password', function (password, fn) {
    var hashedPassword = '';
    var shasum = crypto.createHash('sha512');

    if (password !== '') {
      shasum.update('initialhash');
      shasum.update(password);
      hashedPassword = shasum.digest('hex');
    }
    fn(hashedPassword);
  });

  // 認証情報を確認する
  socket.on('check credential', function (client) {
    // クライアントはconnectedメッセージを受信したら、
    // credentialsオブジェクトを引数にこのメッセージを送信する

    // 認証情報の確認
    if (client.mode == 'create') {
      // modeが'create'の場合、すでに対応するroomIdのチャットルームがないか
      // チェックする
      if (socketsOf[client.roomId] !== undefined) {
        socket.emit('room exists', {});
        return;
      }
      socketsOf[client.roomId] = {};
    }

    if (client.mode == 'enter') {
      // 対応するroomIdのチャットルームの存在をチェックする
      if (socketsOf[client.roomId] === undefined) {
        socket.emit('invalid credential', {});
        return;
      }
      // ユーザー名がかぶっていないかチェックする
      if (socketsOf[client.roomId][client.userName] !== undefined) {
        socket.emit('userName exists', {});
        return;
      }
    }

    // ソケットにクライアントの情報をセットする
    socket.set('client', client, function () {
      socketsOf[client.roomId][client.userName] = socket;
      if (client.userName) {
        console.log('user ' + client.userName + '@' + client.roomId + ' connected');
      }
    });

    // 認証成功
    socket.emit('credential ok', {});

    // 既存クライアントにメンバーの変更を通知する
    var members = Object.keys(socketsOf[client.roomId]);
    emitToRoom(client.roomId, 'update members', members);

    var shasum = crypto.createHash('sha1')
    var message = {
        from: 'システムメッセージ',
        body: client.userName + 'さんが入室しました',
        roomId: client.roomId
    }
    message.date = _formatDate(new Date());
    shasum.update('-' + message.roomId);
    message.id = (new Date()).getTime() + '-' + shasum.digest('hex');
    emitToRoom(message.roomId, 'push message', message);

  });

  // ソケットが切断された場合、ソケット一覧からソケットを削除する
  socket.on('disconnect', function () {
    socket.get('client', function (err, client) {
      if (err || !client) {
        return;
      }
      var sockets = socketsOf[client.roomId];
      if(sockets !== undefined) {
        delete sockets[client.userName];
      }
      console.log('user ' + client.userName + '@' + client.roomId + ' disconnected');
      var members = Object.keys(sockets);
      if (members.length === 0) {
        delete socketsOf[client.roomId];
      } else {
        // 既存クライアントにメンバーの変更を通知する
        emitToRoom(client.roomId, 'update members', members);
        var message = {
          from: 'システムメッセージ',
          body: client.userName + 'さんが退室しました',
          roomId: client.roomId
        }
        var shasum = crypto.createHash('sha1')
        message.date = _formatDate(new Date());
        shasum.update('-' + message.roomId);
        message.id = (new Date()).getTime() + '-' + shasum.digest('hex');
        emitToRoom(message.roomId, 'push message', message);

      }
    });
  });

  // クライアントは'say'メッセージとともにチャットメッセージを送信する
  socket.on('say', function (message, fn) {
    console.log('receive message');

    var shasum = crypto.createHash('sha1')
    message.date = _formatDate(new Date());
    shasum.update(message.userName + '-' + message.roomId);
    message.id = (new Date()).getTime() + '-' + shasum.digest('hex');
    emitToRoom(message.roomId, 'push message', message);
    // クライアント側のコールバックを実行する
    fn();
  });

  // クライアントはログが必要な場合'request log'メッセージを送信する
  socket.on('request log', function (data) {
    socket.get('client', function (err, client) {
      if (err || client === undefined) {
        return;
      }
      emitToRoom(client.roomId, 'request log', {}, function (log) {
        socket.emit('update log', log);
      });
    });
  });

  // メッセージハンドラの定義(room)

  // TODO : ↓見直し



};

