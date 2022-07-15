import getLogger from './logger'
import defaultConfig from './default-config'

export default (config) => {
  const mergedConfig = { ...defaultConfig, ...config }

  return {
    ...mergedConfig,
    logger: getLogger(mergedConfig.log_level),
  }
}
