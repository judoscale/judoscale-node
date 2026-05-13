# Judoscale Next.js sample

Mirrors [express_web](../express_web): Next.js App Router with `judoscale-nextjs` (web metrics) and `judoscale-bullmq` (queues).

## Run locally

```sh
npm install
# Redis required for BullMQ
npm run dev
```

In another terminal:

```sh
npm run worker
```

Build + production-like server:

```sh
npm run build
npm run start
```

Reports go to Request Catcher unless `JUDOSCALE_URL` is set.
