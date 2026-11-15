"use client";

import { useTranslations } from "next-intl";
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
import { useWebHaptics } from "web-haptics/react";
import {
  createEntry,
  type EntryFormState,
  transcribeRecording,
} from "@/app/[locale]/journal/actions";
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
import { useRouter } from "@/i18n/navigation";
import { dayKey } from "@/lib/calendar";
import type { EntryKind } from "@/lib/entry-kind";

export type ComposerOpenChangeDetails = { cancel: () => void };

export type ComposerStartOptions = { day?: string; kind?: EntryKind };

type ComposerContextValue = {
  state: ComposerState;
  startRecording: (options?: ComposerStartOptions) => void;
  startUpload: (file: File, options?: ComposerStartOptions) => void;
  pickAudioFile: (options?: ComposerStartOptions) => void;
  startTyping: (options?: ComposerStartOptions) => void;
  cancelRecording: () => void;
  discard: () => void;
  finishRecording: () => void;
  onOpenChange: (open: boolean, details: ComposerOpenChangeDetails) => void;
  saveEntry: (
    prev: EntryFormState,
    formData: FormData,
  ) => Promise<EntryFormState>;
  onDraftChange: (draft: { title?: string; body?: string }) => void;
  setBackdateDay: (day: string | null) => void;
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
  const t = useTranslations("Composer");
  const [state, dispatch] = useReducer(reduceComposer, initialComposerState);
  const router = useRouter();
  const recorder = useRecorder();
  const { trigger } = useWebHaptics();
  const requestIdRef = useRef(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadOptionsRef = useRef<ComposerStartOptions | undefined>(undefined);
  const [, startTransition] = useTransition();

  const hasHiddenDraft = !state.open && state.phase === "editing";

  const startUpload = (file: File, options?: ComposerStartOptions) => {
    const requestId = ++requestIdRef.current;
    dispatch({ type: "upload", day: options?.day, kind: options?.kind });
    if (file.size === 0 || !file.type.startsWith("audio/")) {
      dispatch({ type: "failed", message: t("invalidAudio") });
      return;
    }
    if (file.size > MAX_AUDIO_BYTES) {
      dispatch({ type: "failed", message: t("fileTooLarge") });
      return;
    }
    startTransition(async () => {
      const formData = new FormData();
      formData.set("audio", file);
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

  const pickAudioFile = (options?: ComposerStartOptions) => {
    if (
      state.phase === "starting" ||
      state.phase === "recording" ||
      state.phase === "transcribing"
    ) {
      return;
    }
    if (hasHiddenDraft) {
      dispatch({ type: "open" });
      return;
    }
    void trigger("nudge");
    uploadOptionsRef.current = options;
    fileInputRef.current?.click();
  };

  const beginRecording = async (options?: ComposerStartOptions) => {
    requestIdRef.current += 1;
    dispatch({ type: "start", day: options?.day, kind: options?.kind });
    const error = await recorder.start();
    if (error === "interrupted") {
      return;
    }
    if (error) {
      dispatch({
        type: "failed",
        message: error === "denied" ? t("micError") : t("unsupported"),
      });
      return;
    }
    dispatch({ type: "started" });
  };

  // beginRecording() runs synchronously up to its first await, which is
  // where recorder.start() creates the AudioContext, so it stays inside the
  // click's user-activation window.
  const startRecording = (options?: ComposerStartOptions) => {
    if (hasHiddenDraft) {
      dispatch({ type: "open" });
      return;
    }
    // iOS only fires haptics synchronously inside the tap handler.
    void trigger("nudge");
    void beginRecording(options);
  };

  const startTyping = (options?: ComposerStartOptions) => {
    if (hasHiddenDraft) {
      dispatch({ type: "open" });
      return;
    }
    dispatch({ type: "type-instead", day: options?.day, kind: options?.kind });
  };

  const finishRecording = () => {
    void trigger("success");
    const requestId = ++requestIdRef.current;
    startTransition(async () => {
      const blob = await recorder.stop();
      if (!blob) {
        dispatch({
          type: "failed",
          message: t("nothingCaptured"),
        });
        return;
      }
      if (blob.size > MAX_AUDIO_BYTES) {
        dispatch({
          type: "failed",
          message: t("tooLong"),
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

  const onSaved = (id: string, kind: EntryKind) => {
    dispatch({ type: "reset" });
    toast.success(t(kind === "whisper" ? "whisperSaved" : "saved"), {
      action: {
        label: t("view"),
        onClick: () => router.push(`/journal/${id}`),
      },
    });
  };

  const saveEntry = async (prev: EntryFormState, formData: FormData) => {
    if (state.backdateDay && state.backdateDay !== dayKey(new Date())) {
      const [year, month, day] = state.backdateDay.split("-").map(Number);
      const now = new Date();
      formData.set(
        "createdAt",
        new Date(
          year,
          month - 1,
          day,
          now.getHours(),
          now.getMinutes(),
        ).toISOString(),
      );
    }
    const kind = state.kind;
    formData.set("kind", kind);
    const result = await createEntry(prev, formData);
    if (result?.savedId) {
      onSaved(result.savedId, kind);
    }
    return result;
  };

  const onDraftChange = (draft: { title?: string; body?: string }) => {
    dispatch({ type: "draft", ...draft });
  };

  const setBackdateDay = (day: string | null) => {
    dispatch({
      type: "set-day",
      day: day && day !== dayKey(new Date()) ? day : null,
    });
  };

  return (
    <ComposerContext.Provider
      value={{
        state,
        startRecording,
        startUpload,
        pickAudioFile,
        startTyping,
        cancelRecording,
        discard,
        finishRecording,
        onOpenChange,
        saveEntry,
        onDraftChange,
        setBackdateDay,
        analyserRef: recorder.analyserRef,
        startedAtRef: recorder.startedAtRef,
      }}
    >
      {children}
      <ComposerOverlay />
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        hidden
        tabIndex={-1}
        aria-hidden
        onChange={(event) => {
          const file = event.currentTarget.files?.[0];
          event.currentTarget.value = "";
          if (file) {
            startUpload(file, uploadOptionsRef.current);
          }
        }}
      />
    </ComposerContext.Provider>
  );
}
