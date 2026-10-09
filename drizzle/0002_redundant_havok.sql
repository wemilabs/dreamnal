ALTER TABLE "dream_entries" ADD COLUMN "meaning" text;--> statement-breakpoint
ALTER TABLE "dream_entries" ADD COLUMN "meaning_confidence" smallint;--> statement-breakpoint
ALTER TABLE "dream_entries" ADD COLUMN "fulfilled_on" date;--> statement-breakpoint
ALTER TABLE "dream_entries" ADD COLUMN "fulfillment_note" text;