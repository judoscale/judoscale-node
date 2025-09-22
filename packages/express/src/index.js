const { Judoscale, MetricsStore, requestMetrics, UtilizationTracker, WebMetricsCollector } = require('judoscale-node-core')
const packageInfo = require('../package.json')

const metricsStore = new MetricsStore()
const utilizationTracker = new UtilizationTracker()

function middleware(judoscale) {
  return (req, res, next) => {
    utilizationTracker.start()
    utilizationTracker.incr()

    const queueTime = requestMetrics.queueTimeFromHeaders(req.headers, new Date())
    const requestId = requestMetrics.requestId(req.headers)

    if (queueTime !== null) {
      metricsStore.push('qt', queueTime)
      judoscale.config.logger.debug(`[Judoscale] queue_time=${queueTime}ms request_id=${requestId}`)
    }

    const startTime = requestMetrics.monotonicTime()

    res.on('finish', () => {
      const appTime = requestMetrics.elapsedTime(startTime)
      metricsStore.push('at', appTime)
      judoscale.config.logger.debug(`[Judoscale] app_time=${appTime}ms request_id=${requestId}`)

      utilizationTracker.decr()
    })

    next()
  }
}

Judoscale.registerAdapter('judoscale-express', new WebMetricsCollector(metricsStore, utilizationTracker), {
  adapter_version: packageInfo.version,
})

module.exports = { Judoscale, middleware }
