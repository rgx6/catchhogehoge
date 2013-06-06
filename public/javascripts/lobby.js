// lobby.js

(function () {
  var socket;

  // ページロード時の処理
  $(document).ready(function () {
    // サーバに接続
    socket = io.connect('http://localhost');

    //------------------------------
    // メッセージハンドラ定義
    //------------------------------

    // サーバーへの接続完了
    socket.on('connected', function(data) {
      console.log("lobby : connected");
      // lobby への入室を通知する
      socket.emit('enter lobby');
    });

    // TODO : コメント
    socket.on('entered lobby', function() {
      console.log("lobby : entered lobby");
      // lobby 情報を要求する
      socket.emit('request lobby');
    });

    socket.on('create room ok', function(data) {
      // TODO : 必要なパラメータを持ってroomにpost
      // roomName, userName, token
      $.form({
        type: 'post',
        url: 'room',
        data: { roomName: data.roomName, userName: data.userName, token: data.token },
      });
    });

    // TODO : ↓見直し

    // 認証失敗：パスワードが一致しない
    socket.on('invalid credential', function(data) {
      authRetry('ルーム名/パスワードが不正です');
    });

    // 認証失敗：同名のルームがすでに存在する
    socket.on('room exist', function(data) {
      authRetry('同名のルームがすでに存在します');
    });

    // 認証失敗：ルームに同名のユーザーが存在する
    socket.on('user name exist', function(data) {
      authRetry('その名前はすでに使われています');
    });

    // lobby 情報の更新
    socket.on('update lobby', function(lobby) {
      updateLobby(lobby);
    });

    // 認証成功
    socket.on('credential ok', function(data) {
      socket.emit('request log', {});
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
      messageLogs[message.id] = message;
      prependMessage(message);
    });

    //------------------------------
    // イベントハンドラ定義
    //------------------------------

    // 部屋作成に必要な情報を送る
    $('#create-room').on('click', function () {
      // TODO : 入力値チェック
      var credentials = {
        roomName:   $('#new-room-name').val(),
        comment:    $('#new-room-comment').val(),
        userName: $('#new-player-name').val(),
        password:   $('#new-password').val(),
        dictionary: null
      };
      socket.emit('create room', credentials);
    });

    // TODO : 見直し↓
    
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

    // POST 後に画面遷移するための関数
    $.form = function(s) {
      var def = {
        type: 'get',
        url: location.href,
        data: {}
      };

      s = $.extend(true, s, $.extend(true, {}, def, s));

      var form = $('<form>')
        .attr({
          'method': s.type,
          'action': s.url
        })
        .appendTo(document.body);

      for (var a in s.data) {
        $('<input>')
          .attr({
            'name': a,
            'value': s.data[a]
          })
          .appendTo(form[0]);
      };

      form[0].submit();
    };

  }); // document.ready()ここまで

  // lobby 情報を表示する
  function updateLobby(lobby) {
    $('#rooms').empty();
    var keys = Object.keys(lobby);
    keys.sort();
    keys.forEach(function (key) {
      prependMessage(messageLogs[key]);
    });

    var html = '<div class="message" id="' + message.id + '">'
      + '<p class="postdate pull-right">' + message.date + '</p>'
      + '<p class="author">' + message.from + '：</p>'
      + '<p class="comment">' + message.body + '</p>'
      + '</div>';
    $('#messages').prepend(html);


  }


  // TODO : ↓見直し

  function authRetry(message) {
    $('#credential-dialog-header').text(message);    
    $('#new-room').val(credentials.roomName);
    $('#new-name').val(credentials.userName);
    $('#credentialDialog').modal('show');
  }

}).apply(this);

