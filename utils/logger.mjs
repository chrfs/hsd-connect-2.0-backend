import winston from 'winston'
import WinstonDailyRotateFile from 'winston-daily-rotate-file'
import flatted from 'flatted'
import fs from 'fs'
import path from 'path'
import env from '../config/env'

if (!fs.existsSync(env.WINSTON.LOG_DIR)) {
  fs.mkdirSync(env.WINSTON.LOG_DIR)
}

const winstonTransportProperties = {
  datePattern: 'YYYY-MM-DD-HH',
  handleExceptions: true,
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d'
}

const winstonConfiguration = {
  level: env.WINSTON.LOG_LEVEL || 'development',
  formatter: flatted.stringify,
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.json(),
    winston.format.printf(
      info => `${info.timestamp} ${info.level}: ${flatted.stringify(info.message)}`
    )
  ),
  transports: [
    new winston.transports.Console({
      handleExceptions: true,
      json: true,
      level: env.WINSTON.LOG_LEVEL || 'info'
    }),
    new WinstonDailyRotateFile({
      filename: path.join(
        env.WINSTON.LOG_DIR,
        `/${env.WINSTON.LOG_LEVEL}-%DATE%.log`
      ),
      ...winstonTransportProperties,
      level: env.WINSTON.LOG_LEVEL
    }),
    new WinstonDailyRotateFile({
      filename: path.join(env.WINSTON.LOG_DIR, `/error-%DATE%.log`),
      ...winstonTransportProperties,
      level: 'error'
    })
  ]
}

export default winston.createLogger(winstonConfiguration)
