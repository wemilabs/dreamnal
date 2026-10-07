import type { LabelStat } from "@/lib/insights";
import { symbolsCopy } from "@/lib/symbols/copy";
import { LocalDay } from "./local-day";

export function capitalizeLabel(label: string): string {
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export function LabelLine({ stat }: { stat: LabelStat }) {
  return (
    <>
      {capitalizeLabel(stat.label)}: {symbolsCopy.dreams(stat.count)},{" "}
      {symbolsCopy.lastOn} <LocalDay iso={stat.lastAt} />
    </>
  );
}
