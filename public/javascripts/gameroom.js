// TODO : F5無効化

(function () {
  $(document).ready(function () {

    // socketオブジェクト
    var socket;
    // ゲームモード
    var mode;
    // 自分が絵を描く役割かどうか
    var isPainter;
    // お絵かきデータの定期送信用タイマーオブジェクト
    var timer;
    // お絵かきデータの送信間隔(ミリ秒)
    var setTimeoutMillisecond = 500;
    // チャットの文字数制限
    var messageLengthLimit = 100;

    // お絵かきの変数
    // 描画する始点のX座標
    var startX;
    // 描画する始点のY座標
    var startY;
    // TODO : color/widthの初期化は別の場所でやる？
    // 描画する色
    var color = 'Rgb(0, 0, 0)';
    // 描画する線の太さ
    var drawWidth = 1;
    // 描画中フラグ
    var drawFlag = false;
    // canvasオブジェクト
    var canvas = $('#mainCanvas').get(0);
    // contextオブジェクト
    var context;
    // お絵かきデータのbuffer
    var buffer = [];
    // お絵かきデータ送信用のタイマーがセットされているか
    var buffering = false;

    // TODO : 接続先を変数化
    // serverに接続
    socket = io.connect('http://localhost');

    // TODO : 部屋名とか設定（認証完了後か？）

    //------------------------------
    // メッセージハンドラ定義
    //------------------------------

    /**
     * 接続できたら画面を初期化するための情報を要求する
     */
    socket.on('connected', function () {
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
    socket.on('enter room ng', function () {
      console.log('enter room ng');

      // TODO : エラー表示
      // TODO : lobby に redirect
    });

    /**
     * 受け取ったメッセージを表示する 
     */
    socket.on('push chat', function (message) {
      // console.log('push chat');

      $('#messages').prepend(message.userName + ' : ' + message.message + '<br />');
    });

    /**
     * 受け取ったシステムメッセージを表示する
     */
    socket.on('push system message', function (message) {
      // console.log('push system message');

      $('#sysmessages').prepend(message + '<br />');
    });

    /**
     * お絵かきデータの差分を受取る
     */
    socket.on('push image', function (data) {
      console.log('push image');

      // 自分が描いたデータは無視する
      // TODO : 通信量削減のためserver側で制御したい 
      if (data.userName == credentials.userName) {
        return;
      }

      drawData(data.data);
    });

    /**
     * 途中入室時にお絵かきデータをまとめて受け取る
     */
    socket.on('push image first', function (data) {
      for (var i = 0; i < data.length; i++) {
        drawData(data[i]);
      }
    });

    /**
     * プレイヤー情報の表示を更新する
     */
    socket.on('update member', function (players) {
      console.log('update member');

      $('#players').empty();
      var html = '';
      for (var i = 0; i < players.length; i++) {
        if (players[i] == undefined) continue;
        html += '<tr><td>' + players[i].name + '</td></tr>';
        html += '<tr><td>' + players[i].score + '</td></tr>';
        html += '<tr><td>' + (players[i].isReady ? '準備完了' : '準備中') + '</td></tr>';
      }
      $('#players').append(html);
    });

    /**
     * canvasをクリアする
     */
    socket.on('clear canvas', function () {
      console.log('clear canvas');

      fillRect('Rgb(255, 255, 255)');
    });

    /**
     * 残り時間の表示を更新
     */
    socket.on('send time left', function (timeLeft) {
      console.log('send time left');

      $('#time').empty();
      $('#time').append('残り時間 ' + timeLeft + ' 秒');
    });

    /**
     * お題とヒントを表示する
     */
    socket.on('send theme', function (theme) {
      console.log('send theme');

      $('#theme').empty();
      $('#theme').append('お題 ： ' + theme);
    });

    /**
     * painterかどうかを設定する
     */
    socket.on('send is painter', function (data) {
      console.log('send is painter');

      isPainter = data;
    });

    /**
     * モード変更処理
     */
    socket.on('change mode', function (data) {
      console.log('change mode ' + data);

      mode = data;
      if (mode == 'chat') {
        ('#time').empty();
      }
    });

    //------------------------------
    // イベントハンドラ定義
    //------------------------------

    /**
     * 
     */
    $('#message').on('keydown', function (e) {
      if ((e.which && e.which === 13) || (e.keyCode && e.keyCode === 13)) {
        var message = $('#message').val();

        if (message.length == 0) {
          // なにもしない
        } else if (message.length > messageLengthLimit) {
          // TODO : エラー表示
        } else {
          socket.emit('send chat', message, function () {
            // メッセージの送信に成功したらテキストボックスをクリアする
            $('#message').val('');
          });
        }

        return false;
      } else {
        return true;
      }
    });

    // TODO : canvas非対応ブラウザへの対応 ここだけじゃなくてほぼ全体入れる必要あり、
    // というかlobbyの段階ではじくべきだけど、lobbyではcanvas使わない……
    if (canvas.getContext)
    {
      context = canvas.getContext('2d');

      /**
       * Canvas MouseDownイベント
       */
      $('#mainCanvas').mousedown(function (e) {
        console.log('MouseDown');

        if (!canDraw()) return;

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
      $('#mainCanvas').mousemove(function (e) {
        console.log('MouseMove');

        if (!canDraw()) return;

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
      $('#mainCanvas').mouseup(function () {
        console.log('MouseUp');
        drawFlag = false;
      });
  
      /**
       * Canvas MouseLeaveイベント
       */
      $('#mainCanvas').mouseleave(function () {
        console.log('MouseLeave');
        // TODO : クリックしたままなら描画を続ける機能がほしい
        drawFlag = false;
      });

      // TODO : もうちょっときれいに
      $('#width1px').on('click', function () {
        drawWidth = 1;
      });
      $('#width5px').on('click', function () {
        drawWidth = 5;
      });
      $('#width10px').on('click', function () {
        drawWidth = 10;
      });
      $('#width15px').on('click', function () {
        drawWidth = 15;
      });

      $('td').on('click', function () {
        color = $(this).css('background-color');
      });

      $('td').on('dblclick', function () {
        if (!canDraw()) return;

        fillRect(color);
        pushBuffer('fill', null, color, null);
      });

      $('#save').on('click', function () {
        var d = canvas.toDataURL('image/png');
        d = d.replace('image/png', 'image/octet-stream');
        window.open(d, 'save');
      });

      /**
       * 準備完了ボタン クリックイベント
       */
      $('#ready').on('click', function () {
        console.log('#ready click');
  
        socket.emit('ready', function () {
          // TODO : 準備完了／キャンセルの管理
        });
      });

      /**
       * 受け取ったお絵かきデータを描画メソッドに振り分ける
       */
      function drawData (data) {
        for (var i = 0; i < data.length; i++) {
          if (data[i].type == 'fill') {
            fillRect(data[i].color);
          } else {
            for (var j = 0; j < data[i].data.length; j++) {
              var type  = data[i].type;
              var width = data[i].width;
              var color = data[i].color;
              var d = data[i].data[j];
    
              if (type == 'line') {
                drawLine(d.xs, d.ys, d.xe, d.ye, width, color);
              } else if (type == 'point') {
                drawPoint(d.x, d.y, width, color);
              } else {
                // TODO : エラー
              }
            }
          }
        }
      }

      /**
       * モードと役割から描画可能か判定する
       */
      function canDraw () {
        return mode == 'chat' || (mode == 'turn' && isPainter)
      }

      /**
       * Canvas 線分を描画する
       */
      function drawLine (startX, startY, endX, endY, width, color) {
        // console.log('DrawLine');

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
      function drawPoint (x, y, width, color) {
        // console.log('DrawPoint');

        context.strokeStyle = color;
        context.fillStyle = color;
        context.lineWidth = 1;
        context.beginPath();
        context.arc(x, y, width / 2, 0, 2 * Math.PI);
        context.fill();
        context.stroke();
      };

      /**
       * Canvas 塗りつぶし
       */
      function fillRect (color) {
        // console.log('FillRect');

        context.fillStyle = color;
        context.beginPath();
        context.fillRect(0, 0, $('canvas').width(), $('canvas').height());
        context.stroke();
      }

      /**
       * お絵かき情報をbufferに溜める
       */
      function pushBuffer (type, width, color, data) {
        // console.log('PushBuffer');

        if (type == 'line' || type == 'point') {
          if (buffer.length > 0 &&
              buffer[buffer.length - 1].type == type &&
              buffer[buffer.length - 1].width == width &&
              buffer[buffer.length - 1].color == color) {
            buffer[buffer.length - 1].data.push(data);
          } else {
            buffer.push({ type: type, width: width, color: color, data: [data] });
          }
        } else if (type == 'fill') {
          // 塗りつぶしの場合は遅延なしで送信する
          buffer.length = 0;
          buffer.push({ type: type, color: color});
          clearTimeout(timer);
          sendImage();
          return;
        }

        if (!buffering) {
          // console.log('buffering');

          buffering = true;
          timer = setTimeout(function () { sendImage() }, setTimeoutMillisecond);
        }
      };

      /**
       * bufferを送信する
       */
      function sendImage () {
        // console.log('send image');

        socket.emit('send image', buffer);
        buffer.length = 0;
        buffering = false;
      };
    }
  });
})();
