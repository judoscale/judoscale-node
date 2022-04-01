/**
 * @fileoverview Adapter metadata class
 * @author Carlos Marques
 */

import { defaultConfig } from 'judoscale-node-core'

class Adapter {
  constructor(collectors) {
    this.collectors = collectors
    this.identifier = 'judoscale-express'
    this.adapter_version = defaultConfig.version
    this.language_version = process.version
  }

  asJson() {
    const data = {}
    data[this.identifier] = {
      adapter_version: this.adapter_version,
      language_version: this.language_version
    }

    return data
  }
}

export default Adapter
