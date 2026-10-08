import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function ChartCard({
  title,
  hint,
  className,
  children,
}: {
  title: string;
  hint?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      className={cn(
        "flex min-w-0 flex-col gap-4 rounded-lg border border-border bg-card/60 p-4 md:p-5",
        className,
      )}
    >
      <div className="flex flex-col gap-0.5">
        <h2 className="text-control font-medium text-foreground">{title}</h2>
        {hint ? <p className="text-sm text-muted-foreground">{hint}</p> : null}
      </div>
      {children}
    </section>
  );
}

export function EmptyChart({ children }: { children: ReactNode }) {
  return (
    <p className="py-6 text-center text-control text-muted-foreground">
      {children}
    </p>
  );
}
