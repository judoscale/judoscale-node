const Redis = require('ioredis')
const Queue = require('bull')
const { Metric, WorkerMetricsCollector } = require('judoscale-node-core')

// Keep track of all instances so we can close connections on process exit
const collectors = []
process.on('exit', async () => {
  for (const collector of collectors) {
    await collector.closeAllQueues()
  }
})

class BullMetricsCollector extends WorkerMetricsCollector {
  constructor(config = {}) {
    super('Bull', config)
    collectors.push(this)
    this.queues = new Map()
  }

  async collect() {
    // TODO: New queues created after first collect() call will not be reported
    if (this.queues.size == 0) await this.prepareQueues()

    let metrics = []

    for (const [queueName, queue] of this.queues) {
      const jobCounts = await queue.getJobCounts('waiting', 'active')

      metrics.push(new Metric('qd', new Date(), jobCounts.waiting, queueName))
      metrics.push(new Metric('busy', new Date(), jobCounts.active, queueName))
    }

    return metrics
  }

  async prepareQueues() {
    const redisKeys = []
    let cursor = '0'

    do {
      const reply = await this.redis.scan(cursor, 'MATCH', 'bull:*:id')
      cursor = reply[0]
      redisKeys.push(...reply[1])
    } while (cursor !== '0')

    for (const redisKey of redisKeys) {
      const queueName = redisKey.split(':')[1]
      const queue = new Queue(queueName, { url: this.redisUrl })
      this.queues.set(queueName, queue)
    }
  }

  async tearDown() {
    await this.redis.quit()
    for (const queue of this.queues.values()) {
      await queue.close()
    }

    this.queues.clear()
  }

  get redis() {
    if (!this._redis) {
      if (this.config.redis instanceof Redis) {
        this._redis = this.config.redis
      } else if (this.config.redis) {
        this._redis = new Redis(this.config.redis)
      } else {
        const redisUrl = this.config.redis_url || process.env.REDIS_URL || 'redis://127.0.0.1:6379'
        this._redis = new Redis(redisUrl)
      }
    }

    return this._redis
  }
}

module.exports = BullMetricsCollector
