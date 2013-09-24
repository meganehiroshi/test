
/**
 * Module dependencies.
 */

var flash = require('connect-flash')
  ,express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , sql = require('./routes/sql')
  , talkboad = require('./routes/talkboad')
  , http = require('http')
  , path = require('path')
  , OAuth = require('oauth').OAuth //node-oauthをrequire
  , auth = require('./routes/auth')
  , io  = require('socket.io')
  , accounts = require('./routes/accounts')
  , passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , FacebookStrategy = require('passport-facebook').Strategy
  , TwitterStrategy = require('passport-twitter').Strategy
  ;

var app = express();
var domain = (process.env.NODE_ENV === 'local') ?  'localhost:3000' : 'nodetesttalkmob.elasticbeanstalk.com' ;
app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('domain', domain);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
//  app.use(express.bodyParser());
  app.use(express.json())
  .use(express.urlencoded())
  app.use(express.methodOverride());
  //追記(S)
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.set('view options', { layout: false });
  //追記(E)

  //passport
  app.use(flash());
  app.use(passport.initialize());
  app.use(passport.session());

  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/login_tw',auth.auth_tw);
app.get('/login',routes.login);
app.get('/logout', function(req, res){
	  req.logout();  //なんかうまくいかないのでコメントアウト
	  res.redirect('/');
	});
app.get('/callback',auth.auth_tw_callback);
app.get('/taglist',routes.taglist);
//app.get('/taglist',sql.select_taglist);
app.get('/createid',routes.createid);
//app.get('/mainboad',sql.select_meetinglist);
app.get('/mainboad',routes.mainboad);
app.get('/talkboad/:roomid',function(req,res){
	return routes.talkboad(req,res);
	}
);

app.post('/login',
	passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
		function(req, res) {
			console.log('ほすと：'+req.headers.host);
		  res.redirect('/mainboad');
		}
);
var callMainboad = routes.mainboad;
//app.post('/createid',sql.createid_submit);
app.post('/createid',
	function(req, res){
		accounts.signup(req, res, function(err){

		  console.log('post createid result : ' + err);
		  if(err){
			  console.log('post createid error');
			  //Objectも送信するので、リダイレクトではなくレンダーで遷移
			  res.render('createid', { title: 'createid', user_name: null,db_result:err,domain: req.headers.host});
		  }else{
			  console.log('post createid success');
			  passport.authenticate('local', { failureRedirect: '/createid', successRedirect: '/mainboad', failureFlash: true });
			  res.redirect('/');

//			  passport.authenticate('local', function(err, user, info) {
//				    //if (err) { return err(err); }
//				    if (!user) { return res.redirect('/createid'); }
//				    console.log('923sssd');
//				    req.logIn(user, function(err) {
//				     // if (err) { return next(err); }
//				    	console.log('123sssd');
//				      return res.redirect('/mainboad');
//				    });
//				  })(req,res);

		  }
	  	});
	}
);



app.post('/talkboad',routes.talkboad);
//app.post('/taglist',sql.update_tag);
app.post('/taglist',routes.taglistUpdate);

app.get('/users', user.list);




passport.serializeUser(function(user, done) {
  done(null, user); // ここの変数userが、ビューの○○.jadeに渡される。
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

var findById = accounts.findById;
var findByUsername = accounts.findByUsername;

passport.use(new LocalStrategy(
	function(name, pass, done) {
	  // asynchronous verification, for effect...
	  process.nextTick(function () {
console.log('asdfasd');
	    // Find the user by username. If there is no user with the given
	    // username, or the password is not correct, set the user to `false` to
	    // indicate failure and set a flash message. Otherwise, return the
	    // authenticated `user`.
	    findByUsername(name, function(err, user) {
	      if (err) {
	        return done(err);
	      }
	      if (!user) {
	        return done(null, false, { message: 'Unknown user ' + name + ' or invalid password.' });
	      }
	      if (user.pass != pass) {
	        return done(null, false, { message: 'Unknown user ' + name + ' or invalid password.'  });
	      }
	      console.log('id+name:'+user.id + user.name)
	      return done(null, user);
	    })
	  });
	}
));

//http.createServer(app).listen(app.get('port'), function(){
//  console.log("Express server listening on port " + app.get('port'));
//});

var server = http.createServer(app).listen(app.get('port'), function(){
	console.log("Express server listening on port " + app.get('port'));
	});



//------------- upload sample ----------------//

var  Alleup = require('alleup');
var alleup = new Alleup({storage : "aws", config_file: "./node_modules/alleup/path_to_alleup_config.json"})

app.get('/upload_form', function(req, res) {
  res.writeHead(200, {'content-type': 'text/html'});
    res.end(
      '<form action="/upload" enctype="multipart/form-data" method="post">'+
        '<input type="text" name="title"><br>'+
        '<input type="file" name="upload" multiple="multiple"><br>'+
        '<input type="submit" value="Upload">'+
      '</form>'
    );

});

app.post('/upload',  function(req, res) {
 // Without Scopes
  alleup.upload(req, res, function(err, file, res){

      console.log("FILE UPLOADED: " + file);
      // THIS YOU CAN SAVE FILE TO DATABASE FOR EXAMPLE
      //res.end();
      res.redirect('/mainboad');
  });
 });








//var io = require('socket.io').listen(server);
//------------------------ scket.io --------------------------//
var port = 3000;
//app.listen(port);

//var socket = io.listen(app);
//var chat = io.listen(server);
var chat = require('socket.io').listen(server);

var socketsOf = {};

chat.sockets.on('connection', function(socket) {

	//console.log('app.js connection');
	socket.emit('connected');

    socket.on('init', function(data) {
    	//console.log('app.js init  roomid:'+data.roomid +'  name:'+data.name + ' id : '+data.id )

    	socket.set('roomid', data.roomid);
    	socket.join(data.roomid);
    	socket.set('name', data.name);
    	socket.set('id', data.id);
    	socket.set('client',data,function(){
    		if(socketsOf[data.roomid] == undefined){
    			socketsOf[data.roomid] = {};
    		}
    		if(socketsOf[data.roomid][data.id] == undefined){
    			socketsOf[data.roomid][data.id] = {};
    		}

    		socketsOf[data.roomid][data.id] = socket;
    	})
    	var members = Object.keys(socketsOf[data.roomid]);
    	//console.log(members);
    	chat.sockets.to(data.roomid).emit('msg', {action:'join',user:data.name,id:data.id,memberlist:members});

    	//console.log('app.js init end')
    });

	// クライアントからのイベント'all'を受信する
	socket.on('all', function(data) {
	// イベント名'msg'で受信メッセージを
	// 自分を含む全クライアントにブロードキャストする

		console.log('data.text:'+ data.message + ' action:'+data.action +' user:'+ data.user+ ' id:'+data.id);
		//add roomid 2013.06.07(S)//
		var roomid,name;
		socket.get('roomid',function(err,_roomid){
			roomid = _roomid;
			data.roomid = _roomid;
			console.log('roomid:'+data.roomid );
		});



		//チャットメッセージをDBへ登録
		talkboad.sendChatMsg(data,function(result){
			if(result == null){
				//DBに登録したチャットメッセージのidを取得
				talkboad.SelectChatMaxId(data,function(result){
					//チャットメッセージのidをdata変数に格納
					data.chatid = result.maxChatId;
					data.createdate = result.createdate;

					//トークルーム内の全員へチャットメッセージを送信
					chat.sockets.to(roomid).emit('msg', data);
				});
			}else{
				console.log('Error sendChatMsg:'+result );
			}
		});



		//add roomid 2013.06.07(E)//

		//    //socket.send(data);
		//    socket.emit('msg', data);

	  });

  // クライアントからのイベント'others'を受信する
  socket.on('others', function(data) {
    // イベント名'msg'で受信メッセージを
    // 自分以外の全クライアントにブロードキャストする
    //socket.broadcast.emit('msg', data);
    var roomid;
	socket.get('roomid',function(err,_roomid){
		roomid = _roomid;
		//console.log('roomid:'+roomid);
	});

    chat.sockets.to(roomid).emit('msg', data);
    //socket.broadcast.emit('msg', data);
  });

  //********* イイネ　ボタンの更新 ***********//
  socket.on('like', function(data) {
    //socket.broadcast.emit('msg', data);
    var roomid;
	socket.get('roomid',function(err,_roomid){
		roomid = _roomid;
		//console.log('roomid:'+roomid);
	});

	//すでにイイネを押しているかを確認
	talkboad.checkDidLike(data,function(result){
		if(result == false){
			//イイネをDBに登録
			talkboad.doLike(data,function(result){
				if(result == null){
					//同じチャットIDのイイネの数をカウント
					talkboad.countLike(data,function(result){
						if(result != null){
							//チャットメッセージのidをdata変数に格納
							data.likeCount = result;

							//トークルーム内の全員へチャットメッセージを送信
							chat.sockets.to(roomid).emit('msg', data);
						}else{
							//イイネの数をカウント取得に失敗
							console.log('Error countLike:' + result);
						}
					});
				}else{
					//イイネの登録に失敗
					console.log('Error doLike:'+result );
				}
			});
		}else{
			console.log('Error checkDidLike:'+result );
		}
	});

    //socket.broadcast.emit('msg', data);
  });

  //********* チャットリストの過去分取得 ***********//
  socket.on('moreChatList', function(data) {

    var roomid;
	socket.get('roomid',function(err,_roomid){
		roomid = _roomid;
	});

	console.log("roomid:"+roomid + " minChatid:"+data.minChatid);

	//
	talkboad.openChatList(roomid,data.minChatid,function(result){
		if(result != null){
			//操作者だけに返せば良いので'socket.emit'を使用
			socket.emit('moreChatList', result);
		}else{
			console.log('Error checkDidLike:'+result );
		}
	});

    //socket.broadcast.emit('msg', data);
  });


  socket.on('disconnect', function(data) {
    console.log('disconn');

    var roomid,name,id;
	socket.get('roomid',function(err,_roomid){
		roomid = _roomid;
		//console.log('roomid:'+roomid);
	});
	socket.get('name',function(err,_name){
		name = _name;
		//console.log('name:'+name);
	});
	socket.get('id',function(err,_id){
		id = _id;
		//console.log('name:'+name);
	});
    chat.sockets.to(roomid).emit('msg', {action:'exit',user:name,id:id});
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



    // クライアントからのイベント'all'を受信する
  socket.on('settag', function(data) {
    //socket.send(data);
    socket.emit('settag-result', data);
    socket.broadcast.emit('msg', data);
  });

});
console.log('Server running at http://127.0.0.1:3000/');