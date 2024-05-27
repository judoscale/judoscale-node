# Judoscale for Express.js

Official [Judoscale](https://judoscale.com) adapter package for Express.js applications.

## Set up your Express app for autoscaling

1. Install the judoscale-express package:

```sh
npm install judoscale-express --save
```

2. Import and use the provided middleware:

**Judoscale should be one of the first middlewares for your app.**

```javascript
// ESM
import { Judoscale, middleware as judoscaleMiddleware } from 'judoscale-express'

// CommonJS
const { Judoscale, middleware: judoscaleMiddleware } = require('judoscale-express')

// Initialize Judoscale with default configuration
const judoscale = new Judoscale()

// custom configuration (see config options below)
const judoscale = new Judoscale({
  log_level: 'debug',
})

// Inject the middleware (this should be the first middleware)
app.use(judoscaleMiddleware(judoscale))
```

## Configuration

Most Judoscale settings are handled via the Judoscale dashboard, but there are a few ways you can configure the adapter in code:

```javascript
new Judoscale({
  // Use a custom logger instance
  // Default: Winston logger instance (simple format)
  logger: myLogger,

  // Override the log level of the default logger (ignored if logger is overridden)
  // Default: process.env.JUDOSCALE_LOG_LEVEL || 'info'
  log_level: 'debug',
})
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
