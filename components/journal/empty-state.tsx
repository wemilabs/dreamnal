import { TypeInsteadButton } from "@/components/journal/record-dream-cta";

export function EmptyState() {
  return (
    <div className="flex flex-col items-start gap-6 pt-6 md:pt-0">
      <h2 className="text-section-title font-semibold tracking-tight text-foreground">
        Nothing written yet.
      </h2>
      <p className="text-lead text-muted-foreground">
        Whatever came to you fades fast. Keep it here.
      </p>
      <p className="text-lead text-muted-foreground md:hidden">
        Tap the mic below to record it, or{" "}
        <TypeInsteadButton>type it instead</TypeInsteadButton>.
      </p>
    </div>
  );
}
