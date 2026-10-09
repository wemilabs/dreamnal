import "server-only";

import { and, desc, eq, isNotNull, sql } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { z } from "zod";
import { db } from "@/db";
import { type DreamEntry, dreamEntries } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth/session";
import { openEntry, openSymbols } from "@/lib/crypto/entries";
import type { SearchEntry } from "@/lib/dream-search";
import {
  CONFIDENCE_LEVELS,
  type Confidence,
  type MeaningFilter,
} from "@/lib/meaning";
import type { SymbolsPayload } from "@/lib/symbols/schema";

export async function listEntries(filter: MeaningFilter = "all") {
  const user = await getCurrentUser();
  const rows = await listEntriesForUser(user.id);
  const entries = rows.map((row) => {
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
      meaningConfidence: row.meaningConfidence,
      fulfilledOn: row.fulfilledOn,
      hasMeaning: row.hasMeaning,
    };
  });

  if (filter === "interpreted") {
    return entries.filter(
      (entry) => entry.hasMeaning && entry.fulfilledOn === null,
    );
  }
  if (filter === "fulfilled") {
    return entries.filter((entry) => entry.fulfilledOn !== null);
  }
  return entries;
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
      meaningConfidence: dreamEntries.meaningConfidence,
      fulfilledOn: dreamEntries.fulfilledOn,
      hasMeaning: sql<boolean>`${dreamEntries.meaning} is not null`,
      createdAt: dreamEntries.createdAt,
    })
    .from(dreamEntries)
    .where(eq(dreamEntries.userId, userId))
    .orderBy(desc(dreamEntries.createdAt));
}

export type MeaningStats = {
  total: number;
  interpreted: number;
  fulfilled: number;
  avgDaysToFulfillment: number | null;
  byConfidence: { value: Confidence; label: string; count: number }[];
};

export async function getMeaningStats(): Promise<MeaningStats> {
  const user = await getCurrentUser();
  return getMeaningStatsForUser(user.id);
}

async function getMeaningStatsForUser(userId: string): Promise<MeaningStats> {
  "use cache";
  cacheTag(`entries:${userId}`);
  cacheLife("minutes");

  const [totalsRows, confidenceRows] = await Promise.all([
    db
      .select({
        total: sql<number>`count(*)`.mapWith(Number),
        interpreted:
          sql<number>`count(*) filter (where ${dreamEntries.meaning} is not null)`.mapWith(
            Number,
          ),
        fulfilled:
          sql<number>`count(*) filter (where ${dreamEntries.fulfilledOn} is not null)`.mapWith(
            Number,
          ),
        avgDaysToFulfillment: sql<
          string | null
        >`avg(${dreamEntries.fulfilledOn}::date - ${dreamEntries.createdAt}::date) filter (where ${dreamEntries.fulfilledOn} is not null)`,
      })
      .from(dreamEntries)
      .where(eq(dreamEntries.userId, userId)),
    db
      .select({
        value: dreamEntries.meaningConfidence,
        count: sql<number>`count(*)`.mapWith(Number),
      })
      .from(dreamEntries)
      .where(
        and(
          eq(dreamEntries.userId, userId),
          isNotNull(dreamEntries.meaningConfidence),
        ),
      )
      .groupBy(dreamEntries.meaningConfidence),
  ]);

  const totals = totalsRows[0];
  const counts = new Map(
    confidenceRows.map(({ value, count }) => [value, count]),
  );
  return {
    total: totals?.total ?? 0,
    interpreted: totals?.interpreted ?? 0,
    fulfilled: totals?.fulfilled ?? 0,
    avgDaysToFulfillment:
      totals?.avgDaysToFulfillment == null
        ? null
        : Number(totals.avgDaysToFulfillment),
    byConfidence: CONFIDENCE_LEVELS.map(({ value, label }) => ({
      value,
      label,
      count: counts.get(value) ?? 0,
    })),
  };
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
