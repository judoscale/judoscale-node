const Redis = require('ioredis')
const { Queue } = require('bullmq')
const { Metric, WorkerMetricsCollector } = require('judoscale-node-core')

class BullMQMetricsCollector extends WorkerMetricsCollector {
  constructor(config = {}) {
    super('BullMQ', config)
    this.queueNames = new Set()
  }

  async collect() {
    // TODO: New queues created after first collect() call will not be reported
    if (this.queueNames.size == 0) await this.fetchQueueNames()

    let metrics = []

    for (const queueName of this.queueNames) {
      const queue = new Queue(queueName, { connection: this.redis })
      const jobCounts = await queue.getJobCounts('waiting', 'active', 'prioritized')
      const busyTime = await this.busyTime(queue)
      await queue.close()

      metrics.push(new Metric('qd', new Date(), jobCounts.waiting + jobCounts.prioritized, queueName))
      metrics.push(new Metric('busy', new Date(), jobCounts.active, queueName))
      metrics.push(new Metric('bt', new Date(), busyTime, queueName))
    }

    return metrics
  }

  // The age of the oldest job in the active list, using the `processedOn` time (ms) set when a worker picks it up.
  // Reads only that field so we don't load job payloads.
  async busyTime(queue) {
    const jobIds = await this.redis.lrange(queue.keys.active, 0, -1)
    if (jobIds.length == 0) return 0

    const pipeline = this.redis.pipeline()
    for (const jobId of jobIds) pipeline.hget(queue.toKey(jobId), 'processedOn')
    const results = await pipeline.exec()
    const processedOns = results
      .map(([_err, processedOn]) => Number(processedOn))
      .filter((processedOn) => processedOn > 0)
    if (processedOns.length == 0) return 0

    return Math.max(0, Date.now() - Math.min(...processedOns))
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

      if (this._redis.listenerCount('error') === 0) {
        this._redis.on('error', (err) => {
          this.config.logger?.debug(`[Judoscale] Redis error: ${err.message}`)
        })
      }
    }

    return this._redis
  }
}

module.exports = BullMQMetricsCollector
