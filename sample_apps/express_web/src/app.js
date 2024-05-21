import Redis from 'ioredis'
import express from 'express'
import { Queue, Worker, QueueEvents } from 'bullmq'
import judoscaleExpress from 'judoscale-express'
import judoscaleBullMQ from 'judoscale-bullmq'

// import { Judoscale, middleware as judoscaleMiddleware } from 'judoscale-express'
// import { Judoscale, plugin as judoscalePlugin } from 'judoscale-fastify'
// import 'judoscale-bullmq'
// import { Judoscale } from 'judoscale-bullmq'

// 1. Configure the reporter
// 2. Start the reporter
// const judoscale = new Judoscale({
//   log_level: "debug",
//   bullmq: {
//     queues: []
//   }
// })

// 3. Inject the middleware/plugin (if web process)
// app.use(judoscaleMiddleware(judoscale))
// fastify.register(judoscalePlugin(judoscale))

const app = express()
const port = process.env.PORT || 5000
const redisConfig = { connection: { host: '127.0.0.1', port: 6379 } }
const redis = new Redis(redisConfig.connection)

app.set('views', './views')
app.set('view engine', 'ejs')

judoscaleBullMQ({
  api_base_url: process.env.JUDOSCALE_URL || 'https://judoscale-node-sample.requestcatcher.com',
})

app.use(
  // TODO: Why do we have to use default? Is this broken in our published packages?
  judoscaleExpress.default({
    api_base_url: process.env.JUDOSCALE_URL || 'https://judoscale-node-sample.requestcatcher.com',
  })
)

app.use(express.json()) // parse JSON bodies
app.use(express.urlencoded({ extended: true })) // parse HTML forms

app.get('/', handleIndex)
app.post('/enqueue-jobs', handleEnqueueJobs)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

async function handleIndex(req, res) {
  const keys = await redis.keys('bull:*:id')
  const queueNames = keys.map((key) => key.split(':')[1])

  const queueStats = await Promise.all(
    queueNames.map(async (name) => {
      const queue = new Queue(name, redisConfig)
      const jobCounts = await queue.getJobCounts('waiting', 'active')

      // // Fetch the oldest job in the waiting state to calculate queue latency
      // const oldestJobs = await queue.getJobs(['waiting'], 0, 0, true)
      // // BUG: timestamp is when the job was created, so this breaks for delayed and retried jobs
      // const latency = oldestJobs.length ? (Number(new Date()) - Number(new Date(oldestJobs[0].timestamp))) / 1000 : 0

      return {
        name,
        enqueuedJobs: jobCounts.waiting,
        activeJobs: jobCounts.active,
      }
    })
  )

  res.render('index', { queues: queueStats })
}

async function handleEnqueueJobs(req, res) {
  const queueName = req.body.queue || 'default'
  const queue = new Queue(queueName, redisConfig)

  const numJobs = Number(req.body.jobs) || 10
  const jobData = { duration: Number(req.body.duration) || 10 }
  const bulkJobArgs = Array.from({ length: numJobs }, () => ({
    name: 'testJob',
    data: jobData,
  }))

  try {
    await queue.addBulk(bulkJobArgs)

    console.log(`${numJobs} jobs added to ${queueName} queue`)
    res.redirect('/')
  } catch (error) {
    console.error('Error enqueuing jobs:', error)
    res.status(500).send('Failed to enqueue jobs')
  }
}
