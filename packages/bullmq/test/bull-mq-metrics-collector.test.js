const Redis = require('ioredis')
const { Queue, Worker } = require('bullmq')
const BullMQMetricsCollector = require('../src/bull-mq-metrics-collector')

describe('BullMQMetricsCollector', () => {
  const resetBullData = async (redis) => {
    const keys = await redis.keys('bull:*')
    if (keys.length) await redis.del(keys)
  }

  let redisConnectionsToCleanUp

  beforeEach(() => {
    redisConnectionsToCleanUp = []
  })

  afterEach(() => {
    redisConnectionsToCleanUp.forEach((redis) => redis.quit())
  })

  test('collects queue metrics', async () => {
    const collector = new BullMQMetricsCollector()

    redisConnectionsToCleanUp.push(collector.redis)
    await resetBullData(collector.redis)

    const queue = new Queue('foo', { connection: collector.redis })
    await queue.add('test-job')
    await queue.add('prioritized-job', {}, { priority: 1 })

    const metrics = await collector.collect()

    expect(metrics.length).toEqual(3)

    expect(metrics[0].identifier).toEqual('qd')
    expect(metrics[0].queueName).toEqual('foo')
    expect(metrics[0].value).toEqual(2)
    expect(metrics[1].identifier).toEqual('busy')
    expect(metrics[1].queueName).toEqual('foo')
    expect(metrics[1].value).toEqual(0)
    expect(metrics[2].identifier).toEqual('bt')
    expect(metrics[2].queueName).toEqual('foo')
    expect(metrics[2].value).toEqual(0)
  })

  test('reports how long the longest-running job in each queue has been running', async () => {
    const collector = new BullMQMetricsCollector()

    redisConnectionsToCleanUp.push(collector.redis)
    await resetBullData(collector.redis)

    const queue = new Queue('foo', { connection: collector.redis })
    const idleQueue = new Queue('bar', { connection: collector.redis })
    const jobs = [await queue.add('job-1'), await queue.add('job-2')]
    await idleQueue.add('waiting-job')

    let releaseJobs
    const jobsReleased = new Promise((resolve) => (releaseJobs = resolve))
    const worker = new Worker('foo', () => jobsReleased, {
      connection: { host: 'localhost', port: 6379 },
      concurrency: 2,
    })

    try {
      while ((await queue.getActiveCount()) < 2) await new Promise((resolve) => setTimeout(resolve, 10))

      const now = Date.now()
      await collector.redis.hset(queue.toKey(jobs[0].id), 'processedOn', now - 60_000)
      await collector.redis.hset(queue.toKey(jobs[1].id), 'processedOn', now - 600_000)

      const metrics = await collector.collect()
      const busyTimes = Object.fromEntries(
        metrics.filter((m) => m.identifier == 'bt').map((m) => [m.queueName, m.value]),
      )

      expect(busyTimes['foo']).toBeGreaterThanOrEqual(600_000)
      expect(busyTimes['foo']).toBeLessThan(605_000)
      expect(busyTimes['bar']).toEqual(0)
    } finally {
      releaseJobs()
      await worker.close()
      await queue.close()
      await idleQueue.close()
    }
  })

  test('uses the redis_url config if provided', async () => {
    const collector1 = new BullMQMetricsCollector({ redis_url: 'redis://localhost:6379/1' })
    const collector2 = new BullMQMetricsCollector({ redis_url: 'redis://localhost:6379/2' })

    redisConnectionsToCleanUp.push(collector1.redis, collector2.redis)
    await resetBullData(collector1.redis)
    await resetBullData(collector2.redis)

    const queue = new Queue('foo', { connection: collector1.redis })
    await queue.add('test-job')

    const metrics1 = await collector1.collect()
    const metrics2 = await collector2.collect()

    expect(metrics1.length).toEqual(3)
    expect(metrics2.length).toEqual(0)
  })

  test('uses the redis connection if provided', async () => {
    const redis1 = new Redis('redis://localhost:6379/1')
    const redis2 = new Redis('redis://localhost:6379/2')

    redisConnectionsToCleanUp.push(redis1, redis2)
    await resetBullData(redis1)
    await resetBullData(redis2)

    const collector1 = new BullMQMetricsCollector({ redis: redis1 })
    const collector2 = new BullMQMetricsCollector({ redis: redis2 })

    const queue = new Queue('foo', { connection: redis1 })
    await queue.add('test-job')

    const metrics1 = await collector1.collect()
    const metrics2 = await collector2.collect()

    expect(metrics1.length).toEqual(3)
    expect(metrics2.length).toEqual(0)
  })

  test('attaches an error listener to redis clients that have none', () => {
    const collectorFromUrl = new BullMQMetricsCollector()
    redisConnectionsToCleanUp.push(collectorFromUrl.redis)
    expect(collectorFromUrl.redis.listenerCount('error')).toBeGreaterThan(0)

    const collectorFromOptions = new BullMQMetricsCollector({
      redis: { host: 'localhost', port: 6379, db: 3 },
    })
    redisConnectionsToCleanUp.push(collectorFromOptions.redis)
    expect(collectorFromOptions.redis.listenerCount('error')).toBeGreaterThan(0)

    const providedRedis = new Redis()
    redisConnectionsToCleanUp.push(providedRedis)
    expect(providedRedis.listenerCount('error')).toEqual(0)

    const collectorFromClient = new BullMQMetricsCollector({ redis: providedRedis })
    expect(collectorFromClient.redis.listenerCount('error')).toBeGreaterThan(0)
  })

  test('logs redis errors via the judoscale logger', () => {
    const logger = { debug: jest.fn() }
    const collector = new BullMQMetricsCollector({ logger })
    redisConnectionsToCleanUp.push(collector.redis)

    collector.redis.emit('error', new Error('write EPIPE'))

    expect(logger.debug).toHaveBeenCalledWith('[Judoscale] Redis error: write EPIPE')
  })

  test('uses the redis connection options if provided', async () => {
    const redis1 = { host: 'localhost', port: 6379, db: 1 }
    const redis2 = { host: 'localhost', port: 6379, db: 2 }

    const collector1 = new BullMQMetricsCollector({ redis: redis1 })
    const collector2 = new BullMQMetricsCollector({ redis: redis2 })

    redisConnectionsToCleanUp.push(collector1.redis, collector2.redis)
    await resetBullData(collector1.redis)
    await resetBullData(collector2.redis)

    const queue = new Queue('foo', { connection: collector1.redis })
    await queue.add('test-job')

    const metrics1 = await collector1.collect()
    const metrics2 = await collector2.collect()

    expect(metrics1.length).toEqual(3)
    expect(metrics2.length).toEqual(0)
  })
})
