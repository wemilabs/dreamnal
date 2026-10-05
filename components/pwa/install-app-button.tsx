"use client";

import { Download, Share, SquarePlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { promptInstall, useInstallStatus } from "@/lib/pwa/install-prompt";

function IosInstallItem() {
  return (
    <SidebarMenuItem>
      <Dialog>
        <DialogTrigger render={<SidebarMenuButton tooltip="Install app" />}>
          <Download aria-hidden />
          <span>Install app</span>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Install Dreamnal</DialogTitle>
            <DialogDescription>
              Keep your journal on the Home Screen.
            </DialogDescription>
          </DialogHeader>
          <ol className="flex flex-col gap-3 text-sm text-foreground">
            <li className="flex items-center gap-3">
              <Share
                className="size-4 shrink-0 text-muted-foreground"
                aria-hidden
              />
              <span>Tap Share in Safari’s toolbar.</span>
            </li>
            <li className="flex items-center gap-3">
              <SquarePlus
                className="size-4 shrink-0 text-muted-foreground"
                aria-hidden
              />
              <span>Tap “Add to Home Screen”.</span>
            </li>
          </ol>
        </DialogContent>
      </Dialog>
    </SidebarMenuItem>
  );
}

export function InstallAppButton() {
  const status = useInstallStatus();

  if (status === "ios") {
    return <IosInstallItem />;
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
