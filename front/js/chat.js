//var root = 'http://172.26.90.165:3000';
var root = 'http://localhost:3000';
var presentUsername = null;
var OtherName = null;
var OtherUsername = null;
var presentName = null;
var resultHtmlTemplate = '{{#each this}}<button class="searchResultButton"><div class="container searchResultUser" name="{{name}}" user="{{username}}">Username: {{username}} Name: {{name}}</div></button>{{/each}}'
var yourChatTemplate = '<div class="UserMessageClass">{{name}}: {{message}}</div>';
var otherChatTemplate = '<div class="OtherMessageClass">{{name}}: {{message}}</div>';
$(document).ready(function (){
	getDataOnLoad();
	$('#inputSearch').keyup(function (){
		var searchTxt = this.value;
		if(searchTxt)
			onSearch(searchTxt);
		else
			$('#searchResult').html("");
	});
	$('#sendMessageButton').on('click', saveButtonClick);
});

var saveButtonClick = function (element){
	var content = $('#inputMessage').val();
	OtherUsername = $('#inputMessage').attr('otherusername');
	sendMessageToUser(OtherUsername, content);
	$('#inputMessage').val("");
};

var messageSent = function (content){
	let compiledTemplate = Handlebars.compile(yourChatTemplate);
	let updatedHtml = compiledTemplate({message: content, name: presentName});
	$('#messagesBox').append(updatedHtml);
}

var sendMessageToUser = function (otherUser, content){
	$.post(root+'/sendMessage/'+otherUser, {content: content},function (data){
		messageSent(content);
	})
}

var emptyFields = function (){
	$('#inputSearch').val("");
	// $('#messagesBox').hmtl("");
	$('#searchResult').html("");
}

var userSelectedFromSearch = function (element){
	emptyFields();
	OtherUsername = $(element.currentTarget).find('.searchResultUser').attr('user');
	$('#inputMessage').attr("otherusername", OtherUsername);
	OtherName = $(element.currentTarget).find('.searchResultUser').attr('name');
	$('#chatBoxHeader').html("Your chats with "+OtherName);
	getOtherUserData(OtherUsername);
	return false;
}
var fillData = function (data){
	fillDatainElement('nameHeader', data);
	presentName = data.name;
	presentUsername = data.username;
	$('#inputMessage').attr("myusername", data.username);
};
var renderSearchResults = function (results){
	var source = $('#searchResult');
	let compiledTemplate = Handlebars.compile(resultHtmlTemplate);
	let updatedHtml = compiledTemplate(results);
	source.html(updatedHtml);
	$('.searchResultButton').on('click', userSelectedFromSearch);
}
var onSearch = function (searchTxt){
	$.get(root+"/search/"+searchTxt,function (data, status){
		var len=data.length,i,flag=-1;
		for(i=0;i<len;i++){
			if(data[i].username === presentUsername){
				flag=i;
			}
		}
		if(flag!=-1)
			data.splice(flag,1);
		renderSearchResults(data);
	});
}
var getDataOnLoad = function (){
	$.get(root+"/getData",function (data, status){
		fillData(data);
	});
}
var fillDatainElement = function (id, data){
	var source = $('#'+id);
	let compiledTemplate = Handlebars.compile(source.html());
	let updatedHtml = compiledTemplate(data);
	source.html(updatedHtml);
}
var fillChatBox = function (chatData){
	$("#messagesBox").html("");
	var i,template,obj;
	for(i=0;i<chatData.chats.length;i++){
		obj={};
		if(chatData.chats[i].from === presentUsername){
			obj.name = presentName;
			template = yourChatTemplate;
		}
		else{
			obj.name = OtherName;
			template = otherChatTemplate;
		}
		let compiledTemplate = Handlebars.compile(template);
		
		obj.message=chatData.chats[i].content;
		let updatedHtml = compiledTemplate(obj);
		$("#messagesBox").append(updatedHtml);
	}
}
var getOtherUserData = function (username){
	$.get(root+"/getOtherUserInfo/"+username+"/0",function (data, status){
		// console.log(data);
		fillChatBox(data);
	});
}
});
