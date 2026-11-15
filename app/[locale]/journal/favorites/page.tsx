import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense, ViewTransition } from "react";
import { EntryListSkeleton } from "@/components/journal/entry-list-skeleton";
import { FavoriteEntryList } from "@/components/journal/favorite-entry-list";
import { PageFade } from "@/components/journal/page-fade";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Journal");
  return { title: t("navFavorites"), description: t("favoritesDescription") };
}

export default async function FavoritesPage() {
  const t = await getTranslations("Journal");
  return (
    <PageFade>
      <h1 className="text-page-title font-semibold tracking-tight text-foreground">
        {t("navFavorites")}
      </h1>
      <p className="mt-2 text-lead text-muted-foreground">
        {t("favoritesDescription")}
      </p>
      <div className="mt-8">
        <Suspense
          fallback={
            <ViewTransition exit="reveal-out" default="none">
              <EntryListSkeleton />
            </ViewTransition>
          }
        >
          <ViewTransition enter="reveal-in" default="none">
            <FavoriteEntryList />
          </ViewTransition>
        </Suspense>
      </div>
    </PageFade>
  );
}
