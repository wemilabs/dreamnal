import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense, ViewTransition } from "react";
import { InsightsContent } from "@/components/journal/insights/insights-content";
import { InsightsSkeleton } from "@/components/journal/insights/insights-skeleton";
import { PageFade } from "@/components/journal/page-fade";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Insights");
  return { title: t("title"), description: t("metadataDescription") };
}

export default async function InsightsPage() {
  const t = await getTranslations("Insights");
  const symbols = await getTranslations("Symbols");
  return (
    <PageFade>
      <h1 className="text-page-title font-semibold tracking-tight text-foreground">
        {t("title")}
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
      <p className="mt-10 text-sm text-muted-foreground">{symbols("footer")}</p>
    </PageFade>
  );
}
