const Redis = require('ioredis')
const Queue = require('bull')
const BullMetricsCollector = require('../src/bull-metrics-collector')

describe('BullMetricsCollector', () => {
  let collector, queue

  beforeEach(async () => {
    collector = new BullMetricsCollector()

    // Clear all Bull information in Redis
    const keys = await collector.redis.keys('bull:*')
    if (keys.length) await collector.redis.del(keys)
  })

  afterEach(async () => {
    if (collector) await collector.tearDown()
    if (queue) await queue.close()
  })

  test('attaches an error listener to redis clients that have none', async () => {
    expect(collector.redis.listenerCount('error')).toBeGreaterThan(0)

    const collectorFromOptions = new BullMetricsCollector({
      redis: { host: 'localhost', port: 6379, db: 3 },
    })
    expect(collectorFromOptions.redis.listenerCount('error')).toBeGreaterThan(0)
    await collectorFromOptions.tearDown()

    const providedRedis = new Redis()
    expect(providedRedis.listenerCount('error')).toEqual(0)

    const collectorFromClient = new BullMetricsCollector({ redis: providedRedis })
    expect(collectorFromClient.redis.listenerCount('error')).toBeGreaterThan(0)
    await collectorFromClient.tearDown()
  })

  test('logs redis errors via the judoscale logger', async () => {
    const logger = { debug: jest.fn() }
    const collectorWithLogger = new BullMetricsCollector({ logger })

    collectorWithLogger.redis.emit('error', new Error('write EPIPE'))

    expect(logger.debug).toHaveBeenCalledWith('[Judoscale] Redis error: write EPIPE')
    await collectorWithLogger.tearDown()
  })

  test('collects queue metrics', async () => {
    queue = new Queue('foo')

    await queue.add('test-job')
    await queue.add('prioritized-job', {}, { priority: 1 })

    const metrics = await collector.collect()

    expect(metrics.length).toEqual(2)

    expect(metrics[0].identifier).toEqual('qd')
    expect(metrics[0].queueName).toEqual('foo')
    expect(metrics[0].value).toEqual(2)
    expect(metrics[1].identifier).toEqual('busy')
    expect(metrics[1].queueName).toEqual('foo')
    expect(metrics[1].value).toEqual(0)
  })
})
