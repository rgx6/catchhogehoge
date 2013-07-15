
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
// TODO : rename
var chatsockets = require('./sockets/app.js');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// TODO : route 変数化 
app.get('/catchhogehoge', routes.index);
app.post('/catchhogehoge/gameroom', routes.room);
// TODO : 末尾の / なしは / ありに redirect させたい

var server = http.createServer(app);
server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

// TODO : debug
var io = require('socket.io').listen(server, {log:false});
// TODO : globalにしたくない
sockets = io.sockets.on('connection', chatsockets.onConnection);
