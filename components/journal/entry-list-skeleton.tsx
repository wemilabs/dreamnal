import { Skeleton } from "@/components/ui/skeleton";

export function EntryListSkeleton() {
  return (
    <div className="flex flex-col gap-3" aria-hidden="true">
      <Skeleton className="mx-1 mb-0 h-4 w-20" />
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="flex flex-col gap-2.5 rounded-2xl bg-card p-5 ring-1 ring-border/60"
        >
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-7 w-2/3" />
          <Skeleton className="h-4 w-full" />
        </div>
      ))}
    </div>
  );
}
