import { Suspense } from "react";
import { Composer } from "../../../components/journal/composer";

export default function NewEntryPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string }>;
}) {
  return (
    <Suspense>
      <ComposerLoader searchParams={searchParams} />
    </Suspense>
  );
}

async function ComposerLoader({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string }>;
}) {
  const { mode } = await searchParams;
  return <Composer initialMode={mode === "type" ? "type" : "record"} />;
}
