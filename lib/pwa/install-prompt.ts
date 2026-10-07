"use client";

import { useSyncExternalStore } from "react";
import { isAndroid, isIOS, isStandalone } from "@/lib/pwa/platform";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

type InstallStatus = "hidden" | "prompt" | "ios" | "android";

let installPrompt: BeforeInstallPromptEvent | null = null;
let installed = false;
const listeners = new Set<() => void>();

const emitChange = () => {
  for (const listener of listeners) {
    listener();
  }
};

if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    installPrompt = event as BeforeInstallPromptEvent;
    emitChange();
  });
  window.addEventListener("appinstalled", () => {
    installed = true;
    installPrompt = null;
    emitChange();
  });
}

const getSnapshot = (): InstallStatus => {
  if (isStandalone() || installed) {
    return "hidden";
  }
  if (installPrompt) {
    return "prompt";
  }
  if (isIOS()) {
    return "ios";
  }
  return isAndroid() ? "android" : "hidden";
};

const getServerSnapshot = (): InstallStatus => "hidden";

const subscribe = (onStoreChange: () => void) => {
  listeners.add(onStoreChange);
  return () => {
    listeners.delete(onStoreChange);
  };
};

export const useInstallStatus = () =>
  useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

export const promptInstall = async () => {
  if (!installPrompt) {
    return;
  }
  const event = installPrompt;
  installPrompt = null;
  emitChange();
  await event.prompt();
};
