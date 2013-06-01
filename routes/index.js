/*
 * GET home page.
 */

var crypto = require('crypto');

exports.index = function(req, res){
  res.render('index', { title: 'minichat' });
};

exports.room = function(req, res){
  var roomName = req.body.roomName || '';
  var yourName = req.body.yourName || '';
  var password = req.body.password || '';
  var mode = req.body.mode;

  if (mode === undefined) {
    res.send(500);
    return;
  };

  var hashedPassword = '';
  var shasum = crypto.createHash('sha512');

  if (password !== '') {
    shasum.update('initialhash');
    shasum.update(password);
    hashedPassword = shasum.digest('hex');
  }

  var params = {
    title: 'チャットルーム：' + roomName,
    room: {
      name: roomName,
      password: hashedPassword
    },
    user: {name: yourName},
    mode: mode
  };
  res.render('room', params);
};
