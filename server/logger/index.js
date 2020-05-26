const { createLogger, format, transports } = require('winston')
const { combine, colorize, errors, timestamp, printf } = format

const customTransports = [new transports.Console()]

const myFormat = printf((info) => {
  return info.stack
    ? `[${info.level}] ${info.stack}`
    : `[${info.level}] ${info.message}`
})

const logger = createLogger({
  level: 'info',
  format: combine(timestamp(), colorize(), errors({ stack: true }), myFormat),
  transports: customTransports,
})

module.exports = logger
