/* global test, expect, describe */

const Report = require('../lib/report')
const Metric = require('../lib/metric')

const adapter = { identifier: 'some-adapter' }
const exampleConfig = { container: 'web.007' }
const metric = new Metric('some-identifier', new Date(), '1234')
const report = new Report([adapter], exampleConfig, [metric])

describe('payload', () => {
  const payload = report.payload()

  test('metrics with property value', () => {
    expect(payload).toHaveProperty('metrics', [[metric.time.getTime() / 1000, metric.value, metric.identifier, null]])
  })

  test('container with property value', () => {
    expect(payload).toHaveProperty('container', 'web.007')
  })

  test('pid with property value', () => {
    expect(payload).toHaveProperty('pid', process.pid)
  })

  test('adapters with property value', () => {
    expect(payload.adapters['some-adapter']).toEqual({})
  })

  test('config with property value', () => {
    expect(typeof payload.config).toEqual('object')
    expect(payload.config.container).toEqual('web.007')
  })
})
