// Comprehensive validation schemas
import { z } from 'zod';
import { ValidationError } from './errors';

// Job validation schemas
export const createJobSchema = z.object({
  type: z.enum(['tts', 'video', 'logo', 'product', 'character', 'campaign']),
  inputData: z.record(z.any()),
  creditsRequired: z.number().int().positive(),
});

export const updateJobSchema = z.object({
  status: z.enum(['pending', 'processing', 'completed', 'failed']).optional(),
  progress: z.number().min(0).max(100).optional(),
  outputData: z.record(z.any()).optional(),
  errorMessage: z.string().optional(),
});

// AI generation schemas
export const ttsGenerationSchema = z.object({
  text: z.string().min(1).max(5000, 'Text must be 5000 characters or less'),
  voiceId: z.string().optional(),
  modelId: z.string().optional(),
});

export const logoGenerationSchema = z.object({
  prompt: z.string().min(10).max(4000, 'Prompt must be between 10-4000 characters'),
  style: z.string().optional(),
  colors: z.array(z.string()).optional(),
});

export const productGenerationSchema = z.object({
  category: z.string().min(2),
  description: z.string().min(10),
  targetAudience: z.string().optional(),
  priceRange: z.object({
    min: z.number().positive(),
    max: z.number().positive(),
  }).optional(),
});

export const characterGenerationSchema = z.object({
  name: z.string().min(2).max(100),
  personality: z.string().min(10),
  archetype: z.string().optional(),
  voiceStyle: z.string().optional(),
});

export const campaignGenerationSchema = z.object({
  goal: z.string().min(10),
  platforms: z.array(z.enum(['twitter', 'facebook', 'instagram', 'linkedin', 'youtube'])),
  duration: z.number().int().positive(),
  targetAudience: z.string().optional(),
});

// Social media schemas
export const socialPostSchema = z.object({
  platforms: z.array(z.string()).min(1, 'At least one platform required'),
  content: z.string().min(1).max(5000),
  scheduledFor: z.string().datetime().optional(),
  mediaUrls: z.array(z.string().url()).optional(),
});

// Query parameter schemas
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  order: z.enum(['asc', 'desc']).default('desc'),
});

// Validation helper
export async function validateRequest<T>(
  schema: z.Schema<T>,
  data: unknown
): Promise<T> {
  try {
    return await schema.parseAsync(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formatted = error.flatten();
      const errors: Record<string, string[]> = {};
      
      Object.entries(formatted.fieldErrors).forEach(([key, msgs]) => {
        if (msgs) {
          errors[key] = msgs;
        }
      });

      throw new ValidationError(errors);
    }
    throw error;
  }
}

// Validation middleware for API routes
export function createValidator<T>(schema: z.Schema<T>) {
  return async (data: unknown): Promise<T> => {
    return validateRequest(schema, data);
  };
}
