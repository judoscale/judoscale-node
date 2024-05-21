import mergeConfig from './merge-config'
import Reporter from './reporter'

class Judoscale {
  static adapters = []

  constructor(options) {
    // TODO: store config in this object
    const finalConfig = mergeConfig(options)
    const reporter = new Reporter()

    reporter.start(finalConfig, Judoscale.adapters)
  }

  static registerAdapter(adapter) {
    Judoscale.adapters.push(adapter)
  }
}

export default Judoscale
