import unirest from 'unirest'

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

    return unirest.post(`${this.base_url}${path}`).headers({ 'Content-Type': 'application/json' }).send(data)
  }
}

export default Api
