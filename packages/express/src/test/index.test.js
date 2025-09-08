/* global test, expect, describe */

const express = require('express')
const request = require('supertest')
const { Judoscale, middleware } = require('../index.js')

const app = express()
app.use(middleware(new Judoscale()))
app.get('/test', (_req, res) => {
  res.send('Middleware test')
})

test('adapter is registered', () => {
  expect(Judoscale.adapters.length).toEqual(1)
  expect(Judoscale.adapters[0].identifier).toEqual('judoscale-express')
})

describe('middleware', () => {
  test('captures request queue time in the metrics store', async () => {
    // Simulate 100ms queue time
    const simulatedHeaderTime = Date.now() - 100

    const response = await request(app).get('/test').set('x-request-start', simulatedHeaderTime.toString())
    expect(response.statusCode).toBe(200)
    expect(response.text).toBe('Middleware test')

    const metrics = Judoscale.adapters[0].collector.collect()
    expect(metrics.length).toEqual(2)
    // Queue time should be 100-200ms depending how long the test takes to run
    expect(metrics[0].identifier).toEqual('qt')
    expect(metrics[0].value).toBeGreaterThanOrEqual(100)
    expect(metrics[0].value).toBeLessThan(200)
    expect(metrics[1].identifier).toEqual('at')
    expect(metrics[1].value).toBeGreaterThanOrEqual(0)
  })

  test('gracefully handles missing queue time', async () => {
    const response = await request(app).get('/test')
    expect(response.statusCode).toBe(200)

    const metrics = Judoscale.adapters[0].collector.collect()
    // Only app time is tracked, queue time isn't.
    expect(metrics.length).toEqual(1)
    expect(metrics[0].identifier).toEqual('at')
  })
})
