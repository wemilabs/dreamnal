"use client";

import { Download, type LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";

export type InstallStep = { icon: LucideIcon; text: string };

export function InstallStepsItem({
  description,
  steps,
}: {
  description: string;
  steps: InstallStep[];
}) {
  const t = useTranslations("Pwa");

  return (
    <SidebarMenuItem>
      <Dialog>
        <DialogTrigger render={<SidebarMenuButton tooltip={t("install")} />}>
          <Download aria-hidden />
          <span>{t("install")}</span>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("installDreamnal")}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <ol className="flex flex-col gap-3 text-sm text-foreground">
            {steps.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3">
                <Icon
                  className="size-4 shrink-0 text-muted-foreground"
                  aria-hidden
                />
                <span>{text}</span>
              </li>
            ))}
          </ol>
        </DialogContent>
      </Dialog>
    </SidebarMenuItem>
  );
}
