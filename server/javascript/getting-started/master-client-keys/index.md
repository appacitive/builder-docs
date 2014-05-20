## Master and Client Keys

Every request to your app backend, made by the sdk, is associated with a security context. Appacitive uses this context to determine the access permissions.

There are 2 types of keys generated when you create an app, that you'll encounter while developing your Appacitive application:

* `Client Key`: This key should be used in consumer clients, like the javascript SDK. It is constrained by <a href="../../access-control" target="_blank"> Object Level ACL's </a> . The client keys are subject to the currently logged in user. If someone copies and uses your JavaScript Client Key, they will only be able to read and write to objects that have global read and write permissions.

* `Master Key`: The only key that grants complete access to your data without <a href="../../access-control" target="_blank"> Object Level ACL's  </a> is the Master Key. This key should be kept safe and out of reach of a third party. This is equivalent to admin level access and should be kept secret.

One of the primary concerns that people have with making a JavaScript based app that utilizes Appacitve is security. Having critical api-keys live within public-facing files seems like a really bad idea. 

However, with the introduction of the <a href="../../access-control" target="_blank">Appacitive ACL's <i class="glyphicon glyphicon-share-alt"></i> </a>, this security issue has been dealt with. For those who are/were uninformed about ACL’s here’s the quick description from Wikipedia:

<div class="block-notice">
    <i class="glyphicon glyphicon-info-sign"></i> An access control list (ACL), with respect to a computer file system, is a list of <a href="http://en.wikipedia.org/wiki/File_system_permissions">permissions</a> attached to an <a href="http://en.wikipedia.org/wiki/Computer_file">object</a>. An ACL specifies which users or system processes are granted access to objects, as well as what operations are allowed on given objects. Each entry in a typical ACL specifies a subject and an operation. For instance, if a file has an ACL that contains (Alice, delete), this would give Alice permission to delete the file.
</div>

You can use Object-Level ACL's to limit read and/or write access to specific users. By doing so, someone who uses your Client Key will also need to authenticate as a user of your app in order to read and/or write to these objects. 

Having the Client Key is not enough in this case, and this is why it is safe to expose your JavaScript Client Key in your source code.

To import data from a legacy data source, use the master apikey and set the ACL such that it preserves data ownership and access level.
