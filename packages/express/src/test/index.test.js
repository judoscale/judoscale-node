/* global test, expect, describe */

const http = require('http')
const express = require('express')
const request = require('supertest')
const { Judoscale, middleware } = require('../index.js')

const app = express()
app.use(middleware(new Judoscale()))
app.get('/test', (_req, res) => {
  res.send('Middleware test')
})

const expressAdapter = Judoscale.adapters.find((a) => a.identifier === 'judoscale-express')

test('adapter is registered', () => {
  expect(expressAdapter).toBeDefined()
  expect(expressAdapter.identifier).toEqual('judoscale-express')
})

describe('middleware', () => {
  test('captures request queue time in the metrics store', async () => {
    // Simulate 100ms queue time
    const simulatedHeaderTime = Date.now() - 100

    const response = await request(app).get('/test').set('x-request-start', simulatedHeaderTime.toString())
    expect(response.statusCode).toBe(200)
    expect(response.text).toBe('Middleware test')

    const metrics = expressAdapter.collector.collect()
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
    const response = await request(app).get('/test')
    expect(response.statusCode).toBe(200)

    const metrics = expressAdapter.collector.collect()
    // Only app time & utilization pct are tracked, queue time isn't.
    expect(metrics.length).toEqual(2)
    expect(metrics[0].identifier).toEqual('at')
    expect(metrics[1].identifier).toEqual('up')
  })

  test('releases utilization when the client aborts before the response finishes', async () => {
    const hangApp = express()
    hangApp.use(middleware(new Judoscale({ report_interval_seconds: 60 })))
    hangApp.get('/hang', (_req, _res) => {
      // Intentionally never ends the response
    })

    const server = http.createServer(hangApp)
    await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
    const { port } = server.address()

    await new Promise((resolve) => {
      const req = http.get({ hostname: '127.0.0.1', port, path: '/hang' }, () => {})
      req.on('error', () => {})
      req.on('socket', (socket) => {
        socket.on('connect', () => {
          // Abort before the handler can finish — close without finish
          setTimeout(() => {
            req.destroy()
            resolve()
          }, 20)
        })
      })
    })

    // Give the server time to emit response `close` and idle afterward
    await new Promise((resolve) => setTimeout(resolve, 80))

    const metrics = expressAdapter.collector.collect()
    const utilization = metrics.find((metric) => metric.identifier === 'up')

    expect(utilization).toBeDefined()
    // If the abort leaked the request counter, utilization would stay pegged at 100.
    expect(utilization.value).toBeLessThan(100)

    await new Promise((resolve) => server.close(resolve))
  })
})
