module.exports = {
  /**
   * Calculates the request queue time based on the X-Request-Start header.
   *
   * @param {object} headers - HTTP headers
   * @param {Date} now - represents the current time (optional)
   * @returns {number} of milliseconds the request was queued
   */
  queueTimeFromHeaders: function (headers, now) {
    // Heroku sets the header as integer milliseconds.
    // NGINX sets the header as fractional sections preceeded by "t=".
    // We can cover both scenarios by stripping all non-digits and treating as milliseconds.
    let requestStart = headers['x-request-start']

    if (requestStart) {
      requestStart = requestStart.replace(/\D/g, '')
      const queueTime = now - new Date(Number(requestStart))
      return Math.max(0, queueTime)
    }
  }
}
