"use client";

import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { Suspense } from "react";
import { useCommandMenu } from "@/components/journal/command-menu";
import { JournalBreadcrumbs } from "@/components/journal/journal-breadcrumbs";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function TopBar({ entryCrumb }: { entryCrumb?: ReactNode }) {
  const t = useTranslations("Journal");
  const { setOpen } = useCommandMenu();

  return (
    <header className="sticky top-0 z-20 flex h-13 shrink-0 items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur-sm md:rounded-t-xl">
      <SidebarTrigger />
      <Separator
        orientation="vertical"
        className="data-[orientation=vertical]:h-4 data-[orientation=vertical]:self-center"
      />
      <Suspense>
        <JournalBreadcrumbs entryCrumb={entryCrumb} />
      </Suspense>
      <div className="ml-auto flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          aria-label={t("searchAria")}
          className="md:hidden"
          onClick={() => setOpen(true)}
        >
          <Search />
        </Button>
        <ThemeToggle />
      </div>
    </header>
  );
}
