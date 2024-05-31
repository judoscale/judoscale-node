const Redis = require('ioredis')
const Queue = require('bull')
const BullMetricsCollector = require('../src/bull-metrics-collector')

describe('BullMetricsCollector', () => {
  let collector, queue

  beforeEach(async () => {
    collector = new BullMetricsCollector()

    // Clear all Bull information in Redis
    const redis = new Redis({ url: this.redisUrl })
    const keys = await redis.keys('bull:*')
    if (keys.length) await redis.del(keys)
    await redis.quit()
  })

  afterEach(async () => {
    if (queue) {
      await queue.close()
    }
  })

  test('collects queue metrics', async () => {
    queue = new Queue('foo')

    await queue.add('test-job')

    const metrics = await collector.collect()

    expect(metrics.length).toEqual(2)

    expect(metrics[0].identifier).toEqual('qd')
    expect(metrics[0].queueName).toEqual('foo')
    expect(metrics[0].value).toEqual(1)
    expect(metrics[1].identifier).toEqual('busy')
    expect(metrics[1].queueName).toEqual('foo')
    expect(metrics[1].value).toEqual(0)
  })
})
