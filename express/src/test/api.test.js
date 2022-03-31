/* global test, expect, describe, jest */

import Api from '../lib/api'
import defaultConfig from '../lib/default-config'
import unirest from 'unirest'

jest.mock('unirest', () => {
  const originalModule = jest.requireActual('unirest')

  return {
    ...originalModule,
    post: jest.fn().mockReturnThis(),
    headers: jest.fn().mockReturnThis(),
    send: jest.fn().mockResolvedValue({})
  }
})

const api = new Api(defaultConfig)

describe('constructor', () => {
  test('config property', () => {
    expect(api.config).toEqual(defaultConfig)
  })

  test('base_url property', () => {
    expect(api.base_url).toEqual(defaultConfig.api_base_url)
  })
})

describe('reportMetrics', () => {
  test('Makes POST request to the api metrics endpoint', () => {
    api.reportMetrics({})

    expect(unirest.post).toHaveBeenCalledWith(`${api.base_url}/v1/metrics`)
    expect(unirest.headers).toHaveBeenCalledWith({ 'Content-Type': 'application/json' })
    expect(unirest.send).toHaveBeenCalledWith({})
  })

  test('Returns promisse', () => {
    expect(api.reportMetrics({})).resolves.toEqual({})
  })
})
