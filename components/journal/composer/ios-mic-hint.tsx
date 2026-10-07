"use client";

import { useSyncExternalStore } from "react";
import { useMicPermission } from "@/lib/mic-permission";
import { isIOS, isStandalone } from "@/lib/pwa/platform";

const subscribe = () => () => {};
const getSnapshot = () => isIOS();
const getServerSnapshot = () => null;

export function IosMicHint() {
  const ios = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const permission = useMicPermission();

  if (!ios || (permission !== "prompt" && permission !== "unsupported")) {
    return null;
  }

  return (
    <p className="text-sm/snug text-muted-foreground">
      {isStandalone()
        ? "iOS asks for the mic each time the app opens. To stop it, open Settings › Apps › Safari › Microphone and choose Allow."
        : "Safari asks for the mic on every visit. To stop it, tap aA in the address bar › Website Settings › Microphone › Allow."}
    </p>
  );
}
