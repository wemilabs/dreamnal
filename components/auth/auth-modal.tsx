"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function AuthModal({
  title,
  lead,
  children,
  footer,
}: {
  title: ReactNode;
  lead: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}) {
  const router = useRouter();

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) router.back();
      }}
    >
      <DialogContent className="max-h-[90dvh] gap-6 overflow-y-auto rounded-lg border border-(--glass-border) bg-(--glass-bg) p-6 shadow-(--glass-shadow) ring-0 backdrop-blur-xl sm:max-w-105">
        <DialogHeader className="gap-2 pr-6">
          <DialogTitle className="font-display text-section-title font-normal tracking-display text-foreground">
            {title}
          </DialogTitle>
          <DialogDescription className="text-lead text-muted-foreground">
            {lead}
          </DialogDescription>
        </DialogHeader>
        {children}
        {footer ? (
          <p className="text-sm/tight text-muted-foreground">{footer}</p>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
