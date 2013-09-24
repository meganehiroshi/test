	var SQL_talkroom_sel     = 'select talkroom.roomid,tag.tagid,tagname,title,DATE_FORMAT(talkroom.start,"%Y/%m/%d") as start,talkroom.end from theme , tag , talkroom  where theme.tagid = tag.tagid and theme.themeid = talkroom.themeid and talkroom.roomid=? ;';
    var where_chatid         ='and talkroom_chat.chatid < ?'
	var SQL_chatList_sel     = 'select a.* from (select talkroom.roomid,chatid,user.id,user.name,message,DATE_FORMAT(createdate,"%Y/%m/%d %H:%i") as createdate from talkroom_chat , talkroom , user   where talkroom_chat.roomid = talkroom.roomid and talkroom_chat.id = user.id and talkroom.roomid = ? ' + where_chatid + ' order by chatid desc limit 30) a order by a.chatid asc ;';

    //AWS設定
	var CONNECT_INFO ={
	                   host     : process.env.RDS_HOSTNAME,
	                   user     : process.env.RDS_USERNAME,
	                   password : process.env.RDS_PASSWORD,
	                   port     : process.env.RDS_PORT,
	             	  database : 'talkmob'    //DB名
					}

  exports.openChatList = function(roomid,rownum,callback){
	//SQL文を書く
	var sql = SQL_chatList_sel;
    var params;

    if(rownum == ''){
    	sql = sql.replace(where_chatid,'');
    	params =  roomid;
    }else{
    	params =  [roomid,rownum];
    }

//   console.log('sql: ' + sql);
//   console.log('params: ' + params);

	var mysql = require('mysql');

	var connection = mysql.createConnection(CONNECT_INFO);
	connection.connect();

	//プレースホルダー使ってSQL発行
	var query = connection.query(sql,params);
	var results = [];

//	console.log('sql:'+sql);
	  //あとはイベント発生したらそれぞれよろしくねっ
	query
	  //エラー用
	  .on('error', function(err) {
	    console.log('err is: ', err );
	    callback(err);
	  })

	  //結果用
	  .on('result', function(row) {
	    //console.log('The res is: ', row );
	    results.push(row);
	  })

	  //終わったよう～
	  .on('end', function() {
	    //console.log('end');
	    connection.destroy(); //終了
	    callback(results);
	  });

	};

  exports.getRoomInfo = function(req,res,roomid,callback){
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

  //チャットメッセージ登録後に、採番されたchatidを取得する
  exports.SelectChatMaxId = function(data,callback){
		//SQL文を書く

		var sql = "select max(chatid) as maxChatId,DATE_FORMAT(createdate,'%Y/%m/%d %H:%i')  as createdate from talkroom_chat where id = ? and roomid = ?";
	    var params =  [data.id,data.roomid];
	    var maxChatId;
		var mysql = require('mysql');

		var connection = mysql.createConnection(CONNECT_INFO);
		connection.connect();

		//プレースホルダー使ってSQL発行
		var query = connection.query(sql,params);
		var result ;

		console.log('sql:'+sql);
		  //あとはイベント発生したらそれぞれよろしくねっ
		query
		  //エラー用
		  .on('error', function(err) {
		    console.log('err is: ', err );
		    callback(err);
		  })

		  //結果用
		  .on('result', function(row) {    //1行しか返ってこないので"rows"ではなく"row"を使用
		    //console.log('The res is: ', row );
		    console.log('The res is row[0]: ', row.maxChatId );
		    result = row;
		    //maxChatId = row.maxChatId;

		  })

		  //終わったよう～
		  .on('end', function() {
		    console.log('end');
		    connection.destroy(); //終了
		    //callback(maxChatId);
		    callback(result);
		  });

		};


  exports.doLike = function(data,callback){
	//SQL文を書く
	var sql = 'insert into chat_like (chatid,id) values (?,?);';
    var params =  [data.chatid , data.id ];

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
	    //console.log('The res is: ', rows );
	  })

	  //終わったよう～
	  .on('end', function() {
	    //console.log('end');
	    //connection.destroy(); //終了
	    connection.end();
	    callback(null);
	  });

	};

	  exports.checkDidLike = function(data,callback){
		//SQL文を書く
		var sql = "select count(*) as count from chat_like where id = ? and chatid = ?";
	    var params =  [data.id,data.chatid];
	    var result = false;
		var mysql = require('mysql');
		var connection = mysql.createConnection(CONNECT_INFO);
		connection.connect();

		//プレースホルダー使ってSQL発行
		var query = connection.query(sql,params);

		console.log('sql:'+sql);
		  //あとはイベント発生したらそれぞれよろしくねっ
		query
		  //エラー用
		  .on('error', function(err) {
		    console.log('err is: ', err );
		    callback(err);
		  })

		  //結果用
		  .on('result', function(row) {    //1行しか返ってこないので"rows"ではなく"row"を使用
		    //results.push(row);
		    if (row.count > 0){
		    	result = true;
		    }
		  })

		  //終わったよう～
		  .on('end', function() {
		    //console.log('end');
		    connection.destroy(); //終了
		    callback(result);
		  });

		};

	  exports.countLike = function(data,callback){
		//SQL文を書く

		var sql = "select count(*) as count from chat_like where chatid = ?";
	    var params =  [data.chatid];
		var mysql = require('mysql');

		var connection = mysql.createConnection(CONNECT_INFO);
		connection.connect();

		//プレースホルダー使ってSQL発行
		var query = connection.query(sql,params);
		var likeCount;

		console.log('sql:'+sql);
		  //あとはイベント発生したらそれぞれよろしくねっ
		query
		  //エラー用
		  .on('error', function(err) {
		    console.log('err is: ', err );
		    callback(err);
		  })

		  //結果用
		  .on('result', function(row) {    //1行しか返ってこないので"rows"ではなく"row"を使用
		    likeCount = row.count;
		    //console.log('The likeCount is: ', likeCount );
		  })

		  //終わったよう～
		  .on('end', function() {
		    //console.log('end');
		    connection.destroy(); //終了
		    callback(likeCount);
		  });

		};