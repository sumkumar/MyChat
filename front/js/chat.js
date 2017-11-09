var hbs = require('handlebars');
var fs = require('fs');
let indexTemplate = fs.readFileSync('./front/chat.html',"utf8");
let compiledTemplate = hbs.compile(indexTemplate);
let data={};
module.exports={
	renderChatHtml: function (user){
		data.user = user;
		//console.log("user name: "+user.name);
		let result = compiledTemplate(data);
		return result;
	}
}