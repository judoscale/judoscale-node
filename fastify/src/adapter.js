const { defaultConfig } = require('judoscale-node-core')

class Adapter {
  constructor(collector) {
    this.collector = collector
    this.identifier = 'judoscale-fastify'
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

module.exports = Adapter
