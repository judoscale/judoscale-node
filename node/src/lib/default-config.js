import logger from './logger'

const defaultConfig = {
  logger,
  log: (message, level = 'debug') => {
    logger.log({ level, message })
  },
  prefix: '[judoscale] ',
  now: null,
  api_base_url: process.env.JUDOSCALE_URL,
  dyno: process.env.DYNO,
  version: '1.0.1',
  report_interval_seconds: 10,
}

export default defaultConfig
