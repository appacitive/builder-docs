# Debugging with the Android SDK

The Appacitive Android SDK comes with an inbuilt logging mechanism which you can use out of the box, or you can override it with your own logging mechanism.

To use the inbuilt logging mechanism, you simply need to instantiate a new *logger* object using *APContainer*.  

```
        Logger logger = APContainer.build(Logger.class);
        logger.setLogLevel(LogLevel.DEBUG);
        logger.error("OMG! Some bad happened.");
```

The logs will start getting displayed in the **LogCat** view as follows. The inbuilt logger in the SDK simply logs to the *android.util.Log* class.

![](https://lh5.ggpht.com/oXwS_Jo1xrUhkZRxtTTvRH4Avartfj6PVjlveBMIHCryeKwV-aj_N4lpPzx37DLi5Bg=w300)

**Note:** Always build the logger after you have made a call to *AppacitiveContext.initialize()*.


To override the inbuilt logging mechanism, create a new Java class which extends *com.appacitive.core.interfaces.Logger*.

``` 
	import com.appacitive.core.interfaces.LogLevel;
	import com.appacitive.core.interfaces.Logger;

	public class CustomLogger implements Logger 
	{
	    private static final String TAG = "CUSTOM TAG";
	
	    private volatile static LogLevel logLevel = LogLevel.INFO;
	
	    @Override
	    public void setLogLevel(LogLevel logLevel) {
	        CustomLogger.logLevel = logLevel;
	    }
	
	    @Override
	    public void error(String s) {
	        if (CustomLogger.logLevel.ordinal() <= LogLevel.ERROR.ordinal()) {
	            //  Custom logging code here
	        }
	    }
	
	    @Override
	    public void info(String s) {
	        if (CustomLogger.logLevel.ordinal() <= LogLevel.INFO.ordinal()) {
	            //  Custom logging code here
	        }
	    }
	
	    @Override
	    public void verbose(String s) {
	        if (CustomLogger.logLevel.ordinal() <= LogLevel.VERBOSE.ordinal()) {
	            //  Custom logging code here
	        }
	    }
	
	    @Override
	    public void warn(String s) {
	        if (CustomLogger.logLevel.ordinal() <= LogLevel.WARN.ordinal()) {
	            //  Custom logging code here
	        }
	    }
    }

```

Now register your new *CustomLogger* with *APContainer* (after you have initiaized the SDK) and start using it as follows,

```
    AppacitiveContext.initialize("XXXXXXXXXXXXXXXXXXXXXXXX", Environment.sandbox, this);

    //  CustomLogger is a java class which extends com.appacitive.core.interfaces.Logger
    APContainer.register(Logger.class, new ObjectFactory<Object>() {
        @Override
        public Object get() {
            return new CustomLogger();
        }
    });

	//	Instantiate your custom logger from APContainer
    Logger customLogger = APContainer.build(Logger.class);
    customLogger.setLogLevel(LogLevel.DEBUG);
    customLogger.error("OMG! Some bad happened.");

```

**Note:** Ths SDK logs every time it makes a call to your backend on Appacitive with the **INFO** loglevel. 