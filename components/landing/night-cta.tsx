import { useTranslations } from "next-intl";
import { RecordCta } from "./record-cta";

export function NightCta() {
  const t = useTranslations("Landing");
  return (
    <section
      className="flex flex-col items-center gap-8 overflow-clip px-6 pt-36 pb-32 lg:px-16"
      style={{
        backgroundImage:
          "radial-gradient(ellipse 70% 90% at 50% 110% in oklab, oklab(37.8% -0.013 -0.067) 0%, oklab(24.3% -0.006 -0.039) 45%, oklab(19.1% -0.004 -0.026) 100%)",
      }}
    >
      <span className="font-mono text-[13px] leading-4.5 text-night-muted">
        {t("tonight")}
      </span>
      <h2 className="flex flex-col items-center font-display">
        <span className="flex flex-wrap justify-center text-center text-night-cta tracking-display text-moon">
          {t("nightTitle")}
        </span>
        <span className="flex flex-wrap justify-center text-center text-night-cta italic tracking-[-0.03em] text-petal">
          {t("nightTitleAccent")}
        </span>
      </h2>
      <p className="flex w-115 max-w-full flex-wrap justify-center text-center text-lead text-night-muted">
        {t("nightDescription")}
      </p>
      <RecordCta tone="moon" href="/journal">
        {t("startJournal")}
      </RecordCta>
    </section>
  );
}
