import {
  date,
  index,
  pgEnum,
  pgTable,
  real,
  smallint,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { authUsers } from "./neon-auth";

export const entrySource = pgEnum("entry_source", ["voice", "text"]);

export const dreamEntries = pgTable(
  "dream_entries",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => authUsers.id, { onDelete: "cascade" }),
    title: text("title"),
    body: text("body").notNull(),
    source: entrySource("source").notNull(),
    audioDurationSeconds: real("audio_duration_seconds"),
    symbols: text("symbols"),
    meaning: text("meaning"),
    meaningConfidence: smallint("meaning_confidence"),
    fulfilledOn: date("fulfilled_on", { mode: "string" }),
    fulfillmentNote: text("fulfillment_note"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    index("dream_entries_user_created_idx").on(t.userId, t.createdAt.desc()),
  ],
);

export type DreamEntry = typeof dreamEntries.$inferSelect;
