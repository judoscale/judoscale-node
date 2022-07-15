import { defaultConfig } from 'judoscale-node-core'
import { MetricsStore } from 'judoscale-node-core'
import { Reporter } from 'judoscale-node-core'
import requestMetrics from './lib/request-metrics'
import WebMetricsCollector from './lib/web-metrics-collector'
import Adapter from './lib/adapter'

export default (config) => {
  const finalConfig = { ...defaultConfig, ...config }

  const store = new MetricsStore()
  const collectors = [new WebMetricsCollector(store)]
  const reporter = new Reporter()

  reporter.start(finalConfig, store, collectors, Adapter)

  return ({ headers }, _res, next) => {
    const now = finalConfig.now || new Date()
    const queueTime = requestMetrics.queueTimeFromHeaders(headers, now)

    if (queueTime !== null) {
      finalConfig.logger.debug(`[Judoscale] queue_time=${queueTime}ms request_id=${requestMetrics.requestId(headers)}`)
      store.push('qt', queueTime)
    }

    next()
  }
}
