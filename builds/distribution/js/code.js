require(['/modules/notes'], function(notebook){	
	app = function() {
		
		console.log(notebook);
		
		app.init = function() {
			var nb = new notebook("#notebook-add", "#notebook-list", "#notebook-amount", "#notebook-submit");
		}
				
		return app.init();
	}

	console.log(notebook);
	return new app();
}());