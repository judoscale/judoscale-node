const fp = require('fastify-plugin')
const { Judoscale, MetricsStore, requestMetrics, WebMetricsCollector } = require('judoscale-node-core')
const packageInfo = require('../package.json')

const metricsStore = new MetricsStore()

async function rawPlugin(fastify) {
  fastify.addHook('onRequest', async (request, _reply) => {
    try {
      const queueTime = requestMetrics.queueTimeFromHeaders(request.headers, Date.now())

      if (queueTime !== null) {
        metricsStore.push('qt', queueTime)
      }

      fastify.log.debug(`Queue Time: ${queueTime} ms`)
    } catch (err) {
      fastify.log.error(err, 'Error processing request queue time')
    }
  })

  fastify.addHook('onRequest', async (request, _reply) => {
    request.judoscaleAppStartTime = requestMetrics.monotonicTime()
  })

  fastify.addHook('onResponse', async (request, _reply) => {
    const appTime = requestMetrics.elapsedTime(request.judoscaleAppStartTime)

    metricsStore.push('at', appTime)
    fastify.log.debug(`App Time: ${appTime} ms`)
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
