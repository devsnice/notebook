requirejs.config({
    baseUrl: "js",
    paths: {
		jquery: '../libs/jquery/jquery',
		transformTime: 'modules/transformTime',
		lockr: 'modules/lockr',
		model: 'modules/model',
		note: 'modules/note',
		notebook: 'modules/notebook'
    },
});

require(['notebook'], function(notebook){	
	var nb = new notebook("#notebook-add", "#notebook-list", "#notebook-amount", "#notebook-submit");
});