CREATE TABLE `sponsorship_applications` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`opportunity_id` integer NOT NULL,
	`influencer_user_id` text NOT NULL,
	`pitch` text NOT NULL,
	`expected_reach` integer NOT NULL,
	`portfolio_links` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`applied_at` text NOT NULL,
	`reviewed_at` text,
	`completed_at` text,
	FOREIGN KEY (`opportunity_id`) REFERENCES `sponsorship_opportunities`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`influencer_user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `sponsorship_deals` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`application_id` integer NOT NULL,
	`opportunity_id` integer NOT NULL,
	`brand_user_id` text NOT NULL,
	`influencer_user_id` text NOT NULL,
	`agreed_payment` integer NOT NULL,
	`deliverables` text NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`content_urls` text,
	`payment_released_at` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`application_id`) REFERENCES `sponsorship_applications`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`opportunity_id`) REFERENCES `sponsorship_opportunities`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`brand_user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`influencer_user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `sponsorship_opportunities` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`brand_user_id` text NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`category` text NOT NULL,
	`budget_min` integer NOT NULL,
	`budget_max` integer NOT NULL,
	`requirements` text NOT NULL,
	`duration_days` integer NOT NULL,
	`slots_available` integer NOT NULL,
	`slots_filled` integer DEFAULT 0 NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`brand_user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
