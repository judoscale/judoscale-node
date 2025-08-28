# Judoscale Demo (Fastify)

A tiny Fastify app for testing Judoscale.

## Local Run

Install dependencies at the root of the monorepo to prepare local dependency references.

```shell
npm install
```

Run the app from within the `fastify_web` directory:

```shell
bin/dev
```

This will run both the app and a proxy server that adds the X-Request-Start header for simulating request queue time.

Visit the app through the proxy server: http://localhost:5006

Reports are sent to Request Catcher—an API testing tool—instead of Judoscale. To view the reports that are sent, go to https://judoscale-node.requestcatcher.com.
