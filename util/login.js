var mongoose = require('mongoose');
var modelSchemas = require('../model/schemas');
var userModel = modelSchemas.getUserModel();
var hashStatusObj={status:false};
var loginSuccess = function (user){

};
var setUserHash = function (user, random){
	console.log("in setUserHash");
	var userSessionUpdateQuery = userModel.update({username: user.Username}, {$set: {hash: random}});
	return new Promise((resolve, reject)=>{
		console.log("in session update promise");
		userSessionUpdateQuery.exec(function (err){
			console.log("in session update query");
			if(err)
				console.log("error: "+err);
			hashStatusObj.status=true;
			hashStatusObj.hash = random;
			resolve();
		});
	});
}
var verifyUserQueryFunc = function (credentials){
	var verifyUserQuery = userModel.find({username: credentials.Username, pwd: credentials.Password});
	return new Promise((resolve, reject)=>{
		console.log("in promise");
		verifyUserQuery.exec(function (err, user){
			console.log("in verify query");
			if(err)
				console.log("error: "+err);
			setUserHash(user, Math.random()*1000000).then(()=>{		// 		Make sure the random number generated is not present in table before setting
				resolve(user);
			});
		});
	});
}

module.exports = {
	verifyCredentials: function (credentials){
		console.log("in verify");
		hashStatusObj.status=false;
		return new Promise((resolve, reject)=>{
			verifyUserQueryFunc(credentials).then(function(user){
				resolve(hashStatusObj);
			});
		});
	},
	addCredentials: function (credentials){
		var newUser = new userModel({
			name: credentials.Name,
			username: credentials.Username,
			pwd: credentials.Password
		});
		newUser.save(function (err){
			if(err)
			console.log("error: "+err);
		});
		userModel.find({username: credentials.Name}, 'username', function (err, user){
			if(err)
			console.log("error");
			else{
				console.log("success: ");
				console.log(user);
			}
		})
	}
}
