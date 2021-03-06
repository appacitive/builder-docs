﻿Todo List App demonstrates ***Users*** and ***Data Store***  features provided by Appacitive Platform. As part of design best practice, you will learn how to model your app and bind your custom objects to the view.


### Creating todo list app from scratch

Follow the step by step guide to get hands on with the Todo List App.


### 1. Modeling the app back-end on Appacitive

Following video shows how to create the model for the app on Appacitive Platform.

<iframe src="//player.vimeo.com/video/96887976?byline=0&amp;portrait=0" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>


### 2. Downloading the boilerplate code

To jump start, we have created a boilerplate app for you. To complete the boilerplate code, first make your model for the todo app on Appacitive and then follow the guide that follows or read it [here](https://github.com/pratik644/AppacitiveToDoSample/tree/boilerplate)  You can download the boilerplate [here](https://github.com/pratik644/todoapp/archive/boilerplate.zip)


### 3. Implementing the application

#### 3.1. Introduction

**Let's Do** is a very simple to-do application with minimal functionality built to help you get started with using your Appacitive model in an iOS application. If you have reached here through the wizard from the Appacitive portal, I assume you have already built your mode for the application which means 50% of your work is done. If, for any reason, you have not made a model at Appacitive, I would advise you to first complete that step and come back here and continue. In case if you are not familiar with building your model in Appacitive, I would encourage you to take a look at [this](http://www.vimeo.com/appacitive) page which contains very comprehensive videos on using Appacitive as your back-end.

Now that your model is all set up, lets add some code to the boilerplate to complete the app. 


#### 3.2. Integrating the iOS SDK

First thing we need to do is integrate the Appacitive iOS SDK into our project. You can checkout the [installation](http://devcenter.appacitive.com/ios/getting-started/installation/) page to find out how, if you already haven't done that. 
In short, you can download the *Appacitive.framework* file and drag it  into the `Frameworks` group in the project navigator. 

Now open the AppDelegate.m file, add an import statement `#import <Appacitive/AppacitiveSDK.h>` to import the AppacitiveSDK and add the following line in the `application:didLaunchWithOptions:` method.

```objectivec
[Appacitive registerAPIKey:@"YOUR_API_KEY" useLiveEnvironment:NO];
```

Go to the appacitive portal and get a client key for your Appacitive app and replace the `@"YOUR_API_KEY"` with the client key.

__Optional:__ For debugging purposes, add the following code below the `+[Appacitive registerAPIKey:useLiveEnvironment]`. It will log all the network requests and responses in the console so you can debug any issues you may face while development. After you have thoroughly tested you app, you can safely remove these lines to disable logging of the network calls.

```objectivec
[[APLogger sharedLogger] enableLogging:YES];
[[APLogger sharedLogger] enableVerboseMode:YES];
```


#### 3.3. Implementing user authentication

Open the `LoginViewController.m` file and add an import statement `#import <Appacitive/AppacitiveSDK.h>` to import the Appacitive iOS SDK. In the `buttonTapped:sender:` method replace the comment `Insert Appacitive code here - 1` with the code below.

```objectivec
[APUser authenticateUserWithUsername:self.email.text password:_password.text successHandler:^(APUser *user){
    [_busyView removeFromSuperview];
    [self dismissViewControllerAnimated:YES completion:nil];
} failureHandler:^(APError *error) {
    NSLog(@"ERROR:%@",[error description]);
    [_busyView removeFromSuperview];
    UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"Error" message:error.localizedDescription delegate:self cancelButtonTitle:@"Dismiss" otherButtonTitles:nil, nil];
    [alert show];
}];
```
The above piece of code will authenticte the user with the username and the password that he provides.

In the same `buttonTapped:sender:` method replace the comment `Insert Appacitive code here - 2` with the code below.

```objectivec
APUser *newUser = [[APUser alloc] init];
[newUser addPropertyWithKey:@"username" value:self.email.text];
[newUser addPropertyWithKey:@"password" value:self.password.text];
[newUser addPropertyWithKey:@"firstname" value:self.email.text];
[newUser addPropertyWithKey:@"email" value:self.email.text];
[newUser createUserWithSuccessHandler:^{
    [APUser authenticateUserWithUsername:self.email.text password:self.password.text successHandler:^(APUser *user) {
        [_busyView removeFromSuperview];
        [self dismissViewControllerAnimated:YES completion:nil];
    } failureHandler:^(APError *error) {
        NSLog(@"ERROR:%@",[error description]);
        [_busyView removeFromSuperview];
        UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"Error" message:error.localizedDescription delegate:self cancelButtonTitle:@"Dismiss" otherButtonTitles:nil, nil];
        [alert show];
    }];
    [self dismissViewControllerAnimated:YES completion:nil];
} failureHandler:^(APError *error) {
    NSLog(@"ERROR:%@",[error description]);
    UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"Error" message:error.localizedDescription delegate:self cancelButtonTitle:@"Dismiss" otherButtonTitles:nil, nil];
    [alert show];
}];
```

In the above piece of code, we instantiate a new `APUser` object that we will use for signing up our new users. We add the `username`, `password`, `email` and `firstname` properties to the newly created APUser instance and we then call the `+[APUser createUserWithSuccessHandler:failureHandler:]` method to create a new user object on Appacitive. That's it, the new user is signed up and in successHandler we login the newly created user to make him the current user of the app.

In the same `buttonTapped:sender:` method replace the comment `Insert Appacitive code here - 3` with the code below.

```objectivec
[APUser sendResetPasswordEmailForUserWithUsername:self.email.text withSubject:@"Reset your Let's Do account password." successHandler:^{
    [_busyView removeFromSuperview];
    UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"Yay!" message:@"We have sent you an email with instructions for resetting your Let's Do account password. Come back soon with a new password, we have a lot to get done." delegate:self cancelButtonTitle:@"Dismiss" otherButtonTitles:nil, nil];
    [alert show];
} failureHandler:^(APError *error) {
    NSLog(@"ERROR:%@",[error description]);
    UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"Error" message:error.localizedDescription delegate:self cancelButtonTitle:@"Dismiss" otherButtonTitles:nil, nil];
    [alert show];
}];
```

In the above piece of code, we send a reset pasword email to the user when he taps the `Forgot password` button.

#### 3.4. Implementing the todo list 

Next, open the ViewController.m file and replace the `logoutButtonTapped` with the following code.

```objectivec
-(void)logoutButtonTapped {
    [APUser logOutCurrentUserWithSuccessHandler:^{
        [self performSegueWithIdentifier:@"showLoginView" sender:nil];
    } failureHandler:^(APError *error) {
        NSLog(@"%@",error);
    }];
}
```

Here we simply logout the user from the app and present the login modal view. To log out the user we use the `+[APUser logOutCurrentUserWithSuccessHandler:failureHandler]` method.


Add the following two methods.

```objectivec
- (IBAction)addButtonTapped {
    UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"What needs to be done?" message:nil delegate:self cancelButtonTitle:@"Cancel" otherButtonTitles:@"Ok", nil];
    alert.alertViewStyle = UIAlertViewStylePlainTextInput;
    [alert show];
}

- (void)alertView:(UIAlertView *)alertView clickedButtonAtIndex:(NSInteger)buttonIndex {
    if(buttonIndex == 1) {
        if([[alertView textFieldAtIndex:0] text] != nil && ![[[alertView textFieldAtIndex:0] text] isEqualToString:@""]) {
            APObject *todoObject = [[APObject alloc] initWithTypeName:@"todo"];
            [todoObject addPropertyWithKey:@"title"  value:[alertView textFieldAtIndex:0].text];
            [todoObject addPropertyWithKey:@"completed" value:@"false"];
            [todoObject addPropertyWithKey:@"order" value:[NSString stringWithFormat:@"%ld",(unsigned long)self.todoItems.count]];
            [todoObject saveObject];
            APConnection *conn = [[APConnection alloc] initWithRelationType:@"owner"];
            [conn createConnectionWithObjectA:todoObject objectB:[APUser currentUser] labelA:@"todo" labelB:@"user"];
            [self.todoItems addObject:todoObject];
            [self.tableView reloadData];
        }
    }
}
```

The `addButtonTapped` method is used to add an entry in to the `todoList` array. We present the user with a UIALertView with a single UITextfield and we set the UIAlertView's delegate to self and then in the `alertView:clickedButtonAtIndex` we check if the user pressed the `Ok` button and if he did, then we simply add, the text he entered in the UITextField, into the `todoList` array.


In the `viewDidAppear:animated:` method add the following code after the `[super viewDidAppear:animated];` line.

```objectivec
if([APUser currentUser] == nil) {
        [self performSegueWithIdentifier:@"showLoginView" sender:nil];
    } else {
        if(_busyView == nil) {
            _busyView = [[MBProgressHUD alloc] initWithView:self.view];
        }
        [_busyView setLabelText:@"Fetching..."];
        [self.view addSubview:_busyView];
        _busyView.delegate = self;
        [_busyView show:YES];
        [APConnections fetchObjectsConnectedToObjectOfType:@"user" withObjectId:[[APUser currentUser] objectId] withRelationType:@"owner" fetchConnections:NO successHandler:^(NSArray *objects) {
            self.todoItems = [[NSMutableArray alloc] init];
            for(APGraphNode *node in objects) {
                [self.todoItems addObject:node.object];
        }
        [self.tableView reloadData];
        [_busyView removeFromSuperview];
    } failureHandler:^(APError *error) {
        NSLog(@"%@",[error description]);
    }];
}
```

Whenever you use any of the authenticate methods from the APUser class, the SDK saves the currently logged-in user on to disk and every time you launch your app, the SDK reloads the saved user object. In `viewDidAppear:animated` method we check to see if we have any previously logged in user saved with us in the static `currentUser` object. If we do not have a saved user, that means either a user has not logged-in yet or he logged out, so we present the user with the login screen. If we do have a logged in user, then we use the `-[APConnection fetchObjectsConnectedToObjectOfType:withObjectId:withRelationType:fetchConnections:successHAndler:failureHandler]` method to fetch all the objects connected to the currently logged in APUser object with a relation type owner. In short, we are fetching all the `todo` APObjects of the currently logged in user. We add all the `todo` objects to our `todoList` array which serves as a data source for our `UITableView` and we reload the `UITableView`.


Add the following code in the `[tableView:cellForRowAtIndexPath:]` method just before the `return cell;` statement.

```objectivec
NSDictionary* attributes = @{NSStrikethroughStyleAttributeName: [NSNumber numberWithInt:NSUnderlineStyleSingle],
                                 NSStrikethroughColorAttributeName: [UIColor colorWithRed:0.349 green:0.733 blue:0.733 alpha:1.000]};
    
NSLog(@"%@",[[self.todoItems objectAtIndex:indexPath.row] getPropertyWithKey:@"completed"]);

if([[[self.todoItems objectAtIndex:indexPath.row] getPropertyWithKey:@"completed"] isEqualToString:@"true"]) {
    NSAttributedString* attrText = [[NSAttributedString alloc] initWithString:[[self.todoItems objectAtIndex:indexPath.row] getPropertyWithKey:@"title"] attributes:attributes];
    cell.textLabel.attributedText = attrText;
} else {
    cell.textLabel.text = [[self.todoItems objectAtIndex:indexPath.row] getPropertyWithKey:@"title"];
}
[cell setBackgroundColor:[UIColor clearColor]];
[cell.textLabel setTextColor:[UIColor colorWithRed:0.349 green:0.733 blue:0.733 alpha:1.000]];
[cell.textLabel setFont:[UIFont fontWithName:@"Helvetica" size:18]];
cell.textLabel.adjustsFontSizeToFitWidth = YES;
cell.textLabel.minimumScaleFactor = 0.5;
```

In the above code, we check the `completed` property of the todo object and if it is set to true, we create an attributed string of the `todo` objects `title` property with a strike-through and we set the `attributedText` property of the cell with the attributed string. If the `completed` property is false, we simply set the `text` property of the cell with the `title` property of the `todo` object.


Add the following code in the `tableView:commitEditingStyle:forRowAtIndexPath:` method.

```objectivec
if (editingStyle == UITableViewCellEditingStyleDelete) {
    [[self.todoItems objectAtIndex:indexPath.row] deleteObjectWithConnectingConnections];
    [self.todoItems removeObjectAtIndex:indexPath.row];
    [self.tableView deleteRowsAtIndexPaths:@[indexPath] withRowAnimation:UITableViewRowAnimationFade];
}
```

In the above code, we simply delete the `todo` APObject from the `todoList` array that the user deleted and we also delete the `todo` APObject form Appacitive by using the `-[APObject deleteObjectWithConnectingConnections]` method.


Add the following code to the `[tableView:didSelectRowAtIndexPath:]` method.

```objectivec
NSDictionary *strikeThroughAttributes = @{NSStrikethroughStyleAttributeName: [NSNumber numberWithInt:NSUnderlineStyleSingle],NSStrikethroughColorAttributeName: [UIColor colorWithRed:0.349 green:0.733 blue:0.733 alpha:1.000]};
NSDictionary *plainattributes = [[NSDictionary alloc] init];

if([[[self.todoItems objectAtIndex:indexPath.row] getPropertyWithKey:@"completed"] isEqualToString:@"true"])
{
    NSAttributedString *plainText = [[NSAttributedString alloc] initWithString:[[self.todoItems objectAtIndex:indexPath.row] getPropertyWithKey:@"title"] attributes:plainattributes];
    [self.tableView cellForRowAtIndexPath:indexPath].textLabel.attributedText = plainText;
    [[self.todoItems objectAtIndex:indexPath.row] updatePropertyWithKey:@"completed" value:@"false"];
    [[self.todoItems objectAtIndex:indexPath.row] updateObject];
} else {
    NSAttributedString *strikeThroughText = [[NSAttributedString alloc] initWithString:[[self.todoItems objectAtIndex:indexPath.row] getPropertyWithKey:@"title"] attributes:strikeThroughAttributes];
    [self.tableView cellForRowAtIndexPath:indexPath].textLabel.attributedText = strikeThroughText;
    [[self.todoItems objectAtIndex:indexPath.row] updatePropertyWithKey:@"completed" value:@"true"];
    [[self.todoItems objectAtIndex:indexPath.row] updateObject];
}
```

In the above code, we simply check the `completed` property of the `todo` APObject and if it is set to `true`, we update it to `false` and vice-versa and we make a strike-through label for completed item and a plain label for items that are not completed. We then call the `-[APObject updateObject]`  method to simply save the changes we just made to the completed status of the `todo` object.

That's it. Build and run the project and try creating your own todo list.


### Conclusion

You have created a fully functional Todo App using the Appacitive iOS SDK. In this Todo App we have explored the **CRUD** capability of two features ***Data Store*** and **Users** provided by Appacitive Core. You also learned how to **Authenticate** a user.


### What's next?
You can check out our other <a title="All Samples based on Appacitive iOS SDK" href="../">samples</a> to know more about iOS SDK and other features provided by Appacitive Platform. For complete API reference of iOS SDK go to our <a target="_blank" title="http://help.appacitive.com" href="http://help.appacitive.com/v1.0/#ios">help docs<span class="plxs glyphicon glyphicon-share-alt"></span></a>.