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
import { Judoscale, plugin as judoscalePlugin } from 'judoscale-fastify'

// CommonJS
const { Judoscale, plugin: judoscalePlugin } = require('judoscale-fastify')

// Initialize Judoscale with default configuration
const judoscale = new Judoscale()

// Register the plugin
fastify.register(judoscalePlugin, judoscale)
```

## Troubleshooting

Once installed, you should see something like this in your development log:

> [Judoscale] Reporter not started: JUDOSCALE_URL is not set

In production, run `heroku logs -t | grep Judoscale`, and you should see something like this:

> [Judoscale] Reporter starting, will report every 10 seconds

If you don't see either of these, ensure "judoscale-express" is in your `Package.lock` file, and restart your app.

You can see more detailed (debug) logging by setting `JUDOSCALE_LOG_LEVEL` on your Heroku app:

```
heroku config:set JUDOSCALE_LOG_LEVEL=debug
```

Reach out to help@judoscale.com if you run into any other problems.
