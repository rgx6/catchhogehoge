(function(){
  var Dictionary = require('./dictionary.js').Dictionary;

  var Room = (function () {

    /**
     * コンストラクタ
     */
    function Room (name, comment, password) {
      this.name           = name;
      this.comment        = comment;
      this.password       = password;
      this.dictionary     = new Dictionary('defalut', [
                              'か', 'もも', 'りんご', 'ようなし', 'あんこだま',
                              'ぴあきゃすと', 'すまーとふぉん', 'ぺんたぶれっと',
                              'あいうえおかきくけこさしすせそたちつてと'
                            ]);
      this.theme          = null;
      this.tokens         = {};
      this.users          = [];
      this.imagelog       = [];
      this.mode           = 'chat';
      this.round          = 0;
      this.timeLeft       = 0;
    }

    // 定数
    var roundMax           = 2;
    var playerCountMax     = 8;
    var turnSecond         = 120;
    var firstHintTime      = 90;
    var secondHintTime     = 60;
    var thirdHintTime      = 30;
    var intervalSecond     = 10;
    var messageLengthLimit = 40;

    /**
     * client送信用のプレイヤー情報を取得する
     */
    Room.prototype.getPlayersInfo = function () {
      var players = [];
      for (var i = 0; i < this.users.length; i++) {
        var user = this.users[i];
        players.push({
          name:      user.name,
          score:     user.score,
          isReady:   user.isReady,
          isPainter: user.isPainter
        })
      }
      return players;
    }

    /**
     * プレイヤー情報をroomに送信
     */
    Room.prototype.updateMember = function () {
      this.log('update member');
      // TODO : room存在チェックは呼び出し側で
      // TODO : painter情報と正解、優勝者の情報は別に管理するか？要検討
      sockets.to(this.name).emit('update member', this.getPlayersInfo());
    }

    /**
     * playerの名前からusersのindexを取得
     */
    Room.prototype.getPlayerIndex = function (playerName) {
      for (var i = 0; i < this.users.length; i++) {
        if (this.users[i].name == playerName) return i;
      }
      return -1;
    }

    /**
     * painterのusersのindexを取得
     */
    Room.prototype.getPainterIndex = function () {
      for (var i = 0; i < this.users.length; i++) {
        if (this.users[i].isPainter) return i;
      }
      return -1;
    }

    /**
     * message の長さチェック
     */
    Room.prototype.isValidMessage = function (message) {
      if (message.trim().length == 0 || message.length > messageLengthLimit) {
        return false;
      }
      return true;
    }

    /**
     * playerからのmessageを処理
     */
    Room.prototype.procMessage = function (playerName, message) {
      this.log('proc message:' + playerName + ' ' + message);

      if (this.mode == 'turn') {
        if(message.trim() == this.theme) {
          this.log('answer');

          var playerIndex = this.getPlayerIndex(playerName);
          var painterIndex = this.getPainterIndex();
          this.log(playerIndex + '/' + painterIndex);

          // TODO : チェック必要ないかも。スリープからの復帰時なんかに接続が維持されると困るけど。
          if (playerIndex < 0 || painterIndex < 0) return;

          if (this.users[painterIndex].name == playerName) {
            this.pushSystemMessage('ネタバレNG');
            return;
          }

          sockets.to(this.name).emit('push chat', { userName: playerName, message: message });

          this.users[playerIndex].score  += this.timeLeft;
          this.users[painterIndex].score += this.timeLeft;
          this.sendTheme(9);
          this.pushSystemMessage(this.users[playerIndex].name + ' 正解 ' + this.timeLeft + '点 合計' + this.users[playerIndex].score + '点');
          this.pushSystemMessage(this.users[painterIndex].name + ' ' + this.timeLeft + '点 合計' + this.users[painterIndex].score + '点');
          this.endTurn();
        } else {
          // TODO : debug
          this.log('not answer');

          sockets.to(this.name).emit('push chat', { userName: playerName, message: message });
        }
      } else {
        // message を push する
        this.log('push chat ' + this.name + ' ' + playerName + ' ' + message);

        sockets.to(this.name).emit('push chat', { userName: playerName, message: message });
      }
    }

    Room.prototype.pushSystemMessage = function (message) {
      this.log('push system message ' + this.name + ' ' + message);
      sockets.to(this.name).emit('push system message', message);
    }

    Room.prototype.sendTimeLeft = function () {
      sockets.to(this.name).emit('send time left', this.timeLeft);
    }

    /**
     * お題とヒントを送る
     */
    Room.prototype.sendTheme = function (level) {
      this.log('send theme');

      for (var i = 0; i < this.users.length; i++) {
        var user = this.users[i];
        if (user.isPainter) {
          if (level == 0) user.socket.emit('send theme', this.theme);
        } else {
          user.socket.emit('send theme', Dictionary.getHint(this.theme, level));
        }
      }
    }

    /**
     * timerで呼び出される処理
     */
    Room.prototype.timerProc = function () {
      this.log('mode:' + this.mode + ' time:' + this.timeLeft);

      switch(this.mode) {
        // お絵描きチャットモード
        case 'chat':
          // do nothing
          break;
  
        // 準備完了 ゲーム開始カウントダウン
        case 'ready':
          this.timeLeft--;
          if (this.timeLeft == 0) {
            this.initGame();
            this.startTurn();
          } else {
            this.sendTimeLeft();
          }
          break;
  
        // ターン中
        case 'turn':
          this.timeLeft--;
          if (this.timeLeft == 0) {
            // 時間切れでターン終了
            this.endTurn();
          } else {
            this.sendTimeLeft();
            if (this.timeLeft == firstHintTime) {
              this.sendTheme(1);
            } else if (this.timeLeft == secondHintTime) {
              this.sendTheme(2);
            } else if (this.timeLeft == thirdHintTime) {
              this.sendTheme(3);
            }
          }
          break;
  
        // ターンとターンの間
        case 'interval':
          this.timeLeft--;
          if (this.timeLeft == 0) {
            // ターン開始
            this.startTurn();
          } else {
            this.sendTimeLeft();
          }
          break;
  
        // 該当なし ありえないケース
        default:
          // TODO : exceptionにする？
          this.log('ERROR room mode error');
          break;
      }
    }

    /**
     * ゲーム開始時の初期化処理
     */
    Room.prototype.initGame = function () {
      this.log('init game');

      this.round = 1;
      for (var i = 0; i < this.users.length; i++) {
        this.users[i].isPainter = false;    
      }
      this.users[0].isPainter = true;
      this.pushSystemMessage('game start');
    }

    // TODO : roundstart/end作る？

    /**
     * ターン開始処理
     */
    Room.prototype.startTurn = function () {
      this.log('start turn');

      this.mode = 'turn';
      this.timeLeft = turnSecond;
      this.theme = this.dictionary.getNextWord();
      // TODO : debug
      this.pushSystemMessage('debug お題:' + this.theme);
      // TODO : clientに送る情報 painter
      sockets.to(this.name).emit('change mode', 'turn');
      this.pushSystemMessage('startTurn');
      this.sendTimeLeft();
      this.sendTheme(0);
    };

    /**
     * ターン終了処理
     */
    Room.prototype.endTurn = function () {
      this.log('end turn');

      if (this.timeLeft == 0) {
        this.pushSystemMessage('時間切れです。');
      }

      // Painterを特定
      // TODO : 同期処理に漏れがなければ変数に持たせておいた方が速くていいかも
      var i;
      for (i = 0; i < this.users.length; i++) {
        if (this.users[i].isPainter) {
          break;
        }
      }

      // TODO : 不要なチェックか？
      if (i == this.users.length) {
        this.log('ERROR painter not exist');
        //throw 'painter not exist ' + this.name;
        return;
      }

      if (i == this.users.length - 1) {
        // round終了
        if (this.round == roundMax) {
          // ゲーム終了
          // TODO : ゲームの結果を通知
          var maxScore = 0;
          var winnerIndex;
          for (var i = 0; i < this.users.length; i++) {
            // TODO : 全員0点、同率の場合を考慮
            if (this.users[i].score > maxScore) {
              maxScore = this.users[i].score;
              winnerIndex = i;
            }
          }
          this.pushSystemMessage('win ' + this.users[winnerIndex].name + ' score ' + this.users[winnerIndex].score);
          this.pushSystemMessage('game end');
          for (var i = 0; i < this.users.length; i++) {
            this.users[i].isReady = false;
          }
          this.changeModeChat();
        } else {
          // 次のroundに
          this.round += 1;
          this.users[i].isPainter = false;
          this.users[0].isPainter = true;
          this.changeModeInterval();
        }
      } else {
        // 次のturnに
        this.users[i].isPainter = false;
        this.users[i+1].isPainter = true;
        this.changeModeInterval();
      }

    }

    /**
     * モード変更 Chat
     */
    Room.prototype.changeModeChat = function () {
      this.log('change mode chat');
      this.mode = 'chat';
      this.pushSystemMessage('お絵描きチャットモード');
      sockets.to(this.name).emit('change mode', 'chat');
    }

    /**
     * モード変更 Ready
     */
    Room.prototype.changeModeReady = function () {
      this.log('change mode ready');
      this.mode = 'ready';
      // TODO : 定数化
      this.timeLeft = intervalSecond;
      this.pushSystemMessage(intervalSecond + '秒後にゲームを開始します。');
      sockets.to(this.name).emit('change mode', 'ready');
    }

    /**
     * モード変更 Interval
     */
    Room.prototype.changeModeInterval = function () {
      this.log('change mode interval');
      this.mode = 'interval';
      // TODO : 定数化
      this.timeLeft = intervalSecond;
      this.pushSystemMessage(intervalSecond + '秒後に次のターンを開始します。');
      sockets.to(this.name).emit('change mode', 'interval');
    }

    /**
     * player退出時の処理
     */
    Room.prototype.playerExit = function (userName) {
      this.log('player exit ' + userName);

      // userを削除
      for (var i = 0; i < this.users.length; i++) {
        if (this.users[i].name == userName) {
          if (this.mode == 'turn' || this.mode == 'interval') {
            if (this.users[i].isPainter) {
              // TODO : ゲーム進行の調整
              // TODO : ゲーム中&&退出プレイヤーがpainterなら引き継ぎ
              // TODO : ゲーム終了チェック＆＆モード変更も
              // TODO : システムメッセージ
            }
          }
          this.users.splice(i, 1);
          break;
        }
      }

      // roomにuser情報を通知
      // TODO : player 0 でこの処理しても大丈夫？
      this.updateMember();
    }

    /**
     * log出力メソッド
     */
    Room.prototype.log = function (message) {
      console.log('[' + this.name + '] ' + message);
    }

    return Room;
  })();

  exports.Room = Room;
})();
