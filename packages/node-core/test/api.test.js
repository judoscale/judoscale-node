/* global test, expect, describe, jest */

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
  test('Makes POST request to the api metrics endpoint', () => {
    spy = jest.spyOn(AbortSignal, "timeout").mockReturnValue("signal-timeout")

    api.reportMetrics({})

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
