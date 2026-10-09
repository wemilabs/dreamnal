import { getTranslations } from "next-intl/server";
import { Suspense, ViewTransition } from "react";
import { CaptureBar } from "@/components/journal/capture-bar";
import { EntryList } from "@/components/journal/entry-list";
import { EntryListSkeleton } from "@/components/journal/entry-list-skeleton";
import {
  FilterChips,
  FilterChipsView,
} from "@/components/journal/filter-chips";
import { PageFade } from "@/components/journal/page-fade";

export default async function JournalPage() {
  const t = await getTranslations("Journal");
  return (
    <PageFade>
      <h1 className="text-page-title font-semibold tracking-tight text-foreground">
        {t("title")}
      </h1>
      <div className="mt-8">
        <CaptureBar />
        <Suspense fallback={<FilterChipsView active={null} />}>
          <FilterChips />
        </Suspense>
        <Suspense
          fallback={
            <ViewTransition exit="reveal-out" default="none">
              <EntryListSkeleton />
            </ViewTransition>
          }
        >
          <ViewTransition enter="reveal-in" default="none">
            <EntryList />
          </ViewTransition>
        </Suspense>
      </div>
    </PageFade>
  );
}
