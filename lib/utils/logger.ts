import winston from 'winston';

const { combine, timestamp, printf, colorize, errors } = winston.format;

const isProd = process.env.NODE_ENV === 'production';

const logFormat = printf(({ level, message, timestamp, stack, ...meta }) =>
  JSON.stringify({
    timestamp,
    level,
    message,
    stack,
    ...meta,
  })
);

export const baseLogger = winston.createLogger({
  level: isProd ? 'info' : 'debug',
  format: combine(errors({ stack: true }), timestamp(), logFormat),
  transports: [
    new winston.transports.Console({
      format: isProd
        ? combine(timestamp(), logFormat)
        : combine(colorize(), timestamp(), logFormat),
    }),
  ],
});
