import { Suspense, ViewTransition } from "react";
import { EntryList } from "@/components/journal/entry-list";
import { EntryListSkeleton } from "@/components/journal/entry-list-skeleton";
import { PageFade } from "@/components/journal/page-fade";

export default function JournalPage() {
  return (
    <PageFade>
      <h1 className="font-display text-page-title tracking-display text-foreground">
        My journal
      </h1>
      <div className="mt-8">
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
