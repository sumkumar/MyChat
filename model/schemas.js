var mongoose = require('mongoose');
var schema = mongoose.Schema;
console.log("open schema");
var UserSchema = new schema({
	name: String,
	username: String,
	pwd: String
});
var UserModel = mongoose.model('UserModel', UserSchema);

var MessageSchema = new schema({
	to: String,
	from: String,
	content: String,
	timeStamp: Date	// check Datatype
});
var MessageModel = mongoose.model('MessageModel', MessageSchema);
module.exports={
	getUserModel: function (){
		return UserModel;
	},
	getMessageModel: function (){
		return MessageModel;
	}
}