"use client";

import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { crumbForPathname } from "@/components/journal/sidebar/nav-items";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link, usePathname } from "@/i18n/navigation";

export function JournalBreadcrumbs({ entryCrumb }: { entryCrumb?: ReactNode }) {
  const pathname = usePathname();
  const t = useTranslations("Journal");
  const crumb = crumbForPathname(pathname);

  if (crumb.kind === "journal") {
    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>{t("breadcrumb")}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink render={<Link href="/journal" />}>
            {t("breadcrumb")}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          {crumb.kind === "nav" ? (
            <BreadcrumbPage>{t(crumb.titleKey)}</BreadcrumbPage>
          ) : (
            <BreadcrumbPage className="max-w-[40vw] truncate md:max-w-xs">
              {entryCrumb}
            </BreadcrumbPage>
          )}
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
