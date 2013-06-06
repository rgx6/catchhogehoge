// room.js

(function () {
  var socket;

  // ページロード時の処理
  $(document).ready(function () {
    // サーバに接続
    socket = io.connect('http://localhost');

    // TODO : 部屋名とか設定（認証完了後か？）

    //------------------------------
    // メッセージハンドラ定義
    //------------------------------

    // サーバーへの接続完了
    socket.on('connected', function(data) {
      console.log('connected');
      // room への入室を通知する
      // TODO : 認証情報を一緒に送る
      socket.emit('enter room', {
        roomName: credentials.roomName,
        userName: credentials.userName,
        token:    credentials.token
      });
    });

    // 認証失敗
    socket.on('enter room ng', function() {
      console.log('enter room ng');
    });

    // 認証成功
    socket.on('enter room ok', function() {
      console.log('enter room ok');
      // TODO : チャットログのリクエスト（不要か？）
      socket.emit('request chat', credentials.roomName);
      // 描画データのリクエスト
      //socket.emit('reuqest image', credentials.roomName);
    });

    // 
    socket.on('push chat', function(data) {
      console.log('push chat');
      for (var i = 0; i < data.length; i++) {
        $('#messages').append(data[i].userName + ' : ' + data[i].message + '<br />');
      }
    });
    
    
    
    
    // チャットログの送信
    socket.on('request log', function(data, callback) {
      callback(messageLogs);
    });

    // チャットログの更新
    socket.on('update log', function(log) {
      Object.keys(log).forEach(function (key) {
        messageLogs[key] = log[key];
      });
      updateMessage();
    });

    // チャットルームへのメンバー追加
    socket.on('update members', function (members) {
      $('#members').empty();
      for (var i = 0; i < members.length; i++) {
        var html = '<li>' + members[i] + '</li>';
        $('#members').append(html);
      }
    });

    // チャットメッセージ受信
    socket.on('push message', function (message) {
      console.log('push message');
      messageLogs[message.id] = message;
      prependMessage(message);
    });

    // チャットメッセージ送信
    $('#post-message').on('click', function () {
      console.log('#post-message');
      var message = {
        userName: credentials.userName,
        body: $('#message').val(),
        roomName: credentials.roomName
      };
      socket.emit('send chat', message, function () {
        // メッセージの送信に成功したらテキストボックスをクリアする
        $('#message').val('');
      });
    });

    $('#credential-dialog-form').on('submit', function() {
      $('#credentialDialog').modal('hide');
      socket.emit('hash password', $('#new-password').val(), function (hashedPassword) {
        credentials.roomName = $('#new-room').val();
        credentials.userName = $('#new-name').val();
        credentials.password = hashedPassword;
        credentials.roomId = credentials.roomName + credentials.password;
        socket.emit('check credential', credentials);
      });
      return false;
    });

  }); // document.ready()ここまで

  function authRetry(message) {
    $('#credential-dialog-header').text(message);    
    $('#new-room').val(credentials.roomName);
    $('#new-name').val(credentials.userName);
    $('#credentialDialog').modal('show');
  }

  function prependMessage(message) {
    var html = '<div class="message" id="' + message.id + '">'
      + '<p class="postdate pull-right">' + message.date + '</p>'
      + '<p class="author">' + message.from + '：</p>'
      + '<p class="comment">' + message.body + '</p>'
      + '</div>';
    $('#messages').prepend(html);
  }

  function updateMessage() {
    $('#messages').empty();
    var keys = Object.keys(messageLogs);
    keys.sort();
    keys.forEach(function (key) {
      prependMessage(messageLogs[key]);
    });
  }

}).apply(this);

