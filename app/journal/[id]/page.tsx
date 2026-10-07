import { notFound } from "next/navigation";
import { Suspense, ViewTransition } from "react";
import { EntryDetail } from "@/components/journal/entry-detail";
import { EntryDetailSkeleton } from "@/components/journal/entry-detail-skeleton";
import { PageFade } from "@/components/journal/page-fade";
import { getEntry } from "@/lib/entries";

export default function EntryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <PageFade>
      <Suspense
        fallback={
          <ViewTransition exit="reveal-out" default="none">
            <EntryDetailSkeleton />
          </ViewTransition>
        }
      >
        <ViewTransition enter="reveal-in" default="none">
          <EntryLoader params={params} />
        </ViewTransition>
      </Suspense>
    </PageFade>
  );
}

async function EntryLoader({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const entry = await getEntry(id);
  if (!entry) {
    notFound();
  }
  return <EntryDetail entry={entry} />;
}
