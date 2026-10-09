import type { Metadata } from "next";
import { Suspense, ViewTransition } from "react";
import { CaptureBar } from "@/components/journal/capture-bar";
import { EntryList } from "@/components/journal/entry-list";
import { EntryListSkeleton } from "@/components/journal/entry-list-skeleton";
import {
  FilterChips,
  FilterChipsView,
} from "@/components/journal/filter-chips";
import { PageFade } from "@/components/journal/page-fade";

export const metadata: Metadata = {
  title: "My journal",
  description:
    "All your dreams, newest first. Filter to the ones you’ve interpreted or marked fulfilled.",
};

export default function JournalPage() {
  return (
    <PageFade>
      <h1 className="text-page-title font-semibold tracking-tight text-foreground">
        My journal
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
