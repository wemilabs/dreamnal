"use server";

import { and, eq } from "drizzle-orm";
import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "../../db";
import { dreamEntries } from "../../db/schema";
import { getCurrentUser } from "../../lib/auth/session";

export type EntryFormState = {
  error?: string;
  fieldErrors?: Record<string, string[] | undefined>;
} | null;

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

  const [entry] = await db
    .insert(dreamEntries)
    .values({ ...parsed.data, userId: user.id })
    .returning({ id: dreamEntries.id });

  updateTag(`entries:${user.id}`);
  redirect(`/journal/${entry.id}`);
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

  const updated = await db
    .update(dreamEntries)
    .set({
      title: parsed.data.title,
      body: parsed.data.body,
      updatedAt: new Date(),
    })
    .where(and(eq(dreamEntries.id, id.data), eq(dreamEntries.userId, user.id)))
    .returning({ id: dreamEntries.id });

  if (updated.length === 0) {
    return { error: "Couldn’t find that entry." };
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
