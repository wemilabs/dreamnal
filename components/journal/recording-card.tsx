"use client";

import type { RefObject } from "react";
import { useEffect, useEffectEvent, useRef } from "react";

const BAR_COUNT = 48;
// Eight minutes at 48 kbps ≈ 2.9 MB — keeps the blob under the platform's
// 4.5 MB Server Action request cap (Vercel Functions limit).
const MAX_SECONDS = 480;

export function RecordingCard({
  analyserRef,
  startedAtRef,
  onDone,
  onCancel,
}: {
  analyserRef: RefObject<AnalyserNode | null>;
  startedAtRef: RefObject<number>;
  onDone: () => void;
  onCancel: () => void;
}) {
  const barsRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<HTMLSpanElement>(null);
  const onDoneEvent = useEffectEvent(onDone);

  useEffect(() => {
    let raf = 0;
    let bins: Uint8Array<ArrayBuffer> | null = null;
    const tick = () => {
      const analyser = analyserRef.current;
      const bars = barsRef.current;
      if (analyser && bars) {
        bins ??= new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(bins);
        const n = bars.children.length;
        for (let i = 0; i < n; i++) {
          const v = bins[Math.floor((i * bins.length) / n)] / 255;
          (bars.children[i] as HTMLElement).style.transform =
            `scaleY(${0.1 + v * 0.9})`;
        }
      }
      const timer = timerRef.current;
      if (timer) {
        const elapsed = (performance.now() - startedAtRef.current) / 1000;
        timer.textContent = `${Math.floor(elapsed / 60)}:${String(
          Math.floor(elapsed % 60),
        ).padStart(2, "0")}`;
        // xAI caps request size and nobody records a dream longer than ten
        // minutes — stop cleanly rather than erroring on upload.
        if (elapsed >= MAX_SECONDS) {
          onDoneEvent();
          return;
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [analyserRef, startedAtRef]);

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="rec-dot size-2 shrink-0 rounded-full bg-rec" />
          <span className="text-sm/tight font-semibold text-foreground">
            Listening
          </span>
        </div>
        <span
          ref={timerRef}
          className="tabular-nums text-sm/tight text-muted-foreground"
        >
          0:00
        </span>
      </div>
      <div
        ref={barsRef}
        className="flex h-10 items-center gap-0.75"
        aria-hidden="true"
      >
        {Array.from({ length: BAR_COUNT }, (_, i) => i).map((i) => (
          <span
            key={i}
            className="w-0.75 flex-1 origin-center rounded-full bg-fold/70"
            style={{ height: "100%", transform: "scaleY(0.1)" }}
          />
        ))}
      </div>
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="pressable text-control font-medium text-muted-foreground underline decoration-foreground/20 underline-offset-[5px]"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onDone}
          className="pressable flex items-center rounded-full bg-primary px-6 py-2.5 text-control font-semibold text-primary-foreground"
        >
          Done
        </button>
      </div>
    </div>
  );
}
