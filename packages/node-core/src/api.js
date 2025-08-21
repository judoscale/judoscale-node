const fetch = require('node-fetch')

class Api {
  constructor(config) {
    this.config = config
    this.base_url = config.api_base_url
  }

  reportMetrics(reportJson) {
    return this.postJson('/v3/reports', reportJson)
  }

  postJson(path, data) {
    this.config.logger.debug(`[Judoscale] Posting to ${this.base_url}${path}`)

    return fetch(`${this.base_url}${path}`, {
      method: 'post',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

module.exports = Api
