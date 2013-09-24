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
  var easyimg = require('easyimage');
  var imageMagick = gm.subClass({ imageMagick: true });
  var request = require('request');
  var mime = require('mime');
  var data;
//  imageMagick('/Users/hiroshi/Downloads/5_1.jpg').autoOrient().write('/Users/hiroshi/Downloads/re5_1.jpg', function(callback){});


//---------easyimg-------------//
//  easyimg.info('/Users/hiroshi/Downloads/DSC_0044.jpg', function(err,stdout,stderr) {
//	  console.log('Next line should be unsupported error');
//	  console.log(err);
//});
//easyimg.rescrop(
//  {
//     src:'/Users/hiroshi/Downloads/5_1.jpg', dst:'/Users/hiroshi/Downloads/5_1hoge.jpg',
//     width:10, height:10
//     ,cropwidth:5, cropheight:5
//     ,x:0, y:0
//     },
//  function(err, image) {
//     if (err) console.log('err:'+err);
//     console.log('Resized and cropped: ' + image.width + ' x ' + image.height);
//  }
//);
//---------easyimg-------------//

//-------------- gm ----------------//
gm('./public/images/anpan.jpg')
  .resize("100^", "100^")
  .stream(function (err,stdout,stderr) {
    // beforeCrop is 600 * 450
    gm(stdout) // gm can read buffers ;)
    //.crop(70, 70, 100, 100)
    .resize(10, 10)
    .write('./tmp/', function (err) {
        if (err) throw err;
    });
});
//-------------- gm ----------------//

//  .wtite('/Users/hiroshi/Pictures',callback);
//  .stream(function(err, stdout, stderr) {

//	    var buf = new Buffer('');
//debugger;
//console.log('stream');
//	    stdout.on('data', function(data) {
//
//	    	console.log('data');
//	       buf = Buffer.concat([buf, data]);
//	    });
//	    stdout.on('end', function(data) {
//	    	console.log('end');
//	       data = {
//	        Bucket: "talkmobprofile",
//	        Key: "my-image.jpg",
//	        Body: buf,
//	        ContentType: mime.lookup("my-image.jpg")
//	      };
//	      console.log('s3 before');
//      s3.putObject(data, function(err, res) {
//        console.log("done");
//      	});
//	    });
//	});



//var w , h =100;
//var fs = require('fs');
////var buf = require('fs').readFileSync('/Users/hiroshi/Downloads/5_1.jpg');
//var hhh = fs.createReadStream('/Users/hiroshi/Downloads/5_1.jpg');
//		//console.log('112');
//    	gm(hhh,'hoge.jpg')
//    	.resize(100, 100)
//    	.stream(function (err, stdout, stderr) {
//    		var writeStream = fs.createWriteStream('/Users/hiroshi/Downloads/5_1resize.jpg');
//    		stdout.pipe(writeStream);
//    	});

//   		if (err) {
//    			console.log('113');
//    			return handle(err);
//    		}else{
//    			console.log('114');
//
//    			var buf = new Buffer('');
//    		    stdout.on('data', function(data) {
//    		        buf = Buffer.concat([buf, data]);
//    		     });
//    		     stdout.on('end', function(data) {
//    		       var data = {
//    		         Bucket: "talkmobprofile",
//    		         Key: "my-image.jpg",
//    		         Body: buf,
//    		         ContentType: mime.lookup("my-image.jpg")
//    		       };
//    			 s3.putObject(data, function(err2, resp) {
//    	        		if (err2) {
//    	        			console.log('err:' + err2);
//    	        		//	throw err;
//    	        	    }else{
//    	    	            console.log("Done\n");
//    	        	    }
//    	          });
//    		});
//    	        	    }
// 	    });





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

