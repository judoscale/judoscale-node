const fastify = require('fastify')
const judoscalePlugin = require('../src/plugin')

describe('Judoscale Fastify Plugin', () => {
  let app

  beforeEach(async () => {
    app = fastify()
    app.register(judoscalePlugin)
    await app.ready()
  })

  afterEach(() => app.close())

  test('calculates and logs queue time correctly', async () => {
    const startTime = Date.now()
    const simulatedHeaderTime = startTime - 100 // simulate 100 ms queue time

    const response = await app.inject({
      method: 'GET',
      url: '/',
      headers: {
        'x-request-start': simulatedHeaderTime.toString(),
      },
    })

    // Assert that the log includes the correct queue time
    expect(app.log.info).toHaveBeenCalledWith(`Queue Time: 100 ms`)
  })
})
