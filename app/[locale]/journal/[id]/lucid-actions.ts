"use server";

import { and, eq } from "drizzle-orm";
import { updateTag } from "next/cache";
import { getTranslations } from "next-intl/server";
import { z } from "zod";
import { db } from "@/db";
import { dreamEntries } from "@/db/schema";
import { getActionLocale } from "@/i18n/action-locale";
import { getCurrentUser } from "@/lib/auth/session";

export type LucidFormState = {
  error?: string;
  ok?: boolean;
} | null;

const lucidInput = z.object({
  id: z.uuid(),
  lucid: z.enum(["true", "false"]).transform((value) => value === "true"),
});

export async function setLucid(
  _prev: LucidFormState,
  formData: FormData,
): Promise<LucidFormState> {
  const t = await getTranslations({
    locale: await getActionLocale(),
    namespace: "Entry",
  });
  const user = await getCurrentUser();
  const input = lucidInput.safeParse({
    id: formData.get("id"),
    lucid: formData.get("lucid"),
  });
  if (!input.success) {
    return { error: t("notFound") };
  }

  const updated = await db
    .update(dreamEntries)
    .set({ lucid: input.data.lucid, updatedAt: new Date() })
    .where(
      and(eq(dreamEntries.id, input.data.id), eq(dreamEntries.userId, user.id)),
    )
    .returning({ id: dreamEntries.id });
  if (updated.length === 0) {
    return { error: t("notFound") };
  }

  updateTag(`entries:${user.id}`);
  return { ok: true };
}
