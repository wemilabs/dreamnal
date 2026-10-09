import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { getEntry } from "@/lib/entries";
import { titleFallback } from "@/lib/format";

export default function EntryCrumb({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<Skeleton className="h-4 w-24" />}>
      <EntryCrumbLoader params={params} />
    </Suspense>
  );
}

async function EntryCrumbLoader({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const t = await getTranslations("Journal");
  const entry = await getEntry(id);
  if (!entry) {
    return t("dream");
  }
  return entry.title ?? titleFallback(entry.body);
}
