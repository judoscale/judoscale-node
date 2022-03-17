/**
 * @fileoverview Default config options
 * @author Carlos Marques
 */

import fs from 'fs'
import logger from './logger'

const defaultConfig = {
  logger,
  log: (message, level = 'debug') => { logger.log({ level, message }) },
  prefix: '[judoscale] ',
  now: null,
  api_base_url: process.env.JUDOSCALE_URL,
  dyno: process.env.DYNO,
  version: JSON.parse(fs.readFileSync('../../../package.json')).version,
  report_interval_seconds: 10
}

export default defaultConfig
