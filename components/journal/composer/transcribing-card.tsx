import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function TranscribingCard({ className }: { className?: string }) {
  return (
    <div className={cn("flex w-full flex-col gap-6", className)}>
      <div className="flex items-center gap-2.5">
        <span className="rec-dot size-2 shrink-0 rounded-full bg-fold" />
        <span className="text-sm/tight font-semibold text-foreground">
          Writing it down…
        </span>
      </div>
      <div className="flex flex-col gap-2.5" aria-hidden="true">
        <Skeleton className="h-4 w-full motion-reduce:animate-none" />
        <Skeleton className="h-4 w-11/12 motion-reduce:animate-none" />
        <Skeleton className="h-4 w-3/4 motion-reduce:animate-none" />
      </div>
    </div>
  );
}
