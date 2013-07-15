(function () {

  /**
   * コンストラクタ 
   */
  var Player = (function () {
    function Player (name, socket) {
      this.name      = name;
      this.score     = 0;
      this.isReady   = false;
      this.socket    = socket;
    }
  
    return Player;
  })();
  
  exports.Player = Player;
})();
