"use client";

import { Mic } from "lucide-react";
import { useRouter } from "next/navigation";
import { useReducer, useRef, useTransition } from "react";
import { createEntry } from "../../app/journal/actions";
import { transcribeRecording } from "../../app/journal/new/actions";
import { Skeleton } from "../ui/skeleton";
import { EntryForm } from "./entry-form";
import { extensionFor, MAX_AUDIO_BYTES } from "./recorder-mime";
import { RecordingCard } from "./recording-card";
import { useRecorder } from "./use-recorder";

type Phase = "idle" | "recording" | "transcribing" | "editing" | "error";

type ComposerState = {
  phase: Phase;
  transcript: string;
  duration: number | null;
  source: "voice" | "text";
  message: string | null;
};

type ComposerAction =
  | { type: "start" }
  | { type: "stop" }
  | { type: "transcribed"; text: string; duration: number }
  | { type: "failed"; message: string }
  | { type: "type-instead" }
  | { type: "reset" };

function reduce(state: ComposerState, action: ComposerAction): ComposerState {
  switch (action.type) {
    case "start":
      return { ...state, phase: "recording", message: null };
    case "stop":
      return { ...state, phase: "transcribing" };
    case "transcribed":
      return {
        ...state,
        phase: "editing",
        transcript: action.text,
        duration: action.duration,
        source: "voice",
      };
    case "failed":
      return { ...state, phase: "error", message: action.message };
    case "type-instead":
      return {
        ...state,
        phase: "editing",
        transcript: "",
        duration: null,
        source: "text",
      };
    case "reset":
      return {
        phase: "idle",
        transcript: "",
        duration: null,
        source: "text",
        message: null,
      };
  }
}

const STATUS_TEXT: Record<Phase, string> = {
  idle: "Ready to record",
  recording: "Recording",
  transcribing: "Transcribing",
  editing: "Editing entry",
  error: "Error",
};

export function Composer({ initialMode }: { initialMode: "record" | "type" }) {
  const [state, dispatch] = useReducer(reduce, {
    phase: initialMode === "type" ? "editing" : "idle",
    transcript: "",
    duration: null,
    source: "text" as const,
    message: null,
  });
  const router = useRouter();
  const recorder = useRecorder();
  const requestIdRef = useRef(0);
  const [, startTransition] = useTransition();

  const beginRecording = async () => {
    requestIdRef.current += 1;
    const error = await recorder.start();
    if (error === "interrupted") {
      return;
    }
    if (error) {
      dispatch({
        type: "failed",
        message:
          error === "denied"
            ? "We couldn’t reach the mic. Check the permission and try again, or type it instead."
            : "This browser can’t record audio. Type it instead below.",
      });
      return;
    }
    dispatch({ type: "start" });
  };

  const finishRecording = () => {
    const requestId = ++requestIdRef.current;
    startTransition(async () => {
      const blob = await recorder.stop();
      if (!blob) {
        dispatch({
          type: "failed",
          message: "Nothing was captured. Try again.",
        });
        return;
      }
      if (blob.size > MAX_AUDIO_BYTES) {
        dispatch({
          type: "failed",
          message:
            "That recording is too long to send. Try a shorter one, or type it instead.",
        });
        return;
      }
      dispatch({ type: "stop" });
      const formData = new FormData();
      formData.set(
        "audio",
        new File([blob], `dream.${extensionFor(blob.type)}`, {
          type: blob.type,
        }),
      );
      const result = await transcribeRecording(formData);
      if (requestId !== requestIdRef.current) {
        return;
      }
      if (result.status === "ok") {
        dispatch({
          type: "transcribed",
          text: result.text,
          duration: result.duration,
        });
      } else {
        dispatch({ type: "failed", message: result.message });
      }
    });
  };

  const cancelRecording = () => {
    requestIdRef.current += 1;
    recorder.cancel();
    dispatch({ type: "reset" });
  };

  return (
    <div className="flex w-full flex-col items-stretch gap-6">
      <span className="font-mono text-xs tracking-caps text-muted-foreground">
        NEW ENTRY
      </span>
      <p aria-live="polite" className="sr-only">
        {STATUS_TEXT[state.phase]}
      </p>
      {state.phase === "idle" && (
        <div className="flex flex-col items-start gap-8 pt-4">
          <button
            type="button"
            onClick={beginRecording}
            aria-label="Start recording"
            className="pressable group flex items-center gap-4 rounded-full bg-primary py-3 pr-8 pl-3 text-primary-foreground"
          >
            <span className="grid size-14 shrink-0 place-items-center rounded-full bg-petal text-ink">
              <Mic className="size-6" aria-hidden />
            </span>
            <span className="text-[17px] font-semibold">
              Tap to start recording
            </span>
          </button>
          <button
            type="button"
            onClick={() => dispatch({ type: "type-instead" })}
            className="pressable text-[17px] font-medium text-foreground underline decoration-foreground/30 decoration-1 underline-offset-[5px]"
          >
            or type it instead
          </button>
        </div>
      )}
      {state.phase === "recording" && (
        <RecordingCard
          analyserRef={recorder.analyserRef}
          startedAtRef={recorder.startedAtRef}
          onDone={finishRecording}
          onCancel={cancelRecording}
        />
      )}
      {state.phase === "transcribing" && (
        <div className="flex w-full flex-col gap-6 rounded-lg border border-(--glass-border) bg-(--glass-bg) px-6 py-6 shadow-(--glass-shadow) backdrop-blur-xl">
          <div className="flex items-center gap-2.5">
            <span className="rec-dot size-2 shrink-0 rounded-full bg-fold" />
            <span className="text-sm/tight font-semibold text-foreground">
              Writing it down…
            </span>
          </div>
          <div className="flex flex-col gap-2.5" aria-hidden="true">
            <Skeleton className="h-4 w-full motion-reduce:animate-none" />
            <Skeleton className="h-4 w-11/12 motion-reduce:animate-none" />
            <Skeleton className="h-4 w-3/4 motion-reduce:animate-none" />
          </div>
        </div>
      )}
      {state.phase === "editing" && (
        <EntryForm
          action={createEntry}
          defaultBody={state.transcript}
          source={state.source}
          audioDurationSeconds={state.duration}
          submitLabel="Save entry"
          onRecordAgain={() => {
            dispatch({ type: "reset" });
            void beginRecording();
          }}
          recordLabel={state.transcript ? "Record again" : "Record instead"}
          onDiscard={() => router.push("/journal")}
        />
      )}
      {state.phase === "error" && (
        <div className="flex w-full flex-col items-start gap-5 rounded-lg border border-(--glass-border) bg-(--glass-bg) px-6 py-6 shadow-(--glass-shadow) backdrop-blur-xl">
          <p role="alert" className="text-[15px] leading-body text-rec">
            {state.message}
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={beginRecording}
              className="pressable flex items-center rounded-full bg-primary px-6 py-2.5 text-[15px] font-semibold text-primary-foreground"
            >
              Try again
            </button>
            <button
              type="button"
              onClick={() => dispatch({ type: "type-instead" })}
              className="pressable text-[15px] font-medium text-foreground underline decoration-foreground/30 underline-offset-[5px]"
            >
              type it instead
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
