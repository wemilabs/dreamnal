"use server";

import { and, eq } from "drizzle-orm";
import { updateTag } from "next/cache";
import { getTranslations } from "next-intl/server";
import { z } from "zod";
import { MAX_AUDIO_BYTES } from "@/components/journal/recorder-mime";
import { db } from "@/db";
import { dreamEntries } from "@/db/schema";
import { getActionLocale } from "@/i18n/action-locale";
import { redirect } from "@/i18n/navigation";
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
  const t = await getTranslations({
    locale: await getActionLocale(),
    namespace: "Entry",
  });

  const audio = formData.get("audio");
  if (
    !(audio instanceof File) ||
    audio.size === 0 ||
    audio.size > MAX_AUDIO_BYTES ||
    !audio.type.startsWith("audio/")
  ) {
    return { status: "error", message: t("transcriptionFailed") };
  }

  try {
    const { text, duration } = await transcribeAudio(audio);
    if (!text.trim()) {
      return {
        status: "error",
        message: t("nothingHeard"),
      };
    }
    return { status: "ok", text, duration };
  } catch {
    return { status: "error", message: t("transcriptionFailed") };
  }
}

export async function getSearchEntries(): Promise<SearchEntry[]> {
  return listSearchEntries();
}

function parseEntryForm(
  formData: FormData,
  messages: { titleMax: string; bodyMin: string; bodyMax: string },
) {
  const entryInput = z.object({
    title: z
      .string()
      .trim()
      .max(120, messages.titleMax)
      .transform((v) => (v === "" ? null : v)),
    body: z
      .string()
      .trim()
      .min(1, messages.bodyMin)
      .max(20000, messages.bodyMax),
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

  return entryInput.safeParse({
    title: formData.get("title") ?? "",
    body: formData.get("body") ?? "",
    source: formData.get("source"),
    audioDurationSeconds: formData.get("audioDurationSeconds") ?? undefined,
  });
}

const idInput = z.uuid();

export async function createEntry(
  _prev: EntryFormState,
  formData: FormData,
): Promise<EntryFormState> {
  const user = await getCurrentUser();
  const t = await getTranslations({
    locale: await getActionLocale(),
    namespace: "Entry",
  });
  const parsed = parseEntryForm(formData, {
    titleMax: t("titleMax"),
    bodyMin: t("bodyMin"),
    bodyMax: t("bodyMax"),
  });
  if (!parsed.success) {
    const flat = z.flattenError(parsed.error);
    return {
      error: flat.formErrors[0],
      fieldErrors: flat.fieldErrors as Record<string, string[] | undefined>,
    };
  }

  const createdAtValue = formData.get("createdAt");
  let createdAt: Date | undefined;
  if (createdAtValue !== null) {
    const parsedCreatedAt = z.iso.datetime().safeParse(createdAtValue);
    if (!parsedCreatedAt.success) {
      return { error: t("dateInvalid") };
    }
    createdAt = new Date(parsedCreatedAt.data);
    if (
      createdAt.getTime() > Date.now() + 5 * 60 * 1000 ||
      createdAt.getTime() < new Date("2000-01-01T00:00:00.000Z").getTime()
    ) {
      return { error: t("dateInvalid") };
    }
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
      ...(createdAt ? { createdAt } : {}),
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
  const t = await getTranslations({
    locale: await getActionLocale(),
    namespace: "Entry",
  });

  const id = idInput.safeParse(formData.get("id"));
  if (!id.success) {
    return { error: t("notFound") };
  }
  const parsed = parseEntryForm(formData, {
    titleMax: t("titleMax"),
    bodyMin: t("bodyMin"),
    bodyMax: t("bodyMax"),
  });
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
    return { error: t("notFound") };
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
    return { error: t("notFound") };
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
  const t = await getTranslations({
    locale: await getActionLocale(),
    namespace: "Entry",
  });

  const id = idInput.safeParse(formData.get("id"));
  if (!id.success) {
    return { error: t("notFound") };
  }

  const deleted = await db
    .delete(dreamEntries)
    .where(and(eq(dreamEntries.id, id.data), eq(dreamEntries.userId, user.id)))
    .returning({ id: dreamEntries.id });

  if (deleted.length === 0) {
    return { error: t("notFound") };
  }

  updateTag(`entries:${user.id}`);
  redirect("/journal");
}
