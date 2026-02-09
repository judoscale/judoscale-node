const fp = require('fastify-plugin')
const { Judoscale, MetricsStore, requestMetrics, UtilizationTracker, WebMetricsCollector } = require('judoscale-node-core')
const packageInfo = require('../package.json')
const fastifyPackageInfo = require('fastify/package.json')

const metricsStore = new MetricsStore()
const utilizationTracker = new UtilizationTracker()

async function rawPlugin(fastify) {
  fastify.addHook('onRequest', async (_request, _reply) => {
    utilizationTracker.start()
    utilizationTracker.incr()
  })

  fastify.addHook('onRequest', async (request, _reply) => {
    const queueTime = requestMetrics.queueTimeFromHeaders(request.headers, new Date())

    if (queueTime !== null) {
      metricsStore.push('qt', queueTime)
      fastify.log.debug(`[Judoscale] queue_time=${queueTime}ms`)
    }
  })

  fastify.addHook('onRequest', async (request, _reply) => {
    request.judoscaleAppStartTime = requestMetrics.monotonicTime()
  })

  fastify.addHook('onResponse', async (request, _reply) => {
    const appTime = requestMetrics.elapsedTime(request.judoscaleAppStartTime)
    metricsStore.push('at', appTime)
    fastify.log.debug(`[Judoscale] app_time=${appTime}ms`)
  })

  fastify.addHook('onResponse', async (_request, _reply) => {
    utilizationTracker.decr()
  })
}

const plugin = fp(rawPlugin, {
  name: 'judoscale-fastify',
})

Judoscale.registerAdapter('judoscale-fastify', new WebMetricsCollector(metricsStore, utilizationTracker), {
  adapter_version: packageInfo.version,
  runtime_version: fastifyPackageInfo.version,
})

module.exports = {
  Judoscale,
  plugin,
}
