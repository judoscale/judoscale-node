import Redis from 'ioredis'
import { Queue } from 'bullmq'

const redis = new Redis(process.env.REDIS_URL || 'redis://127.0.0.1:6379', {
  maxRetriesPerRequest: null,
  enableReadyCheck: false
})

const sleep = (secs) => new Promise((resolve) => setTimeout(resolve, secs * 1000))
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

export default async function Page ({ searchParams }) {
  const sp = await searchParams
  if (sp.sleep) {
    const sleepFor = parseInt(String(sp.sleep), 10)
    await sleep(Number.isNaN(sleepFor) ? randomInt(0, 2) : sleepFor)
  }

  const keys = await redis.keys('bull:*:id')
  const queueNames = keys.map((key) => key.split(':')[1])

  const queueStats = await Promise.all(
    queueNames.map(async (name) => {
      const queue = new Queue(name, { connection: redis })
      const jobCounts = await queue.getJobCounts('waiting', 'active')
      await queue.close()
      return {
        name,
        enqueuedJobs: jobCounts.waiting,
        activeJobs: jobCounts.active
      }
    })
  )

  return (
    <>
      <h1>Judoscale sample app (Next.js)</h1>

      <p>
        This app uses the App Router with <code>judoscale-nextjs</code> and <code>judoscale-bullmq</code>.
        Visit{' '}
        <a href='https://judoscale-node.requestcatcher.com' target='_blank' rel='noreferrer'>
          judoscale-node.requestcatcher.com
        </a>{' '}
        to view outbound reports.
      </p>

      <p>
        Reload with <code>?sleep=N</code> to slow the request, or use the form to enqueue BullMQ jobs.
      </p>

      <div className='grid'>
        <div>
          <h2>Job Queues</h2>
          <table>
            <thead>
              <tr>
                <th>Queue</th>
                <th>Enqueued Jobs</th>
                <th>Active Jobs</th>
              </tr>
            </thead>
            <tbody>
              {queueStats.map((queue) => (
                <tr key={queue.name}>
                  <td>{queue.name}</td>
                  <td>{queue.enqueuedJobs}</td>
                  <td>{queue.activeJobs}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <article>
          <h2>Enqueue Jobs</h2>
          <form action='/api/enqueue-jobs' method='post'>
            <label>
              <span>Queue</span>
              <select name='queue' required>
                <option value='default'>default</option>
                <option value='urgent'>urgent</option>
              </select>
            </label>

            <label>
              <span>Jobs to enqueue</span>
              <input type='number' name='jobs' min='1' max='100' defaultValue='10' required />
            </label>

            <label>
              <span>Job duration (sec)</span>
              <input type='number' name='duration' min='1' max='100' defaultValue='5' required />
            </label>

            <div>
              <button type='submit'>Enqueue Jobs</button>
            </div>
          </form>
        </article>
      </div>
    </>
  )
}
