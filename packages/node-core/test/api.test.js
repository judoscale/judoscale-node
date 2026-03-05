/* global test, expect, describe, jest, beforeEach */

const Api = require('../src/api')
const Config = require('../src/config')
const fetch = require('node-fetch')

jest.mock('node-fetch', () => jest.fn().mockResolvedValue({}))

const api = new Api(new Config())

describe('constructor', () => {
  test('base_url property', () => {
    expect(api.base_url).toEqual(new Config().api_base_url)
  })
})

describe('reportMetrics', () => {
  test('Makes POST request to the api metrics endpoint', async () => {
    spy = jest.spyOn(AbortSignal, "timeout").mockReturnValue("signal-timeout")

    await api.reportMetrics({})

    expect(fetch).toHaveBeenCalledWith(`${api.base_url}/v3/reports`, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: "{}",
      signal: "signal-timeout"
    })
    expect(spy).toHaveBeenCalledWith(5000)

    spy.mockRestore()
  })

  test('Returns promise', () => {
    expect(api.reportMetrics({})).resolves.toEqual({})
  })
})

describe('postJson', () => {
  beforeEach(() => {
    fetch.mockReset()
    fetch.mockResolvedValue({})
  })

  test('retries on transient errors with exponential backoff', async () => {
    const timeoutError = new Error('signal timed out')
    timeoutError.name = 'TimeoutError'

    fetch
      .mockRejectedValueOnce(new TypeError('fetch failed'))
      .mockRejectedValueOnce(timeoutError)
      .mockResolvedValueOnce({ ok: true })

    const result = await api.postJson('/v3/reports', {})

    expect(result).toEqual({ ok: true })
    expect(fetch).toHaveBeenCalledTimes(3)
  })

  test('throws after exhausting all retries on transient errors', async () => {
    const error = new TypeError('fetch failed')
    fetch.mockRejectedValue(error)

    await expect(api.postJson('/v3/reports', {})).rejects.toThrow('fetch failed')
    expect(fetch).toHaveBeenCalledTimes(3)
  })

  test('does not retry on non-transient errors', async () => {
    const error = new Error('some other error')
    fetch.mockRejectedValueOnce(error)

    await expect(api.postJson('/v3/reports', {})).rejects.toThrow('some other error')
    expect(fetch).toHaveBeenCalledTimes(1)
  })
})
