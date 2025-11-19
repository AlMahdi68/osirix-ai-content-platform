# Osirix - AI Content Creation & Monetization Platform

![Osirix Banner](https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=400&fit=crop)

**Osirix** is an autonomous AI content creation and monetization platform that enables users to generate professional videos with AI avatars, voice synthesis, lip-sync technology, and publish content across social media platforms while monetizing through a digital marketplace.

## 🚀 Features

### Core Functionality
- **🎭 Avatar Management** - Upload and manage custom AI avatars for video generation
- **🎤 Text-to-Speech** - Generate natural-sounding voiceovers with ElevenLabs integration
- **🎬 Video Generation** - Create professional videos with Wav2Lip lip-sync technology
- **💰 Digital Marketplace** - Sell and purchase digital content, voice packs, and templates
- **📅 Social Media Scheduling** - Schedule and auto-publish to Twitter, Facebook, Instagram, LinkedIn
- **📊 Analytics Dashboard** - Track performance, revenue, and engagement metrics
- **👥 User Management** - Complete authentication system with JWT and session management
- **💳 Credit System** - Transaction-based billing with credits ledger and reservation logic
- **⚙️ Admin Console** - System management, user moderation, and monitoring tools

### Technical Features
- **Job Queue System** - Background processing with real-time progress tracking
- **Credits Ledger** - Transaction tracking with running balance
- **Audit Logging** - Complete system activity trail
- **Subscription Plans** - Free, Starter, Pro, and Enterprise tiers
- **File Storage** - Configurable storage abstraction (Mega/S3/R2)
- **Webhook Support** - Payment and event processing

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS v4** - Utility-first styling
- **Shadcn/UI** - Beautiful, accessible components
- **Lucide React** - Icon library
- **Sonner** - Toast notifications
- **React Hook Form** - Form management
- **Zod** - Schema validation

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **Better Auth** - Authentication with JWT and sessions
- **Drizzle ORM** - Type-safe database queries
- **Turso (LibSQL)** - Serverless SQLite database
- **Stripe** - Payment processing (ready for integration)

### Infrastructure
- **Redis/BullMQ** - Job queue (ready for integration)
- **ElevenLabs API** - Text-to-speech (ready for integration)
- **Wav2Lip** - Lip-sync technology (ready for integration)
- **FFmpeg** - Audio/video processing (ready for integration)

## 📦 Installation

### Prerequisites
- Node.js 18+ or Bun
- Git

### Setup Steps

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd osirix
```

2. **Install dependencies**
```bash
bun install
# or
npm install
```

3. **Environment variables are already configured**

The database and authentication are pre-configured. For full functionality, optionally add:

```env
# Stripe (for payments)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# ElevenLabs (for TTS)
ELEVENLABS_API_KEY=...

# Storage (choose one)
AWS_S3_BUCKET=...
R2_BUCKET_NAME=...

# Redis (for job queue)
REDIS_URL=redis://localhost:6379
```

4. **Start the development server**
```bash
bun dev
# or
npm run dev
```

5. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Application Structure

```
osirix/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx           # Landing page
│   │   ├── login/             # Authentication pages
│   │   ├── register/
│   │   ├── dashboard/         # Main dashboard
│   │   ├── avatars/           # Avatar management
│   │   ├── jobs/              # Job queue interface
│   │   ├── marketplace/       # Digital marketplace
│   │   ├── social/            # Social media scheduling
│   │   ├── analytics/         # Analytics dashboard
│   │   ├── admin/             # Admin console
│   │   └── api/               # API routes
│   ├── components/            # React components
│   │   ├── ui/               # Shadcn/UI components
│   │   └── DashboardLayout.tsx
│   ├── db/                    # Database layer
│   │   ├── schema.ts         # Database schema
│   │   └── seeds/            # Seed data
│   └── lib/                   # Utility functions
│       ├── auth.ts           # Auth configuration
│       └── auth-client.ts    # Auth client hooks
├── drizzle/                   # Database migrations
└── package.json
```

## 🔑 Key Concepts

### Credits System
- Users have a credit balance tracked in the `credits_ledger` table
- Each operation (TTS, video generation, purchases) requires credits
- Credits are reserved when jobs are created
- Running balance is maintained for efficient queries

### Job Queue
- Jobs are created with status: `pending`, `processing`, `completed`, or `failed`
- Progress tracking (0-100%) for real-time updates
- Credit reservation during job creation
- Support for TTS, video, and lip-sync job types

### Subscription Plans
1. **Free** - $0/month, 100 credits
2. **Starter** - $9.99/month, 500 credits
3. **Pro** - $29.99/month, 2000 credits
4. **Enterprise** - $99.99/month, 10,000 credits

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/sign-up` - Register new user
- `POST /api/auth/sign-in` - Login user
- `POST /api/auth/sign-out` - Logout user
- `GET /api/auth/session` - Get current session

### Credits
- `GET /api/credits/balance` - Get user's credit balance

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

### Jobs
- `GET /api/jobs` - List user's jobs
- `POST /api/jobs` - Create new job

### Avatars
- `GET /api/avatars` - List user's avatars
- `POST /api/avatars` - Upload new avatar

### Marketplace
- `GET /api/marketplace/products` - List all products
- `POST /api/marketplace/products` - Create new product
- `POST /api/marketplace/purchase` - Purchase a product

### Social Media
- `GET /api/social/posts` - List user's posts
- `POST /api/social/posts` - Schedule new post

## 🚦 Getting Started Guide

### For Users

1. **Register an Account**
   - Visit the homepage and click "Get Started"
   - Fill in your details and create an account
   - You'll start with a Free plan

2. **Upload an Avatar**
   - Navigate to the Avatars page
   - Click "Upload Avatar"
   - Upload a video file (recommended: MP4, 1920x1080, 30fps)

3. **Create Your First Job**
   - Go to the Jobs page
   - Click "Create Job"
   - Select job type (TTS, Video, or Lip-sync)
   - Enter your content text
   - Submit the job

4. **Explore the Marketplace**
   - Browse available products
   - Purchase voice packs, avatars, or templates
   - Downloads are instant after purchase

5. **Schedule Social Posts**
   - Navigate to Social Media
   - Click "Schedule Post"
   - Choose platform and enter content
   - Set schedule time or post immediately

### For Developers

1. **Customize the Platform**
   - Modify components in `src/components/`
   - Update API routes in `src/app/api/`
   - Adjust database schema in `src/db/schema.ts`

2. **Add New Features**
   - Follow existing patterns for new pages
   - Use DashboardLayout wrapper for authenticated pages
   - Implement API routes with proper authentication

3. **Integrate External Services**
   - Add ElevenLabs for real TTS generation
   - Integrate Wav2Lip for lip-sync processing
   - Connect Stripe for payment processing
   - Set up Redis for job queue management

## 💾 Database Schema

### Core Tables
- `user` - User accounts
- `session` - Active sessions
- `plans` - Subscription plans with features
- `subscriptions` - User subscriptions
- `credits_ledger` - Credit transactions with running balance
- `jobs` - Content generation jobs
- `avatars` - User avatars
- `products` - Marketplace products
- `orders` - Purchase orders
- `social_posts` - Scheduled posts
- `audit_logs` - System audit trail

## 📄 License

This project is licensed under the MIT License.

---

Built with ❤️ using Next.js, TypeScript, and modern web technologies.