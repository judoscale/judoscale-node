const Redis = require('ioredis')
const { Queue } = require('bullmq')
const BullMQMetricsCollector = require('../src/bull-mq-metrics-collector')

describe('BullMQMetricsCollector', () => {
  let collector

  beforeEach(async () => {
    collector = new BullMQMetricsCollector()

    // Clear all Bull information in Redis
    const keys = await collector.redis.keys('bull:*')
    if (keys.length) await collector.redis.del(keys)
  })

  afterEach(() => {
    collector.redis.quit()
  })

  test('collects queue metrics', async () => {
    const queue = new Queue('foo', { connection: collector.redis })
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

  test('uses the redis_url config if provided', async () => {
    const collector1 = new BullMQMetricsCollector({ redis_url: 'redis://localhost:6379/1' })
    const collector2 = new BullMQMetricsCollector({ redis_url: 'redis://localhost:6379/2' })

    const queue = new Queue('foo', { connection: collector1.redis })
    await queue.add('test-job')

    const metrics1 = await collector1.collect()
    const metrics2 = await collector2.collect()

    expect(metrics1.length).toEqual(2)
    expect(metrics2.length).toEqual(0)

    collector1.redis.quit()
    collector2.redis.quit()
  })

  test('uses the redis connection if provided', async () => {
    const redis1 = new Redis('redis://localhost:6379/1')
    const redis2 = new Redis('redis://localhost:6379/2')

    const collector1 = new BullMQMetricsCollector({ redis: redis1 })
    const collector2 = new BullMQMetricsCollector({ redis: redis2 })

    const queue = new Queue('foo', { connection: redis1 })
    await queue.add('test-job')

    const metrics1 = await collector1.collect()
    const metrics2 = await collector2.collect()

    expect(metrics1.length).toEqual(2)
    expect(metrics2.length).toEqual(0)

    redis1.quit()
    redis2.quit()
  })

  test('uses the redis connection options if provided', async () => {
    const redis1 = { host: 'localhost', port: 6379, db: 1 }
    const redis2 = { host: 'localhost', port: 6379, db: 2 }

    const collector1 = new BullMQMetricsCollector({ redis: redis1 })
    const collector2 = new BullMQMetricsCollector({ redis: redis2 })

    const queue = new Queue('foo', { connection: collector1.redis })
    await queue.add('test-job')

    const metrics1 = await collector1.collect()
    const metrics2 = await collector2.collect()

    expect(metrics1.length).toEqual(2)
    expect(metrics2.length).toEqual(0)

    collector1.redis.quit()
    collector2.redis.quit()
  })
})
