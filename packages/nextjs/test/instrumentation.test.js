/* global test, expect, describe, beforeAll */

const http = require('http')
const { Judoscale, register } = require('../src/index')

const nextAdapter = () =>
  Judoscale.adapters.find((a) => a.identifier === 'judoscale-nextjs')

beforeAll(() => {
  register({})
})

test('adapter is registered', () => {
  expect(nextAdapter()).toBeDefined()
  expect(nextAdapter().identifier).toEqual('judoscale-nextjs')
  expect(nextAdapter().meta.runtime_version).toBeDefined()
})

test('register is idempotent', () => {
  const j = register({})
  expect(register({})).toBe(j)
})

describe('HTTP instrumentation', () => {
  test('captures request queue time and app time from collector', async () => {
    const simulatedHeaderTime = Date.now() - 100

    const server = http.createServer((_req, res) => {
      res.end('ok')
    })

    await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
    const { port } = server.address()

    await new Promise((resolve, reject) => {
      http.get(
        {
          hostname: '127.0.0.1',
          port,
          path: '/',
          headers: { 'x-request-start': simulatedHeaderTime.toString() }
        },
        (res) => {
          res.on('data', () => {})
          res.on('end', resolve)
        }
      ).on('error', reject)
    })

    server.close()

    const metrics = nextAdapter().collector.collect()
    expect(metrics.length).toEqual(3)
    expect(metrics[0].identifier).toEqual('qt')
    expect(metrics[0].value).toBeGreaterThanOrEqual(100)
    expect(metrics[0].value).toBeLessThan(200)
    expect(metrics[1].identifier).toEqual('at')
    expect(metrics[1].value).toBeGreaterThanOrEqual(0)
    expect(metrics[2].identifier).toEqual('up')
    expect(metrics[2].value).toBeGreaterThanOrEqual(0)
  })

  test('gracefully handles missing queue time', async () => {
    const server = http.createServer((_req, res) => {
      res.end('ok')
    })

    await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
    const { port } = server.address()

    await new Promise((resolve, reject) => {
      http.get(
        {
          hostname: '127.0.0.1',
          port,
          path: '/'
        },
        (res) => {
          res.on('data', () => {})
          res.on('end', resolve)
        }
      ).on('error', reject)
    })

    server.close()

    const metrics = nextAdapter().collector.collect()
    expect(metrics.length).toEqual(2)
    expect(metrics[0].identifier).toEqual('at')
    expect(metrics[1].identifier).toEqual('up')
  })
})
