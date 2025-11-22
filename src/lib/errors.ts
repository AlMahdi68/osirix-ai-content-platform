// Production-grade error handling system
export class AppError extends Error {
  constructor(
    public code: string,
    public statusCode: number,
    public userMessage: string,
    message?: string
  ) {
    super(message || userMessage);
    this.name = 'AppError';
    Object.setPrototypeOf(this, AppError.prototype);
  }

  toJSON() {
    return {
      code: this.code,
      message: this.userMessage,
      statusCode: this.statusCode,
    };
  }
}

export class ValidationError extends AppError {
  constructor(public errors: Record<string, string[]>) {
    super('VALIDATION_ERROR', 400, 'Validation failed', 'Validation error');
    this.name = 'ValidationError';
  }

  toJSON() {
    return {
      code: this.code,
      message: this.userMessage,
      errors: this.errors,
      statusCode: this.statusCode,
    };
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super('NOT_FOUND', 404, `${resource} not found`);
    this.name = 'NotFoundError';
  }
}

export class AuthenticationError extends AppError {
  constructor(message = 'Authentication required') {
    super('UNAUTHORIZED', 401, message);
    this.name = 'AuthenticationError';
  }
}

export class RateLimitError extends AppError {
  constructor(public retryAfter: number) {
    super('RATE_LIMIT', 429, 'Too many requests. Please try again later.');
    this.name = 'RateLimitError';
  }
}

export class InsufficientCreditsError extends AppError {
  constructor(required: number, available: number) {
    super(
      'INSUFFICIENT_CREDITS',
      402,
      `Insufficient credits. Required: ${required}, Available: ${available}`
    );
    this.name = 'InsufficientCreditsError';
  }
}

export class AIServiceError extends AppError {
  constructor(service: string, originalError?: string) {
    super(
      'AI_SERVICE_ERROR',
      503,
      `AI service temporarily unavailable. Please try again.`,
      `${service} error: ${originalError}`
    );
    this.name = 'AIServiceError';
  }
}

export const isAppError = (error: unknown): error is AppError =>
  error instanceof AppError;
