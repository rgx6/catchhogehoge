
var appName = 'キャッチ○○○○○○（開発中）';

// TODO : title
exports.index = function (req, res) {
  res.render('index', { title: appName });
};

exports.redirectToIndex = function (req, res) {
  res.redirect('/catchhogehoge/');
};

exports.room = function (req, res) {
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

  var params = {
    title: appName,
    roomName: roomName,
    userName: userName,
    token: token
  };
  res.render('gameroom', params);
};
