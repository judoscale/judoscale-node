# Judoscale Next.js sample

Mirrors [express_web](../express_web): Next.js App Router with `judoscale-nextjs` (web metrics) and `judoscale-bullmq` (queues).

## Local Run

Install dependencies at the root of the monorepo to prepare local dependency references.

```shell
npm install
```

Redis is required for BullMQ. Build the Next.js app, then run from within the `next_web` directory:

```shell
npm run build
bin/dev
```

This will run the app, worker, and a proxy server that adds the X-Request-Start header for simulating request queue time.

Visit the app through the proxy server: http://localhost:5006

Reports are sent to Request Catcher—an API testing tool—instead of Judoscale. To view the reports that are sent, go to https://judoscale-node.requestcatcher.com.

### Dev server (no proxy)

```shell
npm run dev
```

In another terminal:

```shell
npm run worker
```
