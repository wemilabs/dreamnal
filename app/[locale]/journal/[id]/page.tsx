import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Suspense, ViewTransition } from "react";
import { EntryDetail } from "@/components/journal/entry-detail";
import { EntryDetailSkeleton } from "@/components/journal/entry-detail-skeleton";
import { PageFade } from "@/components/journal/page-fade";
import { parseBackHref } from "@/lib/back-href";
import { getEntry } from "@/lib/entries";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Entry");
  return { title: t("metadataTitle"), description: t("metadataDescription") };
}

type EntryPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default function EntryPage({ params, searchParams }: EntryPageProps) {
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
          <EntryLoader params={params} searchParams={searchParams} />
        </ViewTransition>
      </Suspense>
    </PageFade>
  );
}

async function EntryLoader({ params, searchParams }: EntryPageProps) {
  const [{ id }, { from }] = await Promise.all([params, searchParams]);
  const entry = await getEntry(id);
  if (!entry) {
    notFound();
  }
  const backHref =
    parseBackHref(from) ??
    (entry.kind === "whisper" ? "/journal/whispers" : "/journal");
  return <EntryDetail entry={entry} backHref={backHref} />;
}
