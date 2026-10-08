"use client";

import { useActionState, useState, ViewTransition } from "react";
import type { EntryFormState } from "@/app/journal/actions";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type EntryFormProps = {
  action: (prev: EntryFormState, formData: FormData) => Promise<EntryFormState>;
  entryId?: string;
  defaultTitle?: string | null;
  defaultBody?: string;
  source: "voice" | "text";
  audioDurationSeconds?: number | null;
  submitLabel: string;
  pendingLabel?: string;
  onRecordAgain?: () => void;
  recordLabel?: string;
  onDiscard?: () => void;
  onTitleChange?: (title: string) => void;
  onBodyChange?: (body: string) => void;
  titleTransitionName?: string;
};

export function EntryForm({
  action,
  entryId,
  defaultTitle,
  defaultBody = "",
  source,
  audioDurationSeconds,
  submitLabel,
  pendingLabel = "Saving…",
  onRecordAgain,
  recordLabel = "Record again",
  onDiscard,
  onTitleChange,
  onBodyChange,
  titleTransitionName,
}: EntryFormProps) {
  const [state, formAction, pending] = useActionState(action, null);
  const [body, setBody] = useState(defaultBody);
  const words = body.trim() ? body.trim().split(/\s+/).length : 0;

  const titleInput = (
    <Input
      name="title"
      defaultValue={defaultTitle ?? ""}
      onChange={(e) => onTitleChange?.(e.target.value)}
      placeholder="Give it a name…"
      aria-label="Title"
      maxLength={120}
      className="h-auto border-0 border-b border-border bg-transparent px-0 pb-2 text-subhead font-semibold tracking-tight shadow-none focus-visible:border-foreground focus-visible:ring-0 rounded-none placeholder:text-cta placeholder:font-normal placeholder:text-muted-foreground/60 dark:bg-transparent md:text-editor-title md:placeholder:text-subhead"
    />
  );

  return (
    <form action={formAction} className="flex w-full flex-col gap-5">
      {entryId ? <input type="hidden" name="id" value={entryId} /> : null}
      <input type="hidden" name="source" value={source} />
      {audioDurationSeconds != null ? (
        <input
          type="hidden"
          name="audioDurationSeconds"
          value={String(audioDurationSeconds)}
        />
      ) : null}

      <div className="grid gap-1.5">
        {titleTransitionName && defaultTitle ? (
          <ViewTransition
            name={titleTransitionName}
            share="title-morph"
            default="none"
          >
            {titleInput}
          </ViewTransition>
        ) : (
          titleInput
        )}
        {state?.fieldErrors?.title?.[0] ? (
          <p role="alert" className="text-sm/tight text-rec">
            {state.fieldErrors.title[0]}
          </p>
        ) : null}
      </div>

      <div className="grid gap-1.5">
        <Textarea
          name="body"
          value={body}
          onChange={(e) => {
            setBody(e.target.value);
            onBodyChange?.(e.target.value);
          }}
          autoFocus={!defaultBody}
          required
          aria-label="Dream"
          placeholder="Start with the last thing you remember…"
          className="max-h-[50dvh] min-h-60 w-full resize-none overflow-y-auto rounded-lg border border-border bg-card/60 p-4 text-sm text-foreground shadow-none md:text-lead"
        />
        <div className="flex items-center justify-between">
          <span className="tabular-nums text-xs text-muted-foreground">
            {words} {words === 1 ? "word" : "words"}
          </span>
          {state?.fieldErrors?.body?.[0] ? (
            <p role="alert" className="text-sm/tight text-rec">
              {state.fieldErrors.body[0]}
            </p>
          ) : null}
        </div>
      </div>

      {state?.error ? (
        <p role="alert" className="text-sm/tight text-rec">
          {state.error}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-4 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="pressable flex items-center rounded-full bg-primary px-6 py-2.5 text-control font-semibold text-primary-foreground disabled:opacity-60"
        >
          {pending ? pendingLabel : submitLabel}
        </button>
        {onRecordAgain ? (
          <button
            type="button"
            onClick={onRecordAgain}
            className="pressable text-control font-medium text-muted-foreground underline decoration-foreground/20 underline-offset-[5px]"
          >
            {recordLabel}
          </button>
        ) : null}
        {onDiscard ? (
          <button
            type="button"
            onClick={onDiscard}
            className="pressable text-control font-medium text-rec underline decoration-rec/30 underline-offset-[5px]"
          >
            Discard
          </button>
        ) : null}
      </div>
    </form>
  );
}
