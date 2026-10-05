"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  type ReactNode,
  type RefObject,
  useContext,
  useReducer,
  useRef,
  useTransition,
} from "react";
import { toast } from "sonner";
import {
  createEntry,
  type EntryFormState,
  transcribeRecording,
} from "@/app/journal/actions";
import { ComposerOverlay } from "@/components/journal/composer/composer-overlay";
import {
  type ComposerState,
  initialComposerState,
  reduceComposer,
} from "@/components/journal/composer/composer-state";
import {
  extensionFor,
  MAX_AUDIO_BYTES,
} from "@/components/journal/recorder-mime";
import { useRecorder } from "@/components/journal/use-recorder";

export type ComposerOpenChangeDetails = { cancel: () => void };

type ComposerContextValue = {
  state: ComposerState;
  startRecording: () => void;
  startTyping: () => void;
  cancelRecording: () => void;
  discard: () => void;
  finishRecording: () => void;
  onOpenChange: (open: boolean, details: ComposerOpenChangeDetails) => void;
  saveEntry: (
    prev: EntryFormState,
    formData: FormData,
  ) => Promise<EntryFormState>;
  onDraftChange: (draft: { title?: string; body?: string }) => void;
  analyserRef: RefObject<AnalyserNode | null>;
  startedAtRef: RefObject<number>;
};

const ComposerContext = createContext<ComposerContextValue | null>(null);

export function useComposer() {
  const context = useContext(ComposerContext);
  if (!context) {
    throw new Error("useComposer must be used within ComposerProvider");
  }
  return context;
}

export function ComposerProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reduceComposer, initialComposerState);
  const router = useRouter();
  const recorder = useRecorder();
  const requestIdRef = useRef(0);
  const [, startTransition] = useTransition();

  const hasHiddenDraft = !state.open && state.phase === "editing";

  const beginRecording = async () => {
    requestIdRef.current += 1;
    dispatch({ type: "start" });
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
    dispatch({ type: "started" });
  };

  // beginRecording() runs synchronously up to its first await, which is
  // where recorder.start() creates the AudioContext, so it stays inside the
  // click's user-activation window.
  const startRecording = () => {
    if (hasHiddenDraft) {
      dispatch({ type: "open" });
      return;
    }
    void beginRecording();
  };

  const startTyping = () => {
    if (hasHiddenDraft) {
      dispatch({ type: "open" });
      return;
    }
    dispatch({ type: "type-instead" });
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

  const discard = () => {
    requestIdRef.current += 1;
    dispatch({ type: "reset" });
  };

  const onOpenChange = (open: boolean, details: ComposerOpenChangeDetails) => {
    if (open) {
      return;
    }
    if (state.phase === "starting") {
      cancelRecording();
      return;
    }
    if (state.phase === "recording" || state.phase === "transcribing") {
      details.cancel();
      return;
    }
    if (state.phase === "editing") {
      dispatch({ type: "close" });
      return;
    }
    dispatch({ type: "reset" });
  };

  const onSaved = (id: string) => {
    dispatch({ type: "reset" });
    toast.success("Dream saved", {
      action: {
        label: "View",
        onClick: () => router.push(`/journal/${id}`),
      },
    });
  };

  const saveEntry = async (prev: EntryFormState, formData: FormData) => {
    const result = await createEntry(prev, formData);
    if (result?.savedId) {
      onSaved(result.savedId);
    }
    return result;
  };

  const onDraftChange = (draft: { title?: string; body?: string }) => {
    dispatch({ type: "draft", ...draft });
  };

  return (
    <ComposerContext.Provider
      value={{
        state,
        startRecording,
        startTyping,
        cancelRecording,
        discard,
        finishRecording,
        onOpenChange,
        saveEntry,
        onDraftChange,
        analyserRef: recorder.analyserRef,
        startedAtRef: recorder.startedAtRef,
      }}
    >
      {children}
      <ComposerOverlay />
    </ComposerContext.Provider>
  );
}
