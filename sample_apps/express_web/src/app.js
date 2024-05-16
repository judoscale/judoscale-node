import Redis from 'ioredis'
import express from 'express'
import { Queue, Worker, QueueEvents } from 'bullmq'
import judoscale from 'judoscale-express'

const app = express()
const port = process.env.PORT || 5000
const redisConfig = { connection: { host: '127.0.0.1', port: 6379 } }
const redis = new Redis(redisConfig.connection)

app.set('views', './views')
app.set('view engine', 'ejs')

app.use(
  judoscale.default({
    api_base_url: process.env.JUDOSCALE_URL || 'https://judoscale-node-sample.requestcatcher.com',
  })
)

app.use(express.json()) // parse JSON bodies
app.use(express.urlencoded({ extended: true })) // parse HTML forms

app.get('/', async (req, res) => {
  const keys = await redis.keys('bull:*:id')
  const queueNames = keys.map((key) => key.split(':')[1])

  const queueStats = await Promise.all(
    queueNames.map(async (name) => {
      const queue = new Queue(name, redisConfig)
      const queueEvents = new QueueEvents(name, redisConfig)
      const jobCounts = await queue.getJobCounts()
      // const latency = await queueEvents.getLatency()
      const latency = 0
      return {
        name,
        jobs: jobCounts.waiting + jobCounts.active + jobCounts.delayed + jobCounts.completed + jobCounts.failed,
        latency,
      }
    })
  )

  res.render('index', { queues: queueStats })
})

app.post('/enqueue-jobs', async (req, res) => {
  const queueName = req.body.queue || 'default'
  const numJobs = parseInt(req.body.jobs, 10) || 1

  const queue = new Queue(queueName, redisConfig)

  try {
    const jobPromises = []
    for (let i = 0; i < numJobs; i++) {
      jobPromises.push(queue.add('testJob', {}, { jobId: `testJob-${i + 1}` }))
    }
    await Promise.all(jobPromises)
    console.log(`${numJobs} jobs added to ${queueName} queue`)
    res.redirect('/')
  } catch (error) {
    console.error('Error enqueuing jobs:', error)
    res.status(500).send('Failed to enqueue jobs')
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
