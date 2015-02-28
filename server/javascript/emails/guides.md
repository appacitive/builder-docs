# Emails

Appacitive allows you to integrate your current email providers to send out emails through our APIs. The provider settings can be configured in the Portal, or you can send them along with each call that you make.Note : The email settings in the request body overrides the email settings set using the management portal.

## Configuration 

You can configure your SMTP settings from the portal. Go to modules -> notifications -> email configurations.

![](http://cdn.appacitive.com/devcenter/windows/Email-Config-Modules.png)

Here you can configure your SMTP settings and also the from address and reply-to address for all your mails. You could also enable test mode for testing out your emails before sending them out.

![](http://cdn.appacitive.com/devcenter/windows/Email-Configurations-Page.png)

Sending emails from the sdk is quite easy. There are primarily two types of emails that can be sent

* Raw Emails
* Templated Emails

Email is accessed through the Appacitive.Email module. Before you get to sending emails, you need to configure smtp settings. You can either configure it from the portal or in the `Email` module with your mail provider's settings.

```javascript
Appacitive.Email.setupEmail({
    username: "", /* username of the sender email account */
    from: "", /* display name of the sender email account*/
    password: "", /* password of the sender */
    host: "", /* the smtp host, eg. smtp.gmail.com */
    port: "", /* the smtp port, eg. 465 */
    enablessl: "", /* is email provider ssl enabled, true or false, default is true */
    replyto: "" /* the reply-to email address */
});
```
Now you are ready to send emails.

## Sending Raw Emails

A raw email is one where you can specify the entire body of the email. An email has the structure
```javascript
var email = {
    to: [], /* a string array containing the recipient email addresses */
    cc: [], /* a string array containing the cc'd email addresses */
    bcc: [], /* a string array containing the bcc'd email addresses */
    from: "", /* email id of user */
    subject: "Welcome to Appacitive", /* string containing the subject of the email */
    body: "Hi, <br/> Welcome to Appacitive", /* html/string that contains body of the email */
    ishtml: true, /* bool value specifying the body is html or string, default is true */
    useConfig: false/* set true to use configure settings in email module in SDK */
};
```
And to send the email
```javascript
Appacitive.Email.sendRawEmail(email).then(function (email) {
    alert('Successfully sent.');
});
```

## Sending Templated Emails

You can also save email templates in Appacitive and use these templates for sending mails. The template can contain placeholders that can be substituted before sending the mail. 

For example, if you want to send an email to every new registration, it is useful to have an email template with placeholders for username and confirmation link.

Consider we have created an email template where the templatedata is -

```javascript
"Welcome [#username] ! Thank you for downloading [#appname]."
```
Here, [#username] and [#appname] denote the placeholders that we would want to substitute while sending an email. An email has the structure

```javascript
var email = {
    to: [], /* a string array containing the recipient email addresses */
    cc: [], /* a string array containing the cc'd email addresses */
    bcc: [], /* a string array containing the bcc'd email addresses */
    from: "", /* email id of user */
    subject: "Welcome to Appacitive", /* string containing the subject of the email */
    templateName: "templateName", /*name of template to be send */
    data: { 
        fname: "John",
        lname: "Doe"
    }, /*an object with placeholder names and their data eg: {username:"test"} */
    useConfig: false/* set true to use configure settings in email module in SDK*/
};
```
And to send the email,
```javascript
Appacitive.Email.sendTemplatedEmail(email).then(function (email) {
    alert('Successfully sent.');
});
```

`Note`: Emails are not transactional. This implies that a successful send operation would mean that your email provider was able to dispatch the email. It DOES NOT mean that the intended recipient(s) actually received that email.
