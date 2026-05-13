import { NextResponse } from 'next/server'
import { Queue } from 'bullmq'
import Redis from 'ioredis'

const redis = new Redis(process.env.REDIS_URL || 'redis://127.0.0.1:6379', {
  maxRetriesPerRequest: null,
  enableReadyCheck: false
})

export async function POST (request) {
  const formData = await request.formData()
  const queueName = String(formData.get('queue') || 'default')
  const numJobs = Number(formData.get('jobs')) || 10
  const duration = Number(formData.get('duration')) || 10

  const queue = new Queue(queueName, { connection: redis })
  const bulkJobArgs = Array.from({ length: numJobs }, () => ({
    name: 'testJob',
    data: { duration }
  }))

  try {
    await queue.addBulk(bulkJobArgs)
    console.log(`${numJobs} jobs added to ${queueName} queue`)
  } catch (error) {
    console.error('Error enqueuing jobs:', error)
    await queue.close()
    return new NextResponse('Failed to enqueue jobs', { status: 500 })
  }

  await queue.close()
  return NextResponse.redirect(new URL('/', request.url))
}
