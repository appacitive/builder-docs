----------

## Emails

### Configuring

Sending emails from the SDK is quite easy. There are primarily two types of emails that can be sent

* Raw Emails
* Templated Emails

Email is accessed through the APEmail interface. Before you get to sending emails, you need to configure SMTP settings. You can either configure it from the portal or in the `APEmail` interface with your mail provider's settings.

### Sending Raw Emails

A raw email is one where you can specify the entire body of the email. An email has the structure

```objectivec
APEmail *emailObj = [[APEmail alloc] initWithRecipients:@[@"joe.stevens@mail.com", @"alicia.burke@mail.com", @"liam.jones@mail.com"] subject:@"Welcome to my app" body:@"Hey Guys, Welcome to app. Hope you enjoy the experience. Regards,Allan Matthews"];

//Sending email with default SMTP settings from Appacitive.
[emailObj sendEmail];

//Sending email with your email providers SMTP configuration parameters.
[emailObj sendEmailUsingSMTPConfig:[APEmail makeSMTPConfigurationDictionaryWithUsername:@"allan.matthews" password:@"4V3NG3R$" host:@"smtp.email.com" port:@443 enableSSL:YES]];
});

//Alternative way for setting all the APEmail properties individually.
APEmail *emailObj = [[APEmail alloc] init];
emailObj.toRecipients = @[@"joe.stevens@mail.com", @"alicia.burke@mail.com", @"liam.jones@mail.com"];
emailObj.ccRecipients = @[@"katherine.wesley@mail.com", @"jennifer.riley@mail.com", @"toby.salvadore@mail.com"];
emailObj.bccRecipients = @[@"justin.stevenson@mail.com", @"phillip.jones@mail.com"];
emailObj.subjectText = @"Welcome to my app.";
emailObj.bodyText = @"Hey Guys, Welcome to app. Hope you enjoy the experience. Regards,Allan Matthews";
emailObj.fromSender = @"allan.matthews@mail.com";
emailObj.isHTMLBody = NO;
emailObj.replyToEmail = @"jessica.osborne@mail.com";
[emailObj sendEmail];
```

### Sending Templated Emails

You can also save email templates in Appacitive and use these templates for sending mails. The template can contain placeholders that can be substituted before sending the mail.

For example, if you want to send an email to every new registration, it is useful to have an email template with placeholders for username and confirmation link.

Consider we have created an email template named `welcome_email` where the templatedata is -

```objectivec
"Welcome [#username] ! Thank you for downloading [#appname]."
```

Here, [#username] and [#appname] denote the placeholders that we would want to substitute while sending an email. An email has the structure

```objectivec
APEmail *emailObj = [[APEmail alloc] init];
emailObj.toRecipients = @[@"joe.stevens@mail.com", @"alicia.burke@mail.com", @"liam.jones@mail.com"];
emailObj.ccRecipients = @[@"katherine.wesley@mail.com", @"jennifer.riley@mail.com", @"toby.salvadore@mail.com"];
emailObj.bccRecipients = @[@"justin.stevenson@mail.com", @"phillip.jones@mail.com"];
emailObj.subjectText = @"Welcome to my app.";
emailObj.bodyText = @"Hey Guys, Welcome to app. Hope you enjoy the experience. Regards,Allan Matthews";
emailObj.fromSender = @"allan.matthews@mail.com";
emailObj.isHTMLBody = NO;
emailObj.replyToEmail = @"jessica.osborne@mail.com";
emailObj.templateBody = @{@"username":@"Robin", @"appname":@"DealHunter"};
[emailObj sendTemplatedEmailUsingTemplate:@"welcome_email"];
```

**NOTE**: Emails are not transactional. This implies that a successful send operation would mean that your email provider was able to dispatch the email. It DOES NOT mean that the intended recipient(s) actually received that email.
