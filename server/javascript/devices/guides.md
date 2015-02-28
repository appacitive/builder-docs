# Devices

Appacitive provides you with a rich set of device management apis. A pre-created type called `device` is contained in every new application.
You should create a new object of this type every-time your app is installed on a new device. A device object has a device-type which could be `ios`, `android`, `wp7`, `wp75` or `wp8`.
Also, every device object has a unique device token. Additionally a device object could contain other properties like the ones mentioned in the next section or created by you. With this you are ready to control the push and device management aspect of your app with ease.

|Property|Required|Description|
|:---------------|:------------|
|devicetype|Y|Specifies the platform of device (ios,android,windows)|
|devicetoken|Y|Device-id which is given by the platform SDK and is used to identify it|
|channels|N|List of channels (groups) to add the device to|
|timezone|N|The timezone of the device|
|isactive|N|Whether the device is active. If false then it won't get any notification|
|location|N|The location (lat,long) of the device|

## Registering a device

You need to provide Appacitive with info about the device on which you might want to send push notifications later. This info minimally includes the device type (ios, android etc.) and device token.
More pre-defined properties are available in the device type for your benefit. You can also add any additional property(s) you might need in your application, just like creating properties in any other type.

```javascript
// Extend Appacitive object class to create Device class
var Device = Appacitive.Object.extend('device');

// Create Device instance
var device = new Device();

// Set devicetype and devicetoekn
device.set('devicetype', 'ios');
device.set('devicetoken', 'c6ae0529f4752a6a0d127900f9e7c');

// Call save to register device
device.save().then(function(obj) {
	alert('new device registered successfully!');
}, function(status, obj) {
	alert('error while registering!');
});
```
## Retrieve an existing device

The Appacitive platform supports retrieving single or multiple devices. All device object retrievals on the platform
are done purely on the basis of the id of the device object. You can also fine tune the exact list of fields that 
you want to be returned. This will allow for fine tuning the size of the message incase you are on a 
low bandwidth connection.

The different scenarios for device retrieval are detailed in the sections below.

### Retrieve a single device

Returns an existing device object from the system. To retrieve an existing device object, you will need to provide its system defined id.

```javascript
// extended object class to type device
var Device = Appacitive.Object.extend('device');
Device.get({ 
  id: '{{existing__id}}', //mandatory
  fields: ["name"] //optional
}).then(function(device) {
  // device obj is returned as argument to onsuccess
  alert('Fetched device with token: ' + device.get('devicetoken')); 
});

```

Retrieving can also be done via the `fetch` method. Here's an example
```javascript
//extend class
var Device = Appacitive.Object.extend('device');

// create a new object
var device = new Device(); //You can initialize object in this way too.

// set an (existing) id in the object
device.id = {{existing_id}});

// set fields to be returned in the object 
device.fields(["name"]);

// retrieve the device
device.fetch().then(function(obj) {
   // device obj is returned as argument to onsuccess
   alert('Fetched device with token: ' + device.get('devicetoken'));
});
```

**Note**:  You can mention exactly which all fields you want returned so as to reduce payload. By default all fields are returned. Fields `__id` and `__type` are the fields which will always be returned. Every create, save and fetch call will return only these fields, if they're specified in third argument to these calls.
```javascript
["name", "age", "__createby"] //will set fields to return __id, __type, name, age and __createdby
[] //will set fields to return only __id and __type
[*] //will set fields to return all user-defined properties and __id and __type
```

### Retrieve multiple devices 

Returns a list of existing device objects from the system. To get a list of device objects you 
must provide a list of device ids to retrieve devices for. Here's an example

```javascript
// extended class 
var Device = Appacitive.Object.extend('device');

Device.multiGet({ 
  ids: ["14696753262625025", "14696753262625026"], //array of device ids to get : mandatory
  fields: ["name"] // fields to be returned, to avoid increasing the payload : optional
}).then(function(devices) { 
  // device is an array of device objects
});
```

## Updating Device

Updating is also done via the `save` method. To illustrate: 
```javascript
// Extend Appacitive object class to create Device class
var Device = new Appacitive.Object('device');

// Create Device instance
var device = new Device();

// Set devicetype and devicetoekn
device.set('devicetype', 'ios');
device.set('devicetoken', 'c6ae0529f4752a6a0d127900f9e7c');

// Add channels to array property 
device.add('channels', ['group1', 'group2'])

// isNew determines that an object is created or not
// this'll be true for now
if (device.isNew()) console.log("Creating device");


// Call save to register device
device.save().then(function() {
	// device has been saved successfully
	// this will be false
	if (!device.isNew()) console.log("Updating device");

	// now lets update the device's name
	device.set('devicetoken', 'cghfhgf6556464nnvv');

	// add a new hobby
	device.add('channels', 'group3');

	// returns a promise
	return device.save();
}).then(function() {
	console.log(device.get('devicetype')); // ios
	console.log(device.get('channels')) // ['group1', 'group2', 'group3'];
	console.log(device.get('devicetoken')) // cghfhgf6556464nnvv'
}, function(err, obj) {
	if (device.isNew())  alert('create failed');
	else  alert('update failed');
});
```
As you might notice, update is done via the save method as well. The SDK combines the create operation and the update operation under the hood and provides a unified interface. This is done be detecting the presence of the property `__id` to decide whether the object has been created and needs updating or whether the object needs to be created. 
This also means that you should never delete/modify the `__id`/ id property on an entity.

Appacitive automatically figures out which data has changed so only "dirty" fields will be sent. Thus, you don't end up overriding data that you didn't intend to update.

## Deleting device

Deleting is provided via the `destroy` method . Lets say we've had enough of John Doe and want to remove him from the server, here's what we'd do.

```javascript
device.destroy().then(function(obj) {
  alert('Deleted successfully');
});

//You can also delete device with its connections in a simple call.
device.destroy(true).then(function(obj) {
  alert('Deleted successfully');
}); // setting the first argument to true will delete its connections if they exist
```

### Multidelete Devices

Multiple devices can also be deleted at a time. Here's an example

```javascript

var Device = Appacitive.Object.extend('device');

Device.multiDelete({   
	ids: ["14696753262625025", "14696753262625026"], //array of device ids to delete
}, function() { 
	//successfully deleted all device
}, function(err) {
	alert("code:" + err.code + "\nmessage:" + err.message);
});
```

### Searching for Devices

Device search works exactly the same as any object search. 

```javascript
//for type
var Player = Appacitive.Object.extend('player');

// Set filter
var filter = Appacitive.Filter.Property('devicetype').equalTo('ios');

// Create findall query
var query = Player.findAllQuery(
  fields: ["*"],      //optional: returns all device fields only
  filter: filter   //optional  
}); 

// Call fetch
query.fetch().then(function(devices) {
	console.log(devices.length + " found");
}, function(status) {
	console.log(status.message);
});
```

For more info on queries refer this <a href="/javascript/data-store/guides.html#queries">section</a>.
