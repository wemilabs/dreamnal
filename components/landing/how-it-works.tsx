import { Mic } from "lucide-react";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("Landing");
  return (
    <div className="flex h-30 shrink-0 flex-col justify-center gap-1.5 rounded-[16px] bg-background px-7">
      <span className="font-display text-lead text-muted-foreground">
        {t("sampleCorrection")}
      </span>
      <div className="flex items-center gap-2">
        <span className="font-display text-lead text-muted-foreground line-through decoration-muted-foreground/60 decoration-1 [text-underline-position:from-font]">
          {t("sampleWrong")}
        </span>
        <span className="rounded-[4px] bg-petal/60 px-1.5 font-display text-lead text-foreground">
          {t("sampleRight")}
        </span>
        <span className="h-5.5 w-0.5 shrink-0 bg-foreground" />
      </div>
    </div>
  );
}

function KeepVignette() {
  const t = useTranslations("Landing");
  return (
    <div className="flex h-30 shrink-0 items-center rounded-[16px] bg-background px-7">
      <div className="flex w-full flex-col gap-1.5 rounded-md border border-border bg-card px-4.5 py-3.5">
        <span className="font-mono text-xs leading-4 text-muted-foreground">
          {t("sampleDate")}
        </span>
        <span className="font-display text-lead text-foreground">
          {t("sampleEntryTitle")}
        </span>
      </div>
    </div>
  );
}

type Step = {
  label: "stepOne" | "stepTwo" | "stepThree";
  title: "stepOneTitle" | "stepTwoTitle" | "stepThreeTitle";
  body: "stepOneBody" | "stepTwoBody" | "stepThreeBody";
  Vignette: () => React.ReactNode;
};

const STEPS: Step[] = [
  {
    label: "stepOne",
    title: "stepOneTitle",
    body: "stepOneBody",
    Vignette: RecordVignette,
  },
  {
    label: "stepTwo",
    title: "stepTwoTitle",
    body: "stepTwoBody",
    Vignette: ReadBackVignette,
  },
  {
    label: "stepThree",
    title: "stepThreeTitle",
    body: "stepThreeBody",
    Vignette: KeepVignette,
  },
];

function StepCard({ step }: { step: Step }) {
  const t = useTranslations("Landing");
  const { Vignette } = step;
  return (
    <div className="flex grow basis-0 flex-col gap-5 border-t border-border pt-6">
      <span className="font-mono text-[13px] leading-4.5 text-fold">
        {t(step.label)}
      </span>
      <Vignette />
      <div className="flex flex-col gap-2">
        <h3 className="text-subhead font-semibold text-foreground">
          {t(step.title)}
        </h3>
        <p className="text-base leading-6.25 text-muted-foreground">
          {t(step.body)}
        </p>
      </div>
    </div>
  );
}

export function HowItWorks() {
  const t = useTranslations("Landing");
  return (
    <section
      id="how-it-works"
      className="flex flex-col gap-18 bg-card px-6 pt-32 pb-30 lg:px-16"
    >
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <h2 className="w-full max-w-155 shrink-0 font-display text-headline tracking-[-0.03em] text-foreground">
          {t("threeSteps")}
        </h2>
        <p className="w-full max-w-102.75 shrink-0 text-lead text-muted-foreground">
          {t("stepsDescription")}
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
