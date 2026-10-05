"use client";

import { Search } from "lucide-react";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import { useCommandMenu } from "@/components/journal/command-menu";
import { titleForPathname } from "@/components/journal/sidebar/nav-items";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

function TopBarTitle() {
  const pathname = usePathname();
  return (
    <span className="text-sm font-medium text-muted-foreground">
      {titleForPathname(pathname)}
    </span>
  );
}

export function TopBar() {
  const { setOpen } = useCommandMenu();

  return (
    <header className="sticky top-0 z-20 flex h-13 shrink-0 items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur-sm">
      <SidebarTrigger />
      <Separator
        orientation="vertical"
        className="data-[orientation=vertical]:h-4 data-[orientation=vertical]:self-center"
      />
      <Suspense>
        <TopBarTitle />
      </Suspense>
      <div className="ml-auto flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Search"
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
