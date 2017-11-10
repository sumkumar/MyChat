var root = 'http://localhost:3000';
$(document).ready(function (){
	$('#inputSearch').keyup(function (){
		var searchTxt = this.value;
		if(searchTxt)
		onSearch(searchTxt);
	})
});
var searchtemplate = '{{#each results}}<button><div class="container">Username: {{results.username}} Name: {{results.name}}</div></button>{{/each}}';
var renderSearchResults = function (results){
	var resultHtml = $('#searchResult');
	var source   = $("#entry-template").text();
	let compiledTemplate = Handlebars.compile(source);
	let searchResultHtml = compiledTemplate({"title": "Hello", "body": "world"});
	console.log(searchResultHtml);
	resultHtml.html(searchResultHtml);
}
var onSearch = function (searchTxt){
	$.get(root+"/search/"+searchTxt,function (data, status){
		renderSearchResults(data);
	});
}