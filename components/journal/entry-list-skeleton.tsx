import { Skeleton } from "@/components/ui/skeleton";

export function EntryListSkeleton() {
  return (
    <div className="flex flex-col gap-3" aria-hidden="true">
      <Skeleton className="h-4 w-20" />
      <div className="ml-1.5 flex flex-col gap-3 border-l border-border">
        {[0, 1, 2].map((i) => (
          <div key={i} className="pl-5 sm:pl-6">
            <div className="flex flex-col gap-2.5 rounded-2xl bg-card p-4 ring-1 sm:p-5 ring-border/60">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-6 w-2/3" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
