var schemas = require('../model/schemas');
var messageModel = schemas.getMessageModel();


var allMessages = function (){
	var printMessageQuery = messageModel.find({}).exec(function (err, chats){
		console.log(chats);
	})
}
var sendMessageToUser = function (byUser, toUser, message){
	var addMessageQuery = new messageModel({from: byUser, to: toUser, content: message, timeStamp: new Date(Date.now())});
	addMessageQuery.save(function (err){
		console.log("saved");
		// allMessages();
		if(err)
			console.log("add message error: "+err);
	});
}
module.exports={
	sendMessage: function (byUser, toUser, message){
		sendMessageToUser(byUser, toUser, message);
		return "Sent";
	}
}