"use server";

import { getCurrentUser } from "../../../lib/auth/session";
import { transcribeAudio } from "../../../lib/transcribe";

export type TranscribeResult =
  | { status: "ok"; text: string; duration: number }
  | { status: "error"; message: string };

export async function transcribeRecording(
  formData: FormData,
): Promise<TranscribeResult> {
  await getCurrentUser();

  const audio = formData.get("audio");
  if (
    !(audio instanceof File) ||
    audio.size === 0 ||
    audio.size > 24 * 1024 * 1024 ||
    !audio.type.startsWith("audio/")
  ) {
    return { status: "error", message: "Transcription failed, try again" };
  }

  try {
    const { text, duration } = await transcribeAudio(audio);
    if (!text.trim()) {
      return {
        status: "error",
        message:
          "We couldn’t hear anything. Try again a little closer to the mic.",
      };
    }
    return { status: "ok", text, duration };
  } catch {
    return { status: "error", message: "Transcription failed, try again" };
  }
}
