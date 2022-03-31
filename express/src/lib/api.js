/**
 * @fileoverview Handles requests to Judoscale's backend
 * @author Carlos Marques
 */

import unirest from 'unirest'

class Api {
  constructor(config) {
    this.config = config
    this.base_url = config.api_base_url
  }

  reportMetrics(reportJson) {
    return this.postJson('/v1/metrics', reportJson)
  }

  postJson(path, data) {
    return unirest.post(`${this.base_url}${path}`)
      .headers({ 'Content-Type': 'application/json' })
      .send(data)
  }
}

export default Api
