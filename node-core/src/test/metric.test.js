/* global test, expect, describe */

const Metric = require('../lib/metric')

const identifier = 'some-identifier'
const time = new Date()
const value = '1234'
const metric = new Metric(identifier, time, value)

describe('Metric', () => {
  describe('constructor', () => {
    test('identifier property', () => {
      expect(metric.identifier).toBe(identifier)
    })

    test('time property converts its value to UTC', () => {
      expect(metric.time).toEqual(new Date(time.toUTCString()))
    })

    test('value property converts its value to Number', () => {
      expect(metric.value).toBe(1234)
    })
  })
})
