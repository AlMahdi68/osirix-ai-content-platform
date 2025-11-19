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

// Add social_posts table
export const socialPosts = sqliteTable('social_posts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id').notNull(),
  platform: text('platform').notNull(),
  content: text('content').notNull(),
  mediaUrls: text('media_urls', { mode: 'json' }).notNull(),
  scheduledAt: text('scheduled_at'),
  publishedAt: text('published_at'),
  status: text('status').notNull(),
  platformPostId: text('platform_post_id'),
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