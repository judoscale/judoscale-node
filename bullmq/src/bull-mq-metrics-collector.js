const Redis = require('ioredis')
const { Queue } = require('bullmq')
const { Metric, WorkerMetricsCollector } = require('judoscale-node-core')

class BullMQMetricsCollector extends WorkerMetricsCollector {
  constructor() {
    super('BullMQ')

    const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379'

    this.redis = new Redis({ connection: { url: redisUrl } })
    this.queueNames = new Set()

    // TODO: do we need redis.quit() ??
  }

  async collect() {
    if (this.queueNames.size == 0) await this.fetchQueueNames()

    let metrics = []

    for (const queueName of this.queueNames) {
      const queue = new Queue(queueName, { connection: this.redis })
      const jobCounts = await queue.getJobCounts('waiting', 'active')

      metrics.push(new Metric('qd', new Date(), jobCounts.waiting, queueName))
      metrics.push(new Metric('busy', new Date(), jobCounts.active, queueName))
    }

    return metrics
  }

  async fetchQueueNames() {
    const redisKeys = []
    let cursor = '0'
    do {
      const reply = await this.redis.scan(cursor, 'MATCH', 'bull:*:id')
      cursor = reply[0]
      redisKeys.push(...reply[1])
    } while (cursor !== '0')

    for (const redisKey of redisKeys) {
      const queueName = redisKey.split(':')[1]
      this.queueNames.add(queueName)
    }
  }
}

module.exports = BullMQMetricsCollector
