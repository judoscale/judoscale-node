/**
 * @fileoverview Winston logger wrapper
 * @author Carlos Marques
 */

import winston from 'winston'

const logger = winston.createLogger({
  level: process.env.JUDOSCALE_LOG_LEVEL || 'debug',
  format: winston.format.json(),
  defaultMeta: { service: 'judoscale-node-adapter' }
})

logger.add(new winston.transports.Console({
  format: winston.format.simple()
}))

export default logger
