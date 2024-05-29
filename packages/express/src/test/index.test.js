/* global test, expect, describe, beforeEach, jest */

const { Judoscale } = require('judoscale-node-core')
const { middleware } = require('../index.js')

test('adapter is registered', () => {
  expect(Judoscale.adapters.length).toEqual(1)
  expect(Judoscale.adapters[0].identifier).toEqual('judoscale-express')
})

describe('middleware', () => {
  let req, res, next, judoscale

  beforeEach(() => {
    req = { headers: {} }
    res = {}
    next = jest.fn()
    judoscale = new Judoscale()
  })

  test('captures request queue time in the metrics store', () => {
    // Simulate 100ms queue time
    req.headers['x-request-start'] = (Date.now() - 100).toString()
    middleware(judoscale)(req, res, next)

    const metrics = Judoscale.adapters[0].collector.collect()

    expect(next).toHaveBeenCalled()
    expect(metrics.length).toEqual(1)
    // Queue time should be 100-200ms depending how long the test takes to run
    expect(metrics[0].value).toBeGreaterThanOrEqual(100)
    expect(metrics[0].value).toBeLessThan(200)
  })

  test('gracefully handles missing queue time', () => {
    middleware(judoscale)(req, res, next)

    const metrics = Judoscale.adapters[0].collector.collect()

    expect(next).toHaveBeenCalled()
    expect(metrics).toEqual([])
  })
})
