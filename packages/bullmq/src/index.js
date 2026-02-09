const { Judoscale } = require('judoscale-node-core')
const BullMQMetricsCollector = require('./bull-mq-metrics-collector')
const packageInfo = require('../package.json')
const bullmqPackageInfo = require('bullmq/package.json')

Judoscale.registerAdapter('judoscale-bullmq', new BullMQMetricsCollector(), {
  adapter_version: packageInfo.version,
  runtime_version: bullmqPackageInfo.version,
})

module.exports = {
  Judoscale,
}
