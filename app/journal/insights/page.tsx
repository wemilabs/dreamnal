import type { Metadata } from "next";
import { Suspense, ViewTransition } from "react";
import { PageFade } from "@/components/journal/page-fade";
import { InsightsContent } from "@/components/journal/symbols/insights-content";
import { InsightsSkeleton } from "@/components/journal/symbols/insights-skeleton";
import { symbolsCopy } from "@/lib/symbols/copy";

export const metadata: Metadata = {
  title: symbolsCopy.insightsTitle,
};

export default function InsightsPage() {
  return (
    <PageFade>
      <h1 className="font-display text-page-title tracking-display text-foreground">
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
