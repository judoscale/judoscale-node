# Judoscale for Fastify

Official [Judoscale](https://judoscale.com) adapter package for Fastify applications.

## Set up your Fastify app for autoscaling

1. Install the judoscale-fastify package:

```sh
npm install judoscale-fastify --save
```

2. Import and use the provided plugin:

**Judoscale should be one of the first plugins for your app.**

```javascript
// ESM
import judoscale from 'judoscale-fastify'

// CommonJs
const judoscale = require('judoscale-fastify').default

// default configuration
fastify.register(judoscale)

// custom configuration
fastify.register(judoscale, {
  log_level: 'debug',
})
```

## Troubleshooting

Once installed, you should see something like this in your development log:

> [Judoscale] Reporter not started: JUDOSCALE_URL is not set

In your production app where you've installed Judoscale, you should see this in your logs:

> [Judoscale] Reporter starting, will report every 10 seconds

If you don't see either of these, ensure "judoscale-fastify" is in your `Package.lock` file, and restart your app.

You can see more detailed (debug) logging by setting the environment variable `JUDOSCALE_LOG_LEVEL=debug` on your deployed application. Here's how you would do that on Heroku:

```
heroku config:set JUDOSCALE_LOG_LEVEL=debug
```

Reach out to help@judoscale.com if you run into any other problems.
