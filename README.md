# FusionTables-proxy

**FusionTables-proxy** makes it easier to use Google Fusion Tables to back simple JavaScript-based Web apps by handling request signing and caching API responses. This means you don't have to embed your API key in front-end code and the caching should keep you from hitting the rate limit for the Fusion Tables API.

It was designed to work with [FusionTables.js](https://github.com/achavez/FusionTables.js), but should work as a drop-in replacement for just about any Fusion Tables API v1.0 application that only uses `GET` requests (`POST`s will go unacknowledged).

The app is built on [Express.js](http://expressjs.com/) and responses are cached in [Redis](http://redis.io/). It should easily run in Heroku's free tier, but will work just fine on any Node.js environment. Redis is only required to cache requests.

The proxy can restrict access based on the Fusion Table being requested and the origin of the request (using the `Access-Control-Allow-Origin` header).

## Deployment

The proxy should run on any Node environment, but these instructions only cover Heroku deployment.

You'll need to have a credit card on file to use the Redis add-on that's required for caching requests. There's no cost associated, but Heroku requires a credit card for all third-party add-ons. And if you don't want to use caching, you can just skip Redis altogether.

That said, deployment is really easy:

1. Install the [Heroku toolbelt](https://toolbelt.heroku.com/) and login (`heroku login`).
2. Clone this repo `git clone https://github.com/achavez/FusionTables-proxy.git`
3. `cd` in and run `heroku create` to create an app from the repo.
4. Store your Google Fusion Tables API key using an [environment variable](https://devcenter.heroku.com/articles/config-vars) `heroku config:set YOURAPIKEY`.
5. *Optional* If you want to enable request caching, install the Redis Cloud add-on with `heroku addons:add rediscloud`.
6. *Optional* Set the amount of time API responses will be cached by setting the *TTL* enivronment variable. The value is set in seconds so, for example, `heroku config:set 3600` would store responses for one hour. If you don't set this manually, responses will be cached for six hours.
7. Push the app to Heroku using `git` with `git push heroku master`. The Heroku toolbelt should give you the URL to your proxy during the `git push`.


## Usage

For usage with FusionTables.js, see [Proxying Requests](https://github.com/achavez/FusionTables.js) in the FusionTables.js docs.

For other uses, just replace `https://www.googleapis.com/` in your API request with the URL to your proxy (probably `https://your-proxy.herokuapp.com/`). If the cache is configured to use Redis, enable request caching by adding `cache=true` to your request's querystring.

## Restrictring access

If you want to restrict access to your proxy, you can do so by creating a `config.yaml` file. Use [`config.sample.yaml`](https://github.com/achavez/FusionTables-proxy/blob/master/config.sample.yaml) as a template. If you're unsure if you've properly filled it out, check the logs. Each time the app starts up the config file is reparsed and whitelisting settings are printed to the log.

## Caveats

1. Heroku [idles](https://devcenter.heroku.com/articles/dynos#dyno-sleeping) dynos that are inactive for more than an hour. So if a request hasn't been made to the proxy in an hour, the request that "wakes" it will experience a few seconds of latency. This is solvable by adding a second dyno ($) or programatically making requests to keep your dyno alive.
2. The access restrictions above aren't impenetrable, but they're a step up from nothing. And they're definitely an improvement from putting your API key in front-end code.

## License

The MIT License (MIT)

Copyright (c) 2014 Andrew Chavez

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.