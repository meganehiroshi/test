
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , sql = require('./routes/sql')
  , http = require('http')
  , path = require('path')
  , OAuth = require('oauth').OAuth //node-oauthをrequire
  , auth = require('./routes/auth')
  , io  = require('socket.io')
  ;


var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  //追記(S)
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.set('view options', { layout: false });
  //追記(E)
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/login',auth.auth_tw);
app.get('/callback',auth.auth_tw_callback);
//app.get('/taglist',routes.taglist);
app.get('/taglist',sql.select_taglist);
app.get('/createid',routes.createid);
app.get('/mainboad',sql.select_meetinglist);
app.get('/talkboad',routes.talkboad);

app.post('/createid',sql.createid_submit);
app.post('/talkboad',routes.talkboad);
app.post('/taglist',sql.update_tag);

app.get('/users', user.list);
app.get('/foo/:id',routes.sample1);


//http.createServer(app).listen(app.get('port'), function(){
//  console.log("Express server listening on port " + app.get('port'));
//});

var server = http.createServer(app).listen(app.get('port'), function(){
	console.log("Express server listening on port " + app.get('port'));
	});

//var io = require('socket.io').listen(server);
//------------------------ scket.io --------------------------//
var port = 3000;
//app.listen(port);

//var socket = io.listen(app);
var sockets = io.listen(server);

sockets.on('connection', function(socket) {
  console.log('onconnection:', socket);

  // クライアントからのイベント'all'を受信する
  socket.on('all', function(data) {
    // イベント名'msg'で受信メッセージを
    // 自分を含む全クライアントにブロードキャストする

    //socket.send(data);
    socket.emit('msg', data);
    socket.broadcast.emit('msg', data);
  });

  // クライアントからのイベント'others'を受信する
  socket.on('others', function(data) {
    // イベント名'msg'で受信メッセージを
    // 自分以外の全クライアントにブロードキャストする
    socket.broadcast.emit('msg', data);
  });

  // クライアントからのイベント'others'を受信する
  socket.on('postit', function(data) {
    // イベント名'msg'で受信メッセージを
    // 自分以外の全クライアントにブロードキャストする
    console.log('postit:');
    //socket.emit('postit', data);
    socket.broadcast.emit('postit', data);
  });

    // クライアントからのイベント'others'を受信する
  socket.on('mouseup', function(data) {
    // イベント名'msg'で受信メッセージを
    // 自分以外の全クライアントにブロードキャストする
    console.log('mouseup:');
    //socket.emit('postit', data);
    socket.broadcast.emit('mouseup', data);
  });

  socket.on('disconnect', function() {
    console.log('disconn');
  });

    // クライアントからのイベント'all'を受信する
  socket.on('settag', function(data) {
    //socket.send(data);
    socket.emit('settag-result', data);
    socket.broadcast.emit('msg', data);
  });

});
console.log('Server running at http://127.0.0.1:3000/');