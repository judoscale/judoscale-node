import { defaultConfig } from 'judoscale-node-core'

// TODO: make the adapter part of the core Judoscale class
class Adapter {
  constructor(collector) {
    this.collector = collector
    this.identifier = 'judoscale-express'
    this.adapter_version = defaultConfig.version
    this.language_version = process.version
  }

  asJson() {
    const data = {}
    data[this.identifier] = {
      adapter_version: this.adapter_version,
      language_version: this.language_version,
    }

    return data
  }
}

export default Adapter
