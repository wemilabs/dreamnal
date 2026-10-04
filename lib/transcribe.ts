import "server-only";

import { z } from "zod";
import { env } from "./env";

const sttResponse = z.object({
  text: z.string(),
  language: z.string().optional(),
  duration: z.number().default(0),
});

export async function transcribeAudio(
  file: File,
): Promise<{ text: string; duration: number }> {
  const form = new FormData();
  // xAI requires `file` to be the last multipart field
  form.set("file", file, file.name || "audio");

  const res = await fetch(env.XAI_API_BASE_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${env.XAI_API_KEY}` },
    body: form,
  });

  if (!res.ok) {
    console.error("xAI STT failed:", res.status, await res.text());
    throw new Error("Transcription failed, try again");
  }

  const parsed = sttResponse.safeParse(await res.json());
  if (!parsed.success) {
    console.error("xAI STT unexpected response:", parsed.error.message);
    throw new Error("Transcription failed, try again");
  }
  return { text: parsed.data.text, duration: parsed.data.duration };
}
