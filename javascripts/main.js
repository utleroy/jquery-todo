"use strict";

let apiKeys = {};
let uid = "";

function putTodoInDOM (){
	FbAPI.getTodos(apiKeys, uid).then(function(items){
		console.log("items from FB", items);
		$("#completed-tasks").html("");
		$("#incomplete-tasks").html("");
		items.forEach(function(item){
			if(item.isCompleted === true){
				let newListItem = `<li data-completed="${item.isCompleted}">`;
				newListItem+=`<div class="col-xs-8" data-fbid="${item.id}">`;
				newListItem+='<input class="checkboxStyle" type="checkbox" checked>';
				newListItem+=`<label class="inputLabel">${item.task}</label>`;
				newListItem+='</div>';
				newListItem+='</li>';
          //apend to list
          $('#completed-tasks').append(newListItem);
        } else {
        	let newListItem = `<li data-completed="${item.isCompleted}">`;
        	newListItem+=`<div class="col-xs-8" data-fbid="${item.id}">`;
        	newListItem+='<input class="checkboxStyle" type="checkbox">';
        	newListItem+=`<label class="inputLabel">${item.task}</label>`;
        	newListItem+=`<div class="modal fade bd-example-modal-sm" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true">
        	<div class="modal-dialog modal-sm">
        	<div class="modal-content">
        	<input type="text" class="inputTask">
        	<button class="btn btn-default col-xs-6 edit" data-fbid="${item.id}">Edit</button>
        	</div>
        	</div>
        	</div>`;
        	newListItem+='</div>';
        	newListItem+='<div class="col-xs-4">';
        	newListItem+=`<button class="btn btn-default col-xs-6 edit" data-toggle="modal" data-target=".bd-example-modal-sm" data-fbid="${item.id}">Edit</button>`;
        	newListItem+=`<button class="btn btn-danger col-xs-6 delete" data-fbid="${item.id}">Delete</button>`;
        	newListItem+='</div>';
        	newListItem+='</li>';
          //apend to list
          $('#incomplete-tasks').append(newListItem);
        }

      });
	});
}

function createLogoutButton(){
	FbAPI.getUser(apiKeys, uid).then(function(userResponse){
		console.log("user response", userResponse);
		$("#logout-container").html("");
		let currentUsername = userResponse.userName;
		let logoutBtn = `<button class="btn btn-danger" id="logoutBtn">LOGOUT ${currentUsername}</button>`;
		$("#logout-container").append(logoutBtn);
	});
}

$(document).ready(function(){
	FbAPI.firebaseCredentials().then(function(keys){
		console.log("keys", keys);
		apiKeys = keys;
		firebase.initializeApp(apiKeys);
	});

	$("#add-btn").on("click", function(){
		let newItem = {
			"task": $("#add-todo").val(),
			"isCompleted": false,
			"uid": uid
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
				"isCompleted": false,
				"uid":uid
			};
			FbAPI.editTodo(apiKeys, itemId, editedItem).then(function(response){
				console.log("edit mode", response);
				parent.removeClass("editMode");
				putTodoInDOM();
			});
		}
	});

	$("ul").on("change", 'input[type="checkbox"]', function(){
		let updatedIsCompleted = $(this).closest("li").data("completed");
		let itemId = $(this).parent().data("fbid");
		let task = $(this).siblings(".inputLabel").html();

		let editedItem = {
			"task": task,
			"isCompleted": !updatedIsCompleted,
			"uid":uid
		};
		FbAPI.editTodo(apiKeys, itemId, editedItem).then(function(){
			putTodoInDOM();
		});
	});

	$("#registerButton").on("click", function(){
		let email = $("#inputEmail").val();
		let password = $("#inputPassword").val();
		let userName = $("#inputUsername").val();
		let user = {
			"email": email,
			"password": password
		};
		FbAPI.registerUser(user).then(function(registerResponse){
			console.log("user response", registerResponse);

			let newUser ={
				"userName": userName,
				"uid": registerResponse.uid
			};
			return FbAPI.addUser(apiKeys, newUser);

		}).then(function(userResponse){
			return FbAPI.loginUser(user);

		})
		.then(function(loginResponse){
			console.log("login response", loginResponse);
			uid = loginResponse.uid;
			createLogoutButton();
			putTodoInDOM();
			$("#login-container").addClass("hide");
			$("#todo-container").removeClass("hide");
		});
	});

	$("#loginButton").on("click", function(){
		let email = $("#inputEmail").val();
		let password = $("#inputPassword").val();
		let user = {
			"email": email,
			"password": password
		};
		FbAPI.loginUser(user).then(function(loginResponse){
			uid = loginResponse.uid;
			createLogoutButton();
			putTodoInDOM();
			$("#login-container").addClass("hide");
			$("#todo-container").removeClass("hide");
		});
	});
});

$("#logout-container").on("click", "#logoutBtn", function	(){
	console.log("clicked");
	FbAPI.logoutUser();
	uid = "";
	$('#incomplete-tasks').html("");
	$('#completed-tasks').html("");
	$("#inputEmail").val("");
	$("#inputPassword").val("");
	$("#inputUsername").val("");
	$("#login-container").removeClass("hide");
	$("#todo-container").addClass("hide");
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
