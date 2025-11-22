// Universal API handler wrapper with error handling
import { NextRequest, NextResponse } from 'next/server';
import { logger, logError } from './logger';
import { AppError, isAppError, ValidationError } from './errors';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
  requestId: string;
}

type ApiHandler<T = any> = (
  req: NextRequest,
  context?: { params: any }
) => Promise<T>;

export function withErrorHandler<T = any>(handler: ApiHandler<T>) {
  return async (
    req: NextRequest,
    context?: { params: any }
  ): Promise<NextResponse<ApiResponse<T>>> => {
    const requestId = crypto.randomUUID();
    const startTime = Date.now();
    const method = req.method;
    const path = req.nextUrl.pathname;

    try {
      logger.info({
        requestId,
        method,
        path,
        message: 'API request started',
      });

      const data = await handler(req, context);
      const duration = Date.now() - startTime;

      logger.info({
        requestId,
        method,
        path,
        duration,
        message: 'API request completed successfully',
      });

      return NextResponse.json<ApiResponse<T>>(
        {
          success: true,
          data,
          timestamp: new Date().toISOString(),
          requestId,
        },
        {
          status: 200,
          headers: {
            'X-Request-ID': requestId,
            'X-Response-Time': `${duration}ms`,
          },
        }
      );
    } catch (error) {
      const duration = Date.now() - startTime;

      if (isAppError(error)) {
        logger.warn({
          requestId,
          method,
          path,
          duration,
          code: error.code,
          statusCode: error.statusCode,
          message: 'API request failed with app error',
          error: error.message,
        });

        return NextResponse.json<ApiResponse>(
          {
            success: false,
            error: {
              code: error.code,
              message: error.userMessage,
              ...(error instanceof ValidationError && {
                details: error.errors,
              }),
            },
            timestamp: new Date().toISOString(),
            requestId,
          },
          {
            status: error.statusCode,
            headers: {
              'X-Request-ID': requestId,
              'X-Response-Time': `${duration}ms`,
            },
          }
        );
      }

      // Unhandled errors
      logError(error as Error, {
        requestId,
        method,
        path,
        duration,
      });

      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: {
            code: 'INTERNAL_SERVER_ERROR',
            message: 'An unexpected error occurred',
          },
          timestamp: new Date().toISOString(),
          requestId,
        },
        {
          status: 500,
          headers: {
            'X-Request-ID': requestId,
            'X-Response-Time': `${duration}ms`,
          },
        }
      );
    }
  };
}

// Helper to extract and validate bearer token
export function getBearerToken(req: NextRequest): string | null {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}

// Helper to get user from session
export async function getUserFromRequest(req: NextRequest): Promise<any> {
  const token = getBearerToken(req);
  if (!token) {
    return null;
  }

  // Token is stored in localStorage and sent via Authorization header
  // The auth system handles validation
  return { token };
}
