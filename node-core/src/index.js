const Api = require('./lib/api')
const defaultConfigFunction = require('./lib/default-config')
const mergeConfig = require('./lib/merge-config')
const logger = require('./lib/logger')
const requestMetrics = require('./lib/request-metrics')
const Metric = require('./lib/metric')
const MetricsStore = require('./lib/metrics-store')
const Report = require('./lib/report')
const Reporter = require('./lib/reporter')
const WebMetricsCollector = require('./lib/web-metrics-collector')
const WorkerMetricsCollector = require('./lib/worker-metrics-collector')
const Judoscale = require('./lib/judoscale')

const defaultConfig = defaultConfigFunction()

module.exports = {
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
