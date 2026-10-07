import "server-only";

import { and, eq, isNull } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { after } from "next/server";
import { db } from "@/db";
import { dreamEntries } from "@/db/schema";
import { sealSymbols } from "@/lib/crypto/entries";
import { extractSymbols } from "./extract";

export function scheduleSymbolRefresh({
  userId,
  id,
  body,
  sealedBody,
  previousSymbols,
}: {
  userId: string;
  id: string;
  body: string;
  sealedBody: string;
  previousSymbols: string | null;
}) {
  after(async () => {
    try {
      const items = await extractSymbols(body);
      const updated = await db
        .update(dreamEntries)
        .set({
          symbols: sealSymbols({
            userId,
            id,
            payload: { v: 1, source: "ai", items },
          }),
        })
        .where(
          and(
            eq(dreamEntries.id, id),
            eq(dreamEntries.userId, userId),
            eq(dreamEntries.body, sealedBody),
            previousSymbols === null
              ? isNull(dreamEntries.symbols)
              : eq(dreamEntries.symbols, previousSymbols),
          ),
        )
        .returning({ id: dreamEntries.id });
      if (updated.length > 0) {
        revalidateTag(`entries:${userId}`, { expire: 0 });
      }
    } catch (error) {
      console.error(
        "symbol refresh failed",
        id,
        error instanceof Error ? error.message : error,
      );
    }
  });
}
