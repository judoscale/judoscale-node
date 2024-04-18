const fp = require('fastify-plugin')
const { MetricsStore } = require('judoscale-node-core')

const metricsStore = new MetricsStore()

async function judoscaleFastify(fastify, options) {
  fastify.addHook('onRequest', async (request, reply) => {
    try {
      const startTime = Date.now()
      const requestStart = parseInt(request.headers['x-request-start']) || startTime
      const queueTime = startTime - requestStart

      metricsStore.push(queueTime)

      fastify.log.info(`Queue Time: ${queueTime} ms`)
    } catch (err) {
      fastify.log.error(err, 'Error processing request queue time')
    }
  })
}

// Export the plugin wrapped with fastify-plugin
module.exports = fp(judoscaleFastify, {
  name: 'judoscale-fastify',
})
