import redisClient from './lib/redis-client'

export default (async () => {
  const queueNameRegExp = /(.*):(.*):id/
  const keys = await redisClient.keys('*:*:id')

  return keys.map((key) => {
    const match = queueNameRegExp.exec(key)

    if (match) {
      return {
        prefix: match[1],
        name: match[2],
      }
    }

    return null
  })
})()
