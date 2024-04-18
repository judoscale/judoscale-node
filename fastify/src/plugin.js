const fp = require('fastify-plugin')
const { MetricsStore } = require('judoscale-node-core')

async function judoscaleFastify(fastify, options) {
  // Allow injection for testing
  const metricsStore = options.metricsStore || new MetricsStore()

  fastify.addHook('onRequest', async (request, _reply) => {
    try {
      const startTime = Date.now()
      const requestStart = parseInt(request.headers['x-request-start']) || startTime
      const queueTime = startTime - requestStart

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
