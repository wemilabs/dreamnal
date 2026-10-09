import type { Metadata } from "next";
import { Suspense, ViewTransition } from "react";
import { InsightsContent } from "@/components/journal/insights/insights-content";
import { InsightsSkeleton } from "@/components/journal/insights/insights-skeleton";
import { PageFade } from "@/components/journal/page-fade";
import { symbolsCopy } from "@/lib/symbols/copy";

export const metadata: Metadata = {
  title: symbolsCopy.insightsTitle,
  description:
    "The people, places, things and feelings that keep coming back in your dreams, and how many dreams you’ve interpreted.",
};

export default function InsightsPage() {
  return (
    <PageFade>
      <h1 className="text-page-title font-semibold tracking-tight text-foreground">
        {symbolsCopy.insightsTitle}
      </h1>
      <div className="mt-8">
        <Suspense
          fallback={
            <ViewTransition exit="reveal-out" default="none">
              <InsightsSkeleton />
            </ViewTransition>
          }
        >
          <ViewTransition enter="reveal-in" default="none">
            <InsightsContent />
          </ViewTransition>
        </Suspense>
      </div>
      <p className="mt-10 text-sm text-muted-foreground">
        {symbolsCopy.footer}
      </p>
    </PageFade>
  );
}
