"use server";

import { and, eq, isNotNull, isNull } from "drizzle-orm";
import { updateTag } from "next/cache";
import { getTranslations } from "next-intl/server";
import { z } from "zod";
import { db } from "@/db";
import { dreamEntries } from "@/db/schema";
import { getActionLocale } from "@/i18n/action-locale";
import { getCurrentUser } from "@/lib/auth/session";
import { sealMeaning } from "@/lib/crypto/entries";
import { isConfidence } from "@/lib/meaning";

export type MeaningFormState = {
  error?: string;
  fieldErrors?: Record<string, string[] | undefined>;
  ok?: boolean;
} | null;

const idInput = z.uuid();
const datePattern = /^\d{4}-\d{2}-\d{2}$/;
const dayMs = 24 * 60 * 60 * 1000;

function utcDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

async function getMeaningTranslations() {
  return getTranslations({
    locale: await getActionLocale(),
    namespace: "Meaning",
  });
}

export async function saveMeaning(
  _prev: MeaningFormState,
  formData: FormData,
): Promise<MeaningFormState> {
  const t = await getMeaningTranslations();
  const user = await getCurrentUser();
  const id = idInput.safeParse(formData.get("id"));
  if (!id.success) {
    return { error: t("notFound") };
  }

  const [existing] = await db
    .select({ fulfilledOn: dreamEntries.fulfilledOn })
    .from(dreamEntries)
    .where(and(eq(dreamEntries.id, id.data), eq(dreamEntries.userId, user.id)))
    .limit(1);
  if (!existing) {
    return { error: t("notFound") };
  }
  if (existing.fulfilledOn !== null) {
    return { error: t("undoFirst") };
  }

  const value = formData.get("meaning");
  const meaning = typeof value === "string" ? value.trim() : "";
  if (meaning.length > 4000) {
    return {
      fieldErrors: {
        meaning: [t("meaningMax")],
      },
    };
  }

  const values =
    meaning === ""
      ? {
          meaning: null,
          meaningConfidence: null,
          fulfilledOn: null,
          fulfillmentNote: null,
        }
      : (() => {
          const confidence = Number(formData.get("confidence"));
          if (!isConfidence(confidence)) {
            return null;
          }
          return {
            ...sealMeaning({ userId: user.id, id: id.data, meaning }),
            meaningConfidence: confidence,
          };
        })();
  if (values === null) {
    return { fieldErrors: { confidence: [t("confidenceRequired")] } };
  }

  const updated = await db
    .update(dreamEntries)
    .set({ ...values, updatedAt: new Date() })
    .where(
      and(
        eq(dreamEntries.id, id.data),
        eq(dreamEntries.userId, user.id),
        isNull(dreamEntries.fulfilledOn),
      ),
    )
    .returning({ id: dreamEntries.id });
  if (updated.length === 0) {
    return { error: t("undoFirst") };
  }

  updateTag(`entries:${user.id}`);
  return { ok: true };
}

export async function markFulfilled(
  _prev: MeaningFormState,
  formData: FormData,
): Promise<MeaningFormState> {
  const t = await getMeaningTranslations();
  const user = await getCurrentUser();
  const id = idInput.safeParse(formData.get("id"));
  if (!id.success) {
    return { error: t("notFound") };
  }

  const [existing] = await db
    .select({
      meaning: dreamEntries.meaning,
      createdAt: dreamEntries.createdAt,
    })
    .from(dreamEntries)
    .where(and(eq(dreamEntries.id, id.data), eq(dreamEntries.userId, user.id)))
    .limit(1);
  if (!existing) {
    return { error: t("notFound") };
  }
  if (existing.meaning === null) {
    return { error: t("meaningRequired") };
  }

  const value = formData.get("fulfilledOn");
  const fulfilledOn = typeof value === "string" ? value : "";
  const date = datePattern.test(fulfilledOn)
    ? new Date(`${fulfilledOn}T00:00:00.000Z`)
    : null;
  if (
    !date ||
    Number.isNaN(date.getTime()) ||
    date.toISOString().slice(0, 10) !== fulfilledOn
  ) {
    return {
      fieldErrors: {
        fulfilledOn: [t("fulfilledDateRange")],
      },
    };
  }

  const earliest = utcDate(new Date(existing.createdAt.getTime() - dayMs));
  const latest = utcDate(new Date(Date.now() + dayMs));
  if (fulfilledOn < earliest || fulfilledOn > latest) {
    return {
      fieldErrors: {
        fulfilledOn: [t("fulfilledDateRange")],
      },
    };
  }

  const noteValue = formData.get("note");
  const note = typeof noteValue === "string" ? noteValue.trim() : "";
  if (note.length > 2000) {
    return {
      fieldErrors: { note: [t("noteMax")] },
    };
  }

  const sealed = sealMeaning({
    userId: user.id,
    id: id.data,
    fulfillmentNote: note || null,
  });
  const updated = await db
    .update(dreamEntries)
    .set({
      fulfilledOn,
      fulfillmentNote: sealed.fulfillmentNote ?? null,
      meaningConfidence: 100,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(dreamEntries.id, id.data),
        eq(dreamEntries.userId, user.id),
        isNotNull(dreamEntries.meaning),
      ),
    )
    .returning({ id: dreamEntries.id });
  if (updated.length === 0) {
    return { error: t("meaningRequired") };
  }

  updateTag(`entries:${user.id}`);
  return { ok: true };
}

export async function unmarkFulfilled(
  _prev: MeaningFormState,
  formData: FormData,
): Promise<MeaningFormState> {
  const t = await getMeaningTranslations();
  const user = await getCurrentUser();
  const id = idInput.safeParse(formData.get("id"));
  if (!id.success) {
    return { error: t("notFound") };
  }

  const updated = await db
    .update(dreamEntries)
    .set({
      fulfilledOn: null,
      fulfillmentNote: null,
      updatedAt: new Date(),
    })
    .where(and(eq(dreamEntries.id, id.data), eq(dreamEntries.userId, user.id)))
    .returning({ id: dreamEntries.id });
  if (updated.length === 0) {
    return { error: t("notFound") };
  }

  updateTag(`entries:${user.id}`);
  return { ok: true };
}
