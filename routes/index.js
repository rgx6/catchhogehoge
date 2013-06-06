/*
 * GET home page.
 */

var crypto = require('crypto');

exports.index = function(req, res){
  res.render('index', { title: 'catch hoge hoge' });
};

exports.room = function(req, res){
  var roomName = req.body.roomName || '';
  var userName = req.body.userName || '';
  var token    = req.body.token || '';

  // TODO : エラーページを表示するか、lobbyにリダイレクトさせたい
  if (roomName === '' ||
      userName === '' ||
      token === '') {
    res.send(500);
    return;
  };

  // TODO : ここの仕組みを確認
  var params = {
    title: 'ルーム：' + roomName,
    roomName: roomName,
    userName: userName,
    token: token
  };
  res.render('room', params);
};
