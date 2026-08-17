export async function register () {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('judoscale-bullmq')
    const { register: registerJudoscale } = await import('judoscale-nextjs')
    const { default: Redis } = await import('ioredis')

    const redis = new Redis(process.env.REDIS_URL || 'redis://127.0.0.1:6379', {
      maxRetriesPerRequest: null,
      enableReadyCheck: false
    })

    registerJudoscale({
      api_base_url: process.env.JUDOSCALE_URL || 'https://judoscale-node.requestcatcher.com',
      redis
    })
  }
}
