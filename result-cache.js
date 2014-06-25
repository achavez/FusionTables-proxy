// Enable caching, if Redis Cloud is enabled
var	redis = require("redis"),
	client = redis.createClient();

// Log out basic Redis status info
console.log('Redis addon is available. Enabling result caching.');
client.on('error', function (err) {
	console.error("Redis error " + err);
});
client.on('ready', function() {
	console.log('Successfully connected to Redis.');
});

module.exports = client;