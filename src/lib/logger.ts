// Production-grade logging system
import pino from 'pino';

const isProd = process.env.NODE_ENV === 'production';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  timestamp: pino.stdTimeFunctions.isoTime,
  base: {
    env: process.env.NODE_ENV,
    service: 'osirix',
  },
  formatters: {
    level: (label) => {
      return { level: label.toUpperCase() };
    },
  },
  ...(isProd
    ? {} // JSON output in production
    : {
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname',
            singleLine: false,
          },
        },
      }),
});

// Helper functions for structured logging
export const logJobEvent = (
  jobId: string,
  event: 'created' | 'started' | 'progress' | 'completed' | 'failed',
  metadata?: Record<string, any>
) => {
  logger.info({
    jobId,
    event,
    ...metadata,
  });
};

export const logAPICall = (
  service: string,
  endpoint: string,
  duration: number,
  success: boolean,
  metadata?: Record<string, any>
) => {
  const log = success ? logger.info : logger.error;
  log({
    service,
    endpoint,
    duration,
    success,
    ...metadata,
  });
};

export const logError = (
  error: Error,
  context?: Record<string, any>
) => {
  logger.error({
    error: {
      message: error.message,
      name: error.name,
      stack: error.stack,
    },
    ...context,
  });
};
