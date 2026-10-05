"use client";

import { useEffect } from "react";
import "@/lib/pwa/install-prompt";

export function PwaRegistrar() {
  useEffect(() => {
    if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
      void navigator.serviceWorker.register("/sw.js", {
        scope: "/",
        updateViaCache: "none",
      });
    }
  }, []);
  return null;
}
