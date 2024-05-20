const { mergeConfig, Reporter } = require('judoscale-node-core')
const Adapter = require('./Adapter')
// const BullMQMetricsCollector = require('./BullMQMetricsCollector')

module.exports = function initJudoscaleBullMQ(config = {}) {
  const finalConfig = mergeConfig(config)
  // const collectors = [new BullMQMetricsCollector()]
  const collectors = []
  const reporter = new Reporter()

  reporter.start(finalConfig, collectors, Adapter)
}
