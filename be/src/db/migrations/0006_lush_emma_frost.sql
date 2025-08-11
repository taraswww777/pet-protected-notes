ALTER TABLE "system_logs" ALTER COLUMN "metadata" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "system_logs" ADD COLUMN "data" jsonb;