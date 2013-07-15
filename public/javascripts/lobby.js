(function () {
  var socket;

  $(document).ready(function () {
    console.log('ready');

    // サーバに接続
    socket = io.connect('http://localhost');

    //------------------------------
    // メッセージハンドラ定義
    //------------------------------

    // 接続できたら画面を初期化するための情報を要求する
    socket.on('connected', function () {
      console.log('connected');
      socket.emit('init lobby')
    });

    // ロビー情報を受け取って表示を更新する
    socket.on('update lobby', function (lobby) {
      // TODO : 実装
      console.log('update lobby');
      //alert(lobby.toString());
      updateLobby(lobby);
    });

    // 部屋作成 パラメータ不備
    socket.on('create room bad param', function () {
      // TODO : 実装
      console.log('create room bad param');
    });

    // 部屋作成 部屋名重複
    socket.on('create room exist', function () {
      // TODO : 実装
      console.log('create room exist');
    });

    // 部屋作成 成功
    socket.on('create room ok', function (data) {
      console.log('create room ok');
      // TODO : 必要なパラメータを持ってroomにpost
      // roomName, userName, token
      $.form({
        type: 'post',
        url: 'gameroom',
        data: { roomName: data.roomName, userName: data.userName, token: data.token },
      });
    });

    // 既存部屋入室 パラメータ不備
    socket.on('enter room bad param', function () {
      // TODO : 実装
      console.log('enter room bad param');
    });

    // 既存部屋入室 パスワード不一致
    socket.on('enter room password ng', function () {
      // TODO : 実装
      console.log('enter room password ng');
    });

    // 既存部屋入室 ユーザー名重複
    socket.on('enter room name exist', function () {
      // TODO : 実装
      console.log('enter room name exist');
    });

    // 既存部屋入室 満員
    socket.on('enter room full', function () {
      // TODO : 実装
      console.log('enter room full');
    });

    // 既存部屋入室 成功
    socket.on('enter room ok', function (data) {
      console.log('enter room ok');
      // TODO : 必要なパラメータを持ってroomにpost
      // roomName, userName, token
      $.form({
        type: 'post',
        url: 'gameroom',
        data: { roomName: data.roomName, userName: data.userName, token: data.token },
      });
    });

    //------------------------------
    // イベントハンドラ定義
    //------------------------------

    // 部屋作成に必要な情報を送る
    $('#create-room').on('click', function () {
      // TODO : 入力値チェック
      var credentials = {
        roomName: $('#new-room-name').val(),
        comment:  $('#new-room-comment').val(),
        userName: $('#new-player-name').val(),
        password: $('#new-password').val(),
        dictionary: null
      };
      socket.emit('create room', credentials);
    });

    $('#enter-room').on('click', function () {
      // TODO : 一覧からの選択とパスワード、ユーザー名入力にする
      // TODO : 入力値チェック
      var credentials = {
        roomName: $('#enter-room-name').val(),
        userName: $('#enter-player-name').val(),
        password: $('#enter-password').val(),
      };
      socket.emit('enter room', credentials);
    });

    //------------------------------
    // その他
    //------------------------------
  
    // POST 後に画面遷移するための関数
    $.form = function (s) {
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
    }

    // lobby 情報を表示する
    function updateLobby (rooms) {
      // TODO : 整形
      $('#roomList').empty();
      var html = '';
      html += "<table class='table' border='1'><tr><th>部屋名</th><th>パスワード</th><th>人数</th><th>コメント</th><th>辞書</th></tr>";
      for (var i = 0; i < rooms.length; i++) {
        var room = rooms[i];
        html += '<tr><td>' + room.name + '</td><td>' + (room.password ? 'あり' : 'なし')
              + '</td><td>' + room.playerCount + '/' + room.playerCountMax + '</td><td>' + room.comment + '</td><td>' + room.dictionary + '</td></tr>';
      };
      html += '</table>';
      $('#roomList').append(html);
    }
  });

})();
