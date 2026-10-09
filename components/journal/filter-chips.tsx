"use client";

import type { Route } from "next";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { type MeaningFilter, parseMeaningFilter } from "@/lib/meaning";

const filters = [
  { value: "all", label: "All", href: "/journal" },
  {
    value: "interpreted",
    label: "Interpreted",
    href: "/journal?filter=interpreted",
  },
  {
    value: "fulfilled",
    label: "Fulfilled",
    href: "/journal?filter=fulfilled",
  },
] as const;

export function FilterChipsView({ active }: { active: MeaningFilter | null }) {
  return (
    <nav aria-label="Filter dreams" className="mb-6 flex flex-wrap gap-2">
      {filters.map((filter) => {
        const isActive = active === filter.value;
        return (
          <Link
            key={filter.value}
            href={filter.href as Route}
            aria-current={isActive ? "page" : undefined}
            className={`rounded-full px-3 py-1 text-sm font-medium ${
              isActive
                ? "bg-primary text-primary-foreground"
                : "border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {filter.label}
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
