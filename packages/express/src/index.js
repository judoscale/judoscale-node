const { Judoscale, MetricsStore, requestMetrics, WebMetricsCollector } = require('judoscale-node-core')
const packageInfo = require('../package.json')

const store = new MetricsStore()

function middleware(judoscale) {
  return (req, res, next) => {
    const now = judoscale.config.now || new Date()
    const queueTime = requestMetrics.queueTimeFromHeaders(req.headers, now)
    const requestId = requestMetrics.requestId(req.headers)

    if (queueTime !== null) {
      judoscale.config.logger.debug(`[Judoscale] queue_time=${queueTime}ms request_id=${requestId}`)
      store.push('qt', queueTime)
    }

    const startTime = process.hrtime.bigint();

    res.on('finish', () => {
      const endTime = process.hrtime.bigint();
      const appTimeNs = endTime - startTime
      const appTimeMs = Math.floor(Number(appTimeNs) / 1_000_000)

      store.push('at', appTimeMs)
      judoscale.config.logger.debug(`[Judoscale] app_time=${appTimeMs}ms request_id=${requestId}`)
    })

    next()
  }
}

Judoscale.registerAdapter('judoscale-express', new WebMetricsCollector(store), {
  adapter_version: packageInfo.version,
})

module.exports = { Judoscale, middleware }
