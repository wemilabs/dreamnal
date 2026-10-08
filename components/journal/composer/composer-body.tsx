"use client";

import { ComposerError } from "@/components/journal/composer/composer-error";
import { useComposer } from "@/components/journal/composer/composer-provider";
import { IosMicHint } from "@/components/journal/composer/ios-mic-hint";
import { TranscribingCard } from "@/components/journal/composer/transcribing-card";
import { EntryForm } from "@/components/journal/entry-form";
import { RecordingCard } from "@/components/journal/recording-card";

function MicWaiting() {
  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex items-center gap-2.5">
        <span className="rec-dot size-2 shrink-0 rounded-full bg-fold" />
        <span className="text-sm/tight font-semibold text-foreground">
          Waiting for the microphone…
        </span>
      </div>
      <IosMicHint />
    </div>
  );
}

export function ComposerBody() {
  const composer = useComposer();
  const { state } = composer;

  if (state.phase === "starting") {
    return <MicWaiting />;
  }

  if (state.phase === "recording") {
    return (
      <RecordingCard
        analyserRef={composer.analyserRef}
        startedAtRef={composer.startedAtRef}
        onDone={composer.finishRecording}
        onCancel={composer.cancelRecording}
      />
    );
  }

  if (state.phase === "transcribing") {
    return <TranscribingCard />;
  }

  if (state.phase === "editing") {
    return (
      <EntryForm
        action={composer.saveEntry}
        defaultTitle={state.draftTitle}
        defaultBody={state.draftBody}
        onTitleChange={(title) => composer.onDraftChange({ title })}
        onBodyChange={(body) => composer.onDraftChange({ body })}
        source={state.source}
        audioDurationSeconds={state.duration}
        submitLabel="Save entry"
        onRecordAgain={() =>
          composer.startRecording({ day: state.backdateDay ?? undefined })
        }
        recordLabel={state.transcript ? "Record again" : "Record instead"}
        onDiscard={composer.discard}
      />
    );
  }

  if (state.phase === "error") {
    return <ComposerError />;
  }

  return null;
}
