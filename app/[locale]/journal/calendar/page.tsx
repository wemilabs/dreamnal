import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense, ViewTransition } from "react";
import { CalendarContent } from "@/components/journal/calendar/calendar-content";
import { CalendarSkeleton } from "@/components/journal/calendar/calendar-skeleton";
import { PageFade } from "@/components/journal/page-fade";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Calendar");
  return { title: t("title") };
}

export default async function CalendarPage() {
  const t = await getTranslations("Calendar");
  return (
    <PageFade>
      <h1 className="text-page-title font-semibold tracking-tight text-foreground">
        {t("title")}
      </h1>
      <div className="mt-8">
        <Suspense
          fallback={
            <ViewTransition exit="reveal-out" default="none">
              <CalendarSkeleton />
            </ViewTransition>
          }
        >
          <ViewTransition enter="reveal-in" default="none">
            <CalendarContent />
          </ViewTransition>
        </Suspense>
      </div>
    </PageFade>
  );
}
