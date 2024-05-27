import Api from './lib/api'
import defaultConfigFunction from './lib/default-config'
import mergeConfig from './lib/merge-config'
import logger from './lib/logger'
import requestMetrics from './lib/request-metrics'
import Metric from './lib/metric'
import MetricsStore from './lib/metrics-store'
import Report from './lib/report'
import Reporter from './lib/reporter'
import WebMetricsCollector from './lib/web-metrics-collector'
import WorkerMetricsCollector from './lib/worker-metrics-collector'
import Judoscale from './lib/judoscale'

const defaultConfig = defaultConfigFunction()

export {
  Judoscale,
  Api,
  mergeConfig,
  logger,
  requestMetrics,
  Metric,
  MetricsStore,
  Report,
  Reporter,
  WebMetricsCollector,
  WorkerMetricsCollector,
  defaultConfig,
}
