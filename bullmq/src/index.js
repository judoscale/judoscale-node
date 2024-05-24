const { mergeConfig, Reporter } = require('judoscale-node-core')
const Adapter = require('./adapter')
const BullMQMetricsCollector = require('./bull-mq-metrics-collector')

module.exports = function initJudoscaleBullMQ(config = {}) {
  const finalConfig = mergeConfig(config)
  const collectors = [new BullMQMetricsCollector()]
  const reporter = new Reporter()

  reporter.start(finalConfig, collectors, Adapter)
}
