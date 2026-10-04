// Preference order for MediaRecorder. webm/opus, mp4/aac and mp4 were verified
// against POST https://api.x.ai/v1/stt with real Chrome recordings; ogg/opus is
// kept for Firefox (Chrome can't produce it) since xAI lists ogg as accepted.
export const PREFERRED_MIME_TYPES = [
  "audio/webm;codecs=opus",
  "audio/ogg;codecs=opus",
  "audio/mp4;codecs=mp4a.40.2",
  "audio/mp4",
] as const;

const EXTENSIONS: [string, string][] = [
  ["mp4", "m4a"],
  ["ogg", "ogg"],
  ["webm", "webm"],
];

export function extensionFor(mime: string): string {
  return EXTENSIONS.find(([part]) => mime.includes(part))?.[1] ?? "wav";
}
