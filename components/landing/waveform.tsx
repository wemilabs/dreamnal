import type { CSSProperties } from "react";

const ACTIVE_HEIGHTS = [
  6, 10, 16, 22, 14, 26, 34, 20, 12, 28, 38, 30, 18, 10, 24, 32, 22, 14, 8, 18,
  28, 36, 26, 16, 10, 20, 30, 22, 12, 8, 14, 24, 18, 10,
];

const IDLE_HEIGHTS = [6, 4, 4, 4, 4, 4];

const BARS = [
  ...ACTIVE_HEIGHTS.map((height) => ({ height, idle: false })),
  ...IDLE_HEIGHTS.map((height) => ({ height, idle: true })),
].map((bar, position) => ({ ...bar, key: `bar-${position}`, i: position }));

export function Waveform() {
  return (
    <div className="flex h-10 items-center gap-1.25" aria-hidden="true">
      {BARS.map((bar) => (
        <span
          key={bar.key}
          className={`wave-bar w-0.75 shrink-0 rounded-xs ${bar.idle ? "bg-border" : "bg-fold"}`}
          style={{ height: bar.height, "--i": bar.i } as CSSProperties}
        />
      ))}
    </div>
  );
}
