import type { EntryKind } from "@/lib/entry-kind";

export type Phase =
  | "idle"
  | "starting"
  | "recording"
  | "transcribing"
  | "editing"
  | "error";

export type ComposerState = {
  open: boolean;
  phase: Phase;
  transcript: string;
  duration: number | null;
  source: "voice" | "text";
  kind: EntryKind;
  backdateDay: string | null;
  backdateTime: string | null;
  message: string | null;
  draftTitle: string;
  draftBody: string;
};

export type ComposerAction =
  | { type: "open" }
  | { type: "close" }
  | { type: "start"; day?: string; time?: string; kind?: EntryKind }
  | { type: "upload"; day?: string; time?: string; kind?: EntryKind }
  | { type: "started" }
  | { type: "stop" }
  | { type: "transcribed"; text: string; duration: number }
  | { type: "failed"; message: string }
  | { type: "type-instead"; day?: string; time?: string; kind?: EntryKind }
  | { type: "draft"; title?: string; body?: string }
  | { type: "set-day"; day: string | null }
  | { type: "set-time"; time: string | null }
  | { type: "reset" };

export const initialComposerState: ComposerState = {
  open: false,
  phase: "idle",
  transcript: "",
  duration: null,
  source: "text",
  kind: "dream",
  backdateDay: null,
  backdateTime: null,
  message: null,
  draftTitle: "",
  draftBody: "",
};

export function reduceComposer(
  state: ComposerState,
  action: ComposerAction,
): ComposerState {
  switch (action.type) {
    case "open":
      return { ...state, open: true };
    case "close":
      return { ...state, open: false };
    case "start":
      return {
        ...state,
        open: true,
        phase: "starting",
        transcript: "",
        duration: null,
        kind: action.kind ?? "dream",
        backdateDay: action.day ?? null,
        backdateTime: action.time ?? null,
        message: null,
        draftTitle: "",
        draftBody: "",
      };
    case "upload":
      return {
        ...state,
        open: true,
        phase: "transcribing",
        transcript: "",
        duration: null,
        kind: action.kind ?? "dream",
        backdateDay: action.day ?? null,
        backdateTime: action.time ?? null,
        message: null,
        draftTitle: "",
        draftBody: "",
      };
    case "started":
      return { ...state, phase: "recording" };
    case "stop":
      return { ...state, phase: "transcribing" };
    case "transcribed":
      return {
        ...state,
        phase: "editing",
        transcript: action.text,
        duration: action.duration,
        source: "voice",
        draftTitle: "",
        draftBody: action.text,
      };
    case "failed":
      return { ...state, phase: "error", message: action.message };
    case "type-instead":
      return {
        ...state,
        open: true,
        phase: "editing",
        transcript: "",
        duration: null,
        source: "text",
        kind: action.kind ?? "dream",
        backdateDay: action.day ?? null,
        backdateTime: action.time ?? null,
        draftTitle: "",
        draftBody: "",
      };
    case "draft":
      return {
        ...state,
        draftTitle: action.title ?? state.draftTitle,
        draftBody: action.body ?? state.draftBody,
      };
    case "set-day":
      return { ...state, backdateDay: action.day };
    case "set-time":
      return { ...state, backdateTime: action.time };
    case "reset":
      return { ...initialComposerState };
  }
}
