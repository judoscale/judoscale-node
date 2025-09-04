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
  return Math.floor(endTime - startTime)
}

function monotonicTime() {
  // `hrtime.bigint()` returns current high-resolution real time in nanoseconds,
  // we convert to work with milliseconds.
  return Number(process.hrtime.bigint()) / 1_000_000
}

module.exports = {
  queueTimeFromHeaders,
  requestId,
  elapsedTime,
  monotonicTime
}
