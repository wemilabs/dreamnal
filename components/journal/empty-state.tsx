import {
  RecordDreamCta,
  TypeInsteadButton,
} from "@/components/journal/record-dream-cta";

export function EmptyState() {
  return (
    <div className="flex flex-col items-start gap-6 pt-6">
      <h2 className="font-display text-[34px] leading-tight tracking-display text-foreground">
        Nothing written yet.
      </h2>
      <p className="text-lg leading-body text-muted-foreground">
        Tonight’s dream won’t remember itself.
      </p>
      <div className="hidden flex-wrap items-center gap-6 md:flex">
        <RecordDreamCta>Record a dream</RecordDreamCta>
        <TypeInsteadButton />
      </div>
      <p className="text-lg leading-body text-muted-foreground md:hidden">
        Tap the mic below to record it, or{" "}
        <TypeInsteadButton>type it instead</TypeInsteadButton>.
      </p>
    </div>
  );
}
