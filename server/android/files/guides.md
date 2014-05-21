# Files

Appacitive supports file storage and provides API's for you to easily upload and download files like images, videos etc. from your app. In the background we use Amazon's S3 services for persistence. All file upload and download operations in the SDK are handled by the `AppacitiveFile` class.

Some important things to note about the filename are -

- It is not mandatory.
- It does not have to be the same as the name of the file being uploaded.
- In case it is not supplied, it will be auto-generated and returned in the response.
- It is the only handle to download the file, so do not lose it.

## Uploading a file

To upload a new file, you first generate a pre-signed URL from Appacitive by calling the `AppacitiveFile.getUploadUrlInBackground()` method 
This method takes as parameters the *mime-type* of the file to be uploaded, an optional unique *filename*, *expiration* of the URL (in minutes) and a *callback* to handle the actual uploading of the file.

```
        String mimeType = "image/png";
        String fileName = "selfie.png";
        int duration = 10;

        AppacitiveFile.getUploadUrlInBackground(mimeType, fileName, duration, new Callback<FileUploadUrlResponse>() {
            @Override
            public void success(FileUploadUrlResponse result) {
                String fileId = result.fileId;
                String url = result.url;              
            }
        });
```

Now upload the file by making a `PUT` request to the URL in the response above. The necessary authorization information is already embedded in the URL. For more details, refer to [Amazon S3 documentation](http://aws.amazon.com/documentation/s3/). This URL is valid for 5 minutes if `expiration` was not specified while retrieving the URL and only allows you to perform a PUT on the URL. You need to provide the same value for the `Content-Type` HTTP header, which you provided while retrieving the URL, and if not provided, use ‘*application/octet-stream*’ or ‘*binary/octet-stream*’. You send the media file in the payload object of the PUT call.

Store the *filename* safely as a property in some custom type, as this will be the handle to download the file.

You will be able to see your uploaded file in the *file browser* in the management portal. Go to *modules*->*data & storage*->*files*.

![](http://cdn.appacitive.com/devcenter/android/files-1.png)

## Downloading the file

To download an existing file from the platform, you need its unique *filename* returned from the Upload API in the previous section.

Generate a *pre-signed download URL* for the file by calling the `AppacitiveFile.getDownloadUrlInBackground()`. This method takes as parameters the unique *filename*, the *expiraion* (in minutes) of this download URL, and a *callback* to handle the actual downloading of the file.

```
        int expiration = 10;
        AppacitiveFile.getDownloadUrlInBackground("selfie.png", expiration, new Callback<String>() {
            @Override
            public void success(String result) {
                String downloadUrl = result;                
            }
        });
```

Now you can easily download your file by making a GET request to this URL. 

**Note:** To generate a permanent URL for downloading a file, send the `expiration` as `-1`. One important thing to note is that generating a permanent URL for a file, marks the file as public. Such files cannot be used to generate limited time URLs any more.