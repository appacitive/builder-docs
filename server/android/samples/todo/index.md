Todo List App demonstrates ***Users*** and ***Data Store***  features on the Appacitive Platform. As part of the designing with best practices, you will learn how to model your app and connect your app to the Appacitive platform.

### Prerequisites

Download the boilerplate code and open it in Eclipse or Android Studio. The boilerplate uses gradle to manage the build. The target compilation SDK is API 19. 


### Creating Todo List App

Follow the step by step guide to get hands on with the ToDo list app.

<h3 id="model-backend"> 1. Modeling app backend on Appacitive</h3>

Following video shows how to create the model for the todo app on the Appacitive platform.

<iframe src="//player.vimeo.com/video/89849527?byline=0&amp;portrait=0" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>

### 2. Downloading Boilerplate

To jump start, we have created a boilerplate app for you, which is fully functional with some sample data hard coded in the app. You can download the boilerplate <a title="Download boilerplate" href="https://github.com/sathley/GentlemansToDo/archive/boilerplate.zip">here</a>.

This boilerplate app code has some parts missing, which we will now fill to create a fully functional app.

### 3. Integrating Android SDK

The boilerplate compiles with Android KitKat.  


#### 3.1 Installing SDK

Make sure the appacitive SDK jar is present in the `libs` folder of the source directory. If not you can download it from the [Downloads](http://devcenter.appacitive.com/android/downloads/) page and put it there.


#### 3.2 Initializing SDK

You can initialize the SDK anywhere in your app, but we suggest you do it in the launcher activity, by doing so SDK is available everywhere in the app. To initialize the SDK, copy the following code in the `onCreate()` method on `LoginActivity`.

```
	AppacitiveContext.initialize("{{App Id}}", Environment.sandbox, this);
```

You will need to replace `{{API Key}}` by your API Key. To get your api key, open your app on Appacitive Portal. API key for the app is available on your app's home page at the bottom.


#### 3.3 Logging in an existing user with his email and password

The first activity is the `LoginActivity`. It has two `EditText` views for the user to enter his *email address* and *password*. Add the following code to the `onClickListener()` of the Login button.

```
	AppacitiveUser.loginInBackground(emailAddress, passwordString, -1, -1, new Callback<AppacitiveUser>() {
	                    @Override
	                    public void success(AppacitiveUser user) {
	                        Intent tasksIntent = new Intent(context, TasksActivity.class);
	                        tasksIntent.putExtra("user_id", user.getId());
	                        tasksIntent.putExtra("firstname", user.getFirstName());
	                        startActivity(tasksIntent);
	                    }
	
	                    @Override
	                    public void failure(AppacitiveUser user, Exception e) {
	                        Toast.makeText(context, e.getMessage(), Toast.LENGTH_LONG).show();
	                    }
	                });
```

If the user has entered correct credentials, the SDK will get initialized with his auth token and the success callback will be called with an object of AppacitiveUser which contain all his details. 
In the success handler, we create a bundle with his unique id and firstname and send it with the intent to start the `TasksActivity` where he can see his todo tasks.

#### 3.4 Signing up a new user

The `LoginActivity` also contains a button for new user signup which takes him to `SignupActivity`. 
This activity contains three `EditText` views for a new user to input his *name*, *email* and desired *password*. On clicking the **Signup** button, its `onClick` handler is called. Add the following code there.

```
				AppacitiveUser user = new AppacitiveUser();
                user.setFirstName(firstName);
                user.setEmail(emailAddress);
                user.setPassword(passwordString);
                user.setUsername(emailAddress);

                user.signupInBackground(new Callback<AppacitiveUser>() {
                    @Override
                    public void success(AppacitiveUser user) {

                        Intent tasksIntent = new Intent(context, TasksActivity.class);
                        tasksIntent.putExtra("user_id", user.getId());
                        tasksIntent.putExtra("firstname", user.getFirstName());
                        startActivity(tasksIntent);
                    }

                    @Override
                    public void failure(AppacitiveUser user, Exception e) {
                        Toast.makeText(context, e.getMessage(), Toast.LENGTH_LONG).show();
                    }
                });
```

Notice that we are using his email as his unique username. You could have asked him to choose a unique username as well. On successful signup, the success callback is invoked where we again add the new users id and firstname into a bundle and send it with the intent to start the `TasksActivity`.

#### 3.5 Fetch all todo tasks for the logged in user

We retrieve the user's unique id from the intent and fire a call onto appacitive to fetch all connected tasks for the user. 
Add the following code in the `onCreate()` method of `TasksActivity`.

```
		AppacitiveObject.getConnectedObjectsInBackground("owner", "user", mUserId, null, null, new Callback<ConnectedObjectsResponse>() {
            @Override
            public void success(ConnectedObjectsResponse result) {
                List<AppacitiveObject> tasks = new ArrayList<AppacitiveObject>();
                for (ConnectedObject connectedObject : result.results) {
                    tasks.add(connectedObject.object);
                }
                mAdapter = new TasksAdapter(mContext, R.layout.item_tasks, tasks);
                setupHeader();
                mListView.setAdapter(mAdapter);
            }

            @Override
            public void failure(ConnectedObjectsResponse result, Exception e) {
                Toast.makeText(mContext, e.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });
```

In the success handler we are initializing the `TasksAdapter` for the ListView with the tasks fetched from Appacitive for the user.

#### 3.6 Adding a new task

Now we will start working on the tasks for the user. First we will see how to add a new task.
In the `TasksActivity` class there is a button handler for adding a new task. Paste the following code snippet there.

```
	AppacitiveObject task = new AppacitiveObject("todo");
	            task.setStringProperty("title", newTaskName.trim());
	            task.setBoolProperty("completed", false);
	
	            new AppacitiveConnection("owner")
	                    .toExistingObject("user", mUserId)
	                    .fromNewObject("todo", task)
	                    .createInBackground(new Callback<AppacitiveConnection>() {
	                        @Override
	                        public void success(AppacitiveConnection result) {
	                            Toast.makeText(mContext, "New task added", Toast.LENGTH_LONG).show();
	                            mAdapter.add((AppacitiveObject) result.endpointA.object);
	                            mAdapter.notifyDataSetChanged();
	                        }
	
	                        @Override
	                        public void failure(AppacitiveConnection result, Exception e) {
	                            Toast.makeText(mContext, e.getMessage(), Toast.LENGTH_SHORT).show();
	                        }
	                    });
```

This adds a new task on Appacitive and in the success handler informs the ListView's adapter that data has changed.

#### 3.7 Deleting a task

Every task has a delete button to its right. On pressing that button, the task is deleted from appacitive. This is how we can accomplish that.

This code goes in the `TasksAdapter` class. Look for the correct comment under which you must paste this code to delete a task.

```
				AppacitiveObject task = getItem(position);
	                task.deleteInBackground(true, new Callback<Void>() {
	                    @Override
	                    public void success(Void result) {
	                        Toast.makeText(mContext, "Task removed", Toast.LENGTH_SHORT).show();
	                    }
	
	                    @Override
	                    public void failure(Void result, Exception e) {
	                        Toast.makeText(mContext, e.getMessage(), Toast.LENGTH_SHORT).show();
	                    }
	                });
	                remove(task);
	                notifyDataSetChanged();
```

After the task is deleted we also remove the task from the adapter and notify it that underlying data has changed.

#### 3.8 Deleting a task

Similarily, for deleting a task paste the following code snippet in `TasksActivity`. 

```
	AppacitiveObject task = getItem(position);
	                task.setBoolProperty("completed", isChecked);
	
	                task.updateInBackground(false, new Callback<AppacitiveObject>() {
	                    @Override
	                    public void success(AppacitiveObject result) {
	                        if (isChecked)
	                            Toast.makeText(mContext, "Task done", Toast.LENGTH_SHORT).show();
	                        else
	                            Toast.makeText(mContext, "Task undone", Toast.LENGTH_SHORT).show();
	                    }
	
	                    @Override
	                    public void failure(AppacitiveObject result, Exception e) {
	                        Toast.makeText(mContext, e.getMessage(), Toast.LENGTH_SHORT).show();
	                    }
	                });
```
We update the `completed` boolean property of the task with the updated value for the task and fire a call onto appacitive to update the completion status of the task. We also show a corresponding toast to go with it.
 
### Congratulation

You have created a fully functional Todo App using the Appacitive Android SDK backed by Appacitive Platform. In this Todo App, we have explored the **CRUD** capability of two features ***Data Store*** and **Users** provided by Appacitive Core. You also learned how to **Authenticate** user. 

The complete code for this sample is available [here](https://github.com/sathley/GentlemansToDo).

### What's next?

You can check out our other <a title="All Samples based on Appacitive Andorid SDK" href="../">samples</a> to know more about the Android SDK and other features provided by Appacitive Platform. 

For complete API reference of Android SDK go to our <a target="_blank" title="http://help.appacitive.com" href="http://help.appacitive.com/v1.0/#android">help docs<span class="plxs glyphicon glyphicon-share-alt"></span></a>.