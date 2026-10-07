"use client";

import { Download, EllipsisVertical, Share, SquarePlus } from "lucide-react";
import {
  type InstallStep,
  InstallStepsItem,
} from "@/components/pwa/install-steps-item";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { promptInstall, useInstallStatus } from "@/lib/pwa/install-prompt";

const IOS_STEPS: InstallStep[] = [
  { icon: Share, text: "Tap Share in Safari’s toolbar." },
  { icon: SquarePlus, text: "Tap “Add to Home Screen”." },
];

const ANDROID_STEPS: InstallStep[] = [
  { icon: EllipsisVertical, text: "Open your browser’s menu (⋮)." },
  { icon: SquarePlus, text: "Tap “Install app” or “Add to Home screen”." },
];

export function InstallAppButton() {
  const status = useInstallStatus();

  if (status === "ios") {
    return (
      <InstallStepsItem
        description="Keep your journal on the Home Screen."
        steps={IOS_STEPS}
      />
    );
  }
  if (status === "android") {
    return (
      <InstallStepsItem
        description="Keep your journal on your Home screen. Already installed? Open it from there."
        steps={ANDROID_STEPS}
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
        tooltip="Install app"
      >
        <Download aria-hidden />
        <span>Install app</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
