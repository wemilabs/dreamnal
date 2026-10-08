import Link from "next/link";
import { listEntries } from "@/lib/entries";
import {
  keepsComingBack,
  labelStats,
  MIN_DREAMS_FOR_PATTERNS,
  seenTogether,
} from "@/lib/insights";
import { symbolsCopy } from "@/lib/symbols/copy";
import { capitalizeLabel, LabelLine } from "./label-line";
import { RhythmStats } from "./rhythm-stats";

const sectionHeading =
  "font-mono text-xs uppercase tracking-caps text-muted-foreground";
const lineLink =
  "pressable block border-b border-border py-3 text-lead text-foreground";

export async function InsightsContent() {
  const entries = await listEntries();
  if (entries.length < MIN_DREAMS_FOR_PATTERNS) {
    return (
      <p className="text-lead text-muted-foreground">{symbolsCopy.empty}</p>
    );
  }

  const insightEntries = entries.map((e) => ({
    id: e.id,
    createdAt: e.createdAt,
    symbols: e.symbols,
  }));
  const top = keepsComingBack(labelStats(insightEntries)).slice(0, 5);
  const pairs = seenTogether(insightEntries).slice(0, 5);

  return (
    <div className="flex flex-col gap-10">
      <RhythmStats timestamps={entries.map((e) => e.createdAt.toISOString())} />

      <section className="flex flex-col gap-3">
        <h2 className={sectionHeading}>{symbolsCopy.keepsComingBack}</h2>
        {top.length === 0 ? (
          <p className="text-control text-muted-foreground">
            {symbolsCopy.noRecurring}
          </p>
        ) : (
          <ul className="flex flex-col">
            {top.map((stat) => (
              <li key={`${stat.kind}\u0000${stat.label}`}>
                <Link href="/journal/symbols" className={lineLink}>
                  <LabelLine stat={stat} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {pairs.length > 0 ? (
        <section className="flex flex-col gap-3">
          <h2 className={sectionHeading}>{symbolsCopy.seenTogether}</h2>
          <ul className="flex flex-col">
            {pairs.map((pair) => (
              <li
                key={`${pair.a.kind}\u0000${pair.a.label}\u0000${pair.b.kind}\u0000${pair.b.label}`}
              >
                <Link href="/journal/symbols" className={lineLink}>
                  {capitalizeLabel(pair.a.label)} +{" "}
                  {capitalizeLabel(pair.b.label)}:{" "}
                  {symbolsCopy.dreams(pair.count)}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <div>
        <Link
          href="/journal/symbols"
          className="pressable text-control font-medium text-muted-foreground underline decoration-foreground/20 underline-offset-[5px]"
        >
          {symbolsCopy.allSymbols}
        </Link>
      </div>
    </div>
  );
}
