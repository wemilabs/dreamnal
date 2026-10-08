"use client";

import { useState } from "react";
import type { LabelPair } from "@/lib/insights";
import { insightsCopy } from "@/lib/insights-copy";
import { symbolsCopy } from "@/lib/symbols/copy";
import type { SymbolItem } from "@/lib/symbols/schema";
import { capitalizeLabel } from "../symbols/label-line";
import { EmptyChart } from "./chart-card";

const RADIUS = 68;
const LABEL_OFFSET = 10;
const keyOf = (s: SymbolItem) => `${s.kind}\u0000${s.label}`;
const short = (label: string) =>
  label.length > 15 ? `${label.slice(0, 14)}…` : label;

export function PairsGraph({
  pairs,
  onSelect,
}: {
  pairs: LabelPair[];
  onSelect: (symbol: SymbolItem) => void;
}) {
  const [active, setActive] = useState<string | null>(null);

  if (pairs.length === 0) {
    return <EmptyChart>{insightsCopy.pairs.empty}</EmptyChart>;
  }

  const nodes = [
    ...new Map(
      pairs.flatMap((p) => [p.a, p.b]).map((s) => [keyOf(s), s]),
    ).values(),
  ];
  const position = new Map(
    nodes.map((node, i) => {
      const angle = (i / nodes.length) * Math.PI * 2 - Math.PI / 2;
      return [
        keyOf(node),
        { x: Math.cos(angle) * RADIUS, y: Math.sin(angle) * RADIUS, angle },
      ];
    }),
  );
  const counts = pairs.map((p) => p.count);
  const min = Math.min(...counts);
  const span = Math.max(...counts) - min || 1;
  const degree = new Map<string, number>();
  for (const p of pairs) {
    for (const s of [p.a, p.b]) {
      degree.set(keyOf(s), (degree.get(keyOf(s)) ?? 0) + p.count);
    }
  }
  const touches = (p: LabelPair) =>
    active === null || keyOf(p.a) === active || keyOf(p.b) === active;

  return (
    <div className="flex flex-col gap-4">
      <svg
        viewBox="-180 -110 360 220"
        className="mx-auto h-auto w-full max-w-xl"
        role="img"
        aria-label={insightsCopy.pairs.title}
      >
        {pairs.map((p) => {
          const a = position.get(keyOf(p.a));
          const b = position.get(keyOf(p.b));
          if (!a || !b) {
            return null;
          }
          const weight = (p.count - min) / span;
          return (
            <line
              key={`${keyOf(p.a)}\u0000${keyOf(p.b)}`}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke="var(--chart-1)"
              strokeWidth={1 + weight * 4}
              strokeLinecap="round"
              opacity={touches(p) ? 0.35 + weight * 0.5 : 0.08}
            />
          );
        })}
        {nodes.map((node) => {
          const pos = position.get(keyOf(node));
          if (!pos) {
            return null;
          }
          const key = keyOf(node);
          const cos = Math.cos(pos.angle);
          const anchor =
            Math.abs(cos) < 0.2 ? "middle" : cos > 0 ? "start" : "end";
          const lx = pos.x + cos * LABEL_OFFSET;
          const ly = pos.y + Math.sin(pos.angle) * LABEL_OFFSET;
          const dim = active !== null && active !== key;
          return (
            // biome-ignore lint/a11y/useSemanticElements: SVG nodes can't be <button>
            <g
              key={key}
              role="button"
              tabIndex={0}
              aria-label={capitalizeLabel(node.label)}
              className="cursor-pointer outline-none"
              opacity={dim ? 0.45 : 1}
              onPointerEnter={() => setActive(key)}
              onPointerLeave={() => setActive(null)}
              onFocus={() => setActive(key)}
              onBlur={() => setActive(null)}
              onClick={() => onSelect(node)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelect(node);
                }
              }}
            >
              <circle
                cx={pos.x}
                cy={pos.y}
                r={4 + Math.min(4, (degree.get(key) ?? 0) / 2)}
                fill="var(--chart-2)"
                stroke="var(--card)"
                strokeWidth={2}
              />
              <text
                x={lx}
                y={ly}
                textAnchor={anchor}
                dominantBaseline="middle"
                fontSize={12}
                className="fill-foreground"
              >
                {capitalizeLabel(short(node.label))}
              </text>
            </g>
          );
        })}
      </svg>
      <ul className="flex flex-col">
        {pairs.slice(0, 5).map((pair) => (
          <li
            key={`${keyOf(pair.a)}\u0000${keyOf(pair.b)}`}
            className="flex items-center justify-between gap-3 border-b border-border py-2 text-control text-foreground"
          >
            <span className="truncate">
              {capitalizeLabel(pair.a.label)} + {capitalizeLabel(pair.b.label)}
            </span>
            <span className="shrink-0 font-mono text-sm text-muted-foreground">
              {symbolsCopy.dreams(pair.count)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
