var root = 'http://localhost:3000';
var presentUsername = null;
var resultHtmlTemplate = '{{#each this}}<button href="#" class="searchResultButton"><div class="container searchResultUser" user="{{username}}">Username: {{username}} Name: {{name}}</div></button>{{/each}}'
$(document).ready(function (){
	getDataOnLoad();
	$('#inputSearch').keyup(function (){
		var searchTxt = this.value;
		if(searchTxt)
			onSearch(searchTxt);
		else
			$('#searchResult').html("");
	});
	$('.searchResultButton').on('click', userSelectedFromSearch)
});
var userSelectedFromSearch = function (elementHtml){
	var otherUsername = $('.searchResultUser').attr('user');
	getOtherUserData(otherUsername);
}
var fillData = function (data){
	fillDatainElement('nameHeader', data);
	presentUsername = data.username;
	$('#inputMessage').attr("myusername", data.username);
};
var renderSearchResults = function (results){
	var source = $('#searchResult');
	let compiledTemplate = Handlebars.compile(resultHtmlTemplate);
	let updatedHtml = compiledTemplate(results);
	source.html(updatedHtml);
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
var fillChatBox = function (userData){
	$('#chatBoxHeader').html("Your chats with "+userData.name);
	
}
var getOtherUserData = function (username){
	$.get(root+"/getOtherUserInfo/"+username,function (data, status){
		fillChatBox(data);
	});
}