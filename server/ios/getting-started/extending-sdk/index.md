## Extending SDK
----

The Appacitive iOS SDK has four main classes that correspond to the respective entities in Appacitive.

| SDK Class    | Appacitive entity |
|--------------|-------------------|
| APOBject     | Type              |
| APUser       | User              |
| APDevice     | Device            |
| APConnection | Relation          |

In Appacitive, Type is the base entity. User, Device and Relation derive(extend) from type.

The SDK follows a similar approach. APObject is the base class. APUser, APDevice and APConnection derive from APObject.

You can directly instantiate objects of the above mentioned classes for your objects defined in Appacitive. These classes will take care of populating all the Appacitive's pre-defined properties in to individual objective-C properties. The custom properties will be stored in an array property called *_properties* in a key value form. 

If you wish to have an objective-C property for every property you added in Appacitive, you can extend the APObject class.

Classes in the SDK that you would typically extend are:

* APObject
* APUser
* APDevice
* APConnection

In order to extend any of the above classes, you will need to conform to the **APObjectPropertyMapping** protocol. The protocol has just one requierd method that you need to implement in order to extend any of the above classesThe method is  `setPropertyValuesFromDictionary:dictionary`. This method accepts an NSDictionary as an argument.

The goal of this method is to provide a mapping of appactive data to the respective objects and properties of your class.

You pass the dictionary of response that you get from a call to Appacitive to this method. In the implementation, parse the response dictionary and store the data from the response into the respective objects and properties of you class.

Extending other SDK classes is not currently supported and you should do it at your own risk.