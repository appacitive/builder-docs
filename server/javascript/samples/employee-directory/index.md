Employee Directory App allows you to look for employees by name, view the details of an employee, and navigate up and down the Org Chart by clicking the employee’s manager or any of his/her direct reports.

Appacitive <a href="http://github.com/chiragsanghvi/javascriptsdk" target="_blank">Javascript SDK <i class="glyphicon glyphicon-share-alt"></i></a> is built mostly in the way models and collections work in backbone.js, with changes to accomodate <a href="http://help.appacitive.com" target="_blank">Appacitive's API  convention<i class="glyphicon glyphicon-share-alt"></i></a>. Thus integrating SDK with backbone apps becomes more easy.

This tutorial demonstrates two features ***Data Store*** and ***Graph API*** provided by Appacitive Platform. As part of design best practice, you will learn how to model your app and bind your custom objects to the view.

### Dependencies

* Underscore
* jQuery
* Backbone
* Bootstrap

Above specified dependencies are specific to this app. SDK has no dependencies on any libraries. 

### Creating Todo List App from Scratch

Follow this guide to get hands on with this App.

### 1. Modeling app backend on Appacitive

Following video shows how to create the model for the app on Appacitive Platform.

<iframe src="//player.vimeo.com/video/89849527?byline=0&amp;portrait=0" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>

### 2. Importing Sample Data

<div class="muted">This is an optional step.</div>

Once the model is in place you can import some sample data in your app. All the information and images for the employees is taken from <a target="_blank" href="https://github.com/ccoenraets/directory-backbone-bootstrap">ccoenraets/directory-backbone-bootstrap<span class="plxs glyphicon glyphicon-share-alt"></span></a>.

**Retrieving API Key and Application Id**

You will require API Key and Application Id to import data, to get these details, open your app on Appacitive Portal. API key for the app is available on your app's home page at the bottom. To get the App Id, open application details view by clicking on edit icon near your app's name.

<a id="aImportTool" data-js="employee-import" class="btn btn-state btn-primary" href="javascript:void('0')">Launch Import Tool</a>

### 2. Downloading app

The app itself has no dependency on a specific back end. Thus you can **download and run** the app without having to set up a server and a database.

You can download the app <a title="Download boilerplate" href="https://github.com/chiragsanghvi/employee-directory/archive/boilerplate.zip">here <i class="glyphicon glyphicon-download-alt"></i></a>.

<pre style="padding:10px;">
Because the templates of this application are loaded using XMLHTTPRequest, you will get a cross domain error (Access-Control-Allow-Origin) if you load index.html from the file system (with the file:// protocol). Make sure you load the application from a web server. For example: http://localhost:8000.
</pre>

For MAC OS you can simply use [Anvil](http://anvilformac.com/). 

For others, just install [nodejs](http://nodejs.org) and then run this command in your app's directory

```javascript
node server.js 8000
```

### 3. Using Javascript SDK

The data layer is architected with simple and pluggable data adapters. By default the application uses an in-memory data store, but it can be switched to use Appacitive data adapter.

#### 3.1 Include SDK

To change the data layer, just comment out `model-in-memory.js` script, and uncomment the `appacitive-js-sdk-v0.9.6.5.min.js` and `model-appacitive-com.js` scripts  in `index.html`.

```html
<!-- SELECT ONE (AND ONLY ONE) OF THE DATA LAYER SOLUTIONS BELOW -->

<!-- Uncomment the script below to access the application data using an in-memory data store -->
<!--<script src="js/models/model-in-memory.js"></script>-->

<!-- Uncomment the two scripts below to use Appacitive.com as the data persistence layer. -->
<script src="http://cdn.appacitive.com/sdk/js/appacitive-js-sdk-v0.9.6.5.min.js" type="text/javascript"></script>
<script src="js/models/model-appacitive-com.js"></script>
```

#### 3.2 Initialize SDK

Replace `{{API Key}}` with your Api Key and `{{App Id}}` with your App Id in `model-appacitive-com.js`.

```javscript
Appacitive.initialize({ 
  apikey: "{{API Key}}", 
  env: "sandbox", 
  appId: "{{App Id}}"
});
```

**Note**: We suggest using the client key as API key to maintain security and controlled access on your data.

### 3.3 App Structure

Employee Directory is a single page application: *index.html* is essentially empty. Views are injected into and removed from the DOM as needed. Even though it is a single page application, the Backbone.js Router makes it easy to keep the different states of the app *bookmarkable* and *deep-linkable*.

All Appacitive related models and collections are present in `model-appacitive-com.js`. We use the concept of relationships in this tutorial

* <b>One-to-Many association</b>. A one-to-many (Manager-to-Employees) association is defined in the `Employee` model as a collection of employees (the direct reports). The initialize functions sets `reports` property in the employee model with a new instance of `Reports Collection`. That collection is populated with reporting employees from the result of `Graph API` query, which is called by employee objects `fetchDetails` method.

```javascript
// To initialize reports collection
// And override default fetch function
// To call fetchDetails
initialize: function() {
    this.reports = new directory.ReportsCollection();

    //override fetch method 
    this.fetch = this.fetchAllDetails;
}
```

The `Employee` model is mapped to employee type in our Appacitive app. It overrides its default fetch function to call `fetchDetails`. This function uses graph API to fetch details for that employee. In addition, it also populates the `reports` collection with employees who report to that employee and sets the `managerid` and `managername` with the details of the `manager` employee to whom this employee reports.

```javascript
// Use projection query to fetch employee details for this employee
// Returns all employees who report to this employee as well as to whom this employee reports
fetchAllDetails: function(options) {
    var self = this;

    // Create grpah projection query by pass employee id
    var query = new Appacitive.Queries.GraphProjectQuery('manages', [this.id]);
    
    // Create a promise
    var promise = Appacitive.Promise.buildPromise(options);
    
    // Call fetch
    query.fetch().then(function(employees) {

        // As we've overrided fetch function we'll need to copy 
        // employee attributes in existing object
        self.copy(employees[0].toJSON(), true);
        
        // Contains all employees who're connected to this employee by manages relationship
        self.children = employees[0].children;

        
        // reports contains employees with label `employee` in relation
        // Basically reports contains all employees who report directly to this employee
        var reports = self.children.reports;

        // managedBy contains employees with label `manager` in relation
        // Basically managedBy contains employee to whom this employee directly reports
        var managedBy = self.children.managedby;
        
        // If this employee is managed by any other employye 
        // Then we set managerid and managername property in this employee
        if (managedBy.length > 0) {
            self.set('managerid', managedBy[0].id);
            self.set('managername', managedBy[0].name());
        }

        // Add reports to reports collection of this object
        self.reports.add(reports);

        // Fulfill the promise
        promise.fulfill.apply(promise, [self, reports]);
    }, function() {
        // Reject the promise
        promise.reject.apply(promise, arguments);
    });

    // Return promise
    return promise;
}
```

The `EmployeeCollection` is the collection of all employees. It overrides the default fetch function of the collection, to add or remove filters ( to filter stuff on basis of firstname or lastname or nothing) to the query before making fetch call. By default the query property in `Appacitive.Collection` is initialized with a `FindAll` query for that model. In our case the model is employee.

```javascript
// Employee Collection
// ---------------

// The collection of employees is backed by *Appacitive*
directory.EmployeeCollection = Appacitive.Collection.extend(({

    // Reference to this collection's model.
    model: directory.Employee,

    // Override base fetch function to set filters in query when called
    fetch: function(options) {
        console.log('custom fetch');
        // If options contain name then only define filters else set filter as empty
        if (options.data && options.data.name) {
            // Filter on firstname
            var firstNameFilter = Appacitive.Filter.Property('firstname').match(options.data.name);
            
            // Filter on firstname
            var lastNameFilter = Appacitive.Filter.Property('lastname').match(options.data.name);
            
            // Combine both the filters by Oring them
            var filter = Appacitive.Filter.Or(firstNameFilter, lastNameFilter);

            // Set filter for this collection 
            this.query().filter(filter);
        } else {
            // Set empty filter
            this.query().filter('');
        }

        // Call base fetch function with all arguments
        Appacitive.Collection.prototype.fetch.apply(this, arguments);
    }

}));
```

The `ReportsCollection` overrides the default fetch function of the collection, as projection query from employee fetches and adds employees to this collection. Thus it returns a fulfilled promise in fetch call.

```javascript
// ReportsCollection Collection
// ---------------

// The collection of employees who report to another employee
directory.ReportsCollection = Appacitive.Collection.extend(({

    // Reference to this collection's model.
    model: directory.Employee,

    // Override fetch function to avoid making any API calls
    // As projection query from employee fetches and adds employees to this collection
    fetch: function(options) {
        var promise = Appacitive.Promise.buildPromise(options);
        var self = this;
        setTimeout(function() {
            promise.fulfill(self.models);
        }, 0);
        return promise;
    }

}));
```

Following video explains Graph API in more detail.

<iframe src="//player.vimeo.com/video/89849527?byline=0&amp;portrait=0" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>

### Congratulation

You have created a fully functional Employee Directory App using .Net SDK backed by Appacitive Platform. In this App we have explored two features ***Data Store*** and ***Graph API*** feature provided by Appacitive Core.

### What's next?
You can check out our other <a title="All Samples based on Appacitive Javascript SDK" href="../">samples</a> to know more about Javscript SDK and other features provided by Appacitive Platform. For complete API reference of Javascript SDK go to our <a target="_blank" title="http://help.appacitive.com" href="http://help.appacitive.com/v1.0/#javascript">help docs<span class="plxs glyphicon glyphicon-share-alt"></span></a>.
