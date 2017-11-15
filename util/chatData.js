var schemas = require('../model/schemas');
var messageModel = schemas.getMessageModel();

var fetchChats = function (user, otherUser, limit){
	var searchChatsQuery = messageModel.find({$or: [{to: user, from: otherUser}, {to: otherUser, from: user}]});
	searchChatsQuery.select({from: 1, content: 1, timeStamp: 1});
	//searchChatsQuery.or([{to: user, from: otherUser}, {to: otherUser, from: user}]);
	searchChatsQuery.sort({timeStamp: 1});
	searchChatsQuery.limit(limit);
	return new Promise((resolve, reject)=>{
		searchChatsQuery.exec(function (err, chats){
			if(err)
				console.log("fetch chat error: "+err);
			// console.log("chats");
			// console.log(chats);
			resolve(chats);
		});
	})
};
module.exports={
	getChatData: function (user, otherUser, limit){
		// console.log("in chatdata");
		// console.log(user);
		// console.log(otherUser);
		// console.log(limit);
		return new Promise((resolve, reject)=>{
			fetchChats(user, otherUser, limit).then((chats)=>{
				var obj={};
				obj.otherUser = otherUser;
				obj.chats = chats
				// console.log(obj);
				resolve(obj);
			})
		})
	}
}