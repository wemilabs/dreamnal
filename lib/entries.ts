import "server-only";

import { and, desc, eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { z } from "zod";
import { db } from "@/db";
import { type DreamEntry, dreamEntries } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth/session";
import { openEntry, openSymbols } from "@/lib/crypto/entries";
import type { SearchEntry } from "@/lib/dream-search";
import type { SymbolsPayload } from "@/lib/symbols/schema";

export async function listEntries() {
  const user = await getCurrentUser();
  const rows = await listEntriesForUser(user.id);
  return rows.map((row) => {
    const entry = openEntry(row);
    return {
      id: entry.id,
      title: entry.title,
      source: entry.source,
      audioDurationSeconds: entry.audioDurationSeconds,
      createdAt: entry.createdAt,
      symbols: openSymbols(row)?.items ?? [],
      wordCount: entry.body.trim().split(/\s+/).filter(Boolean).length,
      excerpt: Array.from(entry.body).slice(0, 280).join(""),
    };
  });
}

export async function listSearchEntries(): Promise<SearchEntry[]> {
  const user = await getCurrentUser();
  const rows = await listEntriesForUser(user.id);
  return rows.map((row) => {
    const entry = openEntry(row);
    return {
      id: entry.id,
      title: entry.title,
      body: entry.body,
      labels: (openSymbols(row)?.items ?? []).map((item) => item.label),
      createdAt: entry.createdAt.toISOString(),
    };
  });
}

async function listEntriesForUser(userId: string) {
  "use cache";
  cacheTag(`entries:${userId}`);
  cacheLife("minutes");

  return db
    .select({
      id: dreamEntries.id,
      userId: dreamEntries.userId,
      title: dreamEntries.title,
      body: dreamEntries.body,
      source: dreamEntries.source,
      audioDurationSeconds: dreamEntries.audioDurationSeconds,
      symbols: dreamEntries.symbols,
      createdAt: dreamEntries.createdAt,
    })
    .from(dreamEntries)
    .where(eq(dreamEntries.userId, userId))
    .orderBy(desc(dreamEntries.createdAt));
}

export type EntryWithSymbols = Omit<DreamEntry, "symbols"> & {
  symbols: SymbolsPayload | null;
};

export async function getEntry(id: string): Promise<EntryWithSymbols | null> {
  if (!z.uuid().safeParse(id).success) {
    return null;
  }
  const user = await getCurrentUser();
  const entry = await getEntryForUser(user.id, id);
  if (entry === null) {
    return null;
  }
  return { ...openEntry(entry), symbols: openSymbols(entry) };
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
