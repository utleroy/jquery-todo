"use strict";

let apiKeys = {};

function putTodoInDOM (){
	FbAPI.getTodos(apiKeys).then(function(items){
		console.log("items from FB", items);
		$("#completed-tasks").html("");
		$("#incomplete-tasks").html("");
		items.forEach(function(item){
			if(item.isCompleted === true){
				let newListItem = '<li>';
				newListItem+='<div class="col-xs-8">';
				newListItem+='<input class="checkboxStyle" type="checkbox" checked>';
				newListItem+=`<label class="inputLabel">${item.task}</label>`;
				newListItem+='</div>';
				newListItem+='</li>';
          //apend to list
          $('#completed-tasks').append(newListItem);
        } else {
        	let newListItem = '<li>';
        	newListItem+='<div class="col-xs-8">';
        	newListItem+='<input class="checkboxStyle" type="checkbox">';
        	newListItem+=`<label class="inputLabel">${item.task}</label>`;
        	newListItem+='<input type="text" class="inputTask">';
        	newListItem+='</div>';
        	newListItem+='<div class="col-xs-4">';
        	newListItem+=`<button class="btn btn-default col-xs-6 edit" data-fbid="${item.id}">Edit</button>`;
        	newListItem+=`<button class="btn btn-danger col-xs-6 delete" data-fbid="${item.id}">Delete</button>`;
        	newListItem+='</div>';
        	newListItem+='</li>';
          //apend to list
          $('#incomplete-tasks').append(newListItem);
        }

      });
	});
}

$(document).ready(function(){
	FbAPI.firebaseCredentials().then(function(keys){
		console.log("keys", keys);
		apiKeys = keys;
		firebase.initializeApp(apiKeys);
		putTodoInDOM();
	});

	$("#add-btn").on("click", function(){
		let newItem = {
			"task": $("#add-todo").val(),
			"isCompleted": false
		};

		FbAPI.addTodo(apiKeys, newItem).then(function(){
			putTodoInDOM();
		});
	});

	$("ul").on("click", ".delete", function() {
		let itemId = $(this).data("fbid");
		FbAPI.deleteToDo(apiKeys, itemId).then(function(){
			putTodoInDOM();
		});
	});

	
	$("ul").on("click", ".edit", function() {
		let itemId = $(this).data("fbid");
		let parent = $(this).closest("li");
		if(!parent.hasClass("editMode")){
			parent.addClass("editMode");
		}else{
			let editedItem = {
				"task":parent.find(".inputTask").val(),
				"isCompleted": false
			};
			FbAPI.editTodo(apiKeys, itemId, editedItem).then(function(response){
				console.log("edit mode", response);
			parent.removeClass("editMode");
				putTodoInDOM();
			});
		}
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
