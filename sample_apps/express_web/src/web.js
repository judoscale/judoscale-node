import Redis from 'ioredis'
import express from 'express'
import { Queue, Worker, QueueEvents } from 'bullmq'
import { Judoscale, middleware as judoscaleMiddleware } from 'judoscale-express'
import 'judoscale-bullmq'

const app = express()
const port = process.env.PORT || 5000
const redis = new Redis(process.env.REDIS_URL || 'redis://127.0.0.1:6379', {
  maxRetriesPerRequest: null, // Since bull v4
  enableReadyCheck: false, // Since bull v4
})

app.set('views', './views')
app.set('view engine', 'ejs')

const judoscale = new Judoscale({
  api_base_url: process.env.JUDOSCALE_URL || 'https://judoscale-node.requestcatcher.com',
  redis: redis,
})

app.use(judoscaleMiddleware(judoscale))
app.use(express.json()) // parse JSON bodies
app.use(express.urlencoded({ extended: true })) // parse HTML forms

app.get('/', handleIndex)
app.post('/enqueue-jobs', handleEnqueueJobs)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

const sleep = secs => new Promise(resolve => setTimeout(resolve, secs * 1000))
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

async function handleIndex(req, res) {
  // Accept a `?sleep=N` query param to sleep for the specified N of seconds,
  // or `?sleep=true` to sleep randomly for 0-2 seconds.
  if (req.query.sleep) {
    const sleepFor = parseInt(req.query.sleep)
    await sleep(isNaN(sleepFor) ? randomInt(0, 2) : sleepFor)
  }

  const keys = await redis.keys('bull:*:id')
  const queueNames = keys.map((key) => key.split(':')[1])

  const queueStats = await Promise.all(
    queueNames.map(async (name) => {
      const queue = new Queue(name, { connection: redis })
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
  const queue = new Queue(queueName, { connection: redis })

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
