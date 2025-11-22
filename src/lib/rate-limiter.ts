// Advanced rate limiting system
import { RateLimiterMemory } from 'rate-limiter-flexible';
import { RateLimitError } from './errors';
import { logger } from './logger';

interface RateLimitConfig {
  points: number; // requests or tokens
  duration: number; // seconds
  blockDuration?: number; // seconds to block after limit
}

export class RateLimiter {
  private limiters: Map<string, RateLimiterMemory> = new Map();

  private readonly configs: Record<string, RateLimitConfig> = {
    // API rate limits
    'api:standard': {
      points: 100, // 100 requests
      duration: 60, // per minute
    },
    'api:auth': {
      points: 10, // 10 attempts
      duration: 3600, // per hour
      blockDuration: 900, // block for 15 minutes
    },
    'api:ai': {
      points: 30, // 30 AI requests
      duration: 60, // per minute
    },

    // AI service limits
    'ai:openai': {
      points: 50, // 50 requests
      duration: 60, // per minute
    },
    'ai:elevenlabs': {
      points: 30, // 30 requests
      duration: 60, // per minute
    },
    'ai:dalle': {
      points: 20, // 20 images
      duration: 60, // per minute
    },

    // User action limits
    'user:jobs': {
      points: 50, // 50 jobs
      duration: 3600, // per hour
    },
    'user:social_post': {
      points: 100, // 100 posts
      duration: 86400, // per day
    },
  };

  private getLimiter(type: string): RateLimiterMemory {
    if (!this.limiters.has(type)) {
      const config = this.configs[type] || this.configs['api:standard'];
      this.limiters.set(
        type,
        new RateLimiterMemory({
          points: config.points,
          duration: config.duration,
          blockDuration: config.blockDuration,
        })
      );
    }
    return this.limiters.get(type)!;
  }

  async checkLimit(
    type: string,
    identifier: string,
    points: number = 1
  ): Promise<{
    allowed: boolean;
    remaining: number;
    resetAt: Date;
  }> {
    const limiter = this.getLimiter(type);
    const key = `${type}:${identifier}`;

    try {
      const result = await limiter.consume(key, points);
      
      logger.debug({
        rateLimit: type,
        identifier,
        remaining: result.remainingPoints,
        resetAt: new Date(Date.now() + result.msBeforeNext),
      });

      return {
        allowed: true,
        remaining: Math.floor(result.remainingPoints),
        resetAt: new Date(Date.now() + result.msBeforeNext),
      };
    } catch (error: any) {
      logger.warn({
        rateLimit: type,
        identifier,
        action: 'rate_limit_exceeded',
        resetAt: error.msBeforeNext ? new Date(Date.now() + error.msBeforeNext) : undefined,
      });

      return {
        allowed: false,
        remaining: 0,
        resetAt: error.msBeforeNext ? new Date(Date.now() + error.msBeforeNext) : new Date(),
      };
    }
  }

  async enforceLimit(
    type: string,
    identifier: string,
    points: number = 1
  ): Promise<void> {
    const result = await this.checkLimit(type, identifier, points);
    
    if (!result.allowed) {
      const retryAfter = Math.ceil((result.resetAt.getTime() - Date.now()) / 1000);
      throw new RateLimitError(retryAfter);
    }
  }

  // Penalty for failed authentication attempts
  async penalize(type: string, identifier: string, points: number = 1): Promise<void> {
    const limiter = this.getLimiter(type);
    const key = `${type}:${identifier}`;
    
    try {
      await limiter.penalty(key, points);
      logger.warn({
        rateLimit: type,
        identifier,
        action: 'penalty_applied',
        points,
      });
    } catch (error) {
      logger.error({
        rateLimit: type,
        identifier,
        action: 'penalty_failed',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  // Reward for successful actions (reduce penalty)
  async reward(type: string, identifier: string, points: number = 1): Promise<void> {
    const limiter = this.getLimiter(type);
    const key = `${type}:${identifier}`;
    
    try {
      await limiter.reward(key, points);
      logger.debug({
        rateLimit: type,
        identifier,
        action: 'reward_applied',
        points,
      });
    } catch (error) {
      // Ignore reward errors
    }
  }
}

export const rateLimiter = new RateLimiter();
