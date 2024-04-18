import Fastify from 'fastify'
import judoscale from 'judoscale-fastify'

const fastify = Fastify({
  logger: {
    level: process.env.LOG_LEVEL || 'debug',
  },
})

fastify.register(judoscale, {
  log_level: process.env.LOG_LEVEL || 'debug',
  api_base_url: process.env.JUDOSCALE_URL || 'https://judoscale-node-sample.requestcatcher.com',
})

fastify.get('/', function (request, reply) {
  reply.send({ hello: 'world' })
})

fastify.listen({ port: process.env.PORT || 3000 }, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
})
