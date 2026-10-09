"use client";

import { Download, EllipsisVertical, Share, SquarePlus } from "lucide-react";
import { useTranslations } from "next-intl";
import { InstallStepsItem } from "@/components/pwa/install-steps-item";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { promptInstall, useInstallStatus } from "@/lib/pwa/install-prompt";

export function InstallAppButton() {
  const t = useTranslations("Pwa");
  const status = useInstallStatus();
  const iosSteps = [
    { icon: Share, text: t("safariShare") },
    { icon: SquarePlus, text: t("addToHomeScreen") },
  ];
  const androidSteps = [
    { icon: EllipsisVertical, text: t("browserMenu") },
    { icon: SquarePlus, text: t("installOrAdd") },
  ];

  if (status === "ios") {
    return <InstallStepsItem description={t("keepJournal")} steps={iosSteps} />;
  }
  if (status === "android") {
    return (
      <InstallStepsItem
        description={t("alreadyInstalled")}
        steps={androidSteps}
      />
    );
  }
  if (status === "hidden") {
    return null;
  }
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        onClick={() => void promptInstall()}
        tooltip={t("install")}
      >
        <Download aria-hidden />
        <span>{t("install")}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
