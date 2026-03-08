CREATE TABLE `compilations` (
	`id` integer PRIMARY KEY NOT NULL,
	`game_id` text NOT NULL,
	`created_at` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`game_id`) REFERENCES `games`(`name`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `games` (
	`name` text PRIMARY KEY NOT NULL,
	`twitch_game_id` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `games_twitch_game_id_unique` ON `games` (`twitch_game_id`);