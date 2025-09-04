/* global test, expect, describe */

jest.mock('process', () => {
  return {
    ...jest.requireActual('process'),
    hrtime: { bigint: jest.fn().mockReturnValue(1_000_000_000_000n) }
  }
})

const RequestMetrics = require('../src/request-metrics')

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

  describe('elapsedTime', () => {
    test('Calculates elapsed time in milliseconds from the given start time', () => {
      expect(RequestMetrics.monotonicTime()).toBe(1_000_000_000_000n)

      expect(RequestMetrics.elapsedTime(1_000_000_000_000n)).toBe(0)
      expect(RequestMetrics.elapsedTime(999_999_000_000n)).toBe(1)
      expect(RequestMetrics.elapsedTime(999_000_000_000n)).toBe(1_000)
      expect(RequestMetrics.elapsedTime(500_000_000_000n)).toBe(500_000)
    })
  })
})
