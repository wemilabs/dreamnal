import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Header } from "./header";
import { LiveTranscriptCard } from "./live-transcript-card";
import { RecordCta } from "./record-cta";
import { TheFold } from "./the-fold";

export function Hero() {
  const t = useTranslations("Landing");
  return (
    <section
      className="relative min-h-svh overflow-hidden"
      style={{ backgroundImage: "var(--hero-bg)" }}
    >
      <Header />
      <TheFold />
      <div className="relative z-10 flex flex-col gap-7 px-6 pt-16 lg:absolute lg:top-49 lg:left-16 lg:w-155 lg:p-0">
        <h1 className="flex flex-col gap-5 font-display">
          <span className="anim-rise block text-hero tracking-display text-foreground">
            {t("heroBefore")}
          </span>
          <span
            className="anim-rise flex items-baseline gap-6.5 text-hero"
            style={{ animationDelay: "70ms" }}
          >
            <span className="tracking-display text-foreground">
              {t("heroIt")}
            </span>
            <span className="italic tracking-[-0.03em] text-display-accent">
              {t("heroFades")}
            </span>
          </span>
        </h1>
        <p
          className="anim-rise max-w-117.5 text-lead text-muted-foreground"
          style={{ animationDelay: "140ms" }}
        >
          {t("heroDescription")}
        </p>
        <div
          className="anim-rise flex flex-wrap items-center gap-x-6 gap-y-4 pt-2"
          style={{ animationDelay: "210ms" }}
        >
          <RecordCta tone="ink" href="/journal">
            {t("recordDream")}
          </RecordCta>
          <Link
            href="/journal"
            className="pressable text-cta font-medium whitespace-nowrap text-foreground underline decoration-foreground/30 decoration-1 underline-offset-[5px]"
          >
            {t("typeInstead")}
          </Link>
        </div>
      </div>
      <LiveTranscriptCard />
    </section>
  );
}
