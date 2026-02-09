const Api = require('./api')
const requestMetrics = require('./request-metrics')
const Metric = require('./metric')
const MetricsStore = require('./metrics-store')
const Report = require('./report')
const Reporter = require('./reporter')
const UtilizationTracker = require('./utilization-tracker')
const WebMetricsCollector = require('./web-metrics-collector')
const WorkerMetricsCollector = require('./worker-metrics-collector')
const Judoscale = require('./judoscale')
const packageInfo = require('../package.json')

Judoscale.registerAdapter('judoscale-node', null, {
  adapter_version: packageInfo.version,
  runtime_version: process.version,
})

module.exports = {
  Judoscale,
  Api,
  requestMetrics,
  Metric,
  MetricsStore,
  Report,
  Reporter,
  UtilizationTracker,
  WebMetricsCollector,
  WorkerMetricsCollector,
}
