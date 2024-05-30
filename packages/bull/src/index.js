const { Judoscale } = require('judoscale-node-core')
const BullMetricsCollector = require('./bull-metrics-collector')
const packageInfo = require('../package.json')

Judoscale.registerAdapter('judoscale-bull', new BullMetricsCollector(), {
  adapter_version: packageInfo.version,
})

module.exports = {
  Judoscale,
}
