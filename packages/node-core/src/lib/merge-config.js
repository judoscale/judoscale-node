const getLogger = require('./logger')
const defaultConfig = require('./default-config')

module.exports = (config) => {
  const mergedConfig = { ...defaultConfig(), ...config }

  return {
    ...mergedConfig,
    logger: getLogger(mergedConfig.log_level),
  }
}
