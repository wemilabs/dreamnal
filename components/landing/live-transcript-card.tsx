import { useTranslations } from "next-intl";
import { Waveform } from "./waveform";

export function LiveTranscriptCard() {
  const t = useTranslations("Landing");
  return (
    <div
      role="img"
      aria-label={t("exampleTranscript")}
      className="anim-card absolute top-42 right-35 hidden w-101 flex-col gap-4.5 rounded-lg border border-(--glass-border) bg-(--glass-bg) px-6 pt-5.5 pb-6 shadow-(--glass-shadow) backdrop-blur-xl lg:flex"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="rec-dot size-2 shrink-0 rounded-full bg-rec" />
          <span className="text-sm/tight font-semibold text-foreground">
            {t("listening")}
          </span>
        </div>
        <span className="font-mono text-sm/tight text-muted-foreground">
          00:42
        </span>
      </div>
      <Waveform />
      <p className="font-display text-subhead tracking-[-0.01em] text-foreground">
        {t("sampleTranscript")}
      </p>
      <div className="flex items-center justify-between border-t border-border pt-3.5">
        <span className="font-mono text-[13px] leading-4.5 text-muted-foreground">
          {t("sampleDateTime")}
        </span>
        <span className="text-sm/tight font-semibold text-display-accent">
          {t("transcribing")}
        </span>
      </div>
    </div>
  );
}
