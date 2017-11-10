var express = require('express');
var cookieParser = require('cookie-parser');
// var session = require('express-session');
var mongoose = require('mongoose');
require('./util/db_setup');
require('./model/schemas');
var bodyParser = require('body-parser')
var loginUtil = require('./util/login');
var searchUtil = require('./util/search');
var sessionHandlerUtil = require('./util/sessionHandler')
var fs = require('fs');
var app = express();


app.use(cookieParser());
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
});

app.get('/chat', function (req, res){
	fs.readFile('front/chat.html', function(err, data) {
    	res.writeHead(200, {'Content-Type': 'text/html'});
    	res.write(data);
    	return res.end();
  	});
});

app.post('/loginform', function (req, res){
	return loginUtil.verifyCredentials(req.body).then((verifyObj)=>{
		//console.log("returned");
		if(verifyObj.status === true){
		res.cookie('MyChatHash', verifyObj.hashValue, {expires: new Date(Date.now()+900000)});
		res.redirect('/chat');
		}
		else
			res.send("Invalid Credentials");
	});
	
});

app.post('/signupform', function (req, res){
	return loginUtil.addCredentials(req.body).then((verifyObj)=>{
		console.log("returned");
		console.log(verifyObj);
		if(verifyObj.status === true){
			res.redirect('/');
		}
		else
			res.send("Invalid Credentials");
	});
});

app.get('/search/:txt', function (req, res){
	return searchUtil.searchUsername(req.params.txt).then((resultArray)=>{
		res.send(resultArray);
	});
});

app.get('/getData', function (req, res){
	// console.log("in getData");
	sessionHandlerUtil.verifySession(req.cookies.MyChatHash).then((sessionVerified)=>{
		if(sessionVerified.status===true){
			res.send(sessionVerified.userData);
			//console.log(sessionVerified);
		}
		else
			res.send("Verification Error");
	});
});

app.listen(3000);
console.log('listening on 3000');