var redisURL = process.env.REDISCLOUD_URL || process.env.REDIS_URL;

var redis = require('redis');
	url = require('url');
	redisURL = url.parse(redisURL);
	client = redis.createClient(redisURL.port, redisURL.hostname, {no_ready_check: true});

if(redisURL.auth) {
	client.auth(redisURL.auth.split(":")[1]);
}

// Log out basic Redis status info
console.log('Redis addon is available. Enabling result caching.');
client.on('error', function (err) {
	console.error("Redis error " + err);
});
client.on('connect', function() {
	console.log('Successfully connected to Redis.');
});

module.exports = client;