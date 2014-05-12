# Files

Appacitive allows you to upload, download and distribute media files like images, videos etc. on the appacitive platform so you can build rich applications and deliver media using an extensive CDN. 
The appacitive files api works by providing you `pre-signed` urls to a third-party cloud storage service <a href="http://aws.amazon.com/s3/" target="_blank">Amazon S3 <i class="glyphicon glyphicon-share-alt"></i></a> , where the files can be uploaded to or downloaded from.
You can upload and download files of any size and most filetypes are supported. 

## Creating Appacitive.File Object

To construct an instance of `Appacitive.File` class, you must know the content type (mimeType) of the file because this is a required parameter. Optionally you can provide name/id of the file by which it will be saved on the server.

These are the options you need to initialize a file object
```javascript
var options = {
    fileId: //  a unique string representing the filename on server,
    contentType: // Mimetype of file,
    fileData: // data to be uploaded, this could be bytes or HTML5 fileupload instance data
};
```
If you don't provide fileId, then Appacitive assigns it a unique system generated value.

If you don't provide contentType, then the SDK will try to get the MimeType from the HTML5 fileData object or it'll set it as 'text/plain'.

To upload a file, the SDK provides three ways.

### Byte Stream

If you have a byte stream, you can use the following interface to upload data.
```javascript
var bytes = [ 0xAB, 0xDE, 0xCA, 0xAC, 0XAE ];

//create file object
var file = new Appacitive.File({
    fileId: 'serverFile.png',
    fileData: bytes,
    contentType: 'image/png'
});
```

### HTML5 File Object

If you've a fileupload control in your HTML5 app which allows the user to pick a file from their local drive to upload, you can simply create the object as
```javascript
//consider this as your fileupload control
<input type="file" id="imgUpload">

//in a handler or in a function you could get a reference to it, if you've selected a file
var fileData = $('#imgUpload')[0].files[0];

//create file object
var file = new Appacitive.File({
  fileId: fileData.name,
    fileData: fileData
});
```
Here, we gave the fileId as the name of the original file. There're three things to be noted :

1. If you don't provide a fileId, a unique id for the file is generated and saved by the server.

2. If you provide a fileId which already exists on the server, then on saving, this new file will replace the old file.

3. If you don't provide contentType, then the SDK will infer it from the fileData object or set it as text/plain.

### Node.js Upload

If anyone's curious about how to upload a file to Appacitive using `Node.js`, you can create an `Appacitive.File` object from a file on disk as follows:

```javascript
var fileId = "sample.png";
var fileData = require('fs').readFileSync('./sample.png');

//create file object
var file = new Appacitive.File({
	fileId: fileId,
    fileData: fileData,
    contentType: 'image/png'
});
```

## Uploading

Once you're done creating `Appacitive.File` object, simply call save to save it on the server.
```javascript
// save it on server
file.save().then(function(url) {
  alert('Download url is ' + url);
});
```

After save, the onSuccess callback gets a url in response which can be saved in your object and is also reflected in the file object. This url is basically a download url which you could use to render it in your DOM.

```javascript
//file object after upload
{
  fileId: 'test.png',
  contentType: 'image/png',
  url: '{{some url}}'
}

//if you don't provide fileId while upload, then you'll get a unique fileId set in you file object
{
  fileId: '3212jgfjs93798',
  contentType: 'image/png',
  url: '{{some url}}'
}
```

This url only allows you to perform a GET on the file and is public by default. If you want to set an expiry time on the url, then send the expiry time in minutes as first parameter while saving the file. 

```javascript
// Set 30 minutes expiry time for downloadable url
file.save(30);
```

## Custom Upload

If you want to upload a file without using SDK, you can get an upload URL by calling its instance method `getUploadUrl`, and simply upload your file onto this url.
```javascript
file.getUploadUrl().then(function(url) {
   //alert("Upload url:" + url);
});
```

**Note** : The `contentType` parameter that you set in file object, should match the `content-type` http header value when you're uploading the file onto amazon s3 in the subsequent call.

## Update a file

You can update a previously uploaded file for your app by creating an Appacitive.File object with it's unique file name and re-uploading another file in its place.

## Downloading

Using the method `getDownloadUrl` in file object you can download a file which was uploaded to the Appacitive system.

To construct the instance of `Appacitive.File`, you will need to provide the `fileId` of the file, which was returned by the system or set by you when you uploaded the file.
```javascript
//create file object
var file = new Appacitive.File({
  fileId: "test.png"
});

// call to get download url
file.getDownloadUrl().then(function(url) {
    alert("Download url:" + url);
    $("#imgUpload").attr('src',file.url);
});
```

This url only allows you to perform a GET on the file and is public by default. If you want to set an expiry time on the url, then send the expiry time in minutes as first parameter while retreiving the download url. 

```javascript
//Set expiry to 30 minutes
var expiry = 30;

// call to get donwload url
file.getDownloadUrl(expiry).then(function(url) {
    alert("Download url:" + url);
    $("#imgUpload").attr('src',file.url);
});
```

## Delete a file

This deletes a previously uploaded file from appacitive.

```javascript
//create file object
var file = new Appacitive.File({
  fileId: "test.png"
});

//call destroy method on file
file.destroy().then(function() {
	console.log("File deleted successfully");
});
```
