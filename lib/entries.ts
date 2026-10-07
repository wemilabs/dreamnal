import "server-only";

import { and, desc, eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { z } from "zod";
import { db } from "../db";
import { dreamEntries } from "../db/schema";
import { getCurrentUser } from "./auth/session";
import { openEntry } from "./crypto/entries";

export async function listEntries() {
  const user = await getCurrentUser();
  return (await listEntriesForUser(user.id)).map(openEntry);
}

async function listEntriesForUser(userId: string) {
  "use cache";
  cacheTag(`entries:${userId}`);
  cacheLife("minutes");

  return db
    .select()
    .from(dreamEntries)
    .where(eq(dreamEntries.userId, userId))
    .orderBy(desc(dreamEntries.createdAt));
}

export async function getEntry(id: string) {
  if (!z.uuid().safeParse(id).success) {
    return null;
  }
  const user = await getCurrentUser();
  const entry = await getEntryForUser(user.id, id);
  return entry === null ? null : openEntry(entry);
}

async function getEntryForUser(userId: string, id: string) {
  "use cache";
  cacheTag(`entries:${userId}`);
  cacheLife("minutes");

  const [entry] = await db
    .select()
    .from(dreamEntries)
    .where(and(eq(dreamEntries.id, id), eq(dreamEntries.userId, userId)))
    .limit(1);
  return entry ?? null;
}
