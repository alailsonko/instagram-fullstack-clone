import logger from './logger'
import { LoggerOptions } from 'winston'

export function Logger(level: string, message: string): LoggerOptions {
  return logger.log({
    level: level,
    message: message
  })
}
