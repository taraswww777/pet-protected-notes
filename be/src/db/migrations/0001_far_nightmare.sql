CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"login" text NOT NULL,
	"password" varchar NOT NULL,
	CONSTRAINT "users_login_unique" UNIQUE("login")
);
