# Push Notifications

Push is a great way to send timely and relevant targeted messages to users of your app and enhance their overall experience and keep them informed of the latest developments on your app.
Appacitive allows you to send push notifications to your users in a variety of ways and targets android, ios and windows phone.

For detailed info around how platform specific push notifications work, you can check out their specific docs.

iOS       : https://developer.apple.com/notifications/

Android     : http://developer.android.com/google/gcm/index.html

Windows Phone : http://msdn.microsoft.com/en-us/library/hh221549.aspx

You will need to provide some basic one time configurations like certificates, using which we will setup push notification channels for different platforms for you. Also we provide a Push Console using which you can send push notification to the users.

## Configure App for Push Notification

Login to the Appacitive portal and from app list page select the app, you want to configure. Once inside, from the top navigation bar, go to Notification section and select General Settings.

Currently we support Push Notification for iOS, Android and Window, so to enable Push Notifications for the app, you will need to select either of the platforms for your app (if none of the platform is selected, app will guide you to the appropriate section, from where you can select the platform). On the Push Notification's setting page, first you will need to enable them, after that from the iOS section you can upload the certificate and set password for it (if any). For Android, you will need to provide the Sender Id, Sender Auth Token and the package name. That's it, update the app and your app is configured to send push notification.

## Sending Push Notifications

In Javascript SDK, static object `Appacitive.Push` provides 5 methods to send push notification.

Appacitive provides four ways to select the sender list

* Broadcast
* Platform specific Devices
* Specific List of Devices
* To List of Channels
* Query

First we'll see how to send a push notification and then we will discuss the above methods with their options one by one.

```javascript
var options = {..}; //Some options specific to senders
Appacitive.Push.send(options).then(function(notification) {
  alert('Push notification sent successfully');
});
```

### Broadcast

If you want to send a push notification to all active devices, you can use the following options

```javascript
var options = {
  "broadcast": true, // set this to true for broadcast
  "platformoptions": {
      // platform specific options
    "ios": {
      "sound": "test"
    },
    "android": {
      "title": "test title"
    }
  },
    "data": {
      // message to send
    "alert": "Push works!!!",
        // Increment existing badge by 1
    "badge": "+1",
        //Custom data field1 and field2
    "field1": "my custom value",
        "field2": "my custom value"
  },
  "expireafter": "100000" // Expiry in seconds
}
```

### Platform specific Devices

If you want to send push notifications to specific platforms, you can use this option. To do so you will need to provide the devicetype in the query.

```javascript
var options = {
  "query": "*devicetype == 'ios'",
  "broadcast": false, // set this to true for broadcast
  "platformoptions": {
      // platform specific options
    "ios": {
      "sound": "test"
    },
    "android": {
      "title": "test title"
    }
  },
    "data": {
      // message to send
    "alert": "Push works!!!",
        // Increment existing badge by 1
    "badge": "+1",
        //Custom data field1 and field2
    "field1": "my custom value",
        "field2": "my custom value"
  },
  "expireafter": "100000" // Expiry in seconds
}
```

### Specific List of Devices

If you want to send push notifications to specific devices, you can use this option. To do so you will need to provide the device ids.

```javascript
var options = {
  "deviceids": [
    "{deviceId}",
    "{deviceId2}",
    "{deviceId3}"
  ],
  "broadcast": false, // set this to true for broadcast
  "platformoptions": {
      // platform specific options
    "ios": {
      "sound": "test"
    },
    "android": {
      "title": "test title"
    }
  },
    "data": {
      // message to send
    "alert": "Push works!!!",
        // Increment existing badge by 1
    "badge": "+1",
        //Custom data field1 and field2
    "field1": "my custom value",
        "field2": "my custom value"
  },
  "expireafter": "100000" // Expiry in seconds
}
```

### To List of Channels

Device object has a Channel property, using which you can club multiple devices into a group. This is helpful if you want to send push notification using channel.

```javascript
var options = {
  "channels": [
    "{nameOfChannel}"
  ],
  "broadcast": false, // set this to true for broadcast
  "platformoptions": {
      // platform specific options
    "ios": {
      "sound": "test"
    },
    "android": {
      "title": "test title"
    }
  },
    "data": {
      // message to send
    "alert": "Push works!!!",
        // Increment existing badge by 1
    "badge": "+1",
        //Custom data field1 and field2
    "field1": "my custom value",
        "field2": "my custom value"
  },
  "expireafter": "100000" // Expiry in seconds
}
```

### Query Based Push

You can send push notifications to devices using a Query. All the devices which comes out as result of the query will receive the push notification.

```javascript
var options = {
  "query": "{{add your query here}}",
  "broadcast": false, // set this to true for broadcast
  "platformoptions": {
      // platform specific options
    "ios": {
      "sound": "test"
    },
    "android": {
      "title": "test title"
    }
  },
    "data": {
      // message to send
    "alert": "Push works!!!",
        // Increment existing badge by 1
    "badge": "+1",
        //Custom data field1 and field2
    "field1": "my custom value",
        "field2": "my custom value"
  },
  "expireafter": "100000" // Expiry in seconds
}
```

## Platform specific options

There is a list of specific push options which are different for different platforms.
Following are the options that we support.

### iOS options

As of now the extra option that iOS supports is the ability to specify a sound file which the device will play when it receives the notification.
This sound file should be shipped with the App.

```javascript
var options = 
{
  "broadcast":true,
  ..
  ..
  "platformoptions": {
     "ios": {
        "sound": "{name of sound file}"
      }
    }
}
```

### Android options

The option specific to the android platform is the "title" which the android user will see along with the message in case of a notification

```javascript
var options = 
{
  "broadcast":true,
  ..
  ..
  "platformoptions": {
     "android": {
              "title": "test title"
      }
    }
}
```

### Windows Options

Windows Phone supports three types of Push Notifications.

1. Toast
2. Raw
3. Tile

We shall discuss them below, one by one.

#### Toast

A toast displays at the top of the screen to notify users of an event, such as a news or weather alert. 
For more details on what each param exactly means you can check <a href='http://msdn.microsoft.com/en-us/library/windowsphone/develop/jj662938(v=vs.105).aspx' target="_blank">Toasts for Windows Phone <i class="glyphicon glyphicon-share-alt"></i></a>

Toast notification is supported by all windows phone.

```javascript
var options = {
  "broadcast" : true,
  ..
  ..
  "platformoptions": {
            "wp": {
                   "navigatepath": "",
                   "notificationtype": "toast",
                   "text1": "App text1",
                   "text2": "App text2"
            }
     }
}
```

#### Raw

Using Raw notification you can send any kind of data (represented in string format) to a windows phone device. This type of notification will be honored by phone only when the app is running.

Raw notification is supported by all windows phone.

```javascript
var options = {
  "broadcast" : true,
  ..
  ..
  "platformoptions": {
            "wp": {
                   "data": "",                   
                   "notificationtype": "raw"
            }
     }
}
```

#### Tiles

Windows Phone supports three types of Tile Notifications<br>

1. Flip (supported by all WP)<br>
2. Cyclic (supported by WP8 only)<br>
3. Iconic (supported by WP8 only)

The properties which supports clear field functionality have an appropriate comment against them. By sending clear field for a property, that property will be cleared on the device for example if "cleartitle":"true" is sent in notification, title of the tile will be cleared.

To know more about Tile notification and exact meaning of the parameters you can checkout
<a href='http://msdn.microsoft.com/en-us/library/windowsphone/develop/hh202948(v=vs.105).aspx' target="_blank">Windows Tiles Page <i class="glyphicon glyphicon-share-alt"></i></a>

<b>Flip</b>

The flip Tile template flips from front to back.

```javascript
var options=
{
  "broadcast":true,
  ..
  ..
  "platformoptions": {
          "wp": {
            "notificationtype": "tile",
            "tiletemplate": "flip",
            "title": "", /*supports clear field*/
            "backgroundimage": "", /*supports clear field*/
            "count": "", /*supports clear field*/
          /*following settings are for windows phone 7.5 and above */
            "smallbackgroundimage": "", /*supports clear field*/
            "widebackgroundimage": "",  /*supports clear field*/
            "backtitle": "",  /*supports clear field*/
            "backbackgroundimage": "",  /*supports clear field*/
            "widebackbackgroundimage": "",/*supports clear field*/
            "backcontent": "", /*supports clear field*/
            "widebackcontent": ""   /*supports clear field*/
        }
     }
}
```

<b>Cyclic (only wp8)</b>

The cycle Tile template cycles through between one and nine images.

```javascript
var options = 
{
  "broadcast":true,
  ..
  ..
  "platformoptions": {
      "wp": {
        "notificationtype": "tile",
        "tiletemplate": "cycle",
        "cycleimage1": "",  /*supports clear field*/
        "cycleimage2": "",  /*supports clear field*/
        "cycleimage3": "",  /*supports clear field*/
        "cycleimage4": "",  /*supports clear field*/
        "cycleimage5": "",  /*supports clear field*/
        "cycleimage6": "",  /*supports clear field*/
        "cycleimage7": "",  /*supports clear field*/
        "cycleimage8": "",  /*supports clear field*/
        "cycleimage9": "",  /*supports clear field*/               
    /*To send Flip Notification to WP7 and WP75 in same push message*/
        "wp7": {
            "tiletemplate": "flip",
            "title": "",  /*supports clear field*/
            "backgroundimage": "", /*supports clear field*/
            "count": "",  /*supports clear field*/
          },
        "wp75" : {
            "tiletemplate": "flip",
            "title": "",  /*supports clear field*/
            "backgroundimage": "", /*supports clear field*/
            "count": "", /*supports clear field*/
            "smallbackgroundimage": "", /*supports clear field*/
            "widebackgroundimage": "", /*supports clear field*/
            "backtitle": "", /*supports clear field*/
            "backbackgroundimage": "", /*supports clear field*/
            "widebackbackgroundimage": "", /*supports clear field*/
            "backcontent": "",  /*supports clear field*/
            "widebackcontent": ""  /*supports clear field*/
          } 
        }
     }

}
```

<b>Iconic (only wp8)</b>

The iconic template displays a small image in the center of the Tile, and incorporates Windows Phone design principles.

```javascript
var options=
{
  "broadcast":true,
  "platformoptions": {
      "wp": {
          "notificationtype": "tile",
          "tiletemplate": "iconic",
          "title": "",  /*supports clear field*/
          "iconimage": "",  /*supports clear field*/
          "smalliconimage": "",  /*supports clear field*/
          "backgroundcolor": "", /*supports clear field*/
          "widecontent1": "", /*supports clear field*/
          "widecontent2": "", /*supports clear field*/
          "widecontent3": "", /*supports clear field*/
          /*To send Flip Notification to WP7 and WP75 in same push message*/
          "wp7": {
                "tiletemplate": "flip",
                "title": "", /*supports clear field*/
                "backgroundimage": "", /*supports clear field*/
                "count": "", /*supports clear field*/
              },
          "wp75" : {
                "tiletemplate": "flip",
                "title": "",  /*supports clear field*/
                "backgroundimage": "",  /*supports clear field*/
                "count": "",  /*supports clear field*/
                "smallbackgroundimage": "", /*supports clear field*/
                "widebackgroundimage": "",  /*supports clear field*/
                "backtitle": "",   /*supports clear field*/
                "backbackgroundimage": "", /*supports clear field*/
                "widebackbackgroundimage": "", /*supports clear field*/
                "backcontent": "",  /*supports clear field*/
                "widebackcontent": ""  /*supports clear field*/
              } 
        }
     }
}
```