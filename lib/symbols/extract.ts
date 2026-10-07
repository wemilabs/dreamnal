import "server-only";

import { env } from "@/lib/env";
import { requestSymbols } from "./extract-core";

export function extractSymbols(body: string) {
  return requestSymbols({
    apiKey: env.XAI_API_KEY,
    url: env.XAI_CHAT_URL,
    body,
  });
}
