CREATE TYPE "public"."log_level_enum" AS ENUM('INFO', 'SUCCESS', 'ERROR', 'WARNING', 'DEBUG', 'CRITICAL');--> statement-breakpoint
CREATE TABLE "system_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"log_level" "log_level_enum" DEFAULT 'INFO' NOT NULL,
	"attempt_time" timestamp DEFAULT now() NOT NULL,
	"event_type" text NOT NULL,
	"metadata" jsonb
);
