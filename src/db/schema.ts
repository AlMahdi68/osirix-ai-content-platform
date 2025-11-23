import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

// Add plans table
export const plans = sqliteTable('plans', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  price: integer('price').notNull(),
  creditsMonthly: integer('credits_monthly').notNull(),
  features: text('features', { mode: 'json' }).notNull(),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// Add subscriptions table
export const subscriptions = sqliteTable('subscriptions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id').notNull(),
  planId: integer('plan_id').notNull().references(() => plans.id),
  status: text('status').notNull(),
  stripeSubscriptionId: text('stripe_subscription_id'),
  currentPeriodStart: text('current_period_start').notNull(),
  currentPeriodEnd: text('current_period_end').notNull(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// Add credits_ledger table
export const creditsLedger = sqliteTable('credits_ledger', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id').notNull(),
  amount: integer('amount').notNull(),
  type: text('type').notNull(),
  referenceId: text('reference_id'),
  balanceAfter: integer('balance_after').notNull(),
  metadata: text('metadata', { mode: 'json' }),
  createdAt: text('created_at').notNull(),
});

// Add jobs table
export const jobs = sqliteTable('jobs', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id').notNull(),
  type: text('type').notNull(),
  status: text('status').notNull(),
  inputData: text('input_data', { mode: 'json' }).notNull(),
  outputData: text('output_data', { mode: 'json' }),
  creditsReserved: integer('credits_reserved').notNull(),
  creditsCharged: integer('credits_charged'),
  errorMessage: text('error_message'),
  progress: integer('progress').notNull().default(0),
  startedAt: text('started_at'),
  completedAt: text('completed_at'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// Add avatars table
export const avatars = sqliteTable('avatars', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id').notNull(),
  name: text('name').notNull(),
  fileUrl: text('file_url').notNull(),
  thumbnailUrl: text('thumbnail_url'),
  fileSize: integer('file_size').notNull(),
  duration: integer('duration'),
  mimeType: text('mime_type').notNull(),
  metadata: text('metadata', { mode: 'json' }),
  isDefault: integer('is_default', { mode: 'boolean' }).notNull().default(false),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// Add products table
export const products = sqliteTable('products', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  sellerId: text('seller_id').notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  price: integer('price').notNull(),
  fileUrl: text('file_url').notNull(),
  previewUrl: text('preview_url'),
  category: text('category').notNull(),
  tags: text('tags', { mode: 'json' }).notNull(),
  isPublished: integer('is_published', { mode: 'boolean' }).notNull().default(false),
  salesCount: integer('sales_count').notNull().default(0),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// Add orders table
export const orders = sqliteTable('orders', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  buyerId: text('buyer_id').notNull(),
  productId: integer('product_id').notNull().references(() => products.id),
  amount: integer('amount').notNull(),
  stripePaymentIntentId: text('stripe_payment_intent_id'),
  status: text('status').notNull(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// Add social_accounts table
export const socialAccounts = sqliteTable('social_accounts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id').notNull().references(() => user.id),
  platform: text('platform').notNull(),
  platformUserId: text('platform_user_id').notNull(),
  platformUsername: text('platform_username').notNull(),
  accessToken: text('access_token').notNull(),
  refreshToken: text('refresh_token'),
  tokenExpiresAt: text('token_expires_at'),
  scopes: text('scopes', { mode: 'json' }).notNull(),
  isConnected: integer('is_connected', { mode: 'boolean' }).notNull().default(true),
  lastRefreshedAt: text('last_refreshed_at'),
  metadata: text('metadata', { mode: 'json' }),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// Add social_posts table
export const socialPosts = sqliteTable('social_posts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id').notNull(),
  platformAccountId: integer('platform_account_id').references(() => socialAccounts.id),
  platform: text('platform').notNull(),
  content: text('content').notNull(),
  mediaUrls: text('media_urls', { mode: 'json' }).notNull(),
  scheduledAt: text('scheduled_at'),
  publishedAt: text('published_at'),
  status: text('status').notNull(),
  platformPostId: text('platform_post_id'),
  impressions: integer('impressions').notNull().default(0),
  engagements: integer('engagements').notNull().default(0),
  clicks: integer('clicks').notNull().default(0),
  errorMessage: text('error_message'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// Add audit_logs table
export const auditLogs = sqliteTable('audit_logs', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id'),
  action: text('action').notNull(),
  resourceType: text('resource_type').notNull(),
  resourceId: text('resource_id'),
  metadata: text('metadata', { mode: 'json' }),
  ipAddress: text('ip_address'),
  createdAt: text('created_at').notNull(),
});


// Auth tables for better-auth
export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" })
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
});

export const session = sqliteTable("session", {
  id: text("id").primaryKey(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = sqliteTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: integer("access_token_expires_at", {
    mode: "timestamp",
  }),
  refreshTokenExpiresAt: integer("refresh_token_expires_at", {
    mode: "timestamp",
  }),
  scope: text("scope"),
  password: text("password"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const verification = sqliteTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date(),
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(
    () => new Date(),
  ),
});

// Add wallets table
export const wallets = sqliteTable('wallets', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id').notNull().references(() => user.id),
  balance: integer('balance').notNull().default(0),
  pendingBalance: integer('pending_balance').notNull().default(0),
  totalEarnings: integer('total_earnings').notNull().default(0),
  totalWithdrawn: integer('total_withdrawn').notNull().default(0),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// Add transactions table
export const transactions = sqliteTable('transactions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  walletId: integer('wallet_id').notNull().references(() => wallets.id),
  userId: text('user_id').notNull().references(() => user.id),
  type: text('type').notNull(),
  amount: integer('amount').notNull(),
  status: text('status').notNull(),
  sourceType: text('source_type').notNull(),
  sourceId: integer('source_id'),
  description: text('description').notNull(),
  metadata: text('metadata', { mode: 'json' }),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// Add withdrawal_requests table
export const withdrawalRequests = sqliteTable('withdrawal_requests', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id').notNull().references(() => user.id),
  walletId: integer('wallet_id').notNull().references(() => wallets.id),
  amount: integer('amount').notNull(),
  method: text('method').notNull(),
  paymentDetails: text('payment_details', { mode: 'json' }).notNull(),
  status: text('status').notNull().default('pending'),
  processedAt: text('processed_at'),
  rejectionReason: text('rejection_reason'),
  adminNotes: text('admin_notes'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// Add AI-powered feature tables

// AI Products table
export const aiProducts = sqliteTable('ai_products', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id').notNull().references(() => user.id),
  name: text('name').notNull(),
  description: text('description').notNull(),
  category: text('category').notNull(),
  priceSuggestion: integer('price_suggestion').notNull(),
  targetAudience: text('target_audience').notNull(),
  keyFeatures: text('key_features', { mode: 'json' }).notNull(),
  marketingCopy: text('marketing_copy').notNull(),
  status: text('status').notNull().default('draft'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// AI Logos table
export const aiLogos = sqliteTable('ai_logos', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id').notNull().references(() => user.id),
  name: text('name').notNull(),
  prompt: text('prompt').notNull(),
  imageUrl: text('image_url'),
  style: text('style').notNull(),
  colors: text('colors', { mode: 'json' }).notNull(),
  status: text('status').notNull().default('generating'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// AI Characters table
export const aiCharacters = sqliteTable('ai_characters', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id').notNull().references(() => user.id),
  name: text('name').notNull(),
  personality: text('personality').notNull(),
  backstory: text('backstory').notNull(),
  voiceStyle: text('voice_style').notNull(),
  avatarId: integer('avatar_id').references(() => avatars.id),
  traits: text('traits', { mode: 'json' }).notNull(),
  useCases: text('use_cases', { mode: 'json' }).notNull(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// AI Campaigns table
export const aiCampaigns = sqliteTable('ai_campaigns', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id').notNull().references(() => user.id),
  name: text('name').notNull(),
  goal: text('goal').notNull(),
  targetAudience: text('target_audience').notNull(),
  platforms: text('platforms', { mode: 'json' }).notNull(),
  contentStrategy: text('content_strategy').notNull(),
  postingSchedule: text('posting_schedule', { mode: 'json' }).notNull(),
  budget: integer('budget').notNull(),
  status: text('status').notNull().default('planning'),
  performanceMetrics: text('performance_metrics', { mode: 'json' }),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// AI Agent Activities table
export const aiAgentActivities = sqliteTable('ai_agent_activities', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id').notNull().references(() => user.id),
  activityType: text('activity_type').notNull(),
  description: text('description').notNull(),
  relatedResourceType: text('related_resource_type'),
  relatedResourceId: integer('related_resource_id'),
  result: text('result').notNull(),
  metadata: text('metadata', { mode: 'json' }),
  createdAt: text('created_at').notNull(),
});