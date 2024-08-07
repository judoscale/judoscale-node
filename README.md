# Judoscale-Node

These packages work together with the [Judoscale](https://judoscale.com) autoscaling service to scale your web and worker services automatically. They gather a minimal set of metrics for each request or job queue, and periodically report this data asynchronously to the Judoscale API.

## Supported frameworks

- [Express](https://github.com/judoscale/judoscale-node/tree/main/packages/express)
- [Fastify](https://github.com/judoscale/judoscale-node/tree/main/packages/fastify)
- [BullMQ](https://github.com/judoscale/judoscale-node/tree/main/packages/bullmq)
- [Bull](https://github.com/judoscale/judoscale-node/tree/main/packages/bull)

## What data is collected?

The following data is submitted periodically to the Judoscale API:

- Node and framework versions
- Judoscale package versions
- Dyno or service name (example: web.1)
- Queue metrics

Judoscale aggregates and stores this information to power the autoscaling algorithm and dashboard visualizations.

_Note: The reporter will not run if the `JUDOSCALE_URL` environment variable is missing (such as in development or a review app). This environment variable is set for you automatically on Heroku when you install the Judoscale add-on._

## Troubleshooting

Once installed, you should see something like this in your development log:

> [Judoscale] Reporter not started: JUDOSCALE_URL is not set

In your production app where you've installed Judoscale, you should see this in your logs:

> [Judoscale] Reporter starting, will report every 10 seconds

If you don't see any Judoscale logging, check the following:

- Make sure a Judoscale package is present in your `Package.lock` file, and restart your app.
- Make sure Judoscale is one of the first middlewares for your app.

You can see more detailed (debug) logging by setting the environment variable `JUDOSCALE_LOG_LEVEL=debug` on your deployed application. Here's how you would do that on Heroku:

```
heroku config:set JUDOSCALE_LOG_LEVEL=debug
```

Reach out to help@judoscale.com if you run into any other problems.
