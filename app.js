var express = require('express');
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');
require('./util/db_setup');
require('./model/schemas');
var bodyParser = require('body-parser')
var loginUtil = require('./util/login');
var searchUtil = require('./util/search');
var sessionHandlerUtil = require('./util/sessionHandler');
var chatData = require('./util/chatData');
var messageUtil = require('./util/message');
var fs = require('fs');

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var p2p = require('socket.io-p2p-server').Server;
http.listen(3000);
io.use(p2p);

io.on('connection', function(socket) {
	console.log("user connected");
	socket.on('peer-msg', function(data) {
	    console.log('Message from peer: %s', data);
	    socket.broadcast.emit('peer-msg', data);
	});
	socket.on('disconnect', function(){
		console.log('user disconnected');
	});
});


app.use(cookieParser());
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.use('/static', express.static(__dirname+'/front')); 
app.use('/scripts', express.static(__dirname+'/node_modules'));

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
			res.cookie('MyChatHash', verifyObj.hashValue, {expires: new Date(Date.now()+9000000)});
			res.redirect('/chat');
		}
		else
			res.send("Invalid Credentials");
	});
	
});

app.post('/signupform', function (req, res){
	return loginUtil.addCredentials(req.body).then((verifyObj)=>{
		// console.log("returned");
		// console.log(verifyObj);
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

app.get('/getOtherUserInfo/:otherUser/:limit', function (req, res){
	sessionHandlerUtil.verifySession(req.cookies.MyChatHash).then((sessionVerified)=>{
		if(sessionVerified.status===true){
			chatData.getChatData(sessionVerified.userData.username, req.params.otherUser, (req.params.limit+1)*10).then((chatDataObj)=>{
				// console.log(chatDataObj);
				res.send(chatDataObj);
				//console.log(sessionVerified);
			});
		}
		else
			res.send("Verification Error");
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

app.post('/sendMessage/:otherUser', function (req, res){
	sessionHandlerUtil.verifySession(req.cookies.MyChatHash).then((sessionVerified)=>{
		if(sessionVerified.status===true){
			// console.log("content");
			// console.log(req.body.content);
			res.send(messageUtil.sendMessage(sessionVerified.userData.username, req.params.otherUser, req.body.content));
			//console.log(sessionVerified);
		}
		else
			res.send("Verification Error");
	});	
});

//app.listen(3000);
console.log('listening on 3000');