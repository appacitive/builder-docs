﻿
<h1><span class="glyphicon glyphicon-download-alt"></span> Javascript SDK Downloads</h1>
<span class="muted mbm">Version 1.0.10 - Jun 22, 2016</span>
<div> 
	<a class="btn btn-info pll prm" href="http://cdn.appacitive.com/sdk/js/appacitive-js-sdk-v1.0.10.min.js"><i class="glyphicon glyphicon-download-alt"></i>    Download Production</a>
	<a class="btn btn-info mll pll prm" href="http://cdn.appacitive.com/sdk/js/appacitive-js-sdk-v1.0.10.js"><i class="glyphicon glyphicon-download-alt"></i>    Download Development</a>
</div>
<br/>

<div>
To fast track your development, we have created blank projects of different project types. These blank projects have Javascript SDK included with all it's other dependencies. After downloading these projects you can switch over to our [Getting Started](../getting-started) guide.
<br/>
<br/>
<a title="Download blank Javascript/HTML5 project" class="btn btn-success pll" href="http://cdn.appacitive.com/devcenter/javascript/js_appacitive_empty_project_v1.0.10.zip"><i class="glyphicon glyphicon-download-alt"></i>    Download blank Javascript/HTML5 project</a>
</div>
<br/>


<h1><span class="glyphicon glyphicon-time"></span> SDK Changelog</h1>

## v1.0.10
<span class="muted">Jun 22, 2016</span>
+ Fixed a typo in BaseObject Class.
+ Exposed updatePassword function on User class instead just for currentUser.
<br/>

## v1.0.8
<span class="muted">Jan 16, 2016</span>
+ Fixed issue with undeclared functions and usage in BaseObject Class.
<br/>

## v1.0.7
<span class="muted">Dec 29, 2015</span>
+ Optimized baseobject class functions to use extend instead of prototype.
<br/>


## v1.0.6
<span class="muted">Oct 21, 2015</span>

+ Changed versioning to match it to node package version.
+ Changed facebook-node npm package to use facebook-node-withfetch for react-native support.
+ Made SDK react-native compatible.
+ Added support for GraphQuery to return objects, with pagination and sorting.
+ Made changes in Queries to support multiple fields to sort on.
+ Added containedIn, notIn, isNull and notNull support for attribute filters.
+ Added promise support for Appacitive.Initialize.
+ Fixed an issue with UTC date parsing.
<br/>

## v0.9.8.1
<span class="muted">May 04, 2015</span>

+ Changes in FB Login utility method to start adding email permission in scope.
+ Some fixes regarding containedIn and notIn filter implementation.
+ Fixed an issue with unsetting property values.

<br/>

## v0.9.8.0
<span class="muted">April 28, 2015</span>

+ Includes support for setting user properties while registering/login with Facebook and Twitter.
+ Includes support for 2 new filters: isNotNull and notIn.
+ Includes support for async flag ( Send `async:true` in options object ).
+ Changes in setting global context for process/window.
+ Some fixes regarding XDomainRequest Domain, UserAgent issue for MSIE9.
+ Fixed an issue with error handling while chaining promises.

<br/>

## v0.9.7.9
<span class="muted">March 27, 2015</span>

+ Includes support for batch API Delete.
+ Includes support for 2 new filters: isNull and containedIn.
+ Custom reset password link and template name support added.
+ Prev and next functions added for Collections.
+ Some fixes regarding Date and Datatype parsing.
+ Changes in remove of Multivalued property.
+ Some fixes regarding HTTP, Arrays, ACL and UserToken handling.

<br/>

## v0.9.7.8
<span class="muted">Dec 27, 2014</span>

+ Includes support for batch API.
+ Some fixes regarding scoping and HTTP content-type

<br/>

## v0.9.7.7
<span class="muted">Aug 23, 2014</span>

+ Includes support for recursively retrieving an object if it contains any children.
+ Referred Appacitive.Query to start pointing to Appacitive.Queries.FindAllQuery.
+ Made setting query in collection implicit if not provided.

<br/>

## v0.9.7.4 Beta
<span class="muted">July 17, 2014</span>

+ Includes support for ACL's.

<br/>
## v0.9.7.3 Beta
<span class="muted">May 22, 2014</span>

+ Includes support for Logging API calls.
+ Includes support for User Groups and ACLs.
+ Includes support for Push notifications.
+ Includes support for Graph Query and Graph API.
+ Includes support for Emails.
+ Includes support for Objects, Users and Connections.
+ Beta release of Appacitive Javascript SDK.

<br/>

<h1><span class="glyphicon glyphicon-cloud-download"></span> Download Older Versions</h1>
Always use the latest version of the SDK, it will be most reliable and compatible with Appacitive API.


<table style="max-width: 680px;">
	<thead>
		<tr>
			<th align="left">Version</th>
			<th align="left">Download</th>
			<th>Github</th>
			<th>Date</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td align="left">1.0.10</td>
			<td align="left"><a href="http://cdn.appacitive.com/sdk/js/appacitive-js-sdk-v1.0.10.min.js">Production</a>&nbsp;&nbsp;|&nbsp;&nbsp; <a href="http://cdn.appacitive.com/sdk/js/appacitive-js-sdk-v1.0.10.js">Development</a></td>
			<td><a href="https://github.com/chiragsanghvi/JavascriptSDK/tree/master">Github</a></td>
			<td>Jun 2, 2016</td>
		</tr>
		<tr>
			<td align="left">1.0.8</td>
			<td align="left"><a href="http://cdn.appacitive.com/sdk/js/appacitive-js-sdk-v1.0.8.min.js">Production</a>&nbsp;&nbsp;|&nbsp;&nbsp; <a href="http://cdn.appacitive.com/sdk/js/appacitive-js-sdk-v1.0.8.js">Development</a></td>
			<td><a href="https://github.com/chiragsanghvi/JavascriptSDK/tree/v1.0.8">Github</a></td>
			<td>Jan 16, 2016</td>
		</tr>
		<tr>
			<td align="left">1.0.7</td>
			<td align="left"><a href="http://cdn.appacitive.com/sdk/js/appacitive-js-sdk-v1.0.7.min.js">Production</a>&nbsp;&nbsp;|&nbsp;&nbsp; <a href="http://cdn.appacitive.com/sdk/js/appacitive-js-sdk-v1.0.7.js">Development</a></td>
			<td><a href="https://github.com/chiragsanghvi/JavascriptSDK/tree/v1.0.7">Github</a></td>
			<td>Dec 29, 2015</td>
		</tr>
		<tr>
			<td align="left">1.0.6</td>
			<td align="left"><a href="http://cdn.appacitive.com/sdk/js/appacitive-js-sdk-v1.0.6.min.js">Production</a>&nbsp;&nbsp;|&nbsp;&nbsp; <a href="http://cdn.appacitive.com/sdk/js/appacitive-js-sdk-v1.0.6.js">Development</a></td>
			<td><a href="https://github.com/chiragsanghvi/JavascriptSDK/tree/v1.0.6">Github</a></td>
			<td>Oct 21, 2015</td>
		</tr>
		<tr>
			<td align="left">0.9.8.1</td>
			<td align="left"><a href="http://cdn.appacitive.com/sdk/js/appacitive-js-sdk-v0.9.8.1.min.js">Production</a>&nbsp;&nbsp;|&nbsp;&nbsp; <a href="http://cdn.appacitive.com/sdk/js/appacitive-js-sdk-v0.9.8.1.js">Development</a></td>
			<td><a href="https://github.com/chiragsanghvi/JavascriptSDK/tree/v0.9.8.1">Github</a></td>
			<td>May 04, 2015</td>
		</tr>
		<tr>
			<td align="left">0.9.8.0</td>
			<td align="left"><a href="http://cdn.appacitive.com/sdk/js/appacitive-js-sdk-v0.9.8.0.min.js">Production</a>&nbsp;&nbsp;|&nbsp;&nbsp; <a href="http://cdn.appacitive.com/sdk/js/appacitive-js-sdk-v0.9.8.0.js">Development</a></td>
			<td><a href="https://github.com/chiragsanghvi/JavascriptSDK/tree/v0.9.8.0">Github</a></td>
			<td>April 28, 2015</td>
		</tr>
		<tr>
			<td align="left">0.9.7.9</td>
			<td align="left"><a href="http://cdn.appacitive.com/sdk/js/appacitive-js-sdk-v0.9.7.9.min.js">Production</a>&nbsp;&nbsp;|&nbsp;&nbsp; <a href="http://cdn.appacitive.com/sdk/js/appacitive-js-sdk-v0.9.7.9.js">Development</a></td>
			<td><a href="https://github.com/chiragsanghvi/JavascriptSDK/tree/v0.9.7.9">Github</a></td>
			<td>March 27, 2015</td>
		</tr>
		<tr>
			<td align="left">0.9.7.8</td>
			<td align="left"><a href="http://cdn.appacitive.com/sdk/js/appacitive-js-sdk-v0.9.7.8.min.js">Production</a>&nbsp;&nbsp;|&nbsp;&nbsp; <a href="http://cdn.appacitive.com/sdk/js/appacitive-js-sdk-v0.9.7.8.js">Development</a></td>
			<td><a href="https://github.com/chiragsanghvi/JavascriptSDK/tree/v0.9.7.8">Github</a></td>
			<td>Dec 27, 2014</td>
		</tr>
		<tr>
			<td align="left">0.9.7.7</td>
			<td align="left"><a href="http://cdn.appacitive.com/sdk/js/appacitive-js-sdk-v0.9.7.7.min.js">Production</a>&nbsp;&nbsp;|&nbsp;&nbsp; <a href="http://cdn.appacitive.com/sdk/js/appacitive-js-sdk-v0.9.7.7.js">Development</a></td>
			<td><a href="https://github.com/chiragsanghvi/JavascriptSDK/tree/v0.9.7.7">Github</a></td>
			<td>Aug 23, 2014</td>
		</tr>
		<tr>
			<td align="left">0.9.7.4 beta</td>
			<td align="left"><a href="http://cdn.appacitive.com/sdk/js/appacitive-js-sdk-v0.9.7.4.min.js">Production</a>&nbsp;&nbsp;|&nbsp;&nbsp; <a href="http://cdn.appacitive.com/sdk/js/appacitive-js-sdk-v0.9.7.4.js">Development</a></td>
			<td><a href="https://github.com/chiragsanghvi/JavascriptSDK/tree/v0.9.7.4">Github</a></td>
			<td>July 17, 2014</td>
		</tr>
		<tr>
			<td align="left">0.9.7.3 beta</td>
			<td align="left"><a href="http://cdn.appacitive.com/sdk/js/appacitive-js-sdk-v0.9.7.3.min.js">Production</a>&nbsp;&nbsp;|&nbsp;&nbsp; <a href="http://cdn.appacitive.com/sdk/js/appacitive-js-sdk-v0.9.7.3.js">Development</a></td>
			<td><a href="https://github.com/chiragsanghvi/JavascriptSDK/tree/v0.9.7.3">Github</a></td>
			<td>May 22, 2014</td>
		</tr>
	</tbody>
</table>
