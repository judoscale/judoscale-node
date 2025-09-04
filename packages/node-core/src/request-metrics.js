const process = require('process');

function queueTimeFromHeaders(headers, now) {
  // Heroku sets the header as integer milliseconds.
  // NGINX sets the header as fractional sections preceeded by "t=".
  // We can cover both scenarios by stripping all non-digits and treating as milliseconds.
  let requestStart = headers['x-request-start']

  if (requestStart) {
    requestStart = requestStart.replace(/\D/g, '')
    const queueTime = now - new Date(Number(requestStart))
    return Math.max(0, queueTime)
  }

  return null
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
  monotonicTime
}
