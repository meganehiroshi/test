var text = 'hello world';
console.log(text);


var http = require('http');
var server = http.createServer();

console.log('URL:' + server.request.headers.host);

var AWS = require('aws-sdk');

 AWS.config.loadFromPath('credentials.json');
 AWS.config.update({region: 'ap-northeast-1'});

  var s3 = new AWS.S3();
  s3.listBuckets(function(err, data) {
    for (var index in data.Buckets) {
      var bucket = data.Buckets[index];
      console.log("Bucket: ", bucket.Name, ' : ', bucket.CreationDate);
    }
  });


