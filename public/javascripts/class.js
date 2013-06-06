// class.js

// Room クラス
var Room = function(name, comment, password, dictionary) {
  this.name = name;
  this.comment = comment;
  this.password = password;
  this.dictionary = dictionary;
};

// User クラス
// var User = function(name, location, role, handler) {
  // this.name = name;
  // this.role = role;
// };

// DrawData クラス
var DrawData = function(xs, ys, xe, ye, r, g, b, size) {
  this.xs = xs;
  this.ys = ys;
  this.xe = xe;
  this.ye = ye;
  this.r = r;
  this.g = g;
  this.b = b;
  this.size = size;
}
