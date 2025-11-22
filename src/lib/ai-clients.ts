// AI service clients with proper configuration
import OpenAI from 'openai';
import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';
import { AIServiceError } from './errors';
import { logger } from './logger';
import { retryAICall } from './retry';

// OpenAI Client
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'sk-dummy-key',
  timeout: 60000,
  maxRetries: 0, // We handle retries manually
});

// ElevenLabs Client
export const elevenLabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY || 'dummy-key',
});

// Voice IDs for ElevenLabs
export const VOICE_IDS = {
  professional: 'JBFqnCBsd6RMkjVDRZzb',
  friendly: 'EXAVITQu4vr4xnSDxMaL',
  calm: 'cgSgspJ2msLydDiP1Wl4',
  narrator: 'pNInz6obpgDQGcFmaJgB',
  energetic: '21m00Tcm4TlvDq8ikWAM',
};

// Wrapper for OpenAI chat completions with retry
export async function generateChatCompletion(
  messages: Array<{ role: string; content: string }>,
  options: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
  } = {}
) {
  const startTime = Date.now();

  try {
    const response = await retryAICall(async () => {
      return await openai.chat.completions.create({
        model: options.model || 'gpt-4-turbo',
        messages: messages as any,
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens || 2048,
      });
    }, 'OpenAI');

    const duration = Date.now() - startTime;
    logger.info({
      service: 'OpenAI',
      action: 'chat_completion',
      model: options.model || 'gpt-4-turbo',
      tokens: response.usage?.total_tokens,
      duration,
    });

    return response.choices[0].message.content || '';
  } catch (error) {
    logger.error({
      service: 'OpenAI',
      action: 'chat_completion',
      error: error instanceof Error ? error.message : String(error),
    });
    throw new AIServiceError('OpenAI', error instanceof Error ? error.message : String(error));
  }
}

// Wrapper for DALL-E image generation
export async function generateImage(prompt: string, options: {
  size?: '1024x1024' | '1792x1024' | '1024x1792';
  quality?: 'standard' | 'hd';
} = {}) {
  const startTime = Date.now();

  try {
    const response = await retryAICall(async () => {
      return await openai.images.generate({
        model: 'dall-e-3',
        prompt,
        size: options.size || '1024x1024',
        quality: options.quality || 'standard',
        n: 1,
      });
    }, 'DALL-E');

    const duration = Date.now() - startTime;
    logger.info({
      service: 'DALL-E',
      action: 'image_generation',
      size: options.size || '1024x1024',
      quality: options.quality || 'standard',
      duration,
    });

    return response.data[0].url || '';
  } catch (error) {
    logger.error({
      service: 'DALL-E',
      action: 'image_generation',
      error: error instanceof Error ? error.message : String(error),
    });
    throw new AIServiceError('DALL-E', error instanceof Error ? error.message : String(error));
  }
}

// Wrapper for ElevenLabs TTS
export async function generateSpeech(
  text: string,
  voiceId: string = VOICE_IDS.professional
): Promise<Buffer> {
  const startTime = Date.now();

  try {
    const audioStream = await retryAICall(async () => {
      return await elevenLabs.textToSpeech.convert(voiceId, {
        text,
        model_id: 'eleven_multilingual_v2',
        output_format: 'mp3_44100_128',
      });
    }, 'ElevenLabs');

    // Convert stream to buffer
    const chunks: Buffer[] = [];
    for await (const chunk of audioStream as any) {
      if (chunk instanceof Buffer) {
        chunks.push(chunk);
      } else if (chunk instanceof Uint8Array) {
        chunks.push(Buffer.from(chunk));
      }
    }

    const duration = Date.now() - startTime;
    const audioBuffer = Buffer.concat(chunks);

    logger.info({
      service: 'ElevenLabs',
      action: 'tts',
      voiceId,
      textLength: text.length,
      audioSize: audioBuffer.length,
      duration,
    });

    return audioBuffer;
  } catch (error) {
    logger.error({
      service: 'ElevenLabs',
      action: 'tts',
      error: error instanceof Error ? error.message : String(error),
    });
    throw new AIServiceError('ElevenLabs', error instanceof Error ? error.message : String(error));
  }
}

// Check if API keys are configured
export function checkAIServicesConfigured(): {
  openai: boolean;
  elevenlabs: boolean;
} {
  return {
    openai: !!process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'sk-dummy-key',
    elevenlabs: !!process.env.ELEVENLABS_API_KEY && process.env.ELEVENLABS_API_KEY !== 'dummy-key',
  };
}
