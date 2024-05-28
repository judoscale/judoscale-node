const { Judoscale, MetricsStore, requestMetrics, WebMetricsCollector } = require('judoscale-node-core')
const packageInfo = require('../package.json')

const store = new MetricsStore()

function middleware(judoscale) {
  return ({ headers }, _res, next) => {
    const now = judoscale.config.now || new Date()
    const queueTime = requestMetrics.queueTimeFromHeaders(headers, now)

    if (queueTime !== null) {
      judoscale.config.logger.debug(
        `[Judoscale] queue_time=${queueTime}ms request_id=${requestMetrics.requestId(headers)}`
      )
      store.push('qt', queueTime)
    }

    next()
  }
}

Judoscale.registerAdapter('judoscale-express', new WebMetricsCollector(store), {
  adapter_version: packageInfo.version,
})

module.exports = { Judoscale, middleware }
