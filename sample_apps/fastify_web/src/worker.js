import Queue from 'bull'
// import { Judoscale } from 'judoscale-bull'

const queueNames = ['default', 'urgent']
const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379'

// new Judoscale({
//   api_base_url: process.env.JUDOSCALE_URL || 'https://judoscale-node-sample.requestcatcher.com',
// })

const queues = queueNames.map((queueName) => {
  const queue = new Queue(queueName, { url: redisUrl })
  console.log(`Starting processing for ${queueName} queue`)
  queue.process(handlerForQueue(queueName))
  return queue
})

process.on('SIGINT', () => gracefulShutdown('SIGINT'))
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))

function handlerForQueue(queueName) {
  return async (job, done) => {
    console.log(`Processing job ${job.id} from ${queueName} queue for ${job.data.duration} seconds`)
    await sleep(job.data.duration * 1000)
    console.log(`Completed job ${job.id} from ${queueName} queue`)
    done()
  }
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function gracefulShutdown(signal) {
  console.log(`Received ${signal}, shutting down queues...`)
  for (const queue of queues) {
    await queue.close()
  }

  process.exit(0)
}
