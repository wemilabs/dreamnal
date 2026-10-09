import "server-only";

import { env } from "@/lib/env";
import { type SymbolsPayload, symbolsPayload } from "@/lib/symbols/schema";
import {
  decryptEntryField,
  encryptEntryField,
  parseEntryKey,
} from "./entry-cipher";

const key = parseEntryKey(env.ENTRY_ENCRYPTION_KEY);

type EntrySecrets = {
  userId: string;
  id: string;
  title: string | null;
  body: string;
  meaning?: string | null;
  fulfillmentNote?: string | null;
};

export function sealEntry(entry: EntrySecrets) {
  return {
    title:
      entry.title === null
        ? null
        : encryptEntryField(key, entry.userId, entry.id, "title", entry.title),
    body: encryptEntryField(key, entry.userId, entry.id, "body", entry.body),
  };
}

export function openEntry<T extends EntrySecrets>(entry: T): T {
  return {
    ...entry,
    title:
      entry.title === null
        ? null
        : decryptEntryField(key, entry.userId, entry.id, "title", entry.title),
    body: decryptEntryField(key, entry.userId, entry.id, "body", entry.body),
    ...("meaning" in entry && entry.meaning != null
      ? {
          meaning: decryptEntryField(
            key,
            entry.userId,
            entry.id,
            "meaning",
            entry.meaning,
          ),
        }
      : {}),
    ...("fulfillmentNote" in entry && entry.fulfillmentNote != null
      ? {
          fulfillmentNote: decryptEntryField(
            key,
            entry.userId,
            entry.id,
            "fulfillment",
            entry.fulfillmentNote,
          ),
        }
      : {}),
  };
}

export function sealMeaning({
  userId,
  id,
  meaning,
  fulfillmentNote,
}: {
  userId: string;
  id: string;
  meaning?: string | null;
  fulfillmentNote?: string | null;
}): { meaning?: string | null; fulfillmentNote?: string | null } {
  return {
    ...(meaning === undefined
      ? {}
      : {
          meaning:
            meaning === null
              ? null
              : encryptEntryField(key, userId, id, "meaning", meaning),
        }),
    ...(fulfillmentNote === undefined
      ? {}
      : {
          fulfillmentNote:
            fulfillmentNote === null
              ? null
              : encryptEntryField(
                  key,
                  userId,
                  id,
                  "fulfillment",
                  fulfillmentNote,
                ),
        }),
  };
}

export function sealSymbols({
  userId,
  id,
  payload,
}: {
  userId: string;
  id: string;
  payload: SymbolsPayload;
}): string {
  return encryptEntryField(key, userId, id, "symbols", JSON.stringify(payload));
}

export function openSymbols({
  userId,
  id,
  symbols,
}: {
  userId: string;
  id: string;
  symbols: string | null;
}): SymbolsPayload | null {
  if (symbols === null) {
    return null;
  }
  try {
    return symbolsPayload.parse(
      JSON.parse(decryptEntryField(key, userId, id, "symbols", symbols)),
    );
  } catch {
    console.error("symbols unreadable", id);
    return null;
  }
}
