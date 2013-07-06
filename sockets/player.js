
// TODO : 見直し

var Player = (function () {
  function Player(name) {
    this.name = name;
    this.score = 0;
    this.ready = false;
    this.isPainter = false;
  }

  Player.prototype.hoge = function () {
    console.log('instance method だったか？')
  }

  return Player;
})();

exports.Player = Player;
