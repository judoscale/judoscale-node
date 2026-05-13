# Judoscale for Next.js

Official [Judoscale](https://judoscale.com) adapter package for Next.js applications running on a **long-lived Node.js server** (`next start` or equivalent). It instruments the Node `http` / `https` server to collect queue time, application time, and utilization for every request (including App Router, Pages Router, Route Handlers, and RSC), without adding framework middleware.

## Set up your Next.js app for autoscaling

1. Install packages:

```sh
npm install judoscale-nextjs --save
```

2. Enable the instrumentation hook (Next.js 14 needs this in `next.config.js`; Next.js 15+ enables it by default):

```js
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    instrumentationHook: true,
  },
}

module.exports = nextConfig
```

3. Add `instrumentation.ts` (or `.js`) at the project root (or under `src/` if you use a `src/` layout):

```ts
// instrumentation.ts
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { register: registerJudoscale } = await import('judoscale-nextjs')
    registerJudoscale({
      // Same options as `new Judoscale({ ... })` from judoscale-node-core
      // api_base_url: process.env.JUDOSCALE_URL,
      // log_level: 'debug',
    })
  }
}
```

**Use the Node.js runtime only.** This package patches Node's `http.Server`; it does not run in the Edge runtime. The `NEXT_RUNTIME === 'nodejs'` guard avoids loading it in Edge.

### Optional: existing `Judoscale` instance (e.g. BullMQ)

```ts
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('judoscale-bullmq')
    const { Judoscale, register: registerJudoscale } = await import('judoscale-nextjs')
    const redis = ... // ioredis instance

    registerJudoscale({
      judoscale: new Judoscale({
        redis,
        api_base_url: process.env.JUDOSCALE_URL,
      }),
    })
  }
}
```

### Custom server (Express + `next()`)

If you use a custom Node server with Express, prefer [`judoscale-express`](https://www.npmjs.com/package/judoscale-express) and register its middleware instead of this package.

## What is not supported

- **Vercel / serverless / per-request isolates** — The reporter expects a long-running process. Use Judoscale worker adapters or a self-hosted web dyno where `next start` stays up.
- **Edge Middleware / Edge runtime** — Not instrumented.

## Configuration

Same options as other Judoscale Node adapters (`logger`, `log_level`, etc.). See [judoscale-express README](https://github.com/judoscale/judoscale-node/tree/main/packages/express#configuration).

## Troubleshooting

Once installed, you should see something like this in your development log:

> [Judoscale] Reporter not started: JUDOSCALE_URL is not set

In production where `JUDOSCALE_URL` is set, you should see:

> [Judoscale] Reporter starting, will report every 10 seconds

Enable debug logs with `JUDOSCALE_LOG_LEVEL=debug`.

Reach out to help@judoscale.com if you run into any other problems.
