import { useTranslations } from "next-intl";
import { Suspense } from "react";
import {
  JournalNavBottom,
  JournalNavMain,
} from "@/components/journal/sidebar/journal-nav";
import { NavUser } from "@/components/journal/sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuSkeleton,
} from "@/components/ui/sidebar";
import { Wordmark } from "@/components/wordmark";
import { Link } from "@/i18n/navigation";

export function JournalSidebar() {
  const t = useTranslations("Journal");
  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader className="gap-3 px-3 pt-4 pb-2 group-data-[collapsible=icon]:px-2">
        <Link
          href="/journal"
          aria-label={t("homeAria")}
          className="pressable flex items-center px-1 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0 font-display text-2xl font-medium italic leading-8 tracking-[-0.02em] text-foreground"
        >
          <span className="truncate group-data-[collapsible=icon]:hidden">
            <Wordmark />
          </span>
          <span className="hidden group-data-[collapsible=icon]:block">
            d<span className="text-rec">.</span>
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t("sidebarGroup")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <Suspense fallback={<SidebarMenuSkeleton showIcon />}>
              <JournalNavMain />
            </Suspense>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <Suspense fallback={<SidebarMenuSkeleton showIcon />}>
              <JournalNavBottom />
            </Suspense>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <Suspense fallback={<SidebarMenuSkeleton showIcon />}>
              <NavUser />
            </Suspense>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
