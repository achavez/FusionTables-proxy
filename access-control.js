var yaml = require('js-yaml');
      fs = require('fs');


// Parse the YAML config file
try {
	var config = yaml.safeLoad(fs.readFileSync('./config.yaml', 'utf8'));

	// Log out config settings
	if(config && config.origins) {
		console.log('Origin whitelisting enabled for ' + config.origins.join(', '));
	}
	else {
		console.log('Origin whitelisting is disabled.');
	}

	if(config && config.tables) {
		console.log('Table whitelisting enabled for ' + config.tables.join(', '));
	}
	else {
		console.log('Table whitelisting is disabled.');
	}

} catch (e) {
	if (e.code === 'ENOENT') {
		console.error('No config file was found. Origin and table whitelisting disabled.');
	}
	else {
		console.error(e);
	}
}

var checkOrigin = function(req, res, next) {
	if(config && config.origins) {
		// Verify origin and set appropriate access-control header
		var allowed = config.origins.indexOf(req.header('Origin')) !== -1;
		if(allowed) {
			res.set('Access-Control-Allow-Origin', req.header('Origin'));
			next();
		}
		else {
			var msg = 'Rejected a request from a non-whitelisted origin: ' + req.header('Origin');
			console.error(msg);
			res.json(msg, 403);
		}
	}
	else {
		// No origin whitelisting is enabled
		res.set('Access-Control-Allow-Origin', req.header('Origin'));
		next();
	}
};

var checkTable = function(req, res, next) {
	if(config && config.tables) {
		// Verify the table is whitelisted and reject the request if it isn't
		var allowed = false;
		config.tables.every(function(el) {
			if(req.url.indexOf(el) !== -1) {
				allowed = true;
				return false;
			}
			else return true;
		});
		if(allowed) {
			next();
		}
		else {
			console.error('Rejected a request for a non-whitelisted table.');
			res.json('You are trying to query a table that has not been whitelisted in FusionTables-proxy.', 403);
		}
	}
	else {
		// No table whitelisting is enabled
		next();
	}
}

module.exports.checkTable = checkTable;
module.exports.checkOrigin = checkOrigin;