/* global test, expect, describe */

import Report from '../lib/report'
import Metric from '../lib/metric'

const collectors = [{ a: 'collector' }]
const adapter = {
  asJson: () => {
    'payload'
  },
  collectors,
}
const exampleConfig = { container: 'web.007' }
const metric = new Metric('some-identifier', new Date(), '1234')
const report = new Report(adapter, exampleConfig, [metric])

describe('constructor', () => {
  test('adapter property', () => {
    expect(report.adapter).toEqual(adapter)
  })

  test('config property', () => {
    expect(report.config).toEqual(exampleConfig)
  })
})

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
    expect(payload).toHaveProperty('adapters', report.adapter.asJson())
  })
})
