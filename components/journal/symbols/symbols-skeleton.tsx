import { Skeleton } from "@/components/ui/skeleton";

export function SymbolsSkeleton() {
  return (
    <div className="flex flex-col gap-8" aria-hidden="true">
      {[0, 1].map((section) => (
        <div key={section} className="flex flex-col gap-3">
          <Skeleton className="h-3 w-28" />
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-7 w-full" />
          ))}
        </div>
      ))}
    </div>
  );
}
