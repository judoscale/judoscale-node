const { mergeConfig, Reporter, Judoscale } = require('judoscale-node-core')
const Adapter = require('./adapter')
const BullMQMetricsCollector = require('./bull-mq-metrics-collector')

Judoscale.registerAdapter(new Adapter(new BullMQMetricsCollector()))

module.exports = {
  Judoscale,
}
