var logfmt = require('logfmt');
    express = require('express');
    request = require('request');

var access = require('./access-control.js')

if(!process.env.KEY) {
	throw new Error('A Fusion Tables API key is required to sign API requests.');
}

var app = express();

app.use(logfmt.requestLogger());

app.use(access.checkOrigin);
app.use(access.checkTable);

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
		res.json(ft);
    })
});

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
	console.log("Listening on " + port);
});