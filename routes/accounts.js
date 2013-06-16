var mysql = require('mysql');
var account_model = require('./account');
var Account = account_model.Account;

// create connection to mysql
function createConnection(){
  return sqlConnection =  mysql.createConnection({
	                   host     : process.env.RDS_HOSTNAME,
	                   user     : process.env.RDS_USERNAME,
	                   password : process.env.RDS_PASSWORD,
	                   port     : process.env.RDS_PORT,
	             	  database : 'talkmob'    //DB名

  });
};

function createAccountWithTransaction(connection, name, pass, mail, gender, description, callback){
  console.log('start transaction');
  var query = 'start transaction';
  connection.query(query, function(err, result){
    if(err){
      // start transactionに失敗。
      console.log('cannot start transaction.\n    ' + err);
      callback(err);
      return;
    }

    console.log('inserting USER data...');
    query = "insert into user (name,pass,mail,gender) values (?, ?, ?, ?)";
    connection.query(query, [name,pass,mail, gender], function(err, result){
      if(err){
        // プロフィールの登録に失敗。
        console.log('cannot insert USER data');
        console.log(err);
        callback(err);
        return;
      }
      console.log('USER data inserted.');

      query = 'select last_insert_id() as solution from user';
      connection.query(query, function(err, rows, fields){
        if(err){
          // max(ID)の取得に失敗。
          console.log('cannot select last_insert_id as solution from USER');
          // アカウントの登録に失敗。ロールバックする。
          query = 'rollback';
          connection.query(query, function(e){
            if(e){
              // rollbackに失敗した旨をコールバックで伝達
              callback(e);
            }else{
              // アカウントの登録に失敗したことをコールバックで伝達
              callback(err);
            }
          });
          return;
        }
        //var id = rows[0].solution + 1;
        var id = rows[0].solution;
        console.log('last_insert_id = ' + id);

        query = 'commit';
        connection.query(query, function(err){
          // commit自体が失敗した場合は
          // Account & Profileの登録が反映されないが
          // エラーが発生したことをコールバックで伝達。（エラーがない場合は,err=nullなので気にしない）
          console.log('query complete: add account');
          callback(err);
        });
      });
    });
  });
}

function updateAccountWithTransaction(connection, id , name, pass, mail, gender, description, callback){
  console.log('start transaction');
  var query = 'start transaction';
  connection.query(query, function(err, result){
    if(err){
      // start transactionに失敗。
      console.log('cannot start transaction.\n    ' + err);
      callback(err);
      return;
    }

    console.log('update USER data...');
    query = "update user set name=?,pass=?,mail=?,gender=? where id=?";
    connection.query(query, [name,pass,mail, gender,id], function(err, result){
      if(err){
        // プロフィールの登録に失敗。
        console.log('cannot update USER data');
        console.log(err);
        callback(err);
        return;
      }
      console.log('USER data updated.');
		query = 'commit';
		connection.query(query, function(err){
		  // commit自体が失敗した場合は
		  // Account & Profileの登録が反映されないが
		  // エラーが発生したことをコールバックで伝達。（エラーがない場合は,err=nullなので気にしない）
		  console.log('query complete: add account');
		  callback(err);
		});
    });
  });
}


/*
 * method query
 *
 * @arg queryString -- query string
 * @arg callback -- callback function.
 *                         callback(err, rows, fields)
 */
function query(queryString, callback){
  // create connection to mysql
  var connection = createConnection();
  console.log('connection created.');

  // connection.connect は connection.queryが勝手にしてくれるからここでは呼ばない。
  // むしろ呼ぶと「２度接続した」とかいろいろエラーになる。

  // query
  console.log('calling connection.query: ' + queryString);
  connection.query(queryString, callback);
  console.log('called.');
};
exports.query = query;


/*
 * util methods
 */
function findById(id, callback) {
  var queryString = "SELECT * FROM user WHERE user.ID = '" + id + "'";

  query(queryString, function(err, rows, fields){
    if(err){
      callback(new Error('query error in findById.'));
      throw err;
    }

    if(rows.length > 0){
      var account = new Account(rows[0].ID, rows[0].USERNAME, rows[0].PASSWORD, rows[0].PROFILEID, rows[0].CREATED);
      callback(null, account);
    }else{
      callback(new Error('User ' + id + ' does not exist'));
    }
  });
}
exports.findById = findById;

function findByUsername(username, callback) {
  var queryString = "SELECT * FROM user WHERE user.name = '" + username + "'";
  console.log('findByUsername query:' + queryString);

  query(queryString, function(err, rows, fields){
    if(err){
      console.log('error: ' + err);
      callback(new Error('query error in findByUsername.'));
      throw err;
    }

    console.log('findByUsername querring. rows = ' + rows + ', fields = ' + fields);
    if(rows.length > 0){
      var account = new Account(rows[0].id, rows[0].name, rows[0].pass, rows[0].mail, rows[0].gender);
      console.log('accout');
      console.log(account);
      //return callback(null, account);
      callback(null, account);
    }else{
      //return callback(null, null);
      callback(null, null);
    }
  });
}
exports.findByUsername = findByUsername;

function createAccount(name, pass, mail, gender, description, callback){
  console.log('username = ' + name + ', password = ' + pass);

  // create connection to mysql
  var connection = createConnection();

  // connection.connect は connection.queryが勝手にしてくれるからここでは呼ばない。
  // むしろ呼ぶと「２度接続した」とかいろいろエラーになる。

  // query -- すでに使われているアカウント名かどうかチェックする。
  var queryString = "SELECT * FROM user WHERE user.name = '" + name + "'";
  connection.query(queryString, function(err, rows, fields){
    if(err){
      console.log('query error in createAccount');
      callback(err);
      return;
    }
    if(rows.length > 0){
    	console.log('name dupulicated');
    	callback("アカウント名'"+name+"'は既に使われています。他の名前を入力してください。");
    	return;
    }

    createAccountWithTransaction(connection, name, pass, mail, gender, description, function(err){
      if(err){
        console.log('createAccountWithTransaction error');
        callback(err);
        return;
      }

      console.log('success: create account. user:' + name);
      callback(null); // success
    });

  });
}
exports.createAccount = createAccount;


function updateAccount(id, name, pass, mail, gender, description, callback){
  console.log('username = ' + name + ', password = ' + pass);

  // create connection to mysql
  var connection = createConnection();

  // connection.connect は connection.queryが勝手にしてくれるからここでは呼ばない。
  // むしろ呼ぶと「２度接続した」とかいろいろエラーになる。

  // query -- すでに使われているアカウント名かどうかチェックする。
  var queryString = "SELECT * FROM user WHERE user.id = '" + id + "'";
  connection.query(queryString, function(err, rows, fields){
    if(err){
      console.log('id is not exisits!');
      callback(err);
      return;
    }
    if(rows.length > 0){
    	console.log('id is exisit. OK!');
    	//callback("アカウント名は既に使われています。他の名前を入力してください。");
    	//return;
    }

    updateAccountWithTransaction(connection, id, name, pass, mail, gender, description, function(err){
      if(err){
        console.log('createAccountWithTransaction error');
        callback(err);
        return;
      }

      console.log('success: create account. user:' + name);
      callback(null); // success
    });

  });
}

/*
 * method signup
 */
exports.signup = function signup(req, res, callback){
  if(req.body.name && req.body.pass){
	var id = req.body.id;
	var name = req.body.name;
    //var password = des.crypt(req.body.password);
    var pass        = req.body.pass;
    var mail       = req.body.mail;
    var gender      = req.body.gender;
    var type      = req.body.type;
    var description = req.body.description || '';

    if(id){
		updateAccount(id,name, pass, mail, gender, description, function(err){
		    if(err){
		      console.log('signup-updateAccount err : ' + err )
		      callback(err);
		    }else{
		 	 console.log('signup-updateAccount success')
		      callback(null);
		    }
		  });
    }else{
        createAccount(name, pass, mail, gender, description, function(err){
            if(err){
              console.log('signup-createAccount err : ' + err )
              callback(err);
            }else{
         	 console.log('signup-createAccount success')
         	 //req.user.id = id;
         	 //req.user.name = name;
              callback(null);
            }
          });
    }


  }
};