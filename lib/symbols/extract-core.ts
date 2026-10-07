import { z } from "zod";
import {
  cleanItems,
  SYMBOL_KINDS,
  type SymbolItem,
  symbolItem,
} from "./schema.ts";

const SYSTEM_PROMPT = `You extract labels from a dream journal entry. You label; you never interpret.

Return up to 12 items. Each item has a kind and a label:
- person: a person or being in the dream ("my mother", "a stranger", "the dog")
- place: a place or setting ("my childhood home", "a beach")
- thing: an object, element or event ("water", "a closed door", "a train")
- feeling: an emotion the dreamer states or clearly shows ("fear", "joy")

Rules:
- Only include things the dream text actually mentions. Do not infer anything that is not written.
- Write each label in the same language as the dream. Keep it short (1 to 4 words), lowercase and singular.
- Keep a descriptive word only when the dream gives it and it matters ("a closed door", not "a door" plus "closed").
- Merge repeated mentions of the same thing into one item.
- Do not explain, interpret or summarize. Do not add symbolic, spiritual, religious or psychological meanings or categories.
- If nothing fits, return an empty list.`;

const SCHEMA = {
  type: "object",
  properties: {
    items: {
      type: "array",
      maxItems: 12,
      items: {
        type: "object",
        properties: {
          kind: { type: "string", enum: [...SYMBOL_KINDS] },
          label: { type: "string", minLength: 1, maxLength: 60 },
        },
        required: ["kind", "label"],
        additionalProperties: false,
      },
    },
  },
  required: ["items"],
  additionalProperties: false,
};

const chatResponse = z.object({
  choices: z
    .array(z.object({ message: z.object({ content: z.string() }) }))
    .min(1),
});

const itemsResponse = z.object({ items: z.array(symbolItem) });

export async function requestSymbols({
  apiKey,
  url,
  body,
}: {
  apiKey: string;
  url: string;
  body: string;
}): Promise<SymbolItem[]> {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "grok-4.3",
      temperature: 0,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: body },
      ],
      response_format: {
        type: "json_schema",
        json_schema: { name: "dream_symbols", strict: true, schema: SCHEMA },
      },
    }),
  });

  if (!res.ok) {
    throw new Error(`symbols request failed: ${res.status}`);
  }

  const parsed = itemsResponse.safeParse(
    JSON.parse(chatResponse.parse(await res.json()).choices[0].message.content),
  );
  if (!parsed.success) {
    throw new Error("symbols response malformed");
  }
  return cleanItems(parsed.data.items, 12);
}
