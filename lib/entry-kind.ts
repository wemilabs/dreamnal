export const ENTRY_KINDS = ["dream", "whisper"] as const;

export type EntryKind = (typeof ENTRY_KINDS)[number];
