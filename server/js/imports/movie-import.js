window.sampleData = new (function () {
	this.import = function (logCallback) {
		var counter = 0;
		var Movie = Appacitive.Object.extend('movie');
		var Actor = Appacitive.Object.extend('actor');
		var Acted = Appacitive.Connection.extend('acted');

		//create all movies first
		logCallback('Creating movie objects...');
		function onError (response) {
			logCallback(response.message);
		}

		function saveMovie(movie){
			counter++;
			movie.save().then(function(){
				logCallback(movie.get('name') + ' is now on charts.');
				counter--;
				connectMoviesToActor();
			}, onError);
		}

		var movie1 = new Movie({ name: 'Shutter Island', posterurl: 'http://ia.media-imdb.com/images/M/MV5BMTMxMTIyNzMxMV5BMl5BanBnXkFtZTcwOTc4OTI3Mg@@._V1_SX214_AL_.jpg' });
		var movie2 = new Movie({ name: 'The Wolf of Wall Street', posterurl: 'http://ia.media-imdb.com/images/M/MV5BMjIxMjgxNTk0MF5BMl5BanBnXkFtZTgwNjIyOTg2MDE@._V1_SX214_AL_.jpg' });
		var movie3 = new Movie({ name: 'Inception', posterurl: 'http://ia.media-imdb.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX214_AL_.jpg' });
		var movie4 = new Movie({ name: 'The Great Gatsby', posterurl: 'http://ia.media-imdb.com/images/M/MV5BMTkxNTk1ODcxNl5BMl5BanBnXkFtZTcwMDI1OTMzOQ@@._V1_SX214_AL_.jpg' });
		var movie5 = new Movie({ name: 'Transformers', posterurl: 'http://ia.media-imdb.com/images/M/MV5BMTQwNjU5MzUzNl5BMl5BanBnXkFtZTYwMzc1MTI3._V1_SY317_CR0,0,214,317_AL_.jpg' });
		var movie6 = new Movie({ name: 'Transformers: Revenge of the Fallen', posterurl: 'http://ia.media-imdb.com/images/M/MV5BNjk4OTczOTk0NF5BMl5BanBnXkFtZTcwNjQ0NzMzMw@@._V1_SX214_AL_.jpg' });
		var movie7 = new Movie({ name: 'Transformers: Dark of the Moon', posterurl: 'http://ia.media-imdb.com/images/M/MV5BMTkwOTY0MTc1NV5BMl5BanBnXkFtZTcwMDQwNjA2NQ@@._V1_SX214_AL_.jpg' });
		var movie8 = new Movie({ name: 'Jennifer\'s Body', posterurl: 'http://ia.media-imdb.com/images/M/MV5BMTMxNzYwMjc1Ml5BMl5BanBnXkFtZTcwNDI3MDE3Mg@@._V1_SY317_CR0,0,214,317_AL_.jpg' });
		var movie9 = new Movie({ name: 'The Shawshank Redemption', posterurl: 'http://ia.media-imdb.com/images/M/MV5BODU4MjU4NjIwNl5BMl5BanBnXkFtZTgwMDU2MjEyMDE@._V1_SX214_AL_.jpg' });
		var movie10 = new Movie({ name: 'Bruce Almighty', posterurl: 'http://ia.media-imdb.com/images/M/MV5BMTYwMTUyNzAxMF5BMl5BanBnXkFtZTYwMDYwOTY3._V1_SX214_AL_.jpg' });

		saveMovie(movie1);
		saveMovie(movie2);
		saveMovie(movie3);
		saveMovie(movie4);
		saveMovie(movie5);
		saveMovie(movie6);
		saveMovie(movie7);
		saveMovie(movie8);
		saveMovie(movie9);
		saveMovie(movie10);


		//create all actors
		logCallback('Creating actor objects...');

		function saveActor(actor){
			counter++;
			actor.save().then(function(){
				logCallback(actor.get('name') + ' says Hi!!!');
				counter--;
				connectMoviesToActor();
			}, onError);
		}

		var actor1 = new Actor({ name: 'Leonardo DiCaprio', picurl: 'http://ia.media-imdb.com/images/M/MV5BMjI0MTg3MzI0M15BMl5BanBnXkFtZTcwMzQyODU2Mw@@._V1_SY317_CR10,0,214,317_AL_.jpg' });
		var actor2 = new Actor({ name: 'Mark Ruffalo', picurl: 'http://ia.media-imdb.com/images/M/MV5BMTI5MjMwNjAzNF5BMl5BanBnXkFtZTcwMzkyNDg1Mw@@._V1_SX214_CR0,0,214,317_AL_.jpg' });
		var actor3 = new Actor({ name: 'Michelle Williams', picurl: 'http://ia.media-imdb.com/images/M/MV5BMTYxNTQ2NTk3MV5BMl5BanBnXkFtZTcwNjExNDQzNA@@._V1_SY317_CR1,0,214,317_AL_.jpg' });
		var actor4 = new Actor({ name: 'Margot Robbie', picurl: 'http://ia.media-imdb.com/images/M/MV5BMTgxNDcwMzU2Nl5BMl5BanBnXkFtZTcwNDc4NzkzOQ@@._V1_SY317_CR12,0,214,317_AL_.jpg' });
		var actor5 = new Actor({ name: 'Jonah Hill', picurl: 'http://ia.media-imdb.com/images/M/MV5BMTUyNDU0NzAwNl5BMl5BanBnXkFtZTcwMzQxMzIzNw@@._V1_SY317_CR28,0,214,317_AL_.jpg' });
		var actor6 = new Actor({ name: 'Joseph Gordon-Levitt', picurl: 'http://ia.media-imdb.com/images/M/MV5BMTQzOTg0NTkzNF5BMl5BanBnXkFtZTcwNTQ4MTcwOQ@@._V1_SY317_CR35,0,214,317_AL_.jpg' });
		var actor7 = new Actor({ name: 'Ellen Page', picurl: 'http://ia.media-imdb.com/images/M/MV5BMTU3MzM3MDYzMV5BMl5BanBnXkFtZTcwNzk1Mzc3NA@@._V1_SX214_CR0,0,214,317_AL_.jpg' });
		var actor8 = new Actor({ name: 'Elizabeth Debicki', picurl: 'http://ia.media-imdb.com/images/M/MV5BMTYyNjQ4MjgyMF5BMl5BanBnXkFtZTcwOTE0NTE2OQ@@._V1_SX214_CR0,0,214,317_AL_.jpg' });
		var actor9 = new Actor({ name: 'Adelaide Clemens', picurl: 'http://ia.media-imdb.com/images/M/MV5BMTM2OTk1NjEwOF5BMl5BanBnXkFtZTcwNDUzMjY3Mw@@._V1_SY317_CR20,0,214,317_AL_.jpg' });
		var actor10 = new Actor({ name: 'Amitabh Bachchan', picurl: 'http://ia.media-imdb.com/images/M/MV5BNTk1OTUxMzIzMV5BMl5BanBnXkFtZTcwMzMxMjI0Nw@@._V1_SY317_CR8,0,214,317_AL_.jpg' });
		var actor11 = new Actor({name: 'Shia LaBeouf', picurl:'http://ia.media-imdb.com/images/M/MV5BMTMyNDA0MDI4OV5BMl5BanBnXkFtZTcwMDQzMzEwMw@@._V1_SY317_CR16,0,214,317_AL_.jpg'});
		var actor12 = new Actor({name: 'Megan Fox', picurl:'http://ia.media-imdb.com/images/M/MV5BMTc5MjgyMzk4NF5BMl5BanBnXkFtZTcwODk2OTM4Mg@@._V1_SY317_CR4,0,214,317_AL_.jpg'});
		var actor13 = new Actor({name: 'Rosie Huntington-Whiteley', picurl:'http://ia.media-imdb.com/images/M/MV5BMTM1Nzg4Nzc2NV5BMl5BanBnXkFtZTcwODI2NDY3NQ@@._V1_SY317_CR0,0,214,317_AL_.jpg'});
		var actor14 = new Actor({name: 'Amanda Seyfried', picurl:'http://ia.media-imdb.com/images/M/MV5BMjUyODkwODUyMF5BMl5BanBnXkFtZTcwMzU3MjYxMw@@._V1_SY317_CR33,0,214,317_AL_.jpg'});
		var actor15 = new Actor({name: 'Tim Robbins', picurl:'http://ia.media-imdb.com/images/M/MV5BMTI1OTYxNzAxOF5BMl5BanBnXkFtZTYwNTE5ODI4._V1_SY317_CR16,0,214,317_AL_.jpg'});
		var actor16 = new Actor({name:'Morgan Freeman', picurl:'http://ia.media-imdb.com/images/M/MV5BMTc0MDMyMzI2OF5BMl5BanBnXkFtZTcwMzM2OTk1MQ@@._V1_SX214_CR0,0,214,317_AL_.jpg'});
		var actor17 = new Actor({name:'Jim Carrey', picurl:'http://ia.media-imdb.com/images/M/MV5BMTQwMjAwNzI0M15BMl5BanBnXkFtZTcwOTY1MTMyOQ@@._V1_SY317_CR22,0,214,317_AL_.jpg'});

		saveActor(actor1);
		saveActor(actor2);
		saveActor(actor3);
		saveActor(actor4);
		saveActor(actor5);
		saveActor(actor6);
		saveActor(actor7);
		saveActor(actor8);
		saveActor(actor9);
		saveActor(actor10);
		saveActor(actor11);
		saveActor(actor12);
		saveActor(actor13);
		saveActor(actor14);
		saveActor(actor15);
		saveActor(actor16);
		saveActor(actor17);

		//join movie and actors
		function connect (movie, actor) {
			var acted = new Acted({
				endpoints: [{
						label: 'movie',
						object: movie
					}, {
						label: 'actor',
						object: actor
					}]
			}); 
			acted.save().then(function (obj) {
				logCallback(actor.get('name') + ' is now in ' + movie.get('name') + ' movie');
			}, onError);
		}
		function connectMoviesToActor () {
			if(counter > 0) return;
			logCallback('Connecting movie to actors...');
			//Shutter Island
			connect(movie1, actor1);
			connect(movie1, actor2);
			connect(movie1, actor3);

			//The Wolf of Wall Street
			connect(movie2, actor1);
			connect(movie2, actor4);
			connect(movie2, actor5);

			//Inception
			connect(movie3, actor1);
			connect(movie3, actor6);
			connect(movie3, actor7);

			//The Great Gatsby
			connect(movie4, actor1);
			connect(movie4, actor8);
			connect(movie4, actor9);
			connect(movie4, actor10);

			//Transformers
			connect(movie5, actor11);
			connect(movie5, actor12);

			//Transformers: Revenge of the Fallen
			connect(movie6, actor11);
			connect(movie6, actor12);

			//Transformers: Dark of the Moon
			connect(movie7, actor11);
			connect(movie7, actor13);

			//Jennifer's Body
			connect(movie8, actor12);
			connect(movie8, actor14);

			//The Shawshank Redemption
			connect(movie9, actor15);
			connect(movie9, actor16);

			//Bruce Almighty
			connect(movie10, actor17);
			connect(movie10, actor16);
		}		
	};
});