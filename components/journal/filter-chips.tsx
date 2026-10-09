"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { AppHref } from "@/i18n/paths";
import { type MeaningFilter, parseMeaningFilter } from "@/lib/meaning";

const filters = [
  { value: "all", label: "filterAll", href: "/journal" },
  {
    value: "interpreted",
    label: "filterInterpreted",
    href: "/journal?filter=interpreted",
  },
  {
    value: "fulfilled",
    label: "filterFulfilled",
    href: "/journal?filter=fulfilled",
  },
] as const;

export function FilterChipsView({ active }: { active: MeaningFilter | null }) {
  const t = useTranslations("Journal");
  return (
    <nav aria-label={t("filterAria")} className="mb-6 flex flex-wrap gap-2">
      {filters.map((filter) => {
        const isActive = active === filter.value;
        return (
          <Link
            key={filter.value}
            href={filter.href as AppHref}
            aria-current={isActive ? "page" : undefined}
            className={`rounded-full px-3 py-1 text-sm font-medium ${
              isActive
                ? "bg-primary text-primary-foreground"
                : "border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {t(filter.label)}
          </Link>
        );
      })}
    </nav>
  );
}

export function FilterChips() {
  const searchParams = useSearchParams();
  return (
    <FilterChipsView active={parseMeaningFilter(searchParams.get("filter"))} />
  );
}
