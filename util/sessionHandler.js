var modelSchemas = require('../model/schemas');
var userModel = modelSchemas.getUserModel();
var sessionVerifiedObj={status:false};
var loginSuccess = function (){
	userModel.find({}, 'username pwd hash', function (err, user){
		console.log("all");
		console.log(user);
	});
};
var getUser = function (hashValue){
	var userSessionUpdateQuery = userModel.find({hash: hashValue});
	userSessionUpdateQuery.select('username name');
	return new Promise((resolve, reject)=>{
		userSessionUpdateQuery.exec(function (err, user){
			loginSuccess();
			if(err)
				console.log("error: "+err);
			resolve(user);
		});
	});
};
module.exports= {
	verifySession: function (hashValue){
		sessionVerifiedObj.status=false;
		return new Promise((resolve, reject)=>{
			getUser(hashValue).then((user)=>{
				// console.log(user);
				if(user.length==1){
					sessionVerifiedObj.status=true;
					sessionVerifiedObj.userData= user[0];		//		dont send user[0] obj that contains extra info like password
				}
				// console.log(sessionVerifiedObj);
				resolve(sessionVerifiedObj);
			});
		});
	}
}