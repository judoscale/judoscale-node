import getLogger from './logger'

const defaultLogLevel = process.env.JUDOSCALE_LOG_LEVEL || 'info'

export default {
  version: '1.0.5',
  api_base_url: process.env.JUDOSCALE_URL,
  log_level: defaultLogLevel,
  dyno: process.env.DYNO,
  report_interval_seconds: 10,
  now: null,
  logger: getLogger(defaultLogLevel),
}
