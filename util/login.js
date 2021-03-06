var mongoose = require('mongoose');
var modelSchemas = require('../model/schemas');
var userModel = modelSchemas.getUserModel();
var hashStatusObj={status:false};
var uniqueUsername=false;
var loginSuccess = function (){
	userModel.find({}, 'username pwd hash', function (err, allUsers){
		console.log(allUsers)
	});
};
var setUserHash = function (user, random){
	//console.log("in setUserHash");
	// var userSessionUpdateQuery = userModel.update({username: user.Username}, {$set: {hash: random}});
	return new Promise((resolve, reject)=>{
		//console.log("in session update promise");
		userModel.update({username: user.username}, {$set: {hash: random}}, function (err){
			console.log("update done!");
			if(err) {
				console.log("update error: "+err);
				reject();
			}
			hashStatusObj.status=true;
			hashStatusObj.hashValue = random;
			resolve();
		});
	});
}
var verifyUserQueryFunc = function (credentials){
	var verifyUserQuery = userModel.find({username: credentials.Username, pwd: credentials.Password});
	return new Promise((resolve, reject)=>{
		//console.log("in promise");
		verifyUserQuery.exec(function (err, user){
			//console.log("verify done!");
			if(err){
				console.log("error: "+err);
				reject();
			}
			// console.log(user);
			setUserHash(user[0], Math.random()*1000000).then(()=>{		// 		Make sure the random number generated is not present in table before setting
				//loginSuccess();
				resolve(user[0]);
			});
		});
	});
}

var addUserQueryFunc = function (credentials){
	hashStatusObj.status=true;
	var addUserQuery = new userModel({name: credentials.Name, username: credentials.Username, pwd: credentials.Password});
	addUserQuery.save(function (err){
		if(err)
			console.log("add query error: "+err);
		// loginSuccess();
	});
}

var isUsernameUsed = function (username){
	var searchUserQuery = userModel.find({username: username});
	return new Promise((resolve, reject)=>{
		//console.log("in promise");
		searchUserQuery.exec(function (err, user){
			//console.log("verify done!");
			if(err){
				console.log("error: "+err);
				reject();
			}
			// console.log(user);
			resolve(user);
		});
	});
}

module.exports = {
	verifyCredentials: function (credentials){
		//console.log("in verify");
		hashStatusObj.status=false;
		return new Promise((resolve, reject)=>{
			verifyUserQueryFunc(credentials).then(function(user){
				resolve(hashStatusObj);
			});
		});
	},
	addCredentials: function (credentials){
		hashStatusObj.status=false;
		uniqueUsername=false;
		return new Promise((resolve, reject)=>{
			isUsernameUsed(credentials.Username).then((user)=>{
				// console.log("user");
				// console.log(user);
				if(user.length==0)
					addUserQueryFunc(credentials);
				resolve(hashStatusObj);
			});
		});
	}
}
