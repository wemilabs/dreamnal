"use server";

import { and, eq } from "drizzle-orm";
import { updateTag } from "next/cache";
import { getTranslations } from "next-intl/server";
import { z } from "zod";
import { db } from "@/db";
import { dreamEntries } from "@/db/schema";
import { getActionLocale } from "@/i18n/action-locale";
import { getCurrentUser } from "@/lib/auth/session";

export type FavoriteFormState = {
  error?: string;
  ok?: boolean;
} | null;

const favoriteInput = z.object({
  id: z.uuid(),
  favorite: z.enum(["true", "false"]).transform((value) => value === "true"),
});

export async function setFavorite(
  _prev: FavoriteFormState,
  formData: FormData,
): Promise<FavoriteFormState> {
  const t = await getTranslations({
    locale: await getActionLocale(),
    namespace: "Entry",
  });
  const user = await getCurrentUser();
  const input = favoriteInput.safeParse({
    id: formData.get("id"),
    favorite: formData.get("favorite"),
  });
  if (!input.success) {
    return { error: t("notFound") };
  }

  const updated = await db
    .update(dreamEntries)
    .set({ favorite: input.data.favorite, updatedAt: new Date() })
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
