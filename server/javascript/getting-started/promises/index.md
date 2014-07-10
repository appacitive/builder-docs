# Promises

`Promise` (as it is called in JavaScript) or Future is a concept of handling asynchronous calls in an easy synchronous way. It is a proxy for a value that is not available now but in somewhere in future.

At its core, a `Promise` represents the result of a task, which may or may not have completed. The only interface requirement of a Promise is having a function called `then`, which can be given callbacks to be called when the promise is fulfilled or has failed. This is outlined in the [Promises/A+ specification](http://promisesaplus.com/). 

A good hint when to use Promises is a massive asynchronous application with many nested callback chains. 

For example, consider saving an `Appacitive.Object`, which is an asynchronous operation. In the old callback paradigm, your code would look like this:

```javascript
object.save({
  success: function(object) {
    // the object was saved.
  },
  error: function(error, object) {
    // saving the object failed.
  }
});
```

Promises in general are JavaScript objects that have a `then` method which takes a pair of callbacks. The first callback is called if the promise is resolved, while the second is called if the promise is rejected. So translating this code to promises is easy:

```javascript
object.save().then(
  function(object) {
    // the object was saved.
  },
  function(error, object) {
    // saving the object failed.
  });
```

## Chaining Promises

The former code is not that special and maybe you'll ask what is the advantage of the second code example over the first one. And I have to say: there is none.

So what’s the big deal? Well, the real power of promises comes from chaining multiple of them together. Calling `promise.then(func)` returns a new promise, which is not fulfilled until `func` has completed. 

But there’s one really special thing about the way `func` is used. If a callback supplied to `then` returns a new promise, then the promise returned by `then` will not be fulfilled until the promise returned by the callback is fulfilled. The details of the behavior are explained in the [Promises/A+ specification](http://promisesaplus.com/). This is a complex topic, but maybe an example would make it clearer.

Imagine you’re writing code to log in, find an object, and then update it. In the old callback paradigm, you’d end up with what we call pyramid code:

```javascript
// Login User
Appacitive.User.login("username", "password", {
  success: function(user) {
    // Find object
    query.fetch({
      success: function(results) {
        // Update object
        results[0].set({ key: value }).save({
          success: function(object) {
            // the object was saved.
          }
        });
      }
    });
  }
});
```

That’s getting pretty ridiculous, and that’s without any error handling code even. But because of the way promise chaining works, the code can now be much flatter:

```javascript
// Login User
Appacitive.User.login("username", "password").then(function(user) {
  // Find object, returns a promise
  return query.fetch();
}).then(function(results) {
  // Update object, returns a promise
  return results[0].set({ key: value }).save(); 
}).then(function(object) {
  // the object was saved.
});
```

The example above will have the exact same eventual result as the nested callback example. However, the code looks much more clean, which leads to a great way to orchestrate promise chains without struggling with error and exception handling.

## Error Handling

The code samples above left out error handling for simplicity, but adding it back reiterates what a mess the old callback code could be:

```javascript
// Login User
Appacitive.User.logIn("username", "password", {
  success: function(user) {
    // Find object, returns a promise
    query.fetch({
      success: function(results) {
        // Update object, returns a promise
        results[0].set({ key: value }).save({
          success: function(object) {
            // the object was saved.
          },
          error: function(error, object) {
            // An error occurred.
          }
        });
      },
      error: function(error) {
        // An error occurred.
      }
    });
  },
  error: function(error, user) {
    // An error occurred.
  }
});
```

Because promises know whether they’ve been fulfilled or failed, they can propagate errors, not calling any callback until an error handler is encountered. For example, the code above could be written simply as:

```javascript
// Login User
Appacitive.User.logIn("username", "password").then(function(user) {
  // Find object, returns a promise
  return query.fetch();
}).then(function(results) {
  // Update object, returns a promise
  return results[0].set({ key: value }).save();
}).then(function(object) {
  // the object was saved.
}, function(error) {
   if (error.code == Appacitive.Error.UserAuthenticationError) {
    // User login failed
   } else {
    // User update failed
  }
});
```

If any Promise in a chain returns an error, all of the success callbacks after it will be skipped until an error callback is encountered. The error callback can transform the error, or it can handle it by returning a new fulfilled Promise that isn't rejected. 

It's often convenient to have a long chain of success callbacks with only one error handler at the end. We've used `Appacitive.Error` class here, which will be discussed in [error-space](../error-space) section of getting-started.

## Exception Handling

Generally, developers consider a failing promise to be the asynchronous equivalent to throwing an exception. In fact, if a callback passed to `then` throws an error, the promise returned will fail with that error. Propagating the error to the next available error handler is the asynchronous equivalent to bubbling up an exception until a catch is encountered.

Any exceptions thrown inside the `then` handlers will be caught by the promise. What this means is that the following:

```javascript
promise.then(function() {
    throw new Error('I am just an error.');
});
```

Will not cause the exception to be visible in the log panel of your browser. This can lead to confusion as it seems that everything went fine, while in reality, the exception is thrown but not reported. To correctly deal with exceptions in promises, consider the approach below.

```javascript
Appacitive.User.logIn("username", "password").then(funtion() {
    throw new Error('I am just an error.');
}).then(null, function(e) {
    // Check whether the error is an exception.
    if(e instanceof Error) {
        // e holds the Error thrown in the then handler above.
        // e.message === 'I am just an error.';
    } else {
        // e is an Appacitive.Error.
    }
});
```

## Creating `Appacitive.Promise` 

When you're getting started, you can just use the promises returned from methods like `fetch` or `save`. However, for more advanced scenarios, you may want to make your own promises. After you create a new `Appacitive.Promise`, you'll need to call `fulfill` or `reject` to trigger its callbacks. 

The best way to explain this is to have some sample code. So this is an example of asynchronous generation of an id:

```javascript
var id = 1;
function getId() {

    // Create promise object
    var promise = new Appacitive.Promise();

    // Generate new id by counting id up
    var myId = id++;

    // Asynchronous result
    window.setTimeout(function() {

        // So this is a simulation of failure;
        // If a random value is below or 
        // equal 0.5 I take it as an failure.
        if (Math.random() > 0.5) {

            // After random time 
            // fulfill promise with id
            promise.fulfill(myId);

        } else {

            // After random time reject promise
            promise.reject("Service failure");

        }

    }, 1000 * Math.random());

    // Return promise to caller
    return promise;

}

function outputValue(value) {
    // Output value to console
    console.log("Your id: ", value);
}

function errorHandler(reason) {
    // Output error reason to console
    console.log("Error happened: ", reason);
}

getId().then(outputValue, errorHandler);
getId().then(outputValue, errorHandler);
```

## Sequential Operations

Thinking async isn't easy. If you're struggling to get off the mark, try writing the code as if it were synchronous. 

In this case, we're trying to 

1. Fetch a story, which has its title, and chapterids for each chapter
2. Fetch each chapter in proper order and add their html to the page
3. Add the story to the page

```javascript
var Story = Appacitive.Object.extend('story');
var Chapter =  Appacitive.Object.extend('chapter');

// Fetch the story
Appacitive.Object.get("story-id").then(function(story) {

	story.get('chapterids').forEach(function(chapterId) {
	  
	  // Fetch chapter, returns a promise
	  promise = Chapter.get(chapterId).then(function(chapter) {
	    // and add it to the page
	    addHtmlToPage(chapter.get('html'));
	  });

	});

}, function(err) {
	console.log("Argh, broken: " + err.message);
});
```

This doesn't work as `forEach` isn't async-aware, so our chapters would appear in whatever order they download, which is basically how Pulp Fiction was written. This isn't Pulp Fiction, so let's fix it…

We want to turn our chapterids array into a sequence of promises. We can do that using `then`:

```javascript
var Story = Appacitive.Object.extend('story');
var Chapter =  Appacitive.Object.extend('chapter');

Appacitive.Object.get("story-id").then(function(story) {

	// Start off with a promise that always resolves
	var sequence = Appacitive.Promise.resolve();

	// Loop through our chapter ids
	story.get('chapterids').forEach(function(chapterId) {

		// Add these actions to the end of the sequence
		sequence = sequence.then(function() {
			return Chapter.get(chapterId);
		}).then(function(chapter) {
			addHtmlToPage(chapter.get('html'));
		});
	});

}).then(function() {
	console.log("All Done");
}, function(err) {
	if (Array.isArray(err)) {
		console.log("Unable to fetch chapters");
	} else {
		console.log("Argh, broken: " + err.message);
    }
});
```

## Parallel Operations

You can also wrap a promise around multiple functions or promises using `Appacitive.Promise.when` method. This method returns a new promise which is fulfilled when all of the input promises are resolved. If any promise in the list fails, then the returned promise will fail with the last error. If they all succeed, then the returned promise will succeed, with the results being the results of all the input promises. 

`Appacitive.Promise.when` takes an array of promises and creates a promise that fulfills when all of them successfully complete. You get an array of results (whatever the promises fulfilled to) in the same order as the promises you passed in.

We can fetch chapters in above example using `when` as:

```javascript

var Story = Appacitive.Object.extend('story');
var Chapter =  Appacitive.Object.extend('chapter');

Appacitive.Object.get("story-id").then(function(story) {
	
	// Collect one promise for each fetch into an array.
    var promises = []

	// Loop through our chapter ids
	story.get('chapterids').forEach(function(chapterId) {
		// Start this fetch immediately and add its promise to the list.
		promise.push(Chapter.get(chapterId));
	});


	// Takes an array of promises and returns a new promise that is resolved when all of the fetches are finished.
	return Appacitive.Promise.when(promises);

}).then(function(chapters) {
	// Now we have the chapters jsons in order! Loop through…
	chapters.forEach(function(chapter) {
		// …and add to the page
		addHtmlToPage(chapter.html);
	});
	console.log("All chapters fetched");
}, function(err) {
	if(Array.isArray(err)) {
		console.log("Unable to fetch chapters");
	} else {
		console.log("Argh, broken: " + err.message);
    }
});
```

Depending on connection, this can be seconds faster than loading one-by-one.


