# Judoscale Demo (Fastify)

A tiny Fastify app for testing Judoscale.

## Local Run

Ensure the Heroku CLI is installed.

```shell
heroku -v
```

Install dependencies.

```shell
npm install
```

Run the app:

```shell
bin/dev
```

This will run both the app and a proxy server that adds the X-Request-Start header for simulating request queue time.

Visit the app through the proxy server: http://localhost:5004

## Local development

To reference a local Judoscale package instead of the NPM version:

```
npm link judoscale-fastify
```

This will create a symlink in `node_modules` pointing to the local file system.
