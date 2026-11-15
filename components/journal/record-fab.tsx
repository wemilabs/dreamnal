"use client";

import { Keyboard, Mic, Plus, Upload } from "lucide-react";
import { useTranslations } from "next-intl";
import { Suspense } from "react";
import { useCaptureBarVisible } from "@/components/journal/capture-bar";
import { useComposer } from "@/components/journal/composer/composer-provider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname } from "@/i18n/navigation";
import type { EntryKind } from "@/lib/entry-kind";
import { cn } from "@/lib/utils";

function RecordFabMenu({ kind }: { kind: EntryKind }) {
  const tComposer = useTranslations("Composer");
  const { startRecording, startTyping, pickAudioFile } = useComposer();
  const captureBarVisible = useCaptureBarVisible();

  return (
    <div
      inert={captureBarVisible}
      className={cn(
        "fixed bottom-[calc(1.25rem+env(safe-area-inset-bottom,0px))] left-1/2 z-40 -translate-x-1/2 transition-[opacity,scale] duration-200 ease-out md:right-8 md:bottom-8 md:left-auto md:translate-x-0",
        captureBarVisible && "pointer-events-none scale-90 opacity-0",
      )}
    >
      <div className="relative">
        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label={tComposer(
              kind === "whisper" ? "addWhisper" : "addDream",
            )}
            render={
              <Button
                size="icon-lg"
                className="group/fab pressable size-auto rounded-full p-2 shadow-[0_12px_28px_-12px_rgb(22_35_59/0.55)]"
              />
            }
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-petal text-ink">
              <Plus
                className="size-4.5 transition-transform duration-200 ease-out group-data-popup-open/fab:rotate-45 motion-reduce:transition-none"
                aria-hidden
              />
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="top"
            align="center"
            sideOffset={10}
            className="w-auto min-w-40"
          >
            <DropdownMenuItem onClick={() => startRecording({ kind })}>
              <Mic aria-hidden />
              {tComposer("record")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => startTyping({ kind })}>
              <Keyboard aria-hidden />
              {tComposer("type")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => pickAudioFile({ kind })}>
              <Upload aria-hidden />
              {tComposer("upload")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

function PathnameRecordFab() {
  const pathname = usePathname();
  const kind =
    pathname === "/journal/whispers" ||
    pathname.startsWith("/journal/whispers/")
      ? "whisper"
      : "dream";

  return <RecordFabMenu kind={kind} />;
}

export function RecordFab() {
  return (
    <Suspense fallback={<RecordFabMenu kind="dream" />}>
      <PathnameRecordFab />
    </Suspense>
  );
}
