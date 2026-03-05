const fetch = globalThis.fetch || require('node-fetch')

const MAX_RETRIES = 3

class Api {
  constructor(config) {
    this.config = config
    this.base_url = config.api_base_url
  }

  reportMetrics(reportJson) {
    return this.postJson('/v3/reports', reportJson)
  }

  async postJson(path, data) {
    const url = `${this.base_url}${path}`
    const body = JSON.stringify(data)

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      this.config.logger.debug(`[Judoscale] Posting to ${url}`)

      try {
        return await fetch(url, {
          method: 'post',
          body,
          headers: { 'Content-Type': 'application/json' },
          signal: AbortSignal.timeout(5000)
        })
      } catch (err) {
        if (this._isTransientError(err) && attempt < MAX_RETRIES) {
          const delay = 0.25 * Math.pow(2, attempt - 1)
          await new Promise((resolve) => setTimeout(resolve, delay * 1000))
        } else {
          throw err
        }
      }
    }
  }

  _isTransientError(err) {
    return (
      err.name === 'TypeError' ||
      err.name === 'AbortError' ||
      err.name === 'TimeoutError'
    )
  }
}

module.exports = Api
