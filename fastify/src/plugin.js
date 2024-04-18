const fp = require('fastify-plugin')
const { mergeConfig, Reporter, MetricsStore, requestMetrics, WebMetricsCollector } = require('judoscale-node-core')
const Adapter = require('./adapter')

async function judoscaleFastify(fastify, options) {
  // Allow injection for testing
  const metricsStore = options.metricsStore || new MetricsStore()
  const finalConfig = mergeConfig(options)
  const collectors = [new WebMetricsCollector(metricsStore)]
  const reporter = new Reporter()

  reporter.start(finalConfig, metricsStore, collectors, Adapter)

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

module.exports = fp(judoscaleFastify, {
  name: 'judoscale-fastify',
})
