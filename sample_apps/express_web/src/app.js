import Redis from 'ioredis'
import express from 'express'
import { Queue, Worker, QueueEvents } from 'bullmq'
import judoscale from 'judoscale-express'

const app = express()
const port = process.env.PORT || 5000
const redisConfig = { connection: { host: '127.0.0.1', port: 6379 } }
const redis = new Redis(redisConfig.connection)
const judoscaleConfig = {
  api_base_url: process.env.JUDOSCALE_URL || 'https://judoscale-node-sample.requestcatcher.com',
}

app.set('views', './views')
app.set('view engine', 'ejs')

app.use(judoscale.default(judoscaleConfig))
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
  const numJobs = Number(req.body.jobs) || 10
  const jobData = { duration: Number(req.body.duration) || 10 }
  const queue = new Queue(queueName, redisConfig)

  try {
    const jobPromises = []
    for (let i = 0; i < numJobs; i++) {
      jobPromises.push(queue.add('testJob', jobData))
    }

    await Promise.all(jobPromises)

    console.log(`${numJobs} jobs added to ${queueName} queue`)
    res.redirect('/')
  } catch (error) {
    console.error('Error enqueuing jobs:', error)
    res.status(500).send('Failed to enqueue jobs')
  }
}
