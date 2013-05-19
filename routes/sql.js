	//SQL文を書く
	var SQL_taglist_sel = 'select tag.tagid,tagname,id from tag left join user_tag using(tagid) where id is null or id = ?;';
	var SQL_taglist_upd = 'insert into user_tag (id,tagid) values (?,?);';
//	var SQL_meetinglist_sel = 'select * from meeting;';
	var SQL_meetinglist_sel = 'select tag.tagid,tagname,title,start from meeting join tag using(tagid) ;';
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
	function select_occupation(req, res){
	  console.log('oc start: ' );
	var mysql = require('mysql');

	var connection = mysql.createConnection(CONNECT_INFO);

	//接続します
	connection.connect();

	var params =  [1];

	//プレースホルダー使ってSQL発行
	var query = connection.query(SQL_occupation_sel);
	var results = [];
	  //あとはイベント発生したらそれぞれよろしくねっ
	query
	  //エラー用
	  .on('error', function(err) {
	    console.log('err is: ', err );
	    res.render('meeting',{
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

exports.select_meetinglist = select_meetinglist;
  function select_meetinglist(req, res){

	var mysql = require('mysql');

	var connection = mysql.createConnection(CONNECT_INFO);

	//SQL文を書く
	//var sql = 'select tagid,tagname from tag;';
	//接続します
	connection.connect();

	var params =  [1];

	//プレースホルダー使ってSQL発行
	var query = connection.query(SQL_meetinglist_sel,params);
	var results = [];
	  //あとはイベント発生したらそれぞれよろしくねっ
	query
	  //エラー用
	  .on('error', function(err) {
	    console.log('err is: ', err );
	    res.render('meeting',{
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
	    res.render('mainboad',{
	    	list: results,
	    	user_name: req.session.user});
	  });

	};


  exports.select_taglist = select_taglist;

  function select_taglist(req, res){

	var mysql = require('mysql');
	var connection = mysql.createConnection(CONNECT_INFO);

	//SQL文を書く
	//var sql = 'select tagid,tagname from tag;';
	//接続します
	connection.connect();

	var params =  [1];

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

exports.update_tag = update_tag;
	function update_tag(req, res){

		var mysql = require('mysql');

		var connection = mysql.createConnection(CONNECT_INFO);

		//SQL文を書く
		//var sql = 'insert into user_tag (id,tagid) values (?,?);';
		var params =  [1,req.param('settagid')];
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
		    res.render('taglist',{
		    	db_result: '失敗しました'
			});
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
		    select_taglist(req , res);
		    //app.get('/taglist',sql.select_taglist);
		    //res.render('taglist');
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