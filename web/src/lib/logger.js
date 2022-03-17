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

if (process.env.NODE_ENV !== 'dontreallymatterbythispoint') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }))
} else {
  logger.add(new winston.transports.File({
    filename: `${process.env.NODE_ENV}.log`
  }))
}

export default logger
