import type { Metadata } from "next";
import { Suspense, ViewTransition } from "react";
import { PageFade } from "@/components/journal/page-fade";
import { SymbolsContent } from "@/components/journal/symbols/symbols-content";
import { SymbolsSkeleton } from "@/components/journal/symbols/symbols-skeleton";
import { symbolsCopy } from "@/lib/symbols/copy";

export const metadata: Metadata = {
  title: symbolsCopy.symbolsTitle,
};

export default function SymbolsPage() {
  return (
    <PageFade>
      <h1 className="font-display text-page-title tracking-display text-foreground">
        {symbolsCopy.symbolsTitle}
      </h1>
      <div className="mt-8">
        <Suspense
          fallback={
            <ViewTransition exit="reveal-out" default="none">
              <SymbolsSkeleton />
            </ViewTransition>
          }
        >
          <ViewTransition enter="reveal-in" default="none">
            <SymbolsContent />
          </ViewTransition>
        </Suspense>
      </div>
      <p className="mt-10 text-sm text-muted-foreground">
        {symbolsCopy.footer}
      </p>
    </PageFade>
  );
}
