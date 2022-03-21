/* global test, expect, describe */

import Metric from '../lib/metric'

test('Metric class', () => {
  const identifier = 'some-identifier'
  const time = new Date()
  const value = '1234'
  const metric = new Metric(identifier, time, value)

  expect(metric.identifier).toBe(identifier)
  expect(metric.time).toEqual(new Date(time.toUTCString()))
  expect(metric.value).toBe(1234)
})
