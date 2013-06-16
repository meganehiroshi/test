var text = 'hello world';
console.log(text);


var http = require('http');
var server = http.createServer();

//console.log('URL:' + server.request.headers.host);

var AWS = require('aws-sdk');

 AWS.config.loadFromPath('credentials.json');
 AWS.config.update({region: 'ap-northeast-1'});

  var s3 = new AWS.S3();
  //テキストのアップロード
//  var params= {"Bucket" :"talkmobprofile" , "Key" : "test1" , "Body" : "testbody"};
//  s3.putObject(params, function(err,data){
//	  concole.log("data:"+data+" err:"+err);
//	  }
//  );

//  //画像アップロード
  var gm = require("gm");
//  var request = require('request');
//  var mime = require('mime');
//  gm('/Users/hiroshi/Downloads/5_1.jpg')
//  .resize("100^", "100^")
//  .stream(function(err, stdout, stderr) {
//
//	    var buf = new Buffer('');
//	    stdout.on('data', function(data) {
//	       buf = Buffer.concat([buf, data]);
//	    });
//	    stdout.on('end', function(data) {
//	      var data = {
//	        Bucket: "talkmobprofile",
//	        Key: "my-image.jpg",
//	        Body: buf,
//	        ContentType: mime.lookup("my-image.jpg")
//	      };
//
//      s3.putObject(data, function(err, res) {
//        console.log("done");
//      });
//    });
//	});

/*}

var w , h =100;
var fs = require('fs');
//var buf = require('fs').readFileSync('/Users/hiroshi/Downloads/5_1.jpg');
var hhh = fs.createReadStream('/Users/hiroshi/Downloads/5_1.jpg');
		//console.log('112');
    	gm(hhh,'hoge.jpg')
    	//.resize(100, 100)
    	.stream(function (err, stdout, stderr) {
    		var writeStream = fs.createWriteStream('/Users/hiroshi/Downloads/5_1resize.jpg');
    		stdout.pipe(writeStream);
    	});

   		if (err) {
    			console.log('113');
    			return handle(err);
    		}else{
    			console.log('114');
    			 s3.putObject({Bucket: "talkmobprofile",Key: 'thumb.jpg',Body: buffer}, function(err2, resp) {
    	        		if (err2) {
    	        			console.log('err:' + err2);
    	        		//	throw err;
    	        	    }else{
    	    	            console.log("Done\n");
    	        	    }
    	          });
    		}

      });
 */



// うまくアップロードできる。でもサイズの変換ができない
//    fs = require('fs');
//	fs.readFile('/Users/hiroshi/Downloads/5_1.jpg', function (err, data) {
//	  if (err) {
//		  console.log('err:' + err);
//		  throw err;
//		  }
//	  var params= {"Bucket" :"talkmobprofile" , "Key" : "test7" , "Body" : data};
//	  s3.putObject(params, function(err,hoge){
//	    console.log("data:putted");
//	  });
//	});

/*
  //バケットのリストを取得
  s3.listBuckets(function(err, data) {
    for (var index in data.Buckets) {
      var bucket = data.Buckets[index];
      console.log("Bucket: ", bucket.Name, ' : ', bucket.CreationDate);
    }
  });
*/

