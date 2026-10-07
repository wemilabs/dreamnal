import { Skeleton } from "@/components/ui/skeleton";

export function EntryDetailSkeleton() {
  return (
    <div
      className="flex flex-col gap-8"
      data-testid="entry-detail-skeleton"
      aria-hidden="true"
    >
      <div className="flex items-start justify-between gap-4">
        <Skeleton className="mt-1.5 h-3 w-44" />
        <Skeleton className="size-9 shrink-0 rounded-full" />
      </div>
      <div className="flex w-full flex-col gap-5">
        <div className="grid gap-1.5 border-b border-border pb-2">
          <Skeleton className="h-9 w-2/5" />
        </div>
        <div className="grid gap-1.5">
          <Skeleton className="min-h-60 w-full rounded-lg" />
          <Skeleton className="h-3 w-16" />
        </div>
        <div className="flex flex-wrap items-center gap-4 pt-2">
          <Skeleton className="h-10 w-32 rounded-full" />
        </div>
      </div>
    </div>
  );
}
