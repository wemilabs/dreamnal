"use client";

import { useActionState, useState } from "react";
import { markFulfilled } from "@/app/journal/[id]/meaning-actions";
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
import { Textarea } from "@/components/ui/textarea";
import { useIsMobile } from "@/hooks/use-mobile";
import { dayKey } from "@/lib/calendar";

function FulfillForm({
  entryId,
  createdAt,
}: {
  entryId: string;
  createdAt: string;
}) {
  const [state, formAction, pending] = useActionState(markFulfilled, null);
  const min = dayKey(new Date(createdAt));
  const max = dayKey(new Date());
  const [fulfilledOn, setFulfilledOn] = useState(max);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="id" value={entryId} />
      <label className="flex flex-col gap-2 text-control text-muted-foreground">
        <span>When did it happen?</span>
        <input
          type="date"
          name="fulfilledOn"
          required
          min={min}
          max={max}
          value={fulfilledOn}
          onChange={(event) => {
            const day = event.currentTarget.value;
            setFulfilledOn(!day || day > max ? max : day < min ? min : day);
          }}
          aria-invalid={state?.fieldErrors?.fulfilledOn ? true : undefined}
          className="h-9 min-w-36 rounded-lg border border-input bg-transparent px-2.5 text-base text-foreground tabular-nums outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:h-8 md:text-sm dark:scheme-dark dark:bg-input/30 [&::-webkit-date-and-time-value]:text-left"
        />
        {state?.fieldErrors?.fulfilledOn?.[0] ? (
          <span role="alert" className="text-sm/tight text-rec">
            {state.fieldErrors.fulfilledOn[0]}
          </span>
        ) : null}
      </label>

      <div className="flex flex-col gap-2 text-control text-muted-foreground">
        <label htmlFor="fulfillment-note">What happened? (optional)</label>
        <Textarea
          id="fulfillment-note"
          name="note"
          maxLength={2000}
          placeholder="The dream played out when…"
          autoComplete="off"
          className="min-h-24 resize-none rounded-lg border border-border bg-card/60 p-4 text-sm md:text-control"
        />
        {state?.fieldErrors?.note?.[0] ? (
          <span role="alert" className="text-sm/tight text-rec">
            {state.fieldErrors.note[0]}
          </span>
        ) : null}
      </div>

      {state?.error ? (
        <p role="alert" className="text-sm/tight text-rec">
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="pressable w-fit rounded-full bg-primary px-5 py-2 text-control font-semibold text-primary-foreground disabled:opacity-60"
      >
        {pending ? "Confirming…" : "Confirm"}
      </button>
    </form>
  );
}

export function FulfillDialog({
  entryId,
  createdAt,
  open,
  onOpenChange,
}: {
  entryId: string;
  createdAt: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange} showSwipeHandle>
        <DrawerContent className="max-h-[85dvh]">
          <DrawerHeader className="shrink-0 text-left">
            <DrawerTitle className="text-2xl font-semibold tracking-tight">
              It came true?
            </DrawerTitle>
            <DrawerDescription className="sr-only">
              Record a date and an optional note for this entry.
            </DrawerDescription>
          </DrawerHeader>
          {open ? (
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
              <FulfillForm entryId={entryId} createdAt={createdAt} />
            </div>
          ) : null}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85dvh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold tracking-tight">
            It came true?
          </DialogTitle>
          <DialogDescription className="sr-only">
            Record a date and an optional note for this entry.
          </DialogDescription>
        </DialogHeader>
        {open ? <FulfillForm entryId={entryId} createdAt={createdAt} /> : null}
      </DialogContent>
    </Dialog>
  );
}
