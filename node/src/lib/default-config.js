export default {
  version: '1.0.1',
  api_base_url: process.env.JUDOSCALE_URL,
  log_level: process.env.JUDOSCALE_LOG_LEVEL || 'info',
  dyno: process.env.DYNO,
  report_interval_seconds: 10,
  now: null,
}
