This tutorial will help you integrate *Appacitive* in existing *TodoMVC* app for *Backbone*.js. It demonstrates Users and Data Store features provided by Appacitive Platform. 

Appacitive <a href="../../downloads" target="_blank">Javascript SDK <i class="glyphicon glyphicon-share-alt"></i></a> is built mostly in the way models and collections work in backbone.js, with changes to accomodate <a href="http://help.appacitive.com" target="_blank">Appacitive's API  convention<i class="glyphicon glyphicon-share-alt"></i></a>. Thus integrating SDK with backbone apps becomes more easy.

As part of design practice, you will learn how to model your app and bind your data to the views. 

### Dependencies

* Underscore
* jQuery
* Backbone

Above specified dependencies are specific to this app. SDK has no dependencies on any libraries. 

### Creating Todo List App from Scratch

Follow this guide to get hands on with the todo App.

<h3 id="model-backend">1. Modeling app backend on Appacitive</h3>

Following video shows how to create the model for the app on Appacitive Platform.

<iframe src="//player.vimeo.com/video/96887976?title=0&amp;byline=0&amp;portrait=0" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>

### 2. Downloading the default ToDoMVC app

To jump start, we have copied the ToDoMVC app for you, and added mock user authentication. This app is fully functional using localstorage. You can download the app <a title="Download boilerplate" href="https://github.com/chiragsanghvi/AppacitiveTodo/archive/boilerplate.zip">here <i class="glyphicon glyphicon-download-alt"></i></a>.

#### Directory Structure

```javascript
css
└── app.css
js/
├── app.js
├── controllers/
│   └── todos.js
├── models/
│   └── todo.js
├── routers/
│   └── router.js
├── views/
│   ├── app-view.js
│   ├── login-view.js
│   ├── todos-view.js
│   └── todo-view.js
└── infra/
	├── backbone.js
	├── backbone.localstorag.js
	└── underscore.js
index.html
readme.md
```

### 3. Integrating the Javascript SDK

All the html that is needed by views is placed in index.html file inside script tags. These templates are <a href="http://underscorejs.org/#template" target="_blank">underscore templates <i class="glyphicon glyphicon-share-alt"></i></a>.


#### 3.1 Include the SDK

To get started, add the SDK to the head tag inside `index.html` file and remove `backbone.localstorage.js` script tag.

```html
<script src="http://cdn.appacitive.com/sdk/js/appacitive-js-sdk-v0.9.8.1.min.js"></script>
```

#### 3.2 Initialize the SDK

You can initialize the SDK any where in your app, but we suggest to do it in `app.js`. To initialize the SDK, open `app.js` and insert following code in the beginning.

```javscript
Appacitive.initialize({ 
  apikey: "{{API Key}}", 
  env: "sandbox", 
  appId: "{{App Id}}"
});
```

**Retrieving API Key and Application Id**

You will need to replace {{App Id}} by your application's id and {{API Key}} by API Key. To get these details, open your app on Appacitive Portal. API key for the app is available on your app's home page at the bottom. To get the App Id, open application details, by clicking on edit icon near your app's name.

**Note**: We suggest using the client key as API key to maintain security and controlled access on your data.

#### 3.3 Creating and Authenticating User

We've extended the todoMVC app with user authentication, which allows users to signup, login and store their todo items on Appacitive. Thus allowing them to access their todo items from any device. 

In addition, we've changed the `AppView` to render either of the 2 views viz. `LoginView` or `TodosView`, depending on whether the user is logged-in or not.

**Note**: Whenever you use signup or login method, the user is stored in the localStorage and can be retrieved using `Appacitive.Users.current()` method. So, everytime your app opens, you just need to check this value, to be sure whether the user is logged-in or not.

Open `appView.js` and replace specified content.

```javascript
// Replace this line
app.user = window.localStorage['user'] ? new app.User(window.localStorage['user']) : null;

// With this line
app.user = Appacitive.User.current()

// Determines user is logged-in or not
if (app.user) {
	new app.TodosView();
} else {
	new app.LogInView();
}
```

The LoginView contains two forms, one for login and other for signup. By default it shows the login form.

```html
<div class="login">
	<!--Login form-->
	<form class="login-form">
	  <div id="header-info">Login</div>
	  <div class="success" style="display:none"></div>
	  <div class="info" style="display:none"></div>
	  <input type="text" id="login-username" placeholder="Username *" />
	  <input type="password" id="login-password" placeholder="Password *" />
	  <div class="error" style="display:none"></div>
	  <button id="login">Log In</button>
	  <button id="signup">Sign Up</button>
	  <a href="javascript:void(0);" id="forgot" style="width:150px;">Forgot Password ?</a>
	</form>

	<!--Signup form-->
	<form class="signup-form hidden">
	  <div id="header-info">Signup</div>
	  <input type="text" id="signup-username" placeholder="Enter Username *" />
	  <input type="password" id="signup-password" placeholder="Enter Password *" />
	  <input type="text" id="signup-firstname" placeholder="Enter name *" />
	  <input type="email" id="signup-email" placeholder="Enter email *" />
	  <div class="error" style="display:none"></div>
	  <button id="signup">Sign Up</button>
	  <button id="cancel">Cancel</button>
	</form>
</div>
```

The LoginView binds to show, hide and submit events for both these forms. To authenticate user open `login-view.js` and replace *mocked section* in `login` function with following code.

```javascript
Appacitive.Users.login(username, password).then(function(authResponse) {
	app.user = authResponse.user;
	new app.TodosView();
	self.undelegateEvents();
}, function(error) {
	self.showError("login", "Invalid username or password. Please try again.");
	self.$(".login-form button").removeAttr("disabled");
	self.$('.login-form #login').html("LogIn");
});

``` 
For signup, replace *mocked section* in `signup` function with following code.

```javascript
Appacitive.Users.signup({
	username: username.toLowerCase(),  //mandatory
	password: password,		//mandatory
	firstname: firstName,      //mandatory
	email: email,
	lastname: lastName
}).then(function(authResponse) {
	app.user = authResponse.user;
	new app.TodosView();
	self.undelegateEvents();
}, function(error) {
	self.showError('signup', error.message);
	self.$(".signup-form button").removeAttr("disabled");
	self.$('.signup-form #login').html("Sign Up");
});
```
Above code creates a new user with given details from the fields and performs login on user's behalf. After successful login/signup , we render `TodosView`. For more info on users click <a href="/javascript/users" target="_blank">here<i class="glyphicon glyphicon-share-alt"></i></a>

**Note**: If you're using client key, then by default only logged-in users themselves can read,update and delete their data.

Once the user logs in, he remains logged-in until he specifically logs out. You can logout current user, by calling `Appacitive.User.logout()` method.

Replace `logOut` function in `todos-view.js` with following code

```javascript
// Logs out the user from Appacitive and shows the login view
logOut: function(e) {
	Appacitive.User.logout(true);
	new app.LogInView();
	this.undelegateEvents();
	delete this;
},
```

#### 3.4 Managing the Todo Items

As this app has been ported from Backbone's todoMVC app, the only change required was to replace Backbone models and collections with Appacitive models and collections. 

To get a hang of how Backbone Models and Collections are used to represent the todo items, you can refer through the <a href="http://documentcloud.github.io/backbone/docs/todos.html" target="_blank">original annotated source <i class="glyphicon glyphicon-share-alt"></i></a>.

To migrate Backbone models and collections on Appacitive, replace `Backbone.Model.extend` with `Appacitive.Object.extend`. When doing so, you need to set `typeName` which is `todo` in our case, as a property to map your objects to Appacitive type `todo` in `todo.js`.

```javascript
// Our basic **Todo** model has `title` and `completed` attributes.
app.Todo = Appacitive.Object.extend({
    
    //type name to which this object binds on Appacitive
    typeName: 'todo'
	
	//..
});
```
Replace `Backbone.Collection` to `Appacitive.Collection` in `todos.js`. You'll also need to change the `comparator` to use `createdAt` property of app.Todo, eliminating the need for ordering todo items manually.

```
// The collection of Todo objects 
var Todos = Appacitive.Collection.extend({
	
	// Specify app.Todo as model for collection
	model: app.Todo,

	// Todos are sorted by their created date.
	comparator: function (todo) {
		return todo.createdAt;
	},

	//  ..
});
```

**Saving a Todo Item:**

To do this open `todos.js` and get rid of the `localstorage` property, to start using Appacitive for persisting data. 

```javascript
//Remove this for persisting data on Appacitive
localStorage: new Backbone.LocalStorage("todos-backbone"),
```	

Add `create` function as a property to the `app.Todos` collection in `todos.js` as follows

```javascript
create: function(todo) {
	// todo object model
	var todo = new app.Todo(todo);

	//owner connection model
	var owner = new app.Owner(todo).save();
	this.add(todo, { sort: true });
},
```

**Connecting Todo Item to logged-in User:**

If you observe above code, apart from creating `todo` object, we're also creating a connection of relation-type `owner`. The constructor of `owner` connection is passed the `todo` object and then saved. For more info on creating connections click <a href="http://help.appacitive.com/v1.0/index.html#javascript/data_connections" target="_blank">here <i class="glyphicon glyphicon-share-alt"></i></a>.

Copy following code in `todo.js`.

```javascript
// Owner connection model
// ----------

// Our basic **owner** relation model, which connects logged-in user
// to todo model
app.Owner = Appacitive.Connection.extend({
    
    //relation name to which this connection binds on Appacitive
    relationName: "owner",

    // Override internal constructor to add endpoints for connection
	// If `todo`, an instance of app.Todo is passed then only we change the attributes to add endpoints
	// Finally we call the internal constructor
	constructor: function(todo) {

		var args = Array.prototype.slice.call(arguments);

		// To avoid other parsing conflicts with connectedObjects
		if (args[0] instanceof app.Todo) {
			arguments[0] = {
				endpoints: [{
					label: 'user',
					object: Appacitive.Users.current()
				}, {
					label: 'todo',
					object: args[0]
				}]
			};
		}

		//Invoke internal constructor
		Appacitive.Connection.apply(this, arguments);
	}
});
```

Here, we're extending the `owner` connection, to set endpoints in constructor. One of the endpoint is the `todo` object that we passed and other is the logged-in user. 

Shortly we're saving `todo` in context of `user` by creating `owner` connection between `user` and `todo`. On saving the `owner` connection, the `todo` object is also created.

**Fetching Todo Items:**

The other part of the app that required a change was the way we populate collection of todo items. You should specify a query so that the collection knows how to fetch the objects. Here, we  make `getConnectedObjects` call on `current user` object and set it as query for the `Todos` collection instance.

Replace `app.Todos.fetch()` call in `initialize` function with following code in `todos-view.js`.

```
// Set query type for app.todos
// Query will be getConnectedObjects in respect to current user for relation owner
// This'll allow us to fetch todo objects connected to user by owner relation
var query = Appacitive.User.current().getConnectedObjects({
	 relation : 'owner',
	 pageSize: 200,
	 fields: ["title", "completed", "__utcdatecreated"]
});

app.todos.query(query);

// Suppresses 'add' events with {reset: true} and prevents the app view
// from being re-rendered for every model. Only renders when the 'reset'
// event is triggered at the end of the fetch.
app.todos.fetch({ reset: true, sort: true }).then(function() {
	self.$input.removeAttr('disabled');
});
```

The `getConnectedObjects` call, returns all the todo items which are connected to current user and gets rendered.

#### 3.5 Run your app

Open `index.html` of your app in a browser. Signup and add, update and remove items.

#### 3.6 Forgot Password

It's a fact that as soon as you introduce passwords into a system, users will forget them. In such cases, Appacitive provides a way to let them securely reset their password.

To start with the password reset flow, you ask the user for his username and call `Appacitive.User.sendResetPasswordEmail`. Replace `forgotPassword` function in `login-view.js` with following code.

```javascript
// sendResetPasswordEmail method accepts 2 arguments
// One is the username and other is subject
// Both are mandatory
// Sends a reset password mail to the intended user
Appacitive.User.sendResetPasswordEmail(username, 'Reset your Appacitive ToDo App password').then(function() {
	  self.showSuccess("Reset password mail sent.");
	  self.$(".login-form button").removeAttr("disabled");
}, function(status) {
	  self.showError('login', status.message);
	  self.$(".login-form button").removeAttr("disabled");
})
```

This'll basically send the user an email, with a reset password link. When user clicks on the link, he'll be redirected to an Appacitive reset password page, which will allow him to enter new password and save it.

Following video explains reset password flow in more detail.

<iframe src="//player.vimeo.com/video/95948652" width="500" height="281" frameborder="0" webkitallowfullscreen mozallowfullscreen 
allowfullscreen></iframe>

<br/>
You can find the templates for `email` and `reset-password` page over here

* [Email Template](https://github.com/chiragsanghvi/AppacitiveTodo/blob/master/reset-password-tmpl/email-template.html)
* [Reset-Password-Page](https://github.com/chiragsanghvi/AppacitiveTodo/blob/master/reset-password-tmpl/reset-page-template.html)

### Congratulation

You have created a fully functional Todo App using Javsript SDK backed by Appacitive Platform. In this Todo App we have explored the **CRUD** capability of two features **Data Store** and **Users** provided by Appacitive Core. You also learned how to **Create and Authenticate** user. 

### What's next?
You can check out our other <a title="All Samples based on Appacitive Javascript SDK" href="../">samples</a> to know more about Javscript SDK and other features provided by Appacitive Platform. For complete API reference of Javascript SDK go to our <a title="javascript help docs" href="../../">help docs</a>.












