# Judoscale

These packages work together with the [Judoscale](https://judoscale.com) Heroku add-on to scale your web and worker dynos automatically. They gather a minimal set of metrics for each request (or job queue), and periodically posts this data asynchronously to the Judoscale service.

## Requirements

- Node-based app

## Set up your Express app for autoscaling

Install the judoscale-express package:

```sh
npm install judoscale-express --save
```

Then import and use the provided middleware:

```javascript
import judoscale from 'judoscale-express'

// default configuration
app.use(judoscale())

// custom configuration (see config options below)
app.use(
  judoscale({
    report_interval_seconds: 5,
  })
)
```

## What does the adapter do?

The request middleware measures request queue time for each request. Installing the middleware also starts an asynchronous reporter that sends these metrics to Judoscale every 10 seconds.

_Note: The reporter will not run if the `JUDOSCALE_URL` environment variable is missing (such as in development or a review app). This environment variable is set for you automatically on Heroku when you install the Judoscale add-on._

## What data is collected?

The following data is submitted periodically to the Judoscale API:

- Node and framework versions
- Judoscale package versions
- Dyno name (example: web.1)
- PID
- Collection of queue time metrics (time and milliseconds)

Judoscale aggregates and stores this information to power the autoscaling algorithm and dashboard visualizations.

## Configuration

Most Judoscale configurations are handled via the settings page on your Judoscale dashboard, but there a few ways you can configure the adapter in code:

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

If you don't see either of these, ensure judoscale-express is in your `Package.lock` file, and restart your app.

You can see more detailed (debug) logging by setting `JUDOSCALE_LOG_LEVEL` on your Heroku app:

```
heroku config:set JUDOSCALE_LOG_LEVEL=debug
```

Reach out to help@judoscale.com if you run into any other problems.
