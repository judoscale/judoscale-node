import { Judoscale, MetricsStore, requestMetrics, WebMetricsCollector } from 'judoscale-node-core'
import Adapter from './lib/adapter'

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

Judoscale.registerAdapter(new Adapter(new WebMetricsCollector(store)))

export { Judoscale, middleware }
