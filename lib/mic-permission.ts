"use client";

import { useSyncExternalStore } from "react";

export type MicPermission = PermissionState | "unsupported" | "unknown";

let micPermission: MicPermission = "unknown";
let queried = false;
const listeners = new Set<() => void>();

const emitChange = () => {
  for (const listener of listeners) {
    listener();
  }
};

const queryMicPermission = () => {
  if (queried) {
    return;
  }
  queried = true;
  if (!navigator.permissions?.query) {
    micPermission = "unsupported";
    emitChange();
    return;
  }
  navigator.permissions
    .query({ name: "microphone" as PermissionName })
    .then((status) => {
      micPermission = status.state;
      status.addEventListener("change", () => {
        micPermission = status.state;
        emitChange();
      });
      emitChange();
    })
    .catch(() => {
      micPermission = "unsupported";
      emitChange();
    });
};

const subscribe = (onStoreChange: () => void) => {
  listeners.add(onStoreChange);
  queryMicPermission();
  return () => {
    listeners.delete(onStoreChange);
  };
};

const getSnapshot = (): MicPermission => micPermission;

const getServerSnapshot = (): MicPermission => "unknown";

export const useMicPermission = () =>
  useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
