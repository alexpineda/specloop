CREATE TABLE `projects` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text,
	`project_short_summary` text,
	`idea` text,
	`idea_request_last_update_type` text,
	`spec` text,
	`implementation_plan` text,
	`existing_code` text,
	`project_rules` text,
	`starter_template` text,
	`last_generated_code` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `messages` (
	`id` text PRIMARY KEY NOT NULL,
	`chat_id` text NOT NULL,
	`content` text NOT NULL,
	`role` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`chat_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `settings` (
	`settings` text NOT NULL,
	`created_at` integer PRIMARY KEY NOT NULL,
	`updated_at` integer NOT NULL
);
