// NPM, core modules
var logfmt = require('logfmt');
	express = require('express');
	app = express();
	request = require('request');

// Custom modules
var access = require('./access-control.js');
if(process.env.REDISCLOUD_URL || process.env.REDIS_URL) {
	var cache = require('./result-cache.js');
}

if(!process.env.KEY) {
	throw new Error('A Fusion Tables API key is required to sign API requests.');
}

app.use(logfmt.requestLogger());

// Check access based on origin, requested tables
app.use(access.checkOrigin);
app.get(access.checkTable);

// First check for cached results if caching is enabled
app.get('/fusiontables/v1/*', function(req, res, next) {
	if(cache && req.query.cached) {
		cache.get(req.url, function(error, reply) {
			if(error != null) {
				console.error("Redis error: " + error + ". Querying Google Fusion Tables for " + req.url);
				next();
			}
			else if(reply) {
				console.log("Cache hit. Sending cached results for " + req.url);
				res.json(JSON.parse(reply));
			}
			else {
				console.log("Missed cache. Querying Google Fusion Tables for " + req.url);
				next();
			}
		});
	}
	else {
		next();
	}
});

// If caching is disabled or the result isn't cached, query the API
app.get('/fusiontables/v1/*', function(req, res) {
	var url = 'https://www.googleapis.com/fusiontables/v1/' + req.params[0];
	var query = req.query;
	query.key = process.env.KEY;
	var parts = {
		url: url,
		qs: query,
		json: true
	};
	request.get(parts, function (error, response, table) {
		if(error) {
    		console.error(error);
    		res.json(error, response.statusCode);
    	}
    	else {
			res.json(table);
			if(cache && req.query.cached) {
				cache.set(req.url, JSON.stringify(table), function(error) {
					if(error) {
						console.error(error);
					}
					else {
						console.log("Cached results for " + req.url);
					}
				});
			}
    	}
    })
});

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
	console.log("Listening on " + port);
});