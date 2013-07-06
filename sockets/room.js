
var Room = (function () {
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
  }

  Room.prototype.hoge = function () {
    console.log('instance method だったか？')
  }

  return Room;
})();

exports.Room = Room;