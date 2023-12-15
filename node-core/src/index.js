import Api from './lib/api'
import defaultConfigFunction from './lib/default-config'
import mergeConfig from './lib/merge-config'
import logger from './lib/logger'
import Metric from './lib/metric'
import MetricsStore from './lib/metrics-store'
import Report from './lib/report'
import Reporter from './lib/reporter'

const defaultConfig = defaultConfigFunction()

export { Api, mergeConfig, logger, Metric, MetricsStore, Report, Reporter, defaultConfig }
