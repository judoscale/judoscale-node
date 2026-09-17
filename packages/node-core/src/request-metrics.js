const process = require('process')

const MILLISECONDS_CUTOFF = Date.UTC(2000, 0, 1)
const MICROSECONDS_CUTOFF = MILLISECONDS_CUTOFF * 1000
const NANOSECONDS_CUTOFF = MICROSECONDS_CUTOFF * 1000

function startedAtMs(header) {
  // There are several variants of this header. We handle these:
  //   - whole milliseconds (Heroku)
  //   - whole microseconds
  //   - whole nanoseconds (Render)
  //   - fractional seconds (NGINX)
  //   - preceding "t=" (NGINX)
  const value = parseFloat(header.replace(/[^0-9.]/g, ''))

  if (!Number.isFinite(value)) return null

  // `value` could be seconds, milliseconds, microseconds or nanoseconds.
  // We use some arbitrary cutoffs to determine which one it is.
  if (value > NANOSECONDS_CUTOFF) return value / 1_000_000
  if (value > MICROSECONDS_CUTOFF) return value / 1_000
  if (value > MILLISECONDS_CUTOFF) return value
  return value * 1_000
}

function queueTimeFromHeaders(headers, now) {
  const requestStart = headers['x-request-start']
  if (!requestStart) return null

  const startedAt = startedAtMs(requestStart)
  if (startedAt === null) return null

  return Math.max(0, Math.round(now - startedAt))
}

function requestId(headers) {
  return headers['x-request-id']
}

function elapsedTime(startTime) {
  const endTime = monotonicTime()
  const elapsedTimeNs = endTime - startTime
  // Convert elapsed time calculated from nanoseconds to milliseconds.
  return Math.floor(Number(elapsedTimeNs) / 1_000_000)
}

function monotonicTime() {
  // `hrtime.bigint()` returns current high-resolution real time in nanoseconds.
  return process.hrtime.bigint()
}

module.exports = {
  queueTimeFromHeaders,
  requestId,
  elapsedTime,
  monotonicTime,
}
