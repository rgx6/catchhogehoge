(function () {
  'use strict';
    
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
    };

    /**
     * ヒントを取得する
     */
    Dictionary.getHint = function (word, level) {
      if (level === 9) {
        // 正解
        return word;
      } else if (level >= 3 && word.length >= 3) {
        // 3回目以降のヒント 3文字以上なら先頭と末尾を表示
        return word.charAt(0) + word.substr(1, word.length - 2).replace(/./g, '○') + word.substr(-1);
      } else if (level >= 2 && word.length >= 2) {
        // 2回目以降のヒント 2文字以上なら先頭を表示
        return word.charAt(0) + word.substr(1).replace(/./g, '○');
      } else if (level >= 1) {
        // 1回目以降のヒント 文字数だけ表示
        return word.replace(/./g, '○');
      } else {
        // ノーヒント
        return '？？？';
      }
    };

    return Dictionary;
  })();

  exports.Dictionary = Dictionary;
})();
