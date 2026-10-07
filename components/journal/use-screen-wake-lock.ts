"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";

export function useScreenWakeLock(): {
  acquire: () => void;
  release: () => void;
} {
  const wantedRef = useRef(false);
  const sentinelRef = useRef<WakeLockSentinel | null>(null);
  const pendingRef = useRef(false);

  const request = useCallback(async () => {
    if (
      !("wakeLock" in navigator) ||
      document.visibilityState !== "visible" ||
      sentinelRef.current ||
      pendingRef.current
    ) {
      return;
    }
    pendingRef.current = true;
    try {
      const sentinel = await navigator.wakeLock.request("screen");
      if (!wantedRef.current) {
        void sentinel.release().catch(() => {});
        return;
      }
      sentinelRef.current = sentinel;
      sentinel.addEventListener("release", () => {
        if (sentinelRef.current === sentinel) {
          sentinelRef.current = null;
        }
      });
    } catch {
    } finally {
      pendingRef.current = false;
    }
  }, []);

  const acquire = useCallback(() => {
    wantedRef.current = true;
    void request();
  }, [request]);

  const release = useCallback(() => {
    wantedRef.current = false;
    const sentinel = sentinelRef.current;
    sentinelRef.current = null;
    void sentinel?.release().catch(() => {});
  }, []);

  useEffect(() => {
    const onVisibilityChange = () => {
      if (wantedRef.current) {
        void request();
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      release();
    };
  }, [request, release]);

  return useMemo(() => ({ acquire, release }), [acquire, release]);
}
