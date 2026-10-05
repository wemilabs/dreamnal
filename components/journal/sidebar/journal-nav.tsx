"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCommandMenu } from "@/components/journal/command-menu";
import {
  isNavItemActive,
  JOURNAL_BOTTOM_NAV_ITEMS,
  JOURNAL_NAV_ITEMS,
  type JournalNavItem,
} from "@/components/journal/sidebar/nav-items";
import { Kbd } from "@/components/ui/kbd";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

function NavLink({ item, active }: { item: JournalNavItem; active: boolean }) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        render={<Link href={item.href} />}
        isActive={active}
        tooltip={item.title}
      >
        <item.icon aria-hidden />
        <span>{item.title}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

export function JournalNavMain() {
  const pathname = usePathname();
  return (
    <SidebarMenu>
      {JOURNAL_NAV_ITEMS.map((item) => (
        <NavLink
          key={item.href}
          item={item}
          active={isNavItemActive(item, pathname)}
        />
      ))}
    </SidebarMenu>
  );
}

export function JournalNavBottom() {
  const pathname = usePathname();
  const { setOpen } = useCommandMenu();
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton onClick={() => setOpen(true)} tooltip="Search">
          <Search aria-hidden />
          <span>Search</span>
          <Kbd className="ml-auto hidden group-data-[collapsible=icon]:hidden md:inline-flex">
            ⌘K
          </Kbd>
        </SidebarMenuButton>
      </SidebarMenuItem>
      {JOURNAL_BOTTOM_NAV_ITEMS.map((item) => (
        <NavLink
          key={item.href}
          item={item}
          active={isNavItemActive(item, pathname)}
        />
      ))}
    </SidebarMenu>
  );
}
