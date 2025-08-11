CREATE TABLE "userInfo" (
	"user_id" integer NOT NULL,
	"first_name" varchar,
	"second_name" varchar,
	"third_name" varchar
);
--> statement-breakpoint
ALTER TABLE "userInfo" ADD CONSTRAINT "userInfo_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;