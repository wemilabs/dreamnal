"use client";

import { useSyncExternalStore } from "react";
import { symbolsCopy } from "@/lib/symbols/copy";

const subscribeNoop = () => () => {};

type Rhythm = { total: number; thisMonth: number; lastMonth: number };

function computeRhythm(timestamps: string[]): Rhythm {
  const now = new Date();
  const last = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const inMonth = (iso: string, ref: Date) => {
    const d = new Date(iso);
    return (
      d.getFullYear() === ref.getFullYear() && d.getMonth() === ref.getMonth()
    );
  };
  return {
    total: timestamps.length,
    thisMonth: timestamps.filter((t) => inMonth(t, now)).length,
    lastMonth: timestamps.filter((t) => inMonth(t, last)).length,
  };
}

export function RhythmStats({ timestamps }: { timestamps: string[] }) {
  const statsJson = useSyncExternalStore(
    subscribeNoop,
    () => JSON.stringify(computeRhythm(timestamps)),
    () => null,
  );
  const stats: Rhythm | null =
    statsJson === null ? null : JSON.parse(statsJson);

  const tiles = [
    { label: symbolsCopy.rhythm.total, value: stats?.total },
    { label: symbolsCopy.rhythm.thisMonth, value: stats?.thisMonth },
    { label: symbolsCopy.rhythm.lastMonth, value: stats?.lastMonth },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {tiles.map((tile) => (
        <div
          key={tile.label}
          className="rounded-lg border border-border bg-card/60 p-4"
        >
          <p className="font-mono text-xs uppercase tracking-caps text-muted-foreground">
            {tile.label}
          </p>
          <p className="mt-3 font-display text-section-title leading-none text-foreground">
            {tile.value === undefined ? (
              <span className="opacity-0" aria-hidden="true">
                0
              </span>
            ) : (
              tile.value
            )}
          </p>
        </div>
      ))}
    </div>
  );
}
