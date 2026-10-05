"use client";

import { Mic } from "lucide-react";
import { useComposer } from "@/components/journal/composer/composer-provider";
import { SidebarMenuButton } from "@/components/ui/sidebar";

export function SidebarRecordButton() {
  const { startRecording } = useComposer();

  return (
    <SidebarMenuButton
      onClick={startRecording}
      tooltip="Record a dream"
      className="bg-primary font-semibold text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground data-active:bg-primary data-active:text-primary-foreground"
    >
      <Mic aria-hidden />
      <span>Record a dream</span>
    </SidebarMenuButton>
  );
}
