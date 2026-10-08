import { Skeleton } from "@/components/ui/skeleton";

function CardSkeleton({ height }: { height: string }) {
  return (
    <div className="flex flex-col gap-4 rounded-lg border border-border bg-card/60 p-4 md:p-5">
      <Skeleton className="h-4 w-32" />
      <Skeleton className={`${height} w-full`} />
    </div>
  );
}

export function InsightsSkeleton() {
  return (
    <div className="flex flex-col gap-6" aria-hidden="true">
      <Skeleton className="h-8 w-64" />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex flex-col gap-3 rounded-lg border border-border bg-card/60 p-4"
          >
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-8 w-14" />
            <Skeleton className="h-3 w-20" />
          </div>
        ))}
      </div>
      <CardSkeleton height="h-56" />
      <CardSkeleton height="h-48" />
    </div>
  );
}
