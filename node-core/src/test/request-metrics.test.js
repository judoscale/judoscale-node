/* global test, expect, describe */

const RequestMetrics = require('../lib/request-metrics')

describe('RequestMetrics', () => {
  describe('queueTimeFromHeaders', () => {
    test('Handle Heroku router format', () => {
      const now = new Date('2012-12-12T12:12:12.012Z')
      const requestStart = new Date(now.getTime() - 100).getTime().toString()
      const headers = { 'x-request-start': requestStart }

      expect(RequestMetrics.queueTimeFromHeaders(headers, now)).toBe(100)
    })

    test('Handle Nginx format', () => {
      const now = new Date('2012-12-12T12:12:12.012Z')
      const requestStart = `t=${(new Date(now.getTime() - 100).getTime() / 1000).toString()}`
      const headers = { 'x-request-start': requestStart }

      expect(RequestMetrics.queueTimeFromHeaders(headers, now)).toBe(100)
    })

    test('Handle negative queue time', () => {
      const now = new Date('2012-12-12T12:12:12.012Z')
      const requestStart = new Date(now.getTime() + 100).getTime().toString()
      const headers = { 'x-request-start': requestStart }

      expect(RequestMetrics.queueTimeFromHeaders(headers, now)).toBe(0)
    })

    test('Handle missing header', () => {
      expect(RequestMetrics.queueTimeFromHeaders({})).toBe(null)
    })
  })

  describe('requestId', () => {
    test('Request ID from headers', () => {
      expect(RequestMetrics.requestId({ 'x-request-id': 'someidvalue' })).toBe('someidvalue')
    })
  })
})
