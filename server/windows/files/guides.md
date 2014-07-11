# Files

Appacitive supports file storage and provides api's for you to easily upload and download file. In the background we use amazon's S3 services for persistance. All file upload and download operations in the SDK are handled by the `FileUpload` and `FileDownload` classes respectively.

All file operations need a file name. This name can be supplied on upload by the user or can be auto generated to be unique by the api. Some important things to note about the file name are -

1. It is not mandatory.
2. It does not have to be the same is the name of the file being uploaded.
3. Incase it is not supplied, it will be auto generated and returned in the response.
4. It is the only handle to download the file, so do not lose it.


## Uploading a new File

To upload a new file, create a new instance of the `FileUpload` class with the mime type and optional filename. 
If you do not supply a file name, an auto generated name will be returned in the response.

```csharp
// To upload an png image with filename testimage.png
var mimeType = "image/png";
var filePath = ...              // Path to the file
var userSpecifiedFileName = "testimage.png";
// filenameOnServer will be testimage.png.
var fileNameOnServer = await new FileUpload(mimeType, userSpecifiedFileName).UploadFileAsync(filePath);



// To upload an png image without specifying a filename
var mimeType = "image/png";
var filePath = ...              // Path to the file
// filenameOnServer will be auto generated
var fileNameOnServer = await new FileUpload(mimeType).UploadFileAsync(filePath);


// To upload an png image as a byte array
var mimeType = "image/png";
byte[] data = ...                               // PNG file data
var filePath = ...                              // Path to the file
// filenameOnServer will be auto generated
var fileNameOnServer = await new FileUpload(mimeType).UploadAsync(data);
```

## Generate url to upload file to

Incase you want to handle the file upload yourself via some custom control or code, you can generate an upload url which will be available for a limited time period to which you can upload the file. The life time of the upload url can be specified in the api call.

The following code snippet shows how this can be done.

```csharp
// Say you want the upload url to upload a PNG image.
var mimeType = "image/png";
int expiryInMinutes = 10;               // Upload url will remain active for next 10 mins
var fileUrl = await new FileUpload(mimeType).GetUploadUrlAsync(expiryInMinutes);

var nameOnServer = fileUrl.FileName;    // This will be the filename on the server (auto generated in this case)
var urlToUpload = fileUrl.Url;          // This will be the url to upload to.
```

## Download an existing file

To download an existing file from the platform, you need the filename of the file returned from the Upload api. With this filename you can download the file using the `FileDownload` class.

```csharp
// To download a file and save to disk
var filename = ...;         // File name of the file to download.
var saveAsFilePath = ...;   // Path to save the downloaded file.
// The file will be downloaded and saved to the saveAs path specified.
await new FileDownload(filename).DownloadFileAsync(saveAsFilePath);


// To download file contents as byte array
var filename = ...;         // File name of the file to download.
var saveAsFilePath = ...;   // Path to save the downloaded file.
// The file will be downloaded and saved to the saveAs path specified.
byte[] contents = await new FileDownload(filename).DownloadAsync();
```

## Generate a public url for an existing file.

All files uploaded to the Appacitive platform are private by default and cannot be accessed via a http GET to a url alone. You can generate a permanent public url for your file or a limited time public url for your file. To generate a permanently public url for a file, use the `FileDownload.GetPublicUrlAsync()` api. To generate a limited time public url for your file, use the `FileDownload.GetDownloadUrlAsync` method.

NOTE: One important thing to note is that generating a permanently public url for a file marks the file as public. Such files cannot be used to generate limited time public urls any more.

```csharp
// To generate a limited time (10 mins) public url for a file
var filename = ...;                         // File name of the file to download.
var expiryInMinutes = 10;                   // Public url that will be active for next 10 mins

// Get limited time public url
string limitedTimePublicUrl = await new FileDownload(filename).GetDownloadUrlAsync(expiryInMinutes);

// Get permanently public url
string permanentPublicUrl = await new FileDownload(filename).GetPublicUrlAsync();
```
