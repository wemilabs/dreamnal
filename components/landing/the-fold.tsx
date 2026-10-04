import type { CSSProperties } from "react";

type FoldPath = {
  d: string;
  gradient: "a" | "b" | "c";
  amp: number;
  dur: number;
  delay: number;
};

const PATHS: FoldPath[] = [
  {
    d: "M80,780 C160,520 360,180 600,120 C760,80 900,180 960,330 C1020,480 1060,640 1120,700 L1120,780 Z",
    gradient: "a",
    amp: 5,
    dur: 12,
    delay: 0,
  },
  {
    d: "M40,780 C140,560 340,250 580,190 C740,150 860,240 910,380 C960,520 1000,660 1040,780 Z",
    gradient: "a",
    amp: 3.5,
    dur: 9.5,
    delay: -2,
  },
  {
    d: "M0,780 C100,600 300,320 540,270 C700,240 820,320 860,450 C900,580 930,700 950,780 Z",
    gradient: "b",
    amp: 6,
    dur: 13.5,
    delay: -4,
  },
  {
    d: "M120,780 C220,620 420,380 640,340 C800,310 960,380 1040,500 C1090,580 1110,680 1120,720 L1120,780 Z",
    gradient: "a",
    amp: 4,
    dur: 11,
    delay: -1,
  },
  {
    d: "M-20,780 C60,650 240,440 460,410 C620,390 740,450 780,560 C810,640 830,720 840,780 Z",
    gradient: "b",
    amp: 3,
    dur: 10,
    delay: -6,
  },
  {
    d: "M300,780 C400,640 600,470 800,460 C940,455 1060,540 1120,620 L1120,780 Z",
    gradient: "b",
    amp: 5.5,
    dur: 14,
    delay: -3,
  },
  {
    d: "M-40,780 C40,700 200,540 380,520 C520,505 640,570 680,660 C700,710 710,750 712,780 Z",
    gradient: "c",
    amp: 4.5,
    dur: 12.5,
    delay: -5,
  },
  {
    d: "M480,780 C560,690 720,590 880,590 C1000,590 1090,650 1120,700 L1120,780 Z",
    gradient: "c",
    amp: 3,
    dur: 9,
    delay: -7,
  },
  {
    d: "M140,780 C220,720 360,640 500,640 C620,640 700,700 730,780 Z",
    gradient: "c",
    amp: 6,
    dur: 13,
    delay: -2.5,
  },
];

function FoldGradient({
  id,
  name,
  middleOffset,
}: {
  id: string;
  name: "a" | "b" | "c";
  middleOffset: number;
}) {
  return (
    <linearGradient id={id} x1="0.5" y1="0" x2="0.5" y2="1">
      <stop offset="0" style={{ stopColor: `var(--fold-${name}-0)` }} />
      <stop
        offset={middleOffset}
        style={{ stopColor: `var(--fold-${name}-1)` }}
      />
      <stop offset="0.5" style={{ stopColor: `var(--fold-${name}-2)` }} />
      <stop offset="1" style={{ stopColor: `var(--fold-${name}-3)` }} />
    </linearGradient>
  );
}

export function TheFold({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1120 780"
      aria-hidden="true"
      className={
        className ??
        "anim-fold absolute -bottom-32.5 -left-37.5 h-auto w-160 lg:-bottom-10 lg:left-auto lg:-right-10 lg:w-280"
      }
    >
      <defs>
        <FoldGradient id="fold-a" name="a" middleOffset={0.22} />
        <FoldGradient id="fold-b" name="b" middleOffset={0.2} />
        <FoldGradient id="fold-c" name="c" middleOffset={0.18} />
      </defs>
      <g>
        {PATHS.map((path) => (
          <path
            key={path.d}
            d={path.d}
            fill={`url(#fold-${path.gradient})`}
            strokeWidth={1.1}
            className="fold-path"
            style={
              {
                "--amp": `${path.amp}px`,
                "--dur": `${path.dur}s`,
                "--dly": `${path.delay}s`,
              } as CSSProperties
            }
          />
        ))}
      </g>
    </svg>
  );
}
