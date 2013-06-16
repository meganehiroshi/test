	//SQL文を書く
	var SQL_taglist_sel = 'select tag.tagid,tagname,user_tag.id from tag left outer join (select id,user_tag.tagid from user_tag where id =?)user_tag using(tagid) ;';
	var SQL_taglist_upd = 'insert into user_tag (id,tagid) values (?,?);';
//	var SQL_themelist_sel = 'select * from theme;';
	var SQL_themelist_sel        = 'select talkroom.roomid,tag.tagid,tagname,title,DATE_FORMAT(talkroom.start,"%Y/%m/%d") as start,talkroom.end from theme , tag , talkroom where theme.tagid = tag.tagid and theme.themeid = talkroom.themeid order by talkroom.start desc;';
	var SQL_invitedTheme_sel     = 'select talkroom.roomid,tag.tagid,tagname,title,DATE_FORMAT(talkroom.start,"%Y/%m/%d") as start,talkroom.end from theme , tag , talkroom , talkroom_member where theme.tagid = tag.tagid and theme.themeid = talkroom.themeid and talkroom.roomid=talkroom_member.roomid and talkroom_member.id=? order by talkroom.start desc;';
	var SQL_occupation_sel = 'select * from occupation;';

	//local設定
//	var CONNECT_INFO ={
//	             	  host     : 'localhost', //接続先ホスト
//	             	  user     : 'root',      //ユーザー名
//	             	  password : 'root',  //パスワード
//	             	  database : 'talkmob'    //DB名
//					}

	//AWS設定
	var CONNECT_INFO ={
	                   host     : process.env.RDS_HOSTNAME,
	                   user     : process.env.RDS_USERNAME,
	                   password : process.env.RDS_PASSWORD,
	                   port     : process.env.RDS_PORT,
	             	  database : 'talkmob'    //DB名
					}

module.exports.select_occupation = select_occupation;
	function select_occupation(req, res ,user){
	  console.log('oc start: ' );
	var mysql = require('mysql');

	var connection = mysql.createConnection(CONNECT_INFO);

	//接続します
	connection.connect();

	var params =  [user.id];

	//プレースホルダー使ってSQL発行
	var query = connection.query(SQL_occupation_sel);
	var results = [];
	  //あとはイベント発生したらそれぞれよろしくねっ
	query
	  //エラー用
	  .on('error', function(err) {
	    console.log('err is: ', err );
	    res.render('theme',{
	    	db_result: '失敗しました'
		});
	  })

	  //結果用
	  .on('result', function(row) {
	    console.log('The res is resluts: ', row );
	    results.push(row);
	  })

	  //終わったよう～
	  .on('end', function() {
	    console.log('oc end');
	    //connection.destroy(); //終了
	    connection.end();
	    return results;
	    /*
	    res.render('mainboad',{
	    	list: results,
	    	user_name: req.session.user});
	    */
	  });


	};

exports.select_themelist = select_themelist;
  function select_themelist(req , res , callback){

	var mysql = require('mysql');

	var connection = mysql.createConnection(CONNECT_INFO);
	connection.connect();

	//プレースホルダー使ってSQL発行
	var query = connection.query(SQL_themelist_sel);
	var results = [];
	  //あとはイベント発生したらそれぞれよろしくねっ
	query
	  //エラー用
	  .on('error', function(err) {
	    console.log('err is: ', err );
	    callback({
	    	db_result: '失敗しました'
		});
	  })

	  //結果用
	  .on('result', function(row) {
	     //console.log('The res is resluts: ', row );
	    results.push(row);
	  })

	  //終わったよう～
	  .on('end', function() {
	    console.log('end');
	    //connection.destroy(); //終了
	    connection.end();
	    callback(results);
	  });

	};

exports.select_InvitedTheme = select_InvitedTheme;
  function select_InvitedTheme(req , res , callback){

	var mysql = require('mysql');
	console.log('req.user.id: ' + req.user.id );
	var connection = mysql.createConnection(CONNECT_INFO);
	connection.connect();
	var params =  [req.user.id];

	//プレースホルダー使ってSQL発行
	var query = connection.query(SQL_invitedTheme_sel,params);
	var results = [];
	  //あとはイベント発生したらそれぞれよろしくねっ
	query
	  //エラー用
	  .on('error', function(err) {
	    console.log('err is: ', err );
	    callback({
	    	db_result: '失敗しました'
		});
	  })

	  //結果用
	  .on('result', function(row) {
	    console.log('The res is resluts: ', row );
	    results.push(row);
	  })

	  //終わったよう～
	  .on('end', function() {
	    console.log('end');
	    //connection.destroy(); //終了
	    connection.end();
	    callback(results);
	  });

	};



  exports.select_taglist = select_taglist;

  function select_taglist(req, res , user){

	var mysql = require('mysql');
	var connection = mysql.createConnection(CONNECT_INFO);

	//SQL文を書く
	//var sql = 'select tagid,tagname from tag;';
	//接続します
	connection.connect();

	var params =  [user.id];

	//プレースホルダー使ってSQL発行
	var query = connection.query(SQL_taglist_sel,params);
	var results = [];
	  //あとはイベント発生したらそれぞれよろしくねっ
	query
	  //エラー用
	  .on('error', function(err) {
	    console.log('err is: ', err );
	    res.render('taglist',{
	    	db_result: '失敗しました'
		});
	  })

	  //結果用
	  .on('result', function(row) {
	    console.log('The res is resluts: ', row );
	    results.push(row);
	  })

	  //終わったよう～
	  .on('end', function() {
	    console.log('end');
	    //connection.destroy(); //終了
	    connection.end();
	    res.render('taglist',{
	    	list: results,
	    	user_name: req.session.user});
	  });

	};

	  exports.select_taglist2 = select_taglist2;

  function select_taglist2(req, res , user , callback){

	var mysql = require('mysql');
	var connection = mysql.createConnection(CONNECT_INFO);

	//接続します
	connection.connect();

	var params =  [user.id];
	var results = [];

	//プレースホルダー使ってSQL発行
	var query = connection.query(SQL_taglist_sel,params);


	//あとはイベント発生したらそれぞれよろしくねっ
	query
	  //エラー用
	  .on('error', function(err) {
	    console.log('err is: ', err );
	    callback(null);
	  })

	  //結果用
	  .on('result', function(row) {
	    console.log('The res is resluts: ', row );
	    results.push(row);
	  })

	  //終わったよう～
	  .on('end', function() {
	    console.log('end');
	    //connection.destroy(); //終了
	    connection.end();
	    callback(results);
	  });

	};


exports.update_tag = update_tag;
	function update_tag(req, res , user , callback){

		var mysql = require('mysql');

		var connection = mysql.createConnection(CONNECT_INFO);

		//SQL文を書く
		//var sql = 'insert into user_tag (id,tagid) values (?,?);';
		var params =  [user.id , req.param('settagid')];
		console.log('name: ', req.param('settagid') );
		//接続します
		connection.connect();

		//プレースホルダー使ってSQL発行
		var query = connection.query(SQL_taglist_upd,params);

		  //あとはイベント発生したらそれぞれよろしくねっ
		query
		  //エラー用
		  .on('error', function(err) {
		    console.log('set tag err: ', err );
		    callback(null);
		  })

		  //結果用
		  .on('result', function(rows) {
		    console.log('set tag result: ', rows );

		  })

		  //終わったよう～
		  .on('end', function() {
		    console.log('end');
		    //connection.destroy(); //終了
		    connection.end();
		    console.log('set tag end: ' );
		    callback('success');
		    //select_taglist(req , res);
		  });
};




  exports.createid_submit = function(req, res){

	var mysql = require('mysql');

	var connection = mysql.createConnection(CONNECT_INFO);

	//SQL文を書く
	var sql = 'insert into user (name,pass,mail,gender) values (?,?,?,?);';
    var params =  [req.param('name'),req.param('pass'),req.param('mail'),req.param('gender')];
    console.log('name: ', req.param('name') );
	//接続します
	connection.connect();

	//プレースホルダー使ってSQL発行
	var query = connection.query(sql,params);

	  //あとはイベント発生したらそれぞれよろしくねっ
	query
	  //エラー用
	  .on('error', function(err) {
	    console.log('err is: ', err );
	    res.render('createid',{
	    	db_result: '失敗しました'
		});
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
	    res.render('createid',{
	    	db_result: '登録しました'
		});
	  });

	};

  exports.createid_review = function(req, res){
	//SQL文を書く
	var sql = 'select * from user where = ?);';
    var params =  [req.param('name'),req.param('pass'),req.param('mail'),req.param('gender')];

	//接続します
	connection.connect();

	//プレースホルダー使ってSQL発行
	var query = connection.query(sql,params);

	  //あとはイベント発生したらそれぞれよろしくねっ
	query
	  //エラー用
	  .on('error', function(err) {
	    console.log('err is: ', err );
	  })

	  //結果用
	  .on('result', function(rows) {
	    console.log('The res is: ', rows );
	  })

	  //終わったよう～
	  .on('end', function() {
	    console.log('end');
	    connection.destroy(); //終了
	    res.render('createid',{
	    	title: 'WEB+DB',
	    	var1: 'hoge'
		});
	  });

	};