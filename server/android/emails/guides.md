# Emails

The Appacitive Android SDK has support to let you send raw and templated emails.

## Configuration

You can configure your SMTP settings from the portal. Go to *modules* -> *notifications* -> *email configurations*. 

![](http://cdn.appacitive.com/devcenter/android/emails-1.png)

Here you can configure your SMTP settings and also the *from* address and *reply-to* address for all your mails. You could also enable *test mode* for testing out you emails before sending them out.

![](http://cdn.appacitive.com/devcenter/android/email-2.png)

## Sending raw emails

Raw emails are ones where the body of the email is provided in the API call to Appacitive. The body can be HTML or simply plaintext.

```
		boolean isHtml = false;
        AppacitiveEmail email = new AppacitiveEmail("Your Subject").withBody(new RawEmailBody("Raw Content Body", isHtml));
        email.to.add("mary@appacitive.com");
        email.cc.add("support@appacitive.com");
        email.bcc.add("connect@appacitive.com");
        
        email.sendInBackground(new Callback<AppacitiveEmail>() {
            @Override
            public void success(AppacitiveEmail result) {
                assert result.getId() > 0;                
            }

            @Override
            public void failure(AppacitiveEmail result, Exception e) {                
                Log.e("Appacitive", e.getMessage());
            }
        });
```

You can override the SMTP settings that you set through the portal by providing `SMTPSettings` in the API call.
A request to send an email with overridden SMTP settings would look like this,

```

		boolean enableSsl = true;
		boolean isHtml = false;

		//	Your custom SMTP settings
		SmtpSettings settings = new SmtpSettings("example@yourdomain.com", "xxxxxxxxx", "smtp.gmail.com", 465, enableSsl);

        AppacitiveEmail email = new AppacitiveEmail("Your Subject").withBody(new RawEmailBody("Raw Content Body", isHtml));

		//	Your custom settings go here
		email.withSmtp(settings);

		//	Your custom from and reply-to addresses
        email.fromAddress = "support@appacitive.com";
        email.replyToAddress = "support@appacitive.com";
        
		email.to.add("mary@appacitive.com");
        email.cc.add("support@appacitive.com");
        email.bcc.add("connect@appacitive.com");
        
		email.sendInBackground(new Callback<AppacitiveEmail>() {
            @Override
            public void success(AppacitiveEmail result) {
                assert result.getId() > 0;                
            }

            @Override
            public void failure(AppacitiveEmail result, Exception e) {
                Log.e("Appacitive", e.getMessage());
            }
        });

```

## Sending templated emails

Appacitive allows you to pre-configure your emails' contents with placeholders and then send them with dynamically substituted values for those placeholders. 
You can start creating and managing your own email templates by going to *modules* -> *notifications* -> *email templates* on the management portal.

![](http://cdn.appacitive.com/devcenter/android/email-3.png)

For example, if you want to send an email for every new registration, it is useful to have an email template with placeholders.
Consider we have created an email template called `welcome_email` with the following body.

>"Welcome `[#username]`! Thank you for downloading `[#appname]`."

Here, `[#username]` and `[#appname]` are the placeholders that we would want to substitute while sending an email. To send an email using this template, you would use something like this,

```
		boolean isHtml = false;

		//	While creating the TemplatedEmailBody, we will provide values for the placeholders
		TemplatedEmailBody body = new TemplatedEmailBody("welcome_email", new HashMap<String, String>() {{
            put("username", "c0bra90");
			put("appname", "MyAwesomeApp");
        }}, isHtml);

        AppacitiveEmail email = new AppacitiveEmail("Your Subject");
		
		email.withBody(body);
        email.to.add("mary@appacitive.com");

        email.sendInBackground(new Callback<AppacitiveEmail>() {
            @Override
            public void success(AppacitiveEmail result) {
                assert result.getId() > 0;                
            }

            @Override
            public void failure(AppacitiveEmail result, Exception e) {
                Log.e("Appacitive", e.getMessage());
            }
        });
```

>Emails are not transactional. This implies that a successful send operation would mean that your email provider was able to dispatch the email. It DOES NOT mean that the intended recipient(s) actually received that email.