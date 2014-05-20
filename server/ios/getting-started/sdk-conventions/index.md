SDK Conventions
------

The Appacitive iOS SDK contains a base class called APObject from which other classes derive data and methods. Other classes extending from APObject are APConnection, APUser and APDevice. All of these classes are extensible. 

Whenever you need to interact with your model in Appacitive, you will typically need to initialise one or more of these classes and call the selectors to perform the defined actions. These methods make a network request to Appacitive in background that will perform the actual desired action on your data model in Appacitive. Most of these selectors/methods accept blocks as parameters which would basically be of two types, success block which gets executed when the operation is successful and failure block which gets executed when the operation results in a failure.

There are 4 main operations that these methods help you to perform on your model viz. Create, Update, Fetch and Delete. One additional method is the search method that helps you find all objects of a specific type. 

Some search methods accept a query as a parameter. This parameter is of APQuery type, so you instantiate an APQuery object by constructing your desired Query and pass it to the query parameter of your search method to search all objects based on the query. These queries are quite similar to the SQL queries. More on how to use the APQuery class to query your data on Appacitive can be hound [here]().

In order to maintain the extensibility of the classes, the **APObject** and **APConnection** classes have a counterpart with a plural name viz. the **APObjects** and **APConnections** classes. The singularly named classes contain all the methods that will apply to any class that inherits from it and the plurally named classes contain mostly class methods that wouldn't apply to its subclasses. So if you ever find a need to extend the classes for your custom objects, always remember to only subclass the singularly named classes.