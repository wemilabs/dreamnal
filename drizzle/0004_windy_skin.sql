CREATE TYPE "public"."entry_kind" AS ENUM('dream', 'whisper');--> statement-breakpoint
ALTER TABLE "dream_entries" ADD COLUMN "kind" "entry_kind" DEFAULT 'dream' NOT NULL;