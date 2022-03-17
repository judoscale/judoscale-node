/**
 * @fileoverview Default config options
 * @author Carlos Marques
 */

import fs from 'fs'
import logger from './logger'

const defaultConfig = {
  log: (message, level = 'debug') => { logger.log({ level, message }) },
  prefix: '[judoscale] ',
  now: null,
  api_base_url: process.env.JUDOSCALE_URL,
  dyno: process.env.DYNO,
  version: JSON.parse(fs.readFileSync('../../../package.json')).version
}

export default defaultConfig
