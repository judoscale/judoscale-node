const fastify = require('fastify')
const judoscalePlugin = require('../src/plugin')
const { MetricsStore } = require('judoscale-node-core')

describe('Judoscale Fastify Plugin', () => {
  let app, metricsStore

  beforeEach(async () => {
    metricsStore = new MetricsStore()
    app = fastify()
    app.register(judoscalePlugin, { metricsStore })

    await app.ready()
  })

  afterEach(() => app.close())

  test('captures queue time in MetricsStore', async () => {
    // Simulate 100ms queue time
    const simulatedHeaderTime = Date.now() - 100

    await app.inject({
      method: 'GET',
      url: '/',
      headers: {
        'x-request-start': simulatedHeaderTime.toString(),
      },
    })

    const metrics = metricsStore.flush()

    expect(metrics.length).toEqual(1)

    // Queue time should be 100-110ms
    expect(metrics[0].value).toBeGreaterThanOrEqual(100)
    expect(metrics[0].value).toBeLessThan(110)
  })
})
