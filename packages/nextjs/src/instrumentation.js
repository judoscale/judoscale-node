const http = require('http')
const https = require('https')
const {
  Judoscale,
  MetricsStore,
  requestMetrics,
  UtilizationTracker,
  WebMetricsCollector
} = require('judoscale-node-core')

const packageInfo = require('../package.json')

const metricsStore = new MetricsStore()
const utilizationTracker = new UtilizationTracker()

let httpPatchApplied = false
let adapterRegistered = false
let registerCalled = false
let judoscaleInstance = null

function instrumentRequest (req, res) {
  utilizationTracker.start()
  utilizationTracker.incr()

  const queueTime = requestMetrics.queueTimeFromHeaders(req.headers, new Date())

  if (queueTime !== null) {
    metricsStore.push('qt', queueTime)
  }

  const startTime = requestMetrics.monotonicTime()

  res.on('finish', () => {
    const appTime = requestMetrics.elapsedTime(startTime)
    metricsStore.push('at', appTime)
    utilizationTracker.decr()
  })
}

function patchOne (mod) {
  const Server = mod.Server
  const originalEmit = Server.prototype.emit
  if (originalEmit.__judoscalePatched) {
    return
  }

  function patchedEmit (event, ...args) {
    if (event === 'request') {
      const req = args[0]
      const res = args[1]
      if (req && res) {
        instrumentRequest(req, res)
      }
    }
    return originalEmit.apply(this, [event, ...args])
  }

  patchedEmit.__judoscalePatched = true
  patchedEmit.__judoscaleOriginalEmit = originalEmit
  Server.prototype.emit = patchedEmit
}

function ensureHttpInstrumentation () {
  if (httpPatchApplied) {
    return
  }
  patchOne(http)
  patchOne(https)
  httpPatchApplied = true
}

function ensureAdapterRegistered () {
  if (adapterRegistered) {
    return
  }

  const nextPackageInfo = require('next/package.json')

  Judoscale.registerAdapter(
    'judoscale-nextjs',
    new WebMetricsCollector(metricsStore, utilizationTracker),
    {
      adapter_version: packageInfo.version,
      runtime_version: nextPackageInfo.version
    }
  )
  adapterRegistered = true
}

function register (options = {}) {
  if (process.env.NEXT_RUNTIME && process.env.NEXT_RUNTIME !== 'nodejs') {
    return undefined
  }

  if (registerCalled) {
    return judoscaleInstance
  }

  registerCalled = true

  ensureHttpInstrumentation()
  ensureAdapterRegistered()

  const { judoscale, ...judoscaleOptions } = options
  judoscaleInstance = judoscale ?? new Judoscale(judoscaleOptions)

  return judoscaleInstance
}

module.exports = {
  register
}
