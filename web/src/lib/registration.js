/**
 * @fileoverview Payload for the registration of a collector on Judoscale's API
 * @author Carlos Marques
 */

import defaultConfig from './default-config'

class Registration {
  constructor(collectors) {
    this.collectors = collectors
  }

  asJson() {
    return {
      pid: process.pid,
      node_version: process.version,
      package_version: defaultConfig.version,
      collectors: this.collectors.map((collector) => collector.collectorName).join(',')
    }
  }
}

export default Registration
