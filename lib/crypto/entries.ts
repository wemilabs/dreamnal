import "server-only";

import { env } from "@/lib/env";
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
  };
}
