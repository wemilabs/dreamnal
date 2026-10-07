"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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

export function JournalBreadcrumbs({ entryCrumb }: { entryCrumb?: ReactNode }) {
  const pathname = usePathname();
  const crumb = crumbForPathname(pathname);

  if (crumb.kind === "journal") {
    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Journal</BreadcrumbPage>
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
            Journal
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          {crumb.kind === "nav" ? (
            <BreadcrumbPage>{crumb.title}</BreadcrumbPage>
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
