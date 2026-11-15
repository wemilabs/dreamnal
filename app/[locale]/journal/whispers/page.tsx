import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense, ViewTransition } from "react";
import { EntryListSkeleton } from "@/components/journal/entry-list-skeleton";
import { NewWhisperButton } from "@/components/journal/new-whisper-button";
import { PageFade } from "@/components/journal/page-fade";
import { WhisperEntryList } from "@/components/journal/whisper-entry-list";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Journal");
  return { title: t("navWhispers"), description: t("whispersDescription") };
}

export default async function WhispersPage() {
  const t = await getTranslations("Journal");
  return (
    <PageFade>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-page-title font-semibold tracking-tight text-foreground">
            {t("navWhispers")}
          </h1>
          <p className="mt-2 text-lead text-muted-foreground">
            {t("whispersDescription")}
          </p>
        </div>
        <NewWhisperButton />
      </div>
      <div className="mt-8">
        <Suspense
          fallback={
            <ViewTransition exit="reveal-out" default="none">
              <EntryListSkeleton />
            </ViewTransition>
          }
        >
          <ViewTransition enter="reveal-in" default="none">
            <WhisperEntryList />
          </ViewTransition>
        </Suspense>
      </div>
    </PageFade>
  );
}
