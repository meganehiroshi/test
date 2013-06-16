	var SQL_talkroom_sel     = 'select talkroom.roomid,tag.tagid,tagname,title,DATE_FORMAT(talkroom.start,"%Y/%m/%d") as start,talkroom.end from theme , tag , talkroom  where theme.tagid = tag.tagid and theme.themeid = talkroom.themeid and talkroom.roomid=? ;';
	var SQL_chatList_sel     = 'select talkroom.roomid,chatid,user.id,user.name,message,createdate from talkroom_chat , talkroom , user   where talkroom_chat.roomid = talkroom.roomid and talkroom_chat.id = user.id and talkroom.roomid = ? order by chatid;';

//AWS設定
	var CONNECT_INFO ={
	                   host     : process.env.RDS_HOSTNAME,
	                   user     : process.env.RDS_USERNAME,
	                   password : process.env.RDS_PASSWORD,
	                   port     : process.env.RDS_PORT,
	             	  database : 'talkmob'    //DB名
					}

  exports.openChatList = function(req,res,user,roomid,callback){
	//SQL文を書く
	var sql = SQL_chatList_sel;
    var params =  roomid;

	var mysql = require('mysql');

	var connection = mysql.createConnection(CONNECT_INFO);
	connection.connect();

	//プレースホルダー使ってSQL発行
	var query = connection.query(sql,params);
	var results = [];

	console.log('sql:'+sql);
	  //あとはイベント発生したらそれぞれよろしくねっ
	query
	  //エラー用
	  .on('error', function(err) {
	    console.log('err is: ', err );
	    callback(err);
	  })

	  //結果用
	  .on('result', function(row) {
	    console.log('The res is: ', row );
	    results.push(row);
	  })

	  //終わったよう～
	  .on('end', function() {
	    console.log('end');
	    connection.destroy(); //終了
	    callback(results);
	  });

	};

  exports.SelectTalkroom = function(req,res,roomid,callback){
	//SQL文を書く
	var sql = SQL_talkroom_sel;
    var params =  roomid;

	var mysql = require('mysql');

	var connection = mysql.createConnection(CONNECT_INFO);
	connection.connect();

	//プレースホルダー使ってSQL発行
	var query = connection.query(sql,params);
	var results = [];

	console.log('sql:'+sql);
	  //あとはイベント発生したらそれぞれよろしくねっ
	query
	  //エラー用
	  .on('error', function(err) {
	    console.log('err is: ', err );
	    callback(err);
	  })

	  //結果用
	  .on('result', function(row) {
	    console.log('The res is: ', row );
	    results.push(row);
	  })

	  //終わったよう～
	  .on('end', function() {
	    console.log('end');
	    connection.destroy(); //終了
	    callback(results);
	  });

	};

  exports.sendChatMsg = function(data,callback){
	//SQL文を書く
	var sql = 'insert into talkroom_chat (roomid,id,deleteflag,message,createdate) values (?,?,0,?,NOW());';
    var params =  [data.roomid , data.id , data.message];

	var mysql = require('mysql');

	var connection = mysql.createConnection(CONNECT_INFO);
	connection.connect();

	//プレースホルダー使ってSQL発行
	var query = connection.query(sql,params);
	var results = [];

	console.log('sql:'+sql);
	  //あとはイベント発生したらそれぞれよろしくねっ
	query
	  //エラー用
	  .on('error', function(err) {
	    console.log('err is: ', err );
	    callback(err);
	  })

	  //結果用
	  .on('result', function(rows) {
	    console.log('The res is: ', rows );
	  })

	  //終わったよう～
	  .on('end', function() {
	    console.log('end');
	    //connection.destroy(); //終了
	    connection.end();
	    callback(null);
	  });

	};