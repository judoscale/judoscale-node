const fastify = require('fastify')
const { Judoscale, plugin } = require('../src/plugin')

describe('Judoscale Fastify Plugin', () => {
  let app

  beforeEach(async () => {
    app = fastify()
    app.register(plugin)

    await app.ready()
  })

  afterEach(() => app.close())

  test('captures request queue time and returns it from the collector', async () => {
    // Simulate 100ms queue time
    const simulatedHeaderTime = Date.now() - 100

    await app.inject({
      method: 'GET',
      url: '/',
      headers: {
        'x-request-start': simulatedHeaderTime.toString(),
      },
    })

    const metrics = Judoscale.adapters[0].collector.collect()

    expect(metrics.length).toEqual(1)

    // Queue time should be 100-200ms depending how long the test takes to run
    expect(metrics[0].value).toBeGreaterThanOrEqual(100)
    expect(metrics[0].value).toBeLessThan(200)
  })

  test('gracefully handles missing queue time', async () => {
    await app.inject({
      method: 'GET',
      url: '/',
      headers: {},
    })

    const metrics = Judoscale.adapters[0].collector.collect()

    expect(metrics).toEqual([])
  })
})
