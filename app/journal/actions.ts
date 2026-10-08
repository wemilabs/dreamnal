"use server";

import { and, eq } from "drizzle-orm";
import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { MAX_AUDIO_BYTES } from "@/components/journal/recorder-mime";
import { db } from "@/db";
import { dreamEntries } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth/session";
import { openEntry, openSymbols, sealEntry } from "@/lib/crypto/entries";
import type { SearchEntry } from "@/lib/dream-search";
import { listSearchEntries } from "@/lib/entries";
import { scheduleSymbolRefresh } from "@/lib/symbols/refresh";
import { transcribeAudio } from "@/lib/transcribe";

export type EntryFormState = {
  error?: string;
  fieldErrors?: Record<string, string[] | undefined>;
  savedId?: string;
} | null;

export type TranscribeResult =
  | { status: "ok"; text: string; duration: number }
  | { status: "error"; message: string };

export async function transcribeRecording(
  formData: FormData,
): Promise<TranscribeResult> {
  await getCurrentUser();

  const audio = formData.get("audio");
  if (
    !(audio instanceof File) ||
    audio.size === 0 ||
    audio.size > MAX_AUDIO_BYTES ||
    !audio.type.startsWith("audio/")
  ) {
    return { status: "error", message: "Transcription failed, try again" };
  }

  try {
    const { text, duration } = await transcribeAudio(audio);
    if (!text.trim()) {
      return {
        status: "error",
        message:
          "We couldn’t hear anything. Try again a little closer to the mic.",
      };
    }
    return { status: "ok", text, duration };
  } catch {
    return { status: "error", message: "Transcription failed, try again" };
  }
}

export async function getSearchEntries(): Promise<SearchEntry[]> {
  return listSearchEntries();
}

const entryInput = z.object({
  title: z
    .string()
    .trim()
    .max(120, "Keep the title under 120 characters")
    .transform((v) => (v === "" ? null : v)),
  body: z
    .string()
    .trim()
    .min(1, "Write something first")
    .max(20000, "That entry is too long"),
  source: z.enum(["voice", "text"]),
  audioDurationSeconds: z
    .string()
    .optional()
    .transform((v) => {
      if (!v) {
        return null;
      }
      const n = Number(v);
      return Number.isFinite(n) && n >= 0 ? n : null;
    }),
});

const idInput = z.uuid();

function parseEntryForm(formData: FormData) {
  return entryInput.safeParse({
    title: formData.get("title") ?? "",
    body: formData.get("body") ?? "",
    source: formData.get("source"),
    audioDurationSeconds: formData.get("audioDurationSeconds") ?? undefined,
  });
}

export async function createEntry(
  _prev: EntryFormState,
  formData: FormData,
): Promise<EntryFormState> {
  const user = await getCurrentUser();
  const parsed = parseEntryForm(formData);
  if (!parsed.success) {
    const flat = z.flattenError(parsed.error);
    return {
      error: flat.formErrors[0],
      fieldErrors: flat.fieldErrors as Record<string, string[] | undefined>,
    };
  }

  const id = crypto.randomUUID();
  const sealed = sealEntry({ userId: user.id, id, ...parsed.data });
  const [entry] = await db
    .insert(dreamEntries)
    .values({
      ...parsed.data,
      ...sealed,
      id,
      userId: user.id,
    })
    .returning({ id: dreamEntries.id });

  updateTag(`entries:${user.id}`);
  scheduleSymbolRefresh({
    userId: user.id,
    id,
    body: parsed.data.body,
    sealedBody: sealed.body,
    previousSymbols: null,
  });
  return { savedId: entry.id };
}

export async function updateEntry(
  _prev: EntryFormState,
  formData: FormData,
): Promise<EntryFormState> {
  const user = await getCurrentUser();

  const id = idInput.safeParse(formData.get("id"));
  if (!id.success) {
    return { error: "Couldn’t find that entry." };
  }
  const parsed = parseEntryForm(formData);
  if (!parsed.success) {
    const flat = z.flattenError(parsed.error);
    return {
      error: flat.formErrors[0],
      fieldErrors: flat.fieldErrors as Record<string, string[] | undefined>,
    };
  }

  const [existing] = await db
    .select({ body: dreamEntries.body, symbols: dreamEntries.symbols })
    .from(dreamEntries)
    .where(and(eq(dreamEntries.id, id.data), eq(dreamEntries.userId, user.id)))
    .limit(1);
  if (!existing) {
    return { error: "Couldn’t find that entry." };
  }

  const sealed = sealEntry({ userId: user.id, id: id.data, ...parsed.data });
  const updated = await db
    .update(dreamEntries)
    .set({
      ...sealed,
      updatedAt: new Date(),
    })
    .where(and(eq(dreamEntries.id, id.data), eq(dreamEntries.userId, user.id)))
    .returning({ id: dreamEntries.id });

  if (updated.length === 0) {
    return { error: "Couldn’t find that entry." };
  }

  const oldBody = openEntry({
    userId: user.id,
    id: id.data,
    title: null,
    body: existing.body,
  }).body;
  const symbolsSource = openSymbols({
    userId: user.id,
    id: id.data,
    symbols: existing.symbols,
  })?.source;
  if (oldBody !== parsed.data.body && symbolsSource !== "user") {
    scheduleSymbolRefresh({
      userId: user.id,
      id: id.data,
      body: parsed.data.body,
      sealedBody: sealed.body,
      previousSymbols: existing.symbols,
    });
  }

  updateTag(`entries:${user.id}`);
  redirect(`/journal/${id.data}`);
}

export async function deleteEntry(
  _prev: EntryFormState,
  formData: FormData,
): Promise<EntryFormState> {
  const user = await getCurrentUser();

  const id = idInput.safeParse(formData.get("id"));
  if (!id.success) {
    return { error: "Couldn’t find that entry." };
  }

  const deleted = await db
    .delete(dreamEntries)
    .where(and(eq(dreamEntries.id, id.data), eq(dreamEntries.userId, user.id)))
    .returning({ id: dreamEntries.id });

  if (deleted.length === 0) {
    return { error: "Couldn’t find that entry." };
  }

  updateTag(`entries:${user.id}`);
  redirect("/journal");
}
