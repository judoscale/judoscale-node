# Judoscale Demo (Fastify)

A tiny Fastify app for testing Judoscale.

## Local Run

Ensure the Heroku CLI is installed.

```shell
heroku -v
```

Install dependencies. Note that we're using `yarn` instead of `npm` so we can use "resolutions". More on this below.

```shell
npm install
```

Run the app:

```shell
bin/dev
```

This will run both the app and a proxy server that adds the X-Request-Start header for simulating request queue time.

http://localhost:5004

## Local development

To reference the local version of `judoscale-fastify` instead of the NPM version:

```
npm link judoscale-fastify
```

This will create a symlink for `node_modules/judoscale-fastify` pointing to the local file system.
