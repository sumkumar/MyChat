var modelSchemas = require('../model/schemas');
var userModel = modelSchemas.getUserModel();
var searchUsernameFunc = function (username){
	var reg = new RegExp('^.*'+username+'.*$');
	var searchUsernameQuery = userModel.find({username: {$regex: reg, $options:'m'}});
	searchUsernameQuery.select({ name: 1, username: 1 });
	return new Promise((resolve, reject)=>{
		//console.log("in promise");
		searchUsernameQuery.exec(function (err, user){
			//console.log("verify done!");
			if(err){
				console.log("error: "+err);
				reject();
			}
			console.log(user);
			resolve(user);
		});
	});
} 
module.exports={
	searchUsername: function (username){
		return new Promise((resolve, reject)=>{
			searchUsernameFunc(username).then(function(user){
				resolve(user);
			});
		});
	}
}