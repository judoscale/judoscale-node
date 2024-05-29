const winston = require('winston')

module.exports = (level) => {
  const logger = winston.createLogger({
    level: process.env.JUDOSCALE_LOG_LEVEL || level,
  })

  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  )

  return logger
}
