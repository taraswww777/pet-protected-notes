CREATE TABLE "notes" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"content" text,
	CONSTRAINT "notes_content_unique" UNIQUE("content")
);
