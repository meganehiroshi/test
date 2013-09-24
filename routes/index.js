
/*
 * GET home page.
 */

var sql = require('./sql');
var async = require('async');
var talkboad = require('./talkboad');

exports.index = function(req, res){
  //res.render('index', { title: 'Express' });
	res.render('top', {  user_name: req.user,domain: req.headers.host, title: 'Express' });
};

exports.login = function(req, res){
	res.render('login', {  user_name: req.user, domain: req.headers.host,message: req.flash('error') });
};



exports.mainboad = function(req, res){
	sql.select_themelist(req,res,function(results){
		if(results){
			sql.select_InvitedTheme(req,res,function(results2){
				if(results2){
					console.log('results2' + results2.title);
					res.render('mainboad', {
						list: results,
						invTheme: results2,
						domain: req.headers.host,
						user_name: req.user
						});
				}else{

				}
			});
		}else{

		}
	});

};

exports.talkboad = function(req, res){
	var roomid = req.param('roomid');
	console.log('exports talkboad')
	talkboad.openChatList(roomid,'',function(results){
	//sql.select_taglist2(req,res,req.user,function(results){

		if(results){
			talkboad.getRoomInfo(req,res,roomid,function(results2){
				if(results2){
					console.log('results2' + results2.title);
					res.render('talkboad', {
						chatlist: results,
						roominfo: results2,
						user_name: req.user,
						roomid: roomid,
						domain: req.headers.host,
						port: 3000
						});
				}else{

				}
			});

		}else{

		}
	});
//	res.render('talkboad', {
//		//user_name: req.session.user,
//		user_name: req.user,
//		port: 3000
//		});
};

exports.taglist = function(req, res){

	sql.select_taglist2(req,res,req.user,function(results){
		if(results){
			res.render('taglist', {
				list: results,
				domain: req.headers.host,
				user_name: req.user
				});
		}else{

		}
	});
};
exports.taglistUpdate = function(req, res){

	sql.update_tag(req,res,req.user,function(results){
		console.log('result : ' + results);
		if(results == null){

		}else{
			console.log('select_taglist2を呼出す');
			sql.select_taglist2(req,res,req.user,function(results){
				if(results){
					res.render('taglist', {
						list: results,
						domain: req.headers.host,
						user_name: req.user
						});
				}else{

				}
			});
		}
	});
};

exports.createid = function(req, res){
	res.render('createid', {
		title: 'createid',
		user_name: req.user,
		domain: req.headers.host,
		db_result:''
			});
};

