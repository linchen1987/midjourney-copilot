CREATE TABLE IF NOT EXISTS "mjtool_prompt_analysis" (
	"uuid1" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"room_name" text,
	"result" json,
	"feedback" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "mjtool_usages" (
	"id" serial PRIMARY KEY NOT NULL,
	"date" date,
	"used_tokens" integer,
	"used_times" smallint,
	"created_at" timestamp DEFAULT now()
);
