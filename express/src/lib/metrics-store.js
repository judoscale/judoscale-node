/**
 * @fileoverview Mem based metrics storage
 * @author Carlos Marques
 */

import Metric from './metric'

class MetricsStore {
  constructor() {
    this.metrics = []
    this.flushedAt = new Date()
  }

  push(identifier, value, time = new Date(), queueName = null) {
    if (this.flushedAt && this.flushedAt < new Date((new Date() - 120000))) {
      return false
    }

    const metric = new Metric(identifier, time, value, queueName)

    this.metrics.push(metric)

    return true
  }

  flush() {
    this.flushedAt = new Date()

    const flushedMetrics = []

    let metric = null

    while (metric = this.metrics.shift()) {
      flushedMetrics.push(metric)
    }

    return flushedMetrics
  }

  clear() {
    this.metrics = []
  }
}

export default MetricsStore
