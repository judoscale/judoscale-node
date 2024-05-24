# Judoscale for BullMQ

Official [Judoscale](https://judoscale.com) adapter package for autoscaling BullMQ job queues.

## Set up your app for autoscaling

1. Install the judoscale-bullmq package:

```sh
npm install judoscale-bullmq --save
```

2. In your worker code, import and start the Judoscale reporter:

```javascript
// ESM
import judoscaleBullMQ from 'judoscale-bullmq'

// CommonJs
const judoscaleBullMQ = require('judoscale-bullmq').default

// default configuration
judoscaleBullMQ()

// custom configuration
judoscaleBullMQ({
  queues: ['default', 'urgent'],
  log_level: 'debug',
})
```

## Troubleshooting

Once installed, you should see something like this in your development log:

> [Judoscale] Reporter not started: JUDOSCALE_URL is not set

In your production app where you've installed Judoscale, you should see this in your logs:

> [Judoscale] Reporter starting, will report every 10 seconds

If you don't see either of these, ensure "judoscale-bullmq" is in your `Package.lock` file, and restart your app.

You can see more detailed (debug) logging by setting the environment variable `JUDOSCALE_LOG_LEVEL=debug` on your deployed application. Here's how you would do that on Heroku:

```
heroku config:set JUDOSCALE_LOG_LEVEL=debug
```

Reach out to help@judoscale.com if you run into any other problems.
