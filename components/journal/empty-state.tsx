import Link from "next/link";
import { RecordCta } from "../landing/record-cta";

export function EmptyState() {
  return (
    <div className="flex flex-col items-start gap-6 pt-6">
      <h2 className="font-display text-[34px] leading-tight tracking-display text-foreground">
        Nothing written yet.
      </h2>
      <p className="text-lg leading-body text-muted-foreground">
        Tonight’s dream won’t remember itself.
      </p>
      <div className="flex flex-wrap items-center gap-6">
        <RecordCta tone="ink" href="/journal/new">
          Record a dream
        </RecordCta>
        <Link
          href="/journal/new?mode=type"
          className="pressable text-[17px] font-medium leading-6 text-foreground underline decoration-foreground/30 decoration-1 underline-offset-[5px]"
        >
          or type it instead
        </Link>
      </div>
    </div>
  );
}
