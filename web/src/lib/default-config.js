/**
 * @fileoverview Default config options
 * @author Carlos Marques
 */

import fs from 'fs'

const defaultConfig = {
  log: console.log,
  prefix: '[judoscale] ',
  now: null,
  api_base_url: process.env.JUDOSCALE_URL,
  dyno: process.env.DYNO,
  version: JSON.parse(fs.readFileSync('../../../package.json')).version
}

export default defaultConfig
