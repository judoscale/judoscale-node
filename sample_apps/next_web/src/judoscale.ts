import { Judoscale } from 'judoscale-bullmq'

export function runJudoscaleWorkerAutoscaler() {
  new Judoscale({
    api_base_url: process.env.JUDOSCALE_URL || 'https://judoscale-node.requestcatcher.com',
    redis_url: process.env.BULLMQ_REDIS_URL || process.env.REDIS_URL || 'redis://127.0.0.1:6379',
  })
}
