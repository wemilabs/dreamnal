import { Waveform } from "./waveform";

export function LiveTranscriptCard() {
  return (
    <div
      role="img"
      aria-label="Example: a dream being transcribed as you speak"
      className="anim-card absolute top-[168px] right-[140px] hidden w-[404px] flex-col gap-[18px] rounded-lg border border-(--glass-border) bg-(--glass-bg) px-6 pt-[22px] pb-6 shadow-(--glass-shadow) backdrop-blur-xl lg:flex"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-[10px]">
          <span className="rec-dot size-2 shrink-0 rounded-full bg-rec" />
          <span className="text-sm/tight font-semibold text-foreground">
            Listening
          </span>
        </div>
        <span className="font-mono text-sm/tight text-muted-foreground">
          00:42
        </span>
      </div>
      <Waveform />
      <p className="font-display text-[21px] leading-[31px] tracking-[-0.01em] text-foreground">
        I was back at my grandmother’s house, except every door opened onto the
        sea, and the hallway kept getting longer the faster I walked…
      </p>
      <div className="flex items-center justify-between border-t border-border pt-[14px]">
        <span className="font-mono text-[13px] leading-[18px] text-muted-foreground">
          Tue 6 Oct · 6:12 AM
        </span>
        <span className="text-sm/tight font-semibold text-display-accent">
          Transcribing
        </span>
      </div>
    </div>
  );
}
