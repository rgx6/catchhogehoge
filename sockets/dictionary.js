(function () {

  /**
   * コンストラクタ 
   */
  var Dictionary = (function () {
    function Dictionary (name, words) {
      this.name  = name;
      this.words = words;
    }

    Dictionary.prototype.getNextWord = function () {
      // TODO : 乱数調整
      // TODO : お題にもHTMLエスケープ必要か？登録時にチェックすれば不要
      var nextIndex = Math.floor(Math.random() * this.words.length);
      return this.words[nextIndex];
    }

    /**
     * ヒントを取得する
     */
    Dictionary.getHint = function (word, level) {
      if (level == 0) {
        return '？？？';
      } else if (level == 1 || word.lenght == 1) {
        return word.replace(/./g, '○');
      } else if (level == 2 || word.lenght <= 2) {
        return word.charAt(0) + word.substr(1).replace(/./g, '○');
      } else if (level == 3) {
        return word.charAt(0) + word.substr(1, word.length - 2).replace(/./g, '○') + word.substr(-1);
      } else if (level == 9) {
        return word;
      }
    }

    return Dictionary;
  })();
  
  exports.Dictionary = Dictionary;
})();
