"use client";

import { Keyboard, Mic } from "lucide-react";
import { useSyncExternalStore } from "react";
import { useComposer } from "@/components/journal/composer/composer-provider";

let captureBarVisible = false;
const listeners = new Set<() => void>();

function setCaptureBarVisible(visible: boolean) {
  if (visible === captureBarVisible) {
    return;
  }
  captureBarVisible = visible;
  for (const listener of listeners) {
    listener();
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useCaptureBarVisible() {
  return useSyncExternalStore(
    subscribe,
    () => captureBarVisible,
    () => false,
  );
}

function observeCaptureBar(node: HTMLElement | null) {
  if (!node) {
    return;
  }
  const observer = new IntersectionObserver(
    ([entry]) => setCaptureBarVisible(entry.isIntersecting),
    { rootMargin: "-52px 0px 0px 0px" },
  );
  observer.observe(node);
  return () => {
    observer.disconnect();
    setCaptureBarVisible(false);
  };
}

export function CaptureBar() {
  const { startRecording, startTyping } = useComposer();

  return (
    <div
      ref={observeCaptureBar}
      className="mb-8 hidden items-center gap-2 rounded-2xl bg-card p-2 shadow-card ring-1 ring-border/60 md:flex"
    >
      <button
        type="button"
        onClick={() => startTyping()}
        className="group flex h-10 flex-1 items-center gap-3 rounded-xl pr-3 pl-3 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <span className="flex-1 text-control text-muted-foreground">
          What did you dream last night?
        </span>
        <span className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors group-hover:text-foreground">
          <Keyboard className="size-4" aria-hidden />
          Type
        </span>
      </button>
      <button
        type="button"
        onClick={() => startRecording()}
        className="pressable flex h-10 items-center gap-2 rounded-full bg-primary pr-4 pl-1 text-sm font-semibold text-primary-foreground"
      >
        <span className="grid size-8 place-items-center rounded-full bg-petal text-ink">
          <Mic className="size-4" aria-hidden />
        </span>
        Record
      </button>
    </div>
  );
}
