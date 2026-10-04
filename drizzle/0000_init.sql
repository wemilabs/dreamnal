CREATE TYPE "public"."entry_source" AS ENUM('voice', 'text');--> statement-breakpoint
CREATE TABLE "dream_entries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"title" text,
	"body" text NOT NULL,
	"source" "entry_source" NOT NULL,
	"audio_duration_seconds" real,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "dream_entries" ADD CONSTRAINT "dream_entries_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "neon_auth"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "dream_entries_user_created_idx" ON "dream_entries" USING btree ("user_id","created_at" DESC NULLS LAST);