window.importData = new (function () {
	this.start = function (options) {
		if(!window.sampleData) throw Error('No one is handling import event.')
		if(!options || !options.apiKey || !options.appId) throw Error('Invalid options provided.')
		
		window.importData.init(options.appId, options.apiKey);

		window.sampleData.import(options.logCallback);

		window.importData.reset();

		options.doneCallback();		
	};

	this.init = function (appId, apiKey) {
		Appacitive.initialize({ 
		  apikey: apiKey, 
		  env: 'sandbox', 
		  appId: appId 
		});
	};

	this.reset = function (argument) {
		//Appacitive.reset();
	}
});