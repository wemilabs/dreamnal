import { Mic } from "lucide-react";

function RecordVignette() {
  return (
    <div className="flex h-30 shrink-0 items-center justify-center gap-4 rounded-[16px] bg-background">
      <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-ink shadow-[0_0_0_10px_rgb(111_143_179/0.18),0_0_0_22px_rgb(111_143_179/0.08)]">
        <Mic className="size-5.5 text-petal" aria-hidden />
      </div>
    </div>
  );
}

function ReadBackVignette() {
  return (
    <div className="flex h-30 shrink-0 flex-col justify-center gap-1.5 rounded-[16px] bg-background px-7">
      <span className="font-display text-lead text-muted-foreground">
        …a lighthouse made of
      </span>
      <div className="flex items-center gap-2">
        <span className="font-display text-lead text-muted-foreground line-through decoration-muted-foreground/60 decoration-1 [text-underline-position:from-font]">
          glass ware
        </span>
        <span className="rounded-[4px] bg-petal/60 px-1.5 font-display text-lead text-foreground">
          glassware
        </span>
        <span className="h-5.5 w-0.5 shrink-0 bg-foreground" />
      </div>
    </div>
  );
}

function KeepVignette() {
  return (
    <div className="flex h-30 shrink-0 items-center rounded-[16px] bg-background px-7">
      <div className="flex w-full flex-col gap-1.5 rounded-md border border-border bg-card px-4.5 py-3.5">
        <span className="font-mono text-xs leading-4 text-muted-foreground">
          TUE 6 OCT
        </span>
        <span className="font-display text-lead text-foreground">
          The hallway to the sea
        </span>
      </div>
    </div>
  );
}

type Step = {
  label: string;
  title: string;
  body: string;
  Vignette: () => React.ReactNode;
};

const STEPS: Step[] = [
  {
    label: "01 — RECORD",
    title: "Talk, eyes still closed",
    body: "One tap starts recording. Ramble, pause, go back. Nothing you say is wasted.",
    Vignette: RecordVignette,
  },
  {
    label: "02 — READ IT BACK",
    title: "Fix what it misheard",
    body: "Grok turns your voice into text in seconds. Edit it like any note, or add what came back to you.",
    Vignette: ReadBackVignette,
  },
  {
    label: "03 — KEEP",
    title: "Save it to your journal",
    body: "Every entry is dated and kept private to your account. Scroll back and watch the patterns surface.",
    Vignette: KeepVignette,
  },
];

function StepCard({ step }: { step: Step }) {
  const { Vignette } = step;
  return (
    <div className="flex grow basis-0 flex-col gap-5 border-t border-border pt-6">
      <span className="font-mono text-[13px] leading-4.5 tracking-[0.08em] text-fold">
        {step.label}
      </span>
      <Vignette />
      <div className="flex flex-col gap-2">
        <h3 className="text-subhead font-semibold text-foreground">
          {step.title}
        </h3>
        <p className="text-base leading-6.25 text-muted-foreground">
          {step.body}
        </p>
      </div>
    </div>
  );
}

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="flex flex-col gap-18 bg-card px-6 pt-32 pb-30 lg:px-16"
    >
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <h2 className="w-full max-w-155 shrink-0 font-display text-headline tracking-[-0.03em] text-foreground">
          Three steps, while you’re still half-asleep.
        </h2>
        <p className="w-full max-w-102.75 shrink-0 text-lead text-muted-foreground">
          No forms, no folders to pick. Talk first and tidy up later, or never.
        </p>
      </div>
      <div className="flex flex-col gap-10 md:flex-row md:gap-10">
        {STEPS.map((step) => (
          <StepCard key={step.label} step={step} />
        ))}
      </div>
    </section>
  );
}
