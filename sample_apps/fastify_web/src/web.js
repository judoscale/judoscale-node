import Fastify from 'fastify'
import fastifyView from '@fastify/view'
import fastifyFormbody from '@fastify/formbody'
import ejs from 'ejs'
import Queue from 'bull'
import Redis from 'ioredis'
import { Judoscale, plugin as judoscalePlugin } from 'judoscale-fastify'

const redisOpts = {
  url: process.env.REDIS_URL || 'redis://127.0.0.1:6379',
  maxRetriesPerRequest: null, // Since bull v4
  enableReadyCheck: false, // Since bull v4
}
const redis = new Redis(redisOpts)

const fastify = Fastify({
  logger: {
    level: process.env.LOG_LEVEL || 'debug',
  },
})

const judoscale = new Judoscale({
  api_base_url: process.env.JUDOSCALE_URL || 'https://judoscale-node-sample.requestcatcher.com',
})

fastify.register(judoscalePlugin, judoscale)
fastify.register(fastifyView, { engine: { ejs: ejs } })
fastify.register(fastifyFormbody)

fastify.get('/', handleIndex)
fastify.post('/enqueue-jobs', handleEnqueueJobs)

fastify.listen({ port: process.env.PORT || 3000 }, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
})

async function handleIndex(req, reply) {
  const keys = await redis.keys('bull:*:id')
  const queueNames = keys.map((key) => key.split(':')[1])

  const queueStats = await Promise.all(
    queueNames.map(async (queueName) => {
      const queue = new Queue(queueName, { createClient: () => redis })
      const jobCounts = await queue.getJobCounts('waiting', 'active')

      // // Fetch the oldest job in the waiting state to calculate queue latency
      // const oldestJobs = await queue.getJobs(['waiting'], 0, 0, true)
      // // BUG: timestamp is when the job was created, so this breaks for delayed and retried jobs
      // const latency = oldestJobs.length ? (Number(new Date()) - Number(new Date(oldestJobs[0].timestamp))) / 1000 : 0

      return {
        queueName,
        enqueuedJobs: jobCounts.waiting,
        activeJobs: jobCounts.active,
      }
    })
  )

  await reply.view('src/index.ejs', { queues: queueStats })
  return reply
}

async function handleEnqueueJobs(req, reply) {
  const queueName = req.body.queue || 'default'
  const queue = new Queue(queueName, { createClient: () => redis })

  const numJobs = Number(req.body.jobs) || 10
  const jobData = { duration: Number(req.body.duration) || 10 }
  const bulkJobArgs = Array.from({ length: numJobs }, () => ({
    data: jobData,
  }))

  try {
    await queue.addBulk(bulkJobArgs)

    console.log(`${numJobs} jobs added to ${queueName} queue`)
    reply.redirect('/')
  } catch (error) {
    console.error('Error enqueuing jobs:', error)
    reply.status(500).send('Failed to enqueue jobs')
  }
}
