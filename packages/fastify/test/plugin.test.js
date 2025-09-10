/* global test, expect, describe, beforeAll, afterAll */

const fastify = require('fastify')
const { Judoscale, plugin } = require('../src/plugin')

const app = fastify()
app.register(plugin, new Judoscale())
app.get('/test', async (_request, _reply) => {
  return { message: 'Middleware test' }
})

test('adapter is registered', () => {
  expect(Judoscale.adapters.length).toEqual(1)
  expect(Judoscale.adapters[0].identifier).toEqual('judoscale-fastify')
})

describe('Judoscale Fastify Plugin', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  test('captures request queue time and returns it from the collector', async () => {
    // Simulate 100ms queue time
    const simulatedHeaderTime = Date.now() - 100

    const response = await app.inject({
      method: 'GET',
      url: '/test',
      headers: { 'x-request-start': simulatedHeaderTime.toString() }
    })
    expect(response.statusCode).toBe(200)
    expect(JSON.parse(response.body)).toEqual({ message: 'Middleware test' })

    const metrics = Judoscale.adapters[0].collector.collect()
    expect(metrics.length).toEqual(3)
    // Queue time should be 100-200ms depending how long the test takes to run
    expect(metrics[0].identifier).toEqual('qt')
    expect(metrics[0].value).toBeGreaterThanOrEqual(100)
    expect(metrics[0].value).toBeLessThan(200)
    expect(metrics[1].identifier).toEqual('at')
    expect(metrics[1].value).toBeGreaterThanOrEqual(0)
    expect(metrics[2].identifier).toEqual('up')
    expect(metrics[2].value).toBeGreaterThanOrEqual(0)
  })

  test('gracefully handles missing queue time', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/test',
      headers: {}
    })
    expect(response.statusCode).toBe(200)

    const metrics = Judoscale.adapters[0].collector.collect()
    // Only app time & utilization pct are tracked, queue time isn't.
    expect(metrics.length).toEqual(2)
    expect(metrics[0].identifier).toEqual('at')
    expect(metrics[1].identifier).toEqual('up')
  })
})
