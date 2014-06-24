var logfmt = require('logfmt');
var express = require('express');
var app = express();
var request = require('request');

if(!process.env.KEY) {
	throw new Error('A Fusion Tables API key is required to sign API requests.');
}

app.use(logfmt.requestLogger());

app.get('/fusiontables/v1/*', function(req, res) {
	var url = 'https://www.googleapis.com/fusiontables/v1/' + req.params[0];
	var query = req.query;
	query.key = process.env.KEY;
	var parts = {
		url: url,
		qs: query,
		json: true
	};
    request.get(parts, function (e, r, ft) {
		res.set('Access-Control-Allow-Origin', '*');
		res.json(ft);
    })
});

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
	console.log("Listening on " + port);
});