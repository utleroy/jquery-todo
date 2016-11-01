"use strict";

let apiKeys = {};

$(document).ready(function() {
	FbAPI.firebaseCredentials().then(function(keys){
		console.log(keys);
		apiKeys = keys;
		firebase.initializeApp(apiKeys);
		FbAPI.getTodos(apiKeys).then(function(items){
			console.log("items from FB", items);
		});
	});

});

	// let $doneList = {};
	// let $compiledListItem;

	// $(".add-btn").on("click",()=>{
	// 	let todoListItem = $("#addTodo").val();
	// 		$compiledListItem = $(`<div class="panel panel-default heading-row">
	// 		<div class="panel-body"><div class="listItemAdded">${todoListItem}</div>
	// 		<button type="button" class="moveItToComplete">completed
	// 		<button type="button" class="killIt">delete
	// 		<button type="button" class="changeIt">edit
	// 		</div></div></div></div>`);
	// 	$("#outputNew").append($compiledListItem);			
	// });

	// $(document).on("click", ".moveItToComplete",()=>{
	// 	$doneList = $compiledListItem;
	// 	$("#outputCompleted").append($doneList);
	// });

	// $(document).on("click", ".killIt",function(){
	// 	$(this).closest("div").remove();
	// });
