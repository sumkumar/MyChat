var hbs = require('handlebars');
var fs = require('fs');
let indexTemplate = fs.readFileSync('./front/chat.html',"utf8");
module.exports={
	renderChatHtml: function (user){
		
		//console.log("user name: "+user.name);
		return indexTemplate;
	}
}