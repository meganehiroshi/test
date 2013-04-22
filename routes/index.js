
/*
 * GET home page.
 */

var sql = require('./sql');
var async = require('async');

exports.index = function(req, res){
  //res.render('index', { title: 'Express' });
	res.render('top', { title: 'Express' });
};

exports.sample1 = function(req , res ){
//	var id = req.param('id');
//	res.send(id , {'Content-Type':'text/plain'},200);
	res.render('login',{
		title: 'WEB+DB',
		var1: 'hoge',
		var2: req.param('id')
		});
};


exports.mainboad = function(req, res){
	res.render('mainboad', { user_name: req.session.user });
};

exports.talkboad = function(req, res){
	res.render('talkboad', {
		user_name: req.session.user,
		port: 3000
		});
};

exports.taglist = function(req, res){
	res.render('taglist', { user_name: req.session.user });
};

exports.createid = function(req, res){
//var hoge = sql.select_occupation(req, res);
var hoge;
	async.series([
		//console.log('asfd------' ,hoge),
		function (callback){
			//hoge = sql.select_occupation(req, res);
			console.log('hogergega:');
			callback(null,sql.select_occupation(req, res));
			}
/*		,function (callback){
			setTimeout(console.log(hoge),2000);
			callback(null,hoge);
			}
*/
		],
		function (err,result){
			console.log('hogergega:' ,result);
			res.render('createid', {
				user_name: req.session.user,
				db_result: '',
				occupation: result
			});
			}
		);
};

