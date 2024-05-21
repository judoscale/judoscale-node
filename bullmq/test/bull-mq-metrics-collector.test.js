const { Queue } = require('bullmq')
const BullMQMetricsCollector = require('../src/bull-mq-metrics-collector')

describe('BullMQMetricsCollector', () => {
  let collector

  beforeEach(() => {
    collector = new BullMQMetricsCollector()
  })

  afterEach(() => {
    collector.redis.quit()
  })

  test('collects queue metrics', async () => {
    const keys = await collector.redis.keys('bull:*')
    if (keys.length) await collector.redis.del(keys)

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
})
