const { monotonicTime } = require('./request-metrics')

class UtilizationTracker {
  /*
  Tracks a count of active requests, incremented / decremented by the request
  middleware, and tracks "idle time" when there aren't active requests (when
  we're moving between 1 -> 0 -> 1 requests).

  The total "idle time" is then converted to "utilization percentage" and
  collected as a web metric, which is then included with reports.
  */
  constructor() {
    this._activeRequestCounter = 0
    this._idleStartedAt = null
    this._reportCycleStartedAt = null
    this._totalIdleTime = 0.0
    this._started = false
  }

  get isStarted() {
    return this._started
  }

  start() {
    // TODO: lock?
    if (!this.isStarted) {
      this._started = true
      this._initIdleReportCycle()
    }
  }

  stop() {
    // TODO: lock?
    if (this.isStarted) {
      this._started = false
      this._idleStartedAt = null
      this._reportCycleStartedAt = null
      this._totalIdleTime = 0.0
      this._activeRequestCounter = 0
    }
  }

  incr() {
    // TODO: lock?
    if (this._activeRequestCounter == 0 && this._idleStartedAt != null) {
      // We were idle and now we're not - add to total idle time
      this._totalIdleTime += this._getCurrentTime() - this._idleStartedAt
      this._idleStartedAt = null
    }

    this._activeRequestCounter += 1
  }

  decr() {
    // TODO: lock?
    this._activeRequestCounter -= 1

    if (this._activeRequestCounter == 0) {
      // We're now idle - start tracking idle time
      this._idleStartedAt = this._getCurrentTime()
    }
  }

  utilizationPct(reset = true) {
    // TODO: lock?
    const currentTime = this._getCurrentTime()
    const idleRatio = this._getIdleRatio(currentTime)

    if (reset) {
      this._resetIdleReportCycle(currentTime)
    }

    return Math.floor((1.0 - idleRatio) * 100.0)
  }

  _getCurrentTime() {
    return monotonicTime()
  }

  _initIdleReportCycle() {
    const currentTime = this._getCurrentTime()
    this._idleStartedAt = currentTime
    this._resetIdleReportCycle(currentTime)
  }

  _resetIdleReportCycle(currentTime) {
    this._totalIdleTime = 0.0
    this._reportCycleStartedAt = currentTime
  }

  _getIdleRatio(currentTime) {
    if (this._reportCycleStartedAt == null) {
      return 0.0
    }

    const totalReportCycleTime = currentTime - this._reportCycleStartedAt

    if (totalReportCycleTime <= 0) {
      return 0.0
    }

    // Capture remaining idle time
    if (this._idleStartedAt !== null) {
      this._totalIdleTime += currentTime - this._idleStartedAt
      this._idleStartedAt = currentTime
    }

    return this._totalIdleTime / totalReportCycleTime
  }
}

module.exports = UtilizationTracker
