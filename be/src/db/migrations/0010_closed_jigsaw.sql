ALTER TABLE "notes" RENAME COLUMN "content" TO "encrypted_content";--> statement-breakpoint
ALTER TABLE "notes" ADD COLUMN "encrypted_dek" text NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "crypto_salt" text;