"use server";

import { and, eq } from "drizzle-orm";
import { updateTag } from "next/cache";
import { z } from "zod";
import { db } from "@/db";
import { dreamEntries } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth/session";
import { sealSymbols } from "@/lib/crypto/entries";
import { symbolsCopy } from "@/lib/symbols/copy";
import { cleanItems, type SymbolItem, symbolItem } from "@/lib/symbols/schema";

export async function saveSymbols(
  entryId: string,
  items: SymbolItem[],
): Promise<{ error?: string } | null> {
  const user = await getCurrentUser();
  const id = z.uuid().safeParse(entryId);
  const parsed = z.array(symbolItem).max(40).safeParse(items);
  if (!id.success || !parsed.success) {
    return { error: symbolsCopy.saveError };
  }

  const updated = await db
    .update(dreamEntries)
    .set({
      symbols: sealSymbols({
        userId: user.id,
        id: id.data,
        payload: { v: 1, source: "user", items: cleanItems(parsed.data, 40) },
      }),
    })
    .where(and(eq(dreamEntries.id, id.data), eq(dreamEntries.userId, user.id)))
    .returning({ id: dreamEntries.id });

  if (updated.length === 0) {
    return { error: symbolsCopy.saveError };
  }

  updateTag(`entries:${user.id}`);
  return null;
}
