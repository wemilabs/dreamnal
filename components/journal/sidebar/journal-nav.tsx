"use client";

import { Search } from "lucide-react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useCommandMenu } from "@/components/journal/command-menu";
import {
  isNavItemActive,
  JOURNAL_BOTTOM_NAV_ITEMS,
  JOURNAL_NAV_ITEMS,
  type JournalNavItem,
} from "@/components/journal/sidebar/nav-items";
import { InstallAppButton } from "@/components/pwa/install-app-button";
import { Kbd } from "@/components/ui/kbd";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "@/i18n/navigation";

function NavLink({
  item,
  active,
  title,
}: {
  item: JournalNavItem;
  active: boolean;
  title: string;
}) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        render={<Link href={item.href} />}
        isActive={active}
        tooltip={title}
      >
        <item.icon aria-hidden />
        <span>{title}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

export function JournalNavMain() {
  const pathname = usePathname();
  const t = useTranslations("Journal");
  return (
    <SidebarMenu>
      {JOURNAL_NAV_ITEMS.map((item) => (
        <NavLink
          key={item.href}
          item={item}
          title={t(item.titleKey)}
          active={isNavItemActive(item, pathname)}
        />
      ))}
    </SidebarMenu>
  );
}

export function JournalNavBottom() {
  const pathname = usePathname();
  const t = useTranslations("Journal");
  const { setOpen } = useCommandMenu();
  return (
    <SidebarMenu>
      <InstallAppButton />
      <SidebarMenuItem>
        <SidebarMenuButton
          onClick={() => setOpen(true)}
          tooltip={t("navSearch")}
        >
          <Search aria-hidden />
          <span>{t("navSearch")}</span>
          <Kbd className="ml-auto hidden group-data-[collapsible=icon]:hidden md:inline-flex">
            ⌘K
          </Kbd>
        </SidebarMenuButton>
      </SidebarMenuItem>
      {JOURNAL_BOTTOM_NAV_ITEMS.map((item) => (
        <NavLink
          key={item.href}
          item={item}
          title={t(item.titleKey)}
          active={isNavItemActive(item, pathname)}
        />
      ))}
    </SidebarMenu>
  );
}
