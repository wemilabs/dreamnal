import type { ReactNode } from "react";
import { ViewTransition } from "react";

export function PageFade({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter="page-fade" exit="page-fade" default="none">
      <div>{children}</div>
    </ViewTransition>
  );
}
