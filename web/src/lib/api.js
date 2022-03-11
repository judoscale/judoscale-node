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

  registerReporter(registrationJson) {
    return this.postJson('/adapter/v1/registrations', { registration: registrationJson })
  }

  reportMetrics(reportJson) {
    return this.postJson('/adapter/v1/metrics', reportJson)
  }

  postJson(path, data) {
    return unirest.post(`${this.base_url}${path}`)
      .headers({ 'Content-Type': 'application/json' })
      .send(data)
  }
}

export default Api
