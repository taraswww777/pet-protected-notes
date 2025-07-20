CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
