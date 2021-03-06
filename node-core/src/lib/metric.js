/**
 * @param {String} identifier - Heroku router request identifier
 * @param {Date} time - Represents the request time
 * @param {String} value - Time queued?
 * @param {String} queueName - If this was an async job metric that would be its queue name.
 */
class Metric {
  constructor(identifier, time, value, queueName = null) {
    this.identifier = identifier
    this.time = new Date(time.toUTCString())
    this.value = Number(value)
    this.queueName = queueName
  }
}

export default Metric
