const {
  Judoscale,
  MetricsStore,
  onResponseSettled,
  requestMetrics,
  UtilizationTracker,
  WebMetricsCollector,
} = require('judoscale-node-core')
const packageInfo = require('../package.json')
const expressPackageInfo = require('express/package.json')

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

    // Listen for both finish and close: aborted clients often emit close without
    // finish, which would otherwise leak the utilization counter at > 0 forever.
    onResponseSettled(res, (reason) => {
      if (reason === 'finish') {
        const appTime = requestMetrics.elapsedTime(startTime)
        metricsStore.push('at', appTime)
        judoscale.config.logger.debug(`[Judoscale] app_time=${appTime}ms request_id=${requestId}`)
      }

      utilizationTracker.decr()
    })

    next()
  }
}

Judoscale.registerAdapter('judoscale-express', new WebMetricsCollector(metricsStore, utilizationTracker), {
  adapter_version: packageInfo.version,
  runtime_version: expressPackageInfo.version,
})

module.exports = { Judoscale, middleware }
