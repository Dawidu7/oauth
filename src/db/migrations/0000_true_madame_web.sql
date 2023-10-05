CREATE TABLE IF NOT EXISTS "keys" (
	"id" varchar(15) PRIMARY KEY NOT NULL,
	"user_id" varchar(15),
	"hashed_password" varchar(255),
	"primary" boolean
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sessions" (
	"id" varchar(15) PRIMARY KEY NOT NULL,
	"user_id" varchar(15),
	"active_expires" bigint,
	"idle_expires" bigint
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" varchar(15) PRIMARY KEY NOT NULL,
	"email" varchar(255),
	"handle" varchar(20),
	"name" varchar(20),
	"created_at" date DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_handle_unique" UNIQUE("handle")
);
