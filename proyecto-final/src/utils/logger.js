import dotenv from 'dotenv';
import { createLogger, format, transports, config } from 'winston';
const { combine, timestamp, printf, colorize } = format;

dotenv.config();

const customLevels = {
  levels: {
    debug: 0,
    http: 1,
    info: 2,
    warning: 3,
    error: 4,
    fatal: 5,
  },
  colors: {
    debug: 'blue',
    http: 'magenta',
    info: 'green',
    warning: 'yellow',
    error: 'red',
    fatal: 'bold red',
  },
};

config.addColors(customLevels.colors);

const customFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

const developmentLogger = createLogger({
  levels: customLevels.levels,
  format: combine(
    colorize(),
    timestamp(),
    customFormat
  ),
  transports: [
    new transports.Console({ level: 'debug' })
  ],
});

const productionLogger = createLogger({
  levels: customLevels.levels,
  format: combine(
    timestamp(),
    customFormat
  ),
  transports: [
    new transports.Console({ level: 'info' }),
    new transports.File({ filename: 'logs/errors.log', level: 'error' })
  ],
});

const logger = process.env.NODE_ENV === 'production' ? productionLogger : developmentLogger;

export default logger;
