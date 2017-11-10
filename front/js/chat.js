var root = 'http://localhost:3000';
var resultHtmlTemplate = '{{#each this}}<button class="searchResultButton"><div class="container" user="{{username}}">Username: {{username}} Name: {{name}}</div></button>{{/each}}'
$(document).ready(function (){
	getDataOnLoad();
	$('#inputSearch').keyup(function (){
		var searchTxt = this.value;
		if(searchTxt)
			onSearch(searchTxt);
		else
			$('#searchResult').html("");
	});

});
var fillData = function (data){
	fillDatainElement('nameHeader', data);
};
var renderSearchResults = function (results){
	var source = $('#searchResult');
	let compiledTemplate = Handlebars.compile(resultHtmlTemplate);
	let updatedHtml = compiledTemplate(results);
	source.html(updatedHtml);
}
var onSearch = function (searchTxt){
	$.get(root+"/search/"+searchTxt,function (data, status){
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