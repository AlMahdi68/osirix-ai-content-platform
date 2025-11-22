// Enhanced job processing system with retry logic and AI integrations
import { db } from '@/db';
import { jobs, creditsLedger } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { logger, logJobEvent } from '../logger';
import { InsufficientCreditsError, AIServiceError } from '../errors';
import { generateChatCompletion, generateImage, generateSpeech, VOICE_IDS } from '../ai-clients';
import { withRetry } from '../retry';

interface JobInput {
  userId: string;
  type: string;
  inputData: any;
  creditsRequired: number;
}

interface JobResult {
  success: boolean;
  outputData?: any;
  errorMessage?: string;
  creditsCharged: number;
}

export class JobProcessor {
  // Process any job type
  async processJob(jobId: number): Promise<JobResult> {
    const job = await db.select().from(jobs).where(eq(jobs.id, jobId)).limit(1);
    
    if (!job.length) {
      throw new Error('Job not found');
    }

    const jobData = job[0];
    
    logJobEvent(jobId.toString(), 'started', {
      type: jobData.type,
      userId: jobData.userId,
    });

    try {
      // Update job status to processing
      await this.updateJobStatus(jobId, 'processing', 0);

      let result: JobResult;

      // Route to appropriate processor
      switch (jobData.type) {
        case 'logo':
          result = await this.processLogoGeneration(jobId, jobData);
          break;
        case 'product':
          result = await this.processProductGeneration(jobId, jobData);
          break;
        case 'character':
          result = await this.processCharacterGeneration(jobId, jobData);
          break;
        case 'campaign':
          result = await this.processCampaignGeneration(jobId, jobData);
          break;
        case 'tts':
          result = await this.processTTS(jobId, jobData);
          break;
        case 'video':
          result = await this.processVideoGeneration(jobId, jobData);
          break;
        default:
          result = await this.processGenericJob(jobId, jobData);
      }

      if (result.success) {
        // Mark job as completed
        await this.updateJobStatus(jobId, 'completed', 100, result.outputData);
        
        // Charge credits
        await this.chargeCredits(jobData.userId, jobId.toString(), result.creditsCharged);

        logJobEvent(jobId.toString(), 'completed', {
          creditsCharged: result.creditsCharged,
        });
      } else {
        throw new Error(result.errorMessage || 'Job processing failed');
      }

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      // Update job as failed
      await this.updateJobStatus(jobId, 'failed', jobData.progress || 0, undefined, errorMessage);
      
      // Refund reserved credits
      await this.refundCredits(jobData.userId, jobId.toString(), jobData.creditsReserved);

      logJobEvent(jobId.toString(), 'failed', {
        error: errorMessage,
        creditsRefunded: jobData.creditsReserved,
      });

      return {
        success: false,
        errorMessage,
        creditsCharged: 0,
      };
    }
  }

  // Logo generation processor
  private async processLogoGeneration(jobId: number, jobData: any): Promise<JobResult> {
    const { prompt, style, colors } = jobData.inputData;

    await this.updateJobStatus(jobId, 'processing', 20);

    // Generate logo concept with AI
    const concept = await withRetry(async () => {
      return await generateChatCompletion(
        [
          {
            role: 'system',
            content: 'You are an expert logo designer. Create detailed logo concepts with visual descriptions.',
          },
          {
            role: 'user',
            content: `Create a ${style || 'modern'} logo concept for: ${prompt}${colors ? `. Use these colors: ${colors.join(', ')}` : ''}. Provide: 1) Visual description 2) Design elements 3) Typography suggestion 4) Color palette`,
          },
        ],
        { maxTokens: 500 }
      );
    });

    await this.updateJobStatus(jobId, 'processing', 50);

    // Generate logo image
    const enhancedPrompt = `Professional logo design: ${prompt}. Style: ${style || 'modern'}. ${concept.substring(0, 200)}`;
    const imageUrl = await generateImage(enhancedPrompt, { size: '1024x1024', quality: 'hd' });

    await this.updateJobStatus(jobId, 'processing', 90);

    return {
      success: true,
      outputData: {
        imageUrl,
        concept,
        prompt,
        style,
        generatedAt: new Date().toISOString(),
      },
      creditsCharged: 10,
    };
  }

  // Product generation processor
  private async processProductGeneration(jobId: number, jobData: any): Promise<JobResult> {
    const { category, description, targetAudience } = jobData.inputData;

    await this.updateJobStatus(jobId, 'processing', 30);

    const productDetails = await withRetry(async () => {
      return await generateChatCompletion(
        [
          {
            role: 'system',
            content: 'You are an expert product strategist. Create comprehensive product concepts with market analysis.',
          },
          {
            role: 'user',
            content: `Create a complete digital product concept:\nCategory: ${category}\nDescription: ${description}\nTarget Audience: ${targetAudience || 'general'}\n\nProvide JSON with: name, tagline, features (array), pricing (min/max), marketingCopy, targetMarket, competitiveAdvantage, launchStrategy`,
          },
        ],
        { maxTokens: 1000 }
      );
    });

    await this.updateJobStatus(jobId, 'processing', 90);

    return {
      success: true,
      outputData: {
        productDetails,
        category,
        generatedAt: new Date().toISOString(),
      },
      creditsCharged: 5,
    };
  }

  // Character generation processor
  private async processCharacterGeneration(jobId: number, jobData: any): Promise<JobResult> {
    const { name, personality, archetype } = jobData.inputData;

    await this.updateJobStatus(jobId, 'processing', 25);

    const characterProfile = await withRetry(async () => {
      return await generateChatCompletion(
        [
          {
            role: 'system',
            content: 'You are an expert character designer. Create rich, detailed character profiles.',
          },
          {
            role: 'user',
            content: `Create a complete character profile:\nName: ${name}\nPersonality: ${personality}\nArchetype: ${archetype || 'hero'}\n\nProvide JSON with: fullName, age, background, personality traits (array), voiceDescription, appearance, quirks, strengths, weaknesses, motivations, catchphrases (array)`,
          },
        ],
        { maxTokens: 800 }
      );
    });

    await this.updateJobStatus(jobId, 'processing', 60);

    // Generate character portrait
    const portraitPrompt = `Professional character portrait: ${name}, ${personality}, ${archetype || 'hero'} archetype. High quality digital art.`;
    const portraitUrl = await generateImage(portraitPrompt, { size: '1024x1024', quality: 'standard' });

    await this.updateJobStatus(jobId, 'processing', 90);

    return {
      success: true,
      outputData: {
        characterProfile,
        portraitUrl,
        name,
        generatedAt: new Date().toISOString(),
      },
      creditsCharged: 8,
    };
  }

  // Campaign generation processor
  private async processCampaignGeneration(jobId: number, jobData: any): Promise<JobResult> {
    const { goal, platforms, duration, targetAudience } = jobData.inputData;

    await this.updateJobStatus(jobId, 'processing', 30);

    const campaignPlan = await withRetry(async () => {
      return await generateChatCompletion(
        [
          {
            role: 'system',
            content: 'You are an expert digital marketing strategist. Create comprehensive campaign plans.',
          },
          {
            role: 'user',
            content: `Create a ${duration}-day marketing campaign:\nGoal: ${goal}\nPlatforms: ${platforms.join(', ')}\nAudience: ${targetAudience || 'general'}\n\nProvide JSON with: campaignName, objectives (array), contentCalendar (array of {day, platform, content, hashtags}), kpis (array), budget estimation, expectedResults`,
          },
        ],
        { maxTokens: 1500 }
      );
    });

    await this.updateJobStatus(jobId, 'processing', 90);

    return {
      success: true,
      outputData: {
        campaignPlan,
        goal,
        platforms,
        duration,
        generatedAt: new Date().toISOString(),
      },
      creditsCharged: 15,
    };
  }

  // TTS processor
  private async processTTS(jobId: number, jobData: any): Promise<JobResult> {
    const { text, voiceId } = jobData.inputData;

    await this.updateJobStatus(jobId, 'processing', 40);

    const audioBuffer = await generateSpeech(text, voiceId || VOICE_IDS.professional);

    await this.updateJobStatus(jobId, 'processing', 90);

    // In production, upload to storage and return URL
    const audioUrl = `data:audio/mpeg;base64,${audioBuffer.toString('base64')}`;

    return {
      success: true,
      outputData: {
        audioUrl,
        text,
        voiceId: voiceId || VOICE_IDS.professional,
        duration: Math.ceil(text.length / 14), // Rough estimate: 14 chars per second
        generatedAt: new Date().toISOString(),
      },
      creditsCharged: Math.ceil(text.length / 100),
    };
  }

  // Video generation processor (placeholder)
  private async processVideoGeneration(jobId: number, jobData: any): Promise<JobResult> {
    const { script, avatarId } = jobData.inputData;

    await this.updateJobStatus(jobId, 'processing', 20);

    // Generate video script if not provided
    const finalScript = script || await this.generateVideoScript(jobData.inputData.topic);

    await this.updateJobStatus(jobId, 'processing', 40);

    // Generate audio
    const audioBuffer = await generateSpeech(finalScript, VOICE_IDS.professional);

    await this.updateJobStatus(jobId, 'processing', 70);

    // In production: process with Wav2Lip, combine with avatar
    // For now, return placeholder
    const videoUrl = '/placeholder-video.mp4';

    await this.updateJobStatus(jobId, 'processing', 90);

    return {
      success: true,
      outputData: {
        videoUrl,
        script: finalScript,
        avatarId,
        duration: Math.ceil(finalScript.length / 14),
        generatedAt: new Date().toISOString(),
      },
      creditsCharged: 20,
    };
  }

  // Generic job processor
  private async processGenericJob(jobId: number, jobData: any): Promise<JobResult> {
    await this.updateJobStatus(jobId, 'processing', 50);

    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    await this.updateJobStatus(jobId, 'processing', 90);

    return {
      success: true,
      outputData: {
        result: 'Job completed successfully',
        generatedAt: new Date().toISOString(),
      },
      creditsCharged: 1,
    };
  }

  // Helper: Generate video script
  private async generateVideoScript(topic: string): Promise<string> {
    return await generateChatCompletion(
      [
        {
          role: 'system',
          content: 'You are an expert video scriptwriter. Create engaging 30-60 second scripts.',
        },
        {
          role: 'user',
          content: `Write a compelling 30-60 second video script about: ${topic}. Include hook, main points, and strong call-to-action.`,
        },
      ],
      { maxTokens: 300 }
    );
  }

  // Helper: Update job status
  private async updateJobStatus(
    jobId: number,
    status: string,
    progress: number,
    outputData?: any,
    errorMessage?: string
  ): Promise<void> {
    const updateData: any = {
      status,
      progress,
      updatedAt: new Date().toISOString(),
    };

    if (outputData) {
      updateData.outputData = outputData;
    }

    if (errorMessage) {
      updateData.errorMessage = errorMessage;
    }

    await db.update(jobs).set(updateData).where(eq(jobs.id, jobId));

    logger.debug({
      jobId,
      status,
      progress,
      message: 'Job status updated',
    });
  }

  // Helper: Charge credits
  private async chargeCredits(userId: string, jobId: string, amount: number): Promise<void> {
    const latestLedger = await db
      .select()
      .from(creditsLedger)
      .where(eq(creditsLedger.userId, userId))
      .orderBy(desc(creditsLedger.createdAt))
      .limit(1);

    const currentBalance = latestLedger.length > 0 ? latestLedger[0].balanceAfter : 0;

    await db.insert(creditsLedger).values({
      userId,
      amount: -amount,
      type: 'charge',
      referenceId: jobId,
      balanceAfter: currentBalance - amount,
      createdAt: new Date().toISOString(),
    });

    logger.info({
      userId,
      jobId,
      amount,
      newBalance: currentBalance - amount,
      message: 'Credits charged',
    });
  }

  // Helper: Refund credits
  private async refundCredits(userId: string, jobId: string, amount: number): Promise<void> {
    const latestLedger = await db
      .select()
      .from(creditsLedger)
      .where(eq(creditsLedger.userId, userId))
      .orderBy(desc(creditsLedger.createdAt))
      .limit(1);

    const currentBalance = latestLedger.length > 0 ? latestLedger[0].balanceAfter : 0;

    await db.insert(creditsLedger).values({
      userId,
      amount,
      type: 'refund',
      referenceId: jobId,
      balanceAfter: currentBalance + amount,
      createdAt: new Date().toISOString(),
    });

    logger.info({
      userId,
      jobId,
      amount,
      newBalance: currentBalance + amount,
      message: 'Credits refunded',
    });
  }
}

export const jobProcessor = new JobProcessor();
