var express = require('express');
var mongoose = require('mongoose');
var fs = require('fs');
var app = express();

app.use('/static', express.static(__dirname+'/front')); 

app.get('/', function (req, res){
	fs.readFile('front/index.html', function(err, data) {
    	res.writeHead(200, {'Content-Type': 'text/html'});
    	res.write(data);
    	return res.end();
  	});
})

app.listen(3000);
console.log('listening on 3000');