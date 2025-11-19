CREATE TABLE `audit_logs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text,
	`action` text NOT NULL,
	`resource_type` text NOT NULL,
	`resource_id` text,
	`metadata` text,
	`ip_address` text,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `avatars` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`name` text NOT NULL,
	`file_url` text NOT NULL,
	`thumbnail_url` text,
	`file_size` integer NOT NULL,
	`duration` integer,
	`mime_type` text NOT NULL,
	`metadata` text,
	`is_default` integer DEFAULT false NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `credits_ledger` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`amount` integer NOT NULL,
	`type` text NOT NULL,
	`reference_id` text,
	`balance_after` integer NOT NULL,
	`metadata` text,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `jobs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`type` text NOT NULL,
	`status` text NOT NULL,
	`input_data` text NOT NULL,
	`output_data` text,
	`credits_reserved` integer NOT NULL,
	`credits_charged` integer,
	`error_message` text,
	`progress` integer DEFAULT 0 NOT NULL,
	`started_at` text,
	`completed_at` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`buyer_id` text NOT NULL,
	`product_id` integer NOT NULL,
	`amount` integer NOT NULL,
	`stripe_payment_intent_id` text,
	`status` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `plans` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`price` integer NOT NULL,
	`credits_monthly` integer NOT NULL,
	`features` text NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`seller_id` text NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`price` integer NOT NULL,
	`file_url` text NOT NULL,
	`preview_url` text,
	`category` text NOT NULL,
	`tags` text NOT NULL,
	`is_published` integer DEFAULT false NOT NULL,
	`sales_count` integer DEFAULT 0 NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `social_posts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`platform` text NOT NULL,
	`content` text NOT NULL,
	`media_urls` text NOT NULL,
	`scheduled_at` text,
	`published_at` text,
	`status` text NOT NULL,
	`platform_post_id` text,
	`error_message` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `subscriptions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`plan_id` integer NOT NULL,
	`status` text NOT NULL,
	`stripe_subscription_id` text,
	`current_period_start` text NOT NULL,
	`current_period_end` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`plan_id`) REFERENCES `plans`(`id`) ON UPDATE no action ON DELETE no action
);
