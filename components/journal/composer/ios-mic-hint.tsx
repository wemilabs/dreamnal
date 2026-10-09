"use client";

import { useTranslations } from "next-intl";
import { useSyncExternalStore } from "react";
import { useMicPermission } from "@/lib/mic-permission";
import { isIOS, isStandalone } from "@/lib/pwa/platform";

const subscribe = () => () => {};
const getSnapshot = () => isIOS();
const getServerSnapshot = () => null;

export function IosMicHint() {
  const t = useTranslations("Composer");
  const ios = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const permission = useMicPermission();

  if (!ios || (permission !== "prompt" && permission !== "unsupported")) {
    return null;
  }

  return (
    <p className="text-sm/snug text-muted-foreground">
      {isStandalone() ? t("iosStandaloneHint") : t("iosMicHint")}
    </p>
  );
}
