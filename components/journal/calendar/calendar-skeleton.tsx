import { Skeleton } from "@/components/ui/skeleton";

export function CalendarSkeleton() {
  return (
    <div className="flex flex-col gap-8" aria-hidden="true">
      <div className="grid grid-cols-3 gap-3">
        {[0, 1, 2].map((item) => (
          <div
            key={item}
            className="flex flex-col gap-3 rounded-lg border border-border bg-card/60 p-4"
          >
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-8 w-14" />
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-4 rounded-lg border border-border bg-card/60 p-4">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-4 w-36" />
      </div>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <Skeleton className="h-80 w-full rounded-lg" />
        <div className="flex flex-col gap-4 rounded-lg border border-border bg-card/60 p-4">
          <Skeleton className="h-7 w-44" />
          {[0, 1, 2].map((item) => (
            <Skeleton key={item} className="h-14 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
