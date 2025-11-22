# 🚀 Osirix Backend System Guide

## Table of Contents
1. [System Architecture](#system-architecture)
2. [Core Features](#core-features)
3. [API Endpoints](#api-endpoints)
4. [OZ AI Assistant](#oz-ai-assistant)
5. [Job Processing System](#job-processing-system)
6. [Error Handling](#error-handling)
7. [Setup Instructions](#setup-instructions)
8. [Testing](#testing)
9. [Production Deployment](#production-deployment)

---

## System Architecture

### Technology Stack
- **Framework**: Next.js 15 (App Router)
- **Database**: Turso (SQLite) with Drizzle ORM
- **Authentication**: Better Auth
- **Payments**: Stripe + Autumn
- **AI Services**: OpenAI GPT-4, DALL-E 3, ElevenLabs
- **Logging**: Pino
- **Validation**: Zod
- **Rate Limiting**: rate-limiter-flexible

### Core Systems

```
┌─────────────────────────────────────────────────────────┐
│                     OSIRIX PLATFORM                      │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   Frontend   │  │   API Layer  │  │   Database   │ │
│  │   Next.js    │──│ Route Handlers│──│    Turso     │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│         │                 │                  │          │
│         │                 │                  │          │
│  ┌──────▼─────────────────▼──────────────────▼──────┐ │
│  │              Core Infrastructure                   │ │
│  ├────────────────────────────────────────────────────┤ │
│  │ • Error Handling    • Rate Limiting                │ │
│  │ • Logging          • Validation                   │ │
│  │ • Retry Logic      • API Wrappers                 │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  ┌──────────────────────────────────────────────────┐ │
│  │              Job Processing Engine                │ │
│  ├──────────────────────────────────────────────────┤ │
│  │ • Logo Generation    • TTS                       │ │
│  │ • Product Creation   • Video Generation          │ │
│  │ • Character Design   • Campaign Planning         │ │
│  └──────────────────────────────────────────────────┘ │
│                                                          │
│  ┌──────────────────────────────────────────────────┐ │
│  │              OZ AI Assistant                      │ │
│  ├──────────────────────────────────────────────────┤ │
│  │ • Personalized Recommendations                    │ │
│  │ • Strategy Planning                               │ │
│  │ • Content Analysis                                │ │
│  │ • Quick Tips & Guidance                          │ │
│  └──────────────────────────────────────────────────┘ │
│                                                          │
│  ┌──────────────────────────────────────────────────┐ │
│  │         External Integrations                     │ │
│  ├──────────────────────────────────────────────────┤ │
│  │ • OpenAI (GPT-4, DALL-E)                         │ │
│  │ • ElevenLabs (TTS)                               │ │
│  │ • Social Media APIs (Twitter, Facebook, etc)     │ │
│  │ • Stripe (Payments)                              │ │
│  └──────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

---

## Core Features

### ✅ Production-Ready Error Handling
- **Typed Errors**: Custom error classes for different scenarios
- **Graceful Degradation**: Fallback responses when AI services fail
- **User-Friendly Messages**: Clear, actionable error messages
- **Logging**: Comprehensive error tracking with Pino

### ✅ Retry Logic & Resilience
- **Exponential Backoff**: Automatic retries with increasing delays
- **Circuit Breaking**: Prevents cascading failures
- **Jitter**: Randomized delays to prevent thundering herd
- **Configurable**: Per-service retry configuration

### ✅ Rate Limiting
- **Multi-Level**: API, User, and Service-specific limits
- **Granular Control**: Different limits for different actions
- **Penalty System**: Increased limits for failed attempts
- **Reward System**: Reduced penalties for successful actions

### ✅ Input Validation
- **Zod Schemas**: Type-safe validation for all inputs
- **Detailed Errors**: Field-specific error messages
- **Sanitization**: Automatic input cleaning
- **Type Safety**: Full TypeScript integration

### ✅ Comprehensive Logging
- **Structured Logging**: JSON logs in production, pretty logs in development
- **Request Tracking**: Unique request IDs for tracing
- **Performance Metrics**: Duration tracking for all operations
- **Error Context**: Full stack traces and context

---

## API Endpoints

### Jobs API

#### Create Job
```typescript
POST /api/jobs

Headers:
  Authorization: Bearer <token>

Body:
{
  "type": "logo" | "product" | "character" | "campaign" | "tts" | "video",
  "inputData": {
    // Type-specific data
  },
  "creditsRequired": number
}

Response:
{
  "success": true,
  "data": {
    "job": {
      "id": number,
      "type": string,
      "status": "pending" | "processing" | "completed" | "failed",
      "progress": number,
      "createdAt": string
    },
    "message": "Job created and processing started"
  },
  "timestamp": string,
  "requestId": string
}
```

#### Get Jobs
```typescript
GET /api/jobs?limit=50&status=completed&type=logo

Headers:
  Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "jobs": Job[],
    "total": number
  },
  "timestamp": string,
  "requestId": string
}
```

#### Get Job Details
```typescript
GET /api/jobs/[id]

Headers:
  Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "id": number,
    "type": string,
    "status": string,
    "progress": number,
    "inputData": object,
    "outputData": object,
    "errorMessage": string | null,
    "creditsReserved": number,
    "creditsCharged": number,
    "createdAt": string,
    "updatedAt": string
  },
  "timestamp": string,
  "requestId": string
}
```

### OZ AI Assistant API

#### Get Recommendations
```typescript
GET /api/oz/recommendations

Headers:
  Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "recommendations": [
      {
        "priority": "critical" | "high" | "medium" | "low",
        "category": string,
        "title": string,
        "description": string,
        "actionSteps": string[],
        "estimatedRevenue": string,
        "timeToImplement": string,
        "difficulty": "easy" | "medium" | "hard"
      }
    ],
    "profile": {
      "connectedPlatforms": number,
      "totalContent": number,
      "accountAge": number
    }
  },
  "timestamp": string,
  "requestId": string
}
```

#### Get Personalized Strategy
```typescript
POST /api/oz/strategy

Headers:
  Authorization: Bearer <token>

Body:
{
  "goal": "Build a $5000/month content business",
  "timeframe": "30days" | "90days" | "1year"
}

Response:
{
  "success": true,
  "data": {
    "strategy": {
      "overview": string,
      "phases": [
        {
          "phase": string,
          "duration": string,
          "goals": string[],
          "actions": string[],
          "expectedRevenue": string
        }
      ],
      "keyMetrics": string[],
      "commonPitfalls": string[]
    },
    "goal": string,
    "timeframe": string
  },
  "timestamp": string,
  "requestId": string
}
```

#### Analyze Content
```typescript
POST /api/oz/analyze

Headers:
  Authorization: Bearer <token>

Body:
{
  "contentType": "logo" | "product" | "post" | "video",
  "contentData": object,
  "performanceMetrics": {
    "views": number,
    "engagement": number,
    "conversions": number
  }
}

Response:
{
  "success": true,
  "data": {
    "score": number, // 0-100
    "strengths": string[],
    "improvements": string[],
    "optimizedVersion": string | undefined
  },
  "timestamp": string,
  "requestId": string
}
```

#### Get Quick Tip
```typescript
POST /api/oz/recommendations

Headers:
  Authorization: Bearer <token>

Body:
{
  "action": "create_logo" | "create_product" | "schedule_post" | ...,
  "context": object
}

Response:
{
  "success": true,
  "data": {
    "tip": string
  },
  "timestamp": string,
  "requestId": string
}
```

### Webhook Endpoints

#### Stripe Webhooks
```typescript
POST /api/webhooks/stripe

Headers:
  stripe-signature: string
  stripe-timestamp: string

Body: Stripe event JSON

Response: { received: true }
```

#### General Webhooks
```typescript
POST /api/webhooks/general

Headers:
  x-webhook-signature: string
  x-webhook-timestamp: string

Body: Event JSON

Response: { received: true }
```

---

## OZ AI Assistant

### Capabilities

1. **Personalized Recommendations**
   - Analyzes user profile (platforms, content, experience)
   - Identifies highest ROI opportunities
   - Provides step-by-step action plans
   - Estimates revenue potential

2. **Strategy Planning**
   - Creates phased action plans (30/90/365 days)
   - Sets realistic milestones
   - Projects revenue expectations
   - Identifies common pitfalls

3. **Content Analysis**
   - Scores content quality (0-100)
   - Highlights strengths
   - Suggests improvements
   - Provides optimized versions

4. **Quick Tips**
   - Context-aware guidance
   - Best practices for each action
   - Timing recommendations
   - Platform-specific tips

### Integration Example

```typescript
// Get recommendations
const response = await fetch('/api/oz/recommendations', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const { data } = await response.json();
const recommendations = data.recommendations;

// Display to user
recommendations.forEach(rec => {
  console.log(`${rec.priority.toUpperCase()}: ${rec.title}`);
  console.log(`Expected: ${rec.estimatedRevenue}/month`);
  console.log(`Steps:`, rec.actionSteps);
});
```

---

## Job Processing System

### Job Types & Processing

#### 1. Logo Generation
```typescript
Input:
{
  prompt: "Tech startup logo",
  style: "modern",
  colors: ["#3B82F6", "#8B5CF6"]
}

Process:
1. Generate concept with GPT-4 (20%)
2. Create visual description (50%)
3. Generate image with DALL-E 3 (90%)
4. Return logo + concept (100%)

Credits: 10

Output:
{
  imageUrl: string,
  concept: string,
  prompt: string,
  style: string,
  generatedAt: string
}
```

#### 2. Product Generation
```typescript
Input:
{
  category: "SaaS",
  description: "Project management tool",
  targetAudience: "Small teams"
}

Process:
1. Analyze market with GPT-4 (30%)
2. Generate product details (70%)
3. Create marketing copy (90%)
4. Return complete product (100%)

Credits: 5

Output:
{
  productDetails: {
    name: string,
    tagline: string,
    features: string[],
    pricing: { min: number, max: number },
    marketingCopy: string,
    targetMarket: string,
    competitiveAdvantage: string,
    launchStrategy: string
  },
  category: string,
  generatedAt: string
}
```

#### 3. Character Generation
```typescript
Input:
{
  name: "Alex the Mentor",
  personality: "Wise and encouraging",
  archetype: "mentor"
}

Process:
1. Generate character profile with GPT-4 (25%)
2. Create personality traits (60%)
3. Generate portrait with DALL-E (90%)
4. Return character + image (100%)

Credits: 8

Output:
{
  characterProfile: {
    fullName: string,
    age: number,
    background: string,
    traits: string[],
    voiceDescription: string,
    appearance: string,
    quirks: string[],
    strengths: string[],
    weaknesses: string[],
    motivations: string[],
    catchphrases: string[]
  },
  portraitUrl: string,
  name: string,
  generatedAt: string
}
```

#### 4. Campaign Generation
```typescript
Input:
{
  goal: "Launch new product",
  platforms: ["twitter", "instagram", "linkedin"],
  duration: 30,
  targetAudience: "Tech professionals"
}

Process:
1. Analyze platforms (30%)
2. Create content calendar with GPT-4 (70%)
3. Generate KPIs (90%)
4. Return campaign plan (100%)

Credits: 15

Output:
{
  campaignPlan: {
    campaignName: string,
    objectives: string[],
    contentCalendar: Array<{
      day: number,
      platform: string,
      content: string,
      hashtags: string[]
    }>,
    kpis: string[],
    budgetEstimation: string,
    expectedResults: string
  },
  goal: string,
  platforms: string[],
  duration: number,
  generatedAt: string
}
```

#### 5. Text-to-Speech
```typescript
Input:
{
  text: "Welcome to Osirix...",
  voiceId: "professional" // or other voice ID
}

Process:
1. Validate text length (40%)
2. Generate audio with ElevenLabs (80%)
3. Process and optimize (90%)
4. Return audio (100%)

Credits: Math.ceil(text.length / 100)

Output:
{
  audioUrl: string, // Base64 or uploaded URL
  text: string,
  voiceId: string,
  duration: number, // seconds
  generatedAt: string
}
```

#### 6. Video Generation
```typescript
Input:
{
  script: "In this video...",
  avatarId: "avatar-123"
}

Process:
1. Generate/validate script (20%)
2. Create audio with TTS (40%)
3. Process with Wav2Lip (70%)
4. Combine and render (90%)
5. Return video (100%)

Credits: 20

Output:
{
  videoUrl: string,
  script: string,
  avatarId: string,
  duration: number,
  generatedAt: string
}
```

### Error Recovery

All job processors include:
- ✅ Automatic retry on transient failures
- ✅ Credit refund on permanent failures
- ✅ Detailed error messages for debugging
- ✅ Progress tracking throughout process
- ✅ Graceful degradation when services unavailable

---

## Error Handling

### Error Types

```typescript
// Authentication Error
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication required"
  },
  "timestamp": "2024-01-20T10:30:00Z",
  "requestId": "req_abc123"
}

// Validation Error
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "email": ["Invalid email address"],
      "password": ["Password must be at least 8 characters"]
    }
  },
  "timestamp": "2024-01-20T10:30:00Z",
  "requestId": "req_abc123"
}

// Rate Limit Error
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT",
    "message": "Too many requests. Please try again later."
  },
  "timestamp": "2024-01-20T10:30:00Z",
  "requestId": "req_abc123"
}

// Insufficient Credits Error
{
  "success": false,
  "error": {
    "code": "INSUFFICIENT_CREDITS",
    "message": "Insufficient credits. Required: 10, Available: 3"
  },
  "timestamp": "2024-01-20T10:30:00Z",
  "requestId": "req_abc123"
}

// AI Service Error
{
  "success": false,
  "error": {
    "code": "AI_SERVICE_ERROR",
    "message": "AI service temporarily unavailable. Please try again."
  },
  "timestamp": "2024-01-20T10:30:00Z",
  "requestId": "req_abc123"
}
```

### Error Response Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `UNAUTHORIZED` | 401 | Authentication required or failed |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Invalid input data |
| `RATE_LIMIT` | 429 | Too many requests |
| `INSUFFICIENT_CREDITS` | 402 | Not enough credits |
| `AI_SERVICE_ERROR` | 503 | External AI service unavailable |
| `INTERNAL_SERVER_ERROR` | 500 | Unexpected error |

---

## Setup Instructions

### 1. Clone and Install
```bash
git clone <repo-url>
cd osirix
npm install
```

### 2. Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Edit .env with your API keys
nano .env
```

### 3. Required API Keys

**OpenAI** (Required for AI features):
```bash
# Visit: https://platform.openai.com/account/api-keys
# Click "Create new secret key"
# Copy to OPENAI_API_KEY in .env
```

**ElevenLabs** (Required for TTS):
```bash
# Visit: https://elevenlabs.io/app/settings/api-keys
# Copy your API key
# Add to ELEVENLABS_API_KEY in .env
```

**Turso Database** (Required):
```bash
# Visit: https://turso.tech/
# Create new database
# Copy DATABASE_URL and DATABASE_AUTH_TOKEN
```

### 4. Database Setup
```bash
# Push schema to database
npm run db:push

# (Optional) Seed with sample data
npm run db:seed
```

### 5. Run Development Server
```bash
npm run dev
```

### 6. Access Application
```
http://localhost:3000
```

---

## Testing

### Test Jobs API
```bash
# Create a test job
curl -X POST http://localhost:3000/api/jobs \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "logo",
    "inputData": {
      "prompt": "Modern tech startup logo",
      "style": "minimalist"
    },
    "creditsRequired": 10
  }'

# Check job status
curl http://localhost:3000/api/jobs/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Test OZ Assistant
```bash
# Get recommendations
curl http://localhost:3000/api/oz/recommendations \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get personalized strategy
curl -X POST http://localhost:3000/api/oz/strategy \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "goal": "Build $5000/month content business",
    "timeframe": "90days"
  }'
```

---

## Production Deployment

### Environment Variables Checklist
- [ ] `DATABASE_URL` - Turso production database
- [ ] `DATABASE_AUTH_TOKEN` - Turso auth token
- [ ] `OPENAI_API_KEY` - OpenAI API key
- [ ] `ELEVENLABS_API_KEY` - ElevenLabs API key
- [ ] `STRIPE_LIVE_KEY` - Stripe live key
- [ ] `STRIPE_WEBHOOK_SECRET` - Stripe webhook secret
- [ ] `ENCRYPTION_KEY` - 32-byte hex string
- [ ] `WEBHOOK_SECRET` - 32-byte hex string
- [ ] `NODE_ENV=production`
- [ ] `LOG_LEVEL=info`

### Pre-Deployment Steps
1. ✅ Test all API endpoints
2. ✅ Verify AI integrations working
3. ✅ Test webhook handlers
4. ✅ Check rate limiting
5. ✅ Verify error handling
6. ✅ Test job processing
7. ✅ Validate authentication flows
8. ✅ Check logging output

### Deployment Platforms

**Vercel** (Recommended):
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

**Manual Deployment**:
```bash
# Build
npm run build

# Start production server
npm start
```

### Monitoring

1. **Logs**: Check Pino logs in production
2. **Errors**: Integrate with Sentry (optional)
3. **Performance**: Monitor API response times
4. **Credits**: Track credit usage and billing
5. **AI Services**: Monitor OpenAI/ElevenLabs quotas

---

## Support & Resources

- **Documentation**: See inline code comments
- **API Reference**: This document
- **Environment Setup**: See `.env.example`
- **Database Schema**: See `src/db/schema.ts`

---

## Summary

✅ **Production-Ready Backend**
- Comprehensive error handling
- Advanced retry logic
- Rate limiting & security
- Structured logging

✅ **AI-Powered Features**
- OpenAI GPT-4 integration
- DALL-E 3 image generation
- ElevenLabs text-to-speech
- Intelligent job processing

✅ **OZ AI Assistant**
- Personalized recommendations
- Strategy planning
- Content analysis
- Real-time guidance

✅ **Robust Infrastructure**
- Type-safe validation
- Credit management
- Webhook handling
- Social media integrations

**Osirix is now ready to help users make money! 🚀💰**
