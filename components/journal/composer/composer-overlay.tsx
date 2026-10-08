"use client";

import { ComposerBody } from "@/components/journal/composer/composer-body";
import { useComposer } from "@/components/journal/composer/composer-provider";
import { STATUS_TEXT } from "@/components/journal/composer/composer-state";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { dayKey, parseDayKey } from "@/lib/calendar";
import { calendarCopy } from "@/lib/calendar-copy";

export function ComposerOverlay() {
  const { state, onOpenChange } = useComposer();
  const isMobile = useIsMobile();
  const status = STATUS_TEXT[state.phase];
  const backdate = state.backdateDay ? parseDayKey(state.backdateDay) : null;
  const backdateLabel =
    backdate && state.backdateDay !== dayKey(new Date())
      ? calendarCopy.forDay(
          new Intl.DateTimeFormat("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          }).format(backdate),
        )
      : null;

  if (isMobile) {
    return (
      <Drawer open={state.open} onOpenChange={onOpenChange} showSwipeHandle>
        <DrawerContent className="max-h-[85dvh]">
          <DrawerHeader className="shrink-0 text-left">
            <DrawerTitle className="text-2xl font-semibold tracking-tight">
              New dream
            </DrawerTitle>
            {backdateLabel ? (
              <p className="text-control text-muted-foreground">
                {backdateLabel}
              </p>
            ) : null}
            <DrawerDescription className="sr-only" aria-live="polite">
              {status}
            </DrawerDescription>
          </DrawerHeader>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
            <ComposerBody />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={state.open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[85dvh] overflow-y-auto sm:max-w-2xl"
        showCloseButton={
          state.phase !== "recording" && state.phase !== "transcribing"
        }
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold tracking-tight">
            New dream
          </DialogTitle>
          {backdateLabel ? (
            <p className="text-control text-muted-foreground">
              {backdateLabel}
            </p>
          ) : null}
          <DialogDescription className="sr-only" aria-live="polite">
            {status}
          </DialogDescription>
        </DialogHeader>
        <ComposerBody />
      </DialogContent>
    </Dialog>
  );
}
