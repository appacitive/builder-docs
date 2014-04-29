window.sampleData = new (function () {
	this.import = function (logCallback) {
		var Employee = Appacitive.Object.extend('employees', {
			name: function() {
				return this.get('firstname') + this.get('lastname');
			}
		});
		var Manages = Appacitive.Connection.extend('manages');

		//create all employees first
		logCallback('Creating employee objects...');
		function onError (response) {
			logCallback(response.message);
		}

		var employee1 = new Employee({"blog":"http://devcenter.appacitive.com","cellphone":"617-000-0001","city":"Boston, MA","department":"Corporate","email":"jking@fakemail.com","firstname":"James","lastname":"King","officephone":"781-000-0001","pic":"http://cdn.appacitive.com/devcenter/root/emp-directory/James_King.jpg","title":"President and CEO","twitterid":"@fakejking"});
		
		var employee2 = new Employee({"blog":"http://devcenter.appacitive.com","cellphone":"617-000-0005","city":"Boston, MA","department":"Sales","email":"rmoore@fakemail.com","firstname":"Ray","lastname":"Moore","officephone":"781-000-0005","pic":"http://cdn.appacitive.com/devcenter/root/emp-directory/Ray_Moore.jpg","title":"VP of Sales","twitterid":"@fakermoore"});
		var employee6 = new Employee({"blog":"http://devcenter.appacitive.com","cellphone":"617-000-0010","city":"Boston, MA","department":"Sales","email":"kbyrne@fakemail.com","firstname":"Kathleen","lastname":"Byrne","officephone":"781-000-0010","pic":"http://cdn.appacitive.com/devcenter/root/emp-directory/Kathleen_Byrne.jpg","title":"Sales Representative","twitterid":"@fakekbyrne"});
		var employee7 = new Employee({"blog":"http://devcenter.appacitive.com","cellphone":"617-000-0011","city":"Boston, MA","department":"Sales","email":"ajones@fakemail.com","firstname":"Amy","lastname":"Jones","officephone":"781-000-0011","pic":"http://cdn.appacitive.com/devcenter/root/emp-directory/Amy_Jones.jpg","title":"Sales Representative","twitterid":"@fakeajones"});
		
		var employee3 = new Employee({"blog":"http://devcenter.appacitive.com","cellphone":"617-000-0004","city":"Boston, MA","department":"Engineering","email":"jwilliams@fakemail.com","firstname":"John","lastname":"Williams","officephone":"781-000-0004","pic":"http://cdn.appacitive.com/devcenter/root/emp-directory/John_Williams.jpg","title":"VP of Engineering","twitterid":"@fakejwilliams"}); 
		var employee8 = new Employee({"blog":"http://devcenter.appacitive.com","cellphone":"617-000-0012","city":"Boston, MA","department":"Engineering","email":"swells@fakemail.com","firstname":"Steven","lastname":"Wells","officephone":"781-000-0012","pic":"http://cdn.appacitive.com/devcenter/root/emp-directory/Steven_Wells.jpg","title":"Software Architect","twitterid":"@fakeswells"}); 
		var employee9 = new Employee({"blog":"http://devcenter.appacitive.com","cellphone":"617-000-0007","city":"Boston, MA","department":"Engineering","email":"pgates@fakemail.com","firstname":"Paula","lastname":"Gates","officephone":"781-000-0007","pic":"http://cdn.appacitive.com/devcenter/root/emp-directory/Paula_Gates.jpg","title":"Software Architect","twitterid":"@fakepgates"});
		var employee10 = new Employee({"blog":"http://devcenter.appacitive.com","cellphone":"617-000-0006","city":"Boston, MA","department":"Engineering","email":"pjones@fakemail.com","firstname":"Paul","lastname":"Jones","officephone":"781-000-0006","pic":"http://cdn.appacitive.com/devcenter/root/emp-directory/Paul_Jones.jpg","title":"QA Manager","twitterid":"@fakepjones"});
		
		var employee4 = new Employee({"blog":"http://devcenter.appacitive.com","cellphone":"617-000-0003","city":"Boston, MA","department":"Accounting","email":"elee@fakemail.com","firstname":"Eugene","lastname":"Lee","officephone":"781-000-0003","pic":"http://cdn.appacitive.com/devcenter/root/emp-directory/Eugene_Lee.jpg","title":"CFO","twitterid":"@fakeelee"});
		
		var employee5 = new Employee({"blog":"http://devcenter.appacitive.com","cellphone":"617-000-0002","city":"Boston, MA","department":"Marketing","email":"jtaylor@fakemail.com","firstname":"Julie","lastname":"Taylor","officephone":"781-000-0002","pic":"http://cdn.appacitive.com/devcenter/root/emp-directory/Julie_Taylor.jpg","title":"VP of Marketing","twitterid":"@fakejtaylor"});
		var employee11 = new Employee({"blog":"http://devcenter.appacitive.com","cellphone":"617-000-0008","city":"Boston, MA","department":"Marketing","email":"lwong@fakemail.com","firstname":"Lisa","lastname":"Wong","officephone":"781-000-0008","pic":"http://cdn.appacitive.com/devcenter/root/emp-directory/Lisa_Wong.jpg","title":"Marketing Manager","twitterid":"@fakelwong"});
		var employee12 = new Employee({"blog":"http://devcenter.appacitive.com","cellphone":"617-000-0009","city":"Boston, MA","department":"Marketing","email":"gdonovan@fakemail.com","firstname":"Gary","lastname":"Donovan","officephone":"781-000-0009","pic":"http://cdn.appacitive.com/devcenter/root/emp-directory/Gary_Donovan.jpg","title":"Marketing Manager","twitterid":"@fakegdonovan"});
		
		var tasks = [];

		tasks.push(employee1.save());
		logCallback('Saving employee ' + employee1.name());

		tasks.push(employee2.save());
		logCallback('Saving employee ' + employee1.name());

		tasks.push(employee3.save());
		logCallback('Saving employee ' + employee1.name());

		tasks.push(employee4.save());
		logCallback('Saving employee ' + employee1.name());

		tasks.push(employee5.save());
		logCallback('Saving employee ' + employee1.name());

		tasks.push(employee6.save());
		logCallback('Saving employee ' + employee1.name());

		tasks.push(employee7.save());
		logCallback('Saving employee ' + employee1.name());

		tasks.push(employee8.save());
		logCallback('Saving employee ' + employee1.name());

		tasks.push(employee9.save());
		logCallback('Saving employee ' + employee1.name());

		tasks.push(employee10.save());
		logCallback('Saving employee ' + employee1.name());

		Appacitive.Promise.when(tasks).then(function() {
			logCallback('Employees are now in directory.');
			connectEmployees();
		}, onError);

		//join manager  and employes
		function connect (manager, employee) {
			var manages = new Manages({
				endpoints: [{
						label: 'manager',
						object: manager
					}, {
						label: 'employee',
						object: employee
					}]
			}); 
			return manages.save().then(function (obj) {
				logCallback(employee.get('firstname') + ' now reports to ' + manager.get('firstname'));
			}, onError);
		}

		function connectEmployees () {
			logCallback('Connecting employees by heirarchy...');
			
			var tasks = []

			tasks.push(connect(employee1, employee2));
			tasks.push(connect(employee1, employee3));
			tasks.push(connect(employee1, employee4));
			tasks.push(connect(employee1, employee5));

			tasks.push(connect(employee2, employee6));
			tasks.push(connect(employee2, employee7));

			tasks.push(connect(employee3, employee8));
			tasks.push(connect(employee3, employee9));
			tasks.push(connect(employee3, employee10));

			tasks.push(connect(employee5, employee11));
			tasks.push(connect(employee5, employee12));			
		}		
	};
});