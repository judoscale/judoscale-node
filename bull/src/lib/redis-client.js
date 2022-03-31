import { createClient } from 'redis'
import config from './config'

export default (async () => {
  const client = createClient({ url: config.redisUrl })

  client.on('error', (err) => config.log('Redis Client Error', err))

  await client.connect()

  return client
})()
