/* global test, expect, describe */

const { Api, Metric, MetricsStore, Report, Reporter } = require('../src/index')

describe('exports', () => {
  test('Api', () => {
    expect(Api).toBeDefined()
  })

  test('Metric', () => {
    expect(Metric).toBeDefined()
  })

  test('MetricStore', () => {
    expect(MetricsStore).toBeDefined()
  })

  test('Report', () => {
    expect(Report).toBeDefined()
  })

  test('Reporter', () => {
    expect(Reporter).toBeDefined()
  })
})
