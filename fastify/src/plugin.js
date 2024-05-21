const fp = require('fastify-plugin')
const { Judoscale, MetricsStore, requestMetrics, WebMetricsCollector } = require('judoscale-node-core')
const packageInfo = require('../package.json')

const metricsStore = new MetricsStore()

async function rawPlugin(fastify, judoscale) {
  fastify.addHook('onRequest', async (request, _reply) => {
    try {
      const queueTime = requestMetrics.queueTimeFromHeaders(request.headers, Date.now())

      metricsStore.push('qt', queueTime)

      fastify.log.debug(`Queue Time: ${queueTime} ms`)
    } catch (err) {
      fastify.log.error(err, 'Error processing request queue time')
    }
  })
}

const plugin = fp(rawPlugin, {
  name: 'judoscale-fastify',
})

Judoscale.registerAdapter('judoscale-fastify', new WebMetricsCollector(metricsStore), {
  adapter_version: packageInfo.version,
})

module.exports = {
  Judoscale,
  plugin,
}
