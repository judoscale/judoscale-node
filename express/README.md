# Judoscale for Express.js

Official [Judoscale](https://judoscale.com) adapter package for Express.js applications.

## Set up your Express app for autoscaling

1. Install the judoscale-express package:

```sh
npm install judoscale-express --save
```

2. Import and use the provided middleware:

```javascript
// ES6-style import:
import judoscale from 'judoscale-express'

// Or if you use `require` for importing:
const judoscale = require('judoscale-express').default

// default configuration
app.use(judoscale())

// custom configuration (see config options below)
app.use(
  judoscale({
    report_interval_seconds: 5,
  })
)
```

## Configuration

Most Judoscale settings are handled via the Judoscale dashboard, but there a few ways you can configure the adapter in code:

```javascript
app.use(
  judoscale({
    // Specify how frequently data is sent to Judoscale.
    // Default: 10
    report_interval_seconds: 5,

    // Specify the API endpoint.
    // Default: process.env.JUDOSCALE_URL
    api_base_url: 'https://judoscale-node.requestcatcher.com',

    // Use a custom logger instance
    // Default: Winston logger instance (simple format)
    logger: myLogger,

    // Override the log level of the default logger (ignored if logger is overridden)
    // Default: process.env.JUDOSCALE_LOG_LEVEL || 'info'
    log_level: 'debug',
  })
)
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
