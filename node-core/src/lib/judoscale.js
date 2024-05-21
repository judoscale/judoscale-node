import mergeConfig from './merge-config'
import Reporter from './reporter'

class Judoscale {
  static adapters = []

  constructor(options) {
    this.config = mergeConfig(options)
    const reporter = new Reporter()

    reporter.start(this.config, Judoscale.adapters)
  }

  static registerAdapter(adapter) {
    Judoscale.adapters.push(adapter)
  }
}

export default Judoscale
