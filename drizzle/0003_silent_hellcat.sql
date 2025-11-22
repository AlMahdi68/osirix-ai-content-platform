CREATE TABLE `social_accounts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`platform` text NOT NULL,
	`platform_user_id` text NOT NULL,
	`platform_username` text NOT NULL,
	`access_token` text NOT NULL,
	`refresh_token` text,
	`token_expires_at` text,
	`scopes` text NOT NULL,
	`is_connected` integer DEFAULT true NOT NULL,
	`last_refreshed_at` text,
	`metadata` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
ALTER TABLE `social_posts` ADD `platform_account_id` integer REFERENCES social_accounts(id);--> statement-breakpoint
ALTER TABLE `social_posts` ADD `impressions` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `social_posts` ADD `engagements` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `social_posts` ADD `clicks` integer DEFAULT 0 NOT NULL;