import { notFound } from "next/navigation";
import { Suspense } from "react";
import { EntryDetail } from "@/components/journal/entry-detail";
import { EntryDetailSkeleton } from "@/components/journal/entry-detail-skeleton";
import { getEntry } from "@/lib/entries";

export default function EntryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<EntryDetailSkeleton />}>
      <EntryLoader params={params} />
    </Suspense>
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
