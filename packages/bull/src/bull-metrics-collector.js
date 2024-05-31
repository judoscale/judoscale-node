const Redis = require('ioredis')
const Queue = require('bull')
const { Metric, WorkerMetricsCollector } = require('judoscale-node-core')

class BullMetricsCollector extends WorkerMetricsCollector {
  constructor() {
    super('Bull')

    this.redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379'
    this.queueNames = new Set()
  }

  async collect() {
    // TODO: New queues created after first collect() call will not be reported
    if (this.queueNames.size == 0) await this.fetchQueueNames()

    let metrics = []

    for (const queueName of this.queueNames) {
      const queue = new Queue(queueName, { url: this.redisUrl })
      const jobCounts = await queue.getJobCounts('waiting', 'active')

      metrics.push(new Metric('qd', new Date(), jobCounts.waiting, queueName))
      metrics.push(new Metric('busy', new Date(), jobCounts.active, queueName))

      queue.close()
    }

    return metrics
  }

  async fetchQueueNames() {
    const redis = new Redis({ url: this.redisUrl })
    const redisKeys = []
    let cursor = '0'

    do {
      const reply = await redis.scan(cursor, 'MATCH', 'bull:*:id')
      cursor = reply[0]
      redisKeys.push(...reply[1])
    } while (cursor !== '0')

    for (const redisKey of redisKeys) {
      const queueName = redisKey.split(':')[1]
      this.queueNames.add(queueName)
    }

    await redis.quit()
  }
}

module.exports = BullMetricsCollector
