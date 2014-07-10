# Files
----

Appacitive supports file storage and provides api's for you to easily upload and download files. In the background we use amazon's S3 services for persistence. To upload or download files, the SDK provides `APFile` class, which you can instantiate to perform operations on file.

## Uploading

You can download file directly.

```objectivec
[APFile uploadFileWithName:@"BannerImage" data:[NSData dataWithContentsOfFile:@"BannerImage.png"] urlExpiresAfter:@10 contentType:@"image/png"];
```

If you wish to manage the upload process on your own, you can just fetch the upload URL.

```objectivec
[APFile getUploadURLForFileWithName:@"bannerImage.png" urlExpiresAfter:@10 contentType:@"image/png" successHandler:^(NSURL *url) {
            NSLog(@"URL:%@",url);
    }];
```

## Downloading

```objectivec

[APFile downloadFileWithName:@"BannerImage" urlExpiresAfter:@10 successHandler:^(NSData *data) {
    UIImage *bannerImage = [UIImage imageWithData:data];
}];
```

If you wish to manage the download process on your own, you can just fetch the download URL.

```objectivec
[APFile getDownloadURLForFileWithName:@"bannerImage.png" urlExpiresAfter:@10 successHandler:^(NSURL *url) {
	NSLog(@"URL:%@",url);
    }];
```
