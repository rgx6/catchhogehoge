// room.js

// TODO : F5無効化したい

(function () {
  var socket;

  // ページロード時の処理
  $(document).ready(function() {
    // サーバに接続
    socket = io.connect('http://localhost');

    // TODO : 部屋名とか設定（認証完了後か？）

    //------------------------------
    // メッセージハンドラ定義
    //------------------------------

    /**
     * 接続できたら画面を初期化するための情報を要求する
     */
    socket.on('connected', function() {
      console.log('connected');

      // 認証情報を一緒に送る
      socket.emit('init room', {
        roomName: credentials.roomName,
        userName: credentials.userName,
        token:    credentials.token
      });
    });

    /**
     * 認証情報に不備があり入室できなかった
     */
    socket.on('enter room ng', function() {
      console.log('enter room ng');

      // TODO : エラー表示
      // TODO : redirect
    });

    /**
     * TODO : 
     */
    socket.on('push chat', function(message) {
      console.log('push chat');
      $('#messages').append(message.userName + ' : ' + message.message + '<br />');
    });

    /**
     * TODO : 
     */
    socket.on('push image', function(data) {
      console.log('push image');

      // 自分が描いたデータは無視する
      // TODO : 描いた本人には送らないようにserver側で制御したい 
      if (data.userName == credentials.userName) {
        return;
      }

      // TODO : rename
      for (var i = 0; i < data.data.length; i++) {
        for (var j = 0; j < data.data[i].data.length; j++) {
          var type = data.data[i].type;
          var width = data.data[i].width;
          var color = data.data[i].color;
          var d = data.data[i].data[j];

          if (type == 'line') {
            drawLine(d.xs, d.ys, d.xe, d.ye, width, color);
          } else if (type == 'point') {
            drawPoint(d.x, d.y, width, color);
          } else {
            // TODO : あとで
          }
        }
      }
    });

    /**
     * 
     */
    socket.on('update member', function(users) {
      console.log('update member');
      // TODO : メソッド化
      $('#users').empty();
      var html = '';
      for (var i = 0; i < users.length; i++) {
        if (users[i] == undefined) continue;
        html += '<tr><td>' + users[i].name + '</td></tr>';
        html += '<tr><td>' + users[i].score + '</td></tr>';
        html += '<tr><td>' + users[i].ready + '</td></tr>';
      }
      $('#users').append(html);
    });

    //------------------------------
    // イベントハンドラ定義
    //------------------------------

    // チャットメッセージ送信
    $('#post-message').on('click', function() {
      console.log('#post-message click');

      var message = $('#message').val();
      socket.emit('send chat', message, function () {
        // メッセージの送信に成功したらテキストボックスをクリアする
        $('#message').val('');
      });
    });



    // TODO : ↓見直し

    /**
     * 準備完了ボタン クリックイベント
     */
    $('#ready').on('click', function() {
      console.log('#ready click');

      socket.emit('ready', function() {
        // TODO : 準備完了／キャンセルの管理
      });
    });

    // TODO : readyとまとめたい
    $('#cancel').on('click', function() {
      console.log('#cancel click');

      socket.emit('ready cancel', function() {
        // TODO : 準備完了／キャンセルの管理
      });
    });

    // チャットルームへのメンバー追加
    socket.on('update members', function (members) {
      $('#members').empty();
      for (var i = 0; i < members.length; i++) {
        var html = '<li>' + members[i] + '</li>';
        $('#members').append(html);
      }
    });
  
    // TODO : お絵描きチャット部分
    var startX;
    var startY;
    var color;
    // TODO : widthの初期化は別の場所でやる？
    var drawWidth = 1;
    var drawFlag = false;
    var canvas = $('#mainCanvas').get(0);
    var context;
    var buffer = [];
    var buffering = false;
    // TODO : canvas非対応ブラウザへの対応 ここだけじゃなくてほぼ全体入れる必要あり、
    // というかlobbyの段階ではじくべきだけど、lobbyではcanvas使わない……
    if (canvas.getContext)
    {
      context = canvas.getContext('2d');

      /**
       * Canvas MouseDownイベント
       */
      $('#mainCanvas').mousedown(function(e) {
        console.log('MouseDown');
        drawFlag = true;
        startX = e.pageX - $(this).offset().left;
        startY = e.pageY - $(this).offset().top;
        drawPoint(startX, startY, drawWidth, color);
        pushBuffer('point', drawWidth, color, { x: startX, y: startY });
        // TODO : なんでchromeだけ必要なのか？
        //return false; // for chrome
      });

      /**
       * Canvas MouseMoveイベント
       */
      $('#mainCanvas').mousemove(function(e) {
        console.log('MouseMove');
        if (drawFlag) {
          var endX = e.pageX - $(this).offset().left;
          var endY = e.pageY - $(this).offset().top;
          drawLine(startX, startY, endX, endY, drawWidth, color);
          pushBuffer('line', drawWidth, color, { xs: startX, ys: startY, xe: endX, ye: endY });
          startX = endX;
          startY = endY;
        }
      });

      /**
       * Canvas MouseUpイベント
       */
      $('#mainCanvas').mouseup(function() {
        console.log('MouseUp');
        drawFlag = false;
      });
  
      /**
       * Canvas MouseLeaveイベント
       */
      $('#mainCanvas').mouseleave(function() {
        console.log('MouseLeave');
        // TODO : クリックしたままなら描画を続ける機能がほしい
        drawFlag = false;
      });
  
      $('li').click(function() {
        color = $(this).css('background-color');
      });

      $('#clear').click(function(e) {
        e.preventDefault();
        context.clearRect(0, 0, $('canvas').width(), $('canvas').height());
      });

      $('#save').click(function() {
        var d = canvas.toDataURL('image/png');
        d = d.replace('image/png', 'image/octet-stream');
        window.open(d, 'save');
      });

      /**
       * Canvas 線分を描画する
       */
      function drawLine(startX, startY, endX, endY, width, color) {
        // console.log('DrawLine');
        // TODO : モードによっては描画しない
        context.strokeStyle = color;
        context.lineCap = 'round';
        context.lineWidth = width;
        context.beginPath();
        context.moveTo(startX, startY);
        context.lineTo(endX, endY);
        context.stroke();
      };

      /**
       * Canvas 点を描画する
       */
      function drawPoint(x, y, width, color) {
        // console.log('DrawPoint');
        // TODO : モードによっては描画しない
        context.strokeStyle = color;
        context.fillStyle = color;
        context.lineWidth = 1;
        context.beginPath();
        context.arc(x, y, width / 2, 0, 2 * Math.PI);
        context.fill();
        context.stroke();
      };
      // TODO : }のあとの;は必要？

      /**
       *
       */
      function pushBuffer(type, width, color, data) {
        // TODO : モードによっては描画しない
        if ((type == 'line' || type == 'point') &&
            buffer.length > 0 &&
            buffer[buffer.length - 1].type == type &&
            buffer[buffer.length - 1].width == width &&
            buffer[buffer.length - 1].color == color) {
          buffer[buffer.length - 1].data.push(data);
        } else {
          buffer.push({ type: type, width: width, color: color, data: [data] });
        }

        // TODO : 特定のイベント(fill, clear)の場合はbuffer関係なしにすぐ送る
        if (!buffering) {
          console.log('buffering');
          buffering = true;
          // TODO : 送信間隔を変数化
          setTimeout(function() { sendImage() }, 500);
        }
      };

      /**
       * 
       */
      function sendImage() {
        console.log('send image');
        socket.emit('send image', buffer);
        buffer = [];
        buffering = false;
      };
    }
  }); // document.ready()ここまで

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

