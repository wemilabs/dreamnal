import { Suspense } from "react";
import { EntryList } from "../../components/journal/entry-list";
import { EntryListSkeleton } from "../../components/journal/entry-list-skeleton";

export default function JournalPage() {
  return (
    <>
      <h1 className="font-display text-[44px] leading-tight tracking-display text-foreground">
        Your journal
      </h1>
      <div className="mt-8">
        <Suspense fallback={<EntryListSkeleton />}>
          <EntryList />
        </Suspense>
      </div>
    </>
  );
}
