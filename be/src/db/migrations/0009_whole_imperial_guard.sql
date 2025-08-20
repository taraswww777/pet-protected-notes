ALTER TABLE "actions" DROP CONSTRAINT "actions_parent_id_actions_id_fk";
--> statement-breakpoint
ALTER TABLE "system_logs" ADD COLUMN "user_id" integer;--> statement-breakpoint
ALTER TABLE "system_logs" ADD CONSTRAINT "system_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;