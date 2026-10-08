import type { Metadata } from "next";
import { Suspense, ViewTransition } from "react";
import { CalendarContent } from "@/components/journal/calendar/calendar-content";
import { CalendarSkeleton } from "@/components/journal/calendar/calendar-skeleton";
import { PageFade } from "@/components/journal/page-fade";

export const metadata: Metadata = {
  title: "Calendar",
};

export default function CalendarPage() {
  return (
    <PageFade>
      <h1 className="text-page-title font-semibold tracking-tight text-foreground">
        Calendar
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
