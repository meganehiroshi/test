

//------------------ aouth --------------------//
var OAuth = require('oauth').OAuth;
var oa = new OAuth(
  "https://api.twitter.com/oauth/request_token",
  "https://api.twitter.com/oauth/access_token",
  "khq3qZqPdT7UczkRPR3Alw", //twitter appで発行されたConsumer keyを入力。
  "1SgZKbNyOngUcJfWkki11J07fbR3UMN2Drkx8tdc", //twitter appで発行されたConsumer secretを入力。
  "1.0",
  "http://localhost:3000/callback",
  "HMAC-SHA1"
);

exports.auth_tw = function(req, res){
	oa.getOAuthRequestToken(function(error, oauth_token, oauth_token_secret, results){
		if (error) {
				console.log(error);
				res.send("yeah no. didn't work.");
		} else {
			req.session.oauth = {};
			req.session.oauth.token = oauth_token;
			console.log('oauth.token: ' + req.session.oauth.token);
			req.session.oauth.token_secret = oauth_token_secret;
			console.log('oauth.token_secret: ' + req.session.oauth.token_secret);
			res.redirect('https://twitter.com/oauth/authenticate?oauth_token='+oauth_token);
		}
	});
};

exports.auth_tw_callback = function(req, res, next){
	if (req.session.oauth) {
		req.session.oauth.verifier = req.query.oauth_verifier;
		var oauth = req.session.oauth;
		oa.getOAuthAccessToken(oauth.token,oauth.token_secret,oauth.verifier,
		function(error, oauth_access_token, oauth_access_token_secret, results){
			if (error){
				console.log(error);
				res.send("yeah something broke.");
			} else {
				req.session.oauth.access_token = oauth_access_token;
		        req.session.oauth.access_token_secret = oauth_access_token_secret;
		        req.session.user = results.screen_name;

		        console.log(results);
		        //res.send("worked. nice one.");
		       /*
		        res.render('mainboad',{
		    		user_name: req.session.user
		    		});
		    	*/
		        res.redirect('mainboad');
			}
		});
	} else {
		next(new Error("you're not supposed to be here."));
	}
};
