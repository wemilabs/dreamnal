"use client";

import { Download, type LucideIcon } from "lucide-react";
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
