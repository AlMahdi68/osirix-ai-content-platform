// Advanced retry logic with exponential backoff
import { backOff } from 'exponential-backoff';
import pRetry from 'p-retry';
import { logger } from './logger';

interface RetryConfig {
  maxRetries?: number;
  initialDelay?: number;
  maxDelay?: number;
  factor?: number;
  onRetry?: (attempt: number, error: Error) => void;
}

const DEFAULT_CONFIG: RetryConfig = {
  maxRetries: 3,
  initialDelay: 1000,
  maxDelay: 30000,
  factor: 2,
};

export async function withRetry<T>(
  fn: () => Promise<T>,
  config: RetryConfig = {}
): Promise<T> {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config };

  return backOff(fn, {
    numOfAttempts: mergedConfig.maxRetries! + 1,
    startingDelay: mergedConfig.initialDelay,
    maxDelay: mergedConfig.maxDelay,
    jitter: 'full',
    retry: (error: any, attemptNumber: number) => {
      const shouldRetry = isRetryableError(error);
      
      if (shouldRetry && mergedConfig.onRetry) {
        mergedConfig.onRetry(attemptNumber, error);
      }

      logger.warn({
        message: shouldRetry ? 'Retrying after error' : 'Non-retryable error',
        attempt: attemptNumber,
        maxAttempts: mergedConfig.maxRetries! + 1,
        error: error.message,
      });

      return shouldRetry;
    },
  });
}

export async function withPRetry<T>(
  fn: () => Promise<T>,
  config: RetryConfig = {}
): Promise<T> {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config };

  return pRetry(fn, {
    retries: mergedConfig.maxRetries!,
    minTimeout: mergedConfig.initialDelay,
    maxTimeout: mergedConfig.maxDelay,
    factor: mergedConfig.factor,
    onFailedAttempt: (error) => {
      if (mergedConfig.onRetry) {
        mergedConfig.onRetry(error.attemptNumber, error);
      }

      logger.warn({
        message: 'Retry attempt failed',
        attempt: error.attemptNumber,
        retriesLeft: error.retriesLeft,
        error: error.message,
      });
    },
  });
}

export function isRetryableError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;

  const message = error.message.toLowerCase();
  const status = 'status' in error ? (error as any).status : null;

  // Retryable: rate limit (429), server errors (5xx), timeout, network errors
  return (
    status === 429 ||
    status === 500 ||
    status === 502 ||
    status === 503 ||
    status === 504 ||
    message.includes('timeout') ||
    message.includes('econnreset') ||
    message.includes('etimedout') ||
    message.includes('enotfound') ||
    message.includes('network') ||
    message.includes('fetch failed')
  );
}

// Specialized retry for AI API calls
export async function retryAICall<T>(
  fn: () => Promise<T>,
  serviceName: string
): Promise<T> {
  return withRetry(fn, {
    maxRetries: 3,
    initialDelay: 2000,
    maxDelay: 30000,
    onRetry: (attempt, error) => {
      logger.warn({
        service: serviceName,
        message: 'AI API call failed, retrying',
        attempt,
        error: error.message,
      });
    },
  });
}
