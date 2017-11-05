var express = require('express');
var mongoose = require('mongoose');
require('./util/db_setup');
require('./model/schemas');
var bodyParser = require('body-parser')
var loginUtil = require('./util/login');
var fs = require('fs');
var app = express();

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.use('/static', express.static(__dirname+'/front')); 

app.get('/', function (req, res){
	fs.readFile('front/index.html', function(err, data) {
    	res.writeHead(200, {'Content-Type': 'text/html'});
    	res.write(data);
    	return res.end();
  	});
})

app.post('/loginform', function (req, res){
	loginUtil.verifyCredentials(req.body);
	res.send("Received");
})

app.post('/signupform', function (req, res){
	loginUtil.addCredentials(req.body);
	res.send("Received");
})

app.listen(3000);
console.log('listening on 3000');