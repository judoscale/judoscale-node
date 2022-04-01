/**
 * @fileoverview Config options
 * @author Carlos Marques
 */

import { defaultConfig } from 'judoscale-node-core'

const Config = { ...defaultConfig, redisUrl: process.env.REDIS_URL }

export default Config
