import Redis from 'ioredis'
import { Worker } from 'bullmq'
import { Judoscale } from 'judoscale-bullmq'

const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379'
const redisOpts = {
  maxRetriesPerRequest: null, // Since bull v4
  enableReadyCheck: false, // Since bull v4
}
const redis = new Redis(redisUrl, redisOpts)
const queueNames = ['default', 'urgent']

new Judoscale({
  api_base_url: process.env.JUDOSCALE_URL || 'https://judoscale-node-sample.requestcatcher.com',
})

const workers = queueNames.map((queueName) => {
  console.log(`Starting worker for ${queueName} queue`)
  return new Worker(queueName, handlerForQueue(queueName), { connection: redis })
})

process.on('SIGINT', () => gracefulShutdown('SIGINT'))
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))

function handlerForQueue(queueName) {
  return async (job) => {
    console.log(`Processing job ${job.id} from ${queueName} queue for ${job.data.duration} seconds`)
    await sleep(job.data.duration * 1000)
    console.log(`Completed job ${job.id} from ${queueName} queue`)
  }
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function gracefulShutdown(signal) {
  console.log(`Received ${signal}, shutting down workers...`)
  for (const worker of workers) {
    await worker.close()
  }

  process.exit(0)
}
