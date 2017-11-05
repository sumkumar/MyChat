var mongoose = require('mongoose');
var modelSchemas = require('../model/schemas');
module.exports = {
	verifyCredentials: function (credentials){
		console.log(credentials);
	},
	addCredentials: function (credentials){
		console.log("adding : ");
		var userModel = modelSchemas.getUserModel();
		console.log(credentials);
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
