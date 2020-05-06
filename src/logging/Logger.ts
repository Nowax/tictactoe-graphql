import pino from 'pino'

const LOG_LEVEL: string = process.env.LOG_LEVEL || 'info'
export const logger = pino({ level: LOG_LEVEL })
