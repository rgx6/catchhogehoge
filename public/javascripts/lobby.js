(function () {
  var socket;

  $(document).ready(function () {
    // console.log('ready');

    // TODO : 外部ファイルから読み込み？
    // サーバに接続
    var host = 'http://rgx.c.node-ninja.com/';
    // var host = 'http://rgx.sakura.ne.jp/';
    // var host = 'http://localhost/';
    socket = io.connect(host);

    //------------------------------
    // メッセージハンドラ定義
    //------------------------------

    /**
     * 接続できたら画面を初期化するための情報を要求する
     */
    socket.on('connected', function () {
      // console.log('connected');

      socket.emit('init lobby')
    });

    /**
     * 部屋情報を受け取って表示を更新する
     */
    socket.on('update lobby', function (rooms) {
      // console.log('update lobby');

      updateRoomsInfo(rooms);
    });

    //------------------------------
    // イベントハンドラ定義
    //------------------------------

    /**
     * 部屋作成に必要な情報を送る
     */
    $('#create-room').on('click', function () {
      var credentials = {
        roomName: $('#new-room-name').val(),
        comment:  $('#new-room-comment').val(),
        userName: $('#new-player-name').val(),
        password: $('#new-password').val(),
        dictionary: null
      };

      socket.emit('create room', credentials, function (data) {
        if (data.result == 'bad param') {
          // TODO : エラー表示
          alert('不正なパラメータです');
        } else if (data.result == 'room exist') {
          // TODO : エラー表示
          alert('同じ名前の部屋があります');
        } else if (data.result == 'ok') {
          $.form({
            type: 'post',
            url:  'gameroom/',
            data: {
              roomName: credentials.roomName,
              userName: credentials.userName,
              token:    data.token
            }
          });
        } else {
          // TODO : エラー
          alert('予期しないエラーです');
        }
      });
    });

    /**
     * 既存の部屋への入室に必要な情報を送る
     */
    $('#enter-room').on('click', function () {
      // TODO : 部屋を一覧から選択できるようにする
      var credentials = {
        roomName: $('#enter-room-name').val(),
        userName: $('#enter-player-name').val(),
        password: $('#enter-password').val(),
      };

      socket.emit('enter room', credentials, function (data) {
        if (data.result == 'bad param') {
          // TODO : エラー表示
          alert('不正なパラメータです');
        } else if (data.result == 'not exist') {
          // TODO : エラー表示
          alert('部屋がありません');
        } else if (data.result == 'password ng') {
          // TODO : エラー表示
          alert('パスワードが違います');
        } else if (data.result == 'full') {
          // TODO : エラー表示
          alert('満員です');
        } else if (data.result == 'name exist') {
          // TODO : エラー表示
          alert('同じ名前のプレイヤーがいます');
        } else if (data.result == 'ok') {
          $.form({
            type: 'post',
            url:  'gameroom/',
            data: {
              roomName: credentials.roomName,
              userName: credentials.userName,
              token:    data.token
            }
          });
        } else {
          // TODO : エラー
          alert('予期しないエラーです');
        }
      });
    });

    /**
     * バグ報告等
     */
    $('#bug').on('keydown', function (e) {
      if ((e.which && e.which === 13) || (e.keyCode && e.keyCode === 13)) {
        var message = $('#bug').val();

        if (message.length == 0) {
          // なにもしない
        } else if (message.length > 500) {
          // TODO : エラー表示
          // TODO : メッセージ入力欄の下に出てくる候補が邪魔
        } else {
          socket.emit('send bug', { message: message, from: 'lobby' }, function () {
            // メッセージの送信に成功したらテキストボックスをクリアする
            $('#bug').val('');
          });
        }

        return false;
      } else {
        return true;
      }
    });

    // TODO : コメント
    $('#roomList tbody tr').live('click', function () {
      if (!$(this).hasClass('info')) {
        $('#roomList tr.info').removeClass('info');
        $(this).addClass('info');
      }

      var roomName = $(this).children('td')[0].id;
      $('#enter-room-name').val(roomName);
    });

    //------------------------------
    // その他
    //------------------------------

    /**
     * 部屋情報を表示する
     */
    function updateRoomsInfo (rooms) {
      // TODO : 整形
      $('#roomList').empty();
      var html = '';
      html += "<table class='table table-hover' border='1'><thead><tr><th>部屋名</th><th>パスワード</th><th>人数</th><th>コメント</th><th>辞書</th></tr></thead><tbody>";
      for (var i = 0; i < rooms.length; i++) {
        var room = rooms[i];
        html += '<tr><td id=\'' + room.name + '\'>' + room.name + '</td><td>' + (room.password ? 'あり' : 'なし')
              + '</td><td>' + room.playerCount + '/' + room.playerCountMax + '</td><td>' + room.comment + '</td><td>' + room.dictionary + '</td></tr>';
      };
      html += '</tbody></table>';
      $('#roomList').append(html);
    }

    /**
     * POST 後に画面遷移するための関数
     */
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
  });
})();
