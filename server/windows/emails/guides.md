# Emails

Sending emails from the SDK is quite easy. There are primarily two types of emails that can be sent

* Raw Emails
* Templated Emails


## Configuration 

You can configure your SMTP settings from the portal. Go to modules -> notifications -> email configurations.

![](http://cdn.appacitive.com/devcenter/windows/Email-Config-Modules.png)

Here you can configure your SMTP settings and also the from address and reply-to address for all your mails. You could also enable test mode for testing out you emails before sending them out.

![](http://cdn.appacitive.com/devcenter/windows/Email-Configurations-Page.png)


To send emails via the SDK use the Email class. Alternatively, you can use the NewEmail fluent interface for sending emails as well, as shown below.


## Sending Raw Emails

A raw email is one where you can specify the entire body of the email. An email has the structure

```csharp
var to = new [] {"email1", "email2"..}
var cc = new [] {"email1", "email2"..}
var bcc = new [] {"email1", "email2"..}

await NewEmail
    .Create("This is a raw email test from the .NET SDK.")
    .To(to, cc, bcc)
    .From("from@email.com", "replyto@email.com)
    .WithBody("This is a raw body email.")
    .SendAsync();
```

## Sending Templated Emails

You can also save email templates in Appacitive and use these templates for sending mails. The template can contain placeholders that can be substituted before sending the mail.

For example, if you want to send an email to every new registration, it is useful to have an email template with placeholders for username and confirmation link.

Consider we have created an email template called `welcome_email` with the following content.

```csharp
"Welcome [#username] ! Thank you for downloading [#appname]."
```

Here, [#username] and [#appname] denote the placeholders that we would want to substitute while sending an email. To send an email using this tempate, you would use something like this.

```csharp
var to = new [] {"email1", "email2"..}
var cc = new [] {"email1", "email2"..}
var bcc = new [] {"email1", "email2"..}

// Sending out a templated email
await NewEmail
    .Create("Thank you for downloading our app")
    .To(to, cc, bcc)
    .From("from@email.com", "replyto@email.com")
    .WithTemplateBody( "welcome_email", 
        new Dictionary<string, string> 
        {
            {"username", "john.doe"},
            {"appname", "appacitive"}
        })
    .SendAsync();
```


`Note`: Emails are not transactional. This implies that a successful send operation would mean that your email provider was able to dispatch the email. It DOES NOT mean that the intended recipient(s) actually received that email.
