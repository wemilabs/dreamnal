import { neon } from "@neondatabase/serverless";
import {
  decryptEntryField,
  encryptEntryField,
  parseEntryKey,
} from "../lib/crypto/entry-cipher.ts";
import { requestSymbols } from "../lib/symbols/extract-core.ts";

const dryRun = process.argv.includes("--dry-run");
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set");
}
const apiKey = process.env.XAI_API_KEY;
if (!apiKey && !dryRun) {
  throw new Error("XAI_API_KEY is not set");
}
const chatUrl =
  process.env.XAI_CHAT_URL ?? "https://api.x.ai/v1/chat/completions";
const masterKey = parseEntryKey(process.env.ENTRY_ENCRYPTION_KEY ?? "");
const sql = neon(databaseUrl, { fullResults: true });

type Row = {
  id: string;
  user_id: string;
  body: string;
  symbols: string | null;
};

const { rows } = await sql.query(
  "select id, user_id, body, symbols from dream_entries where symbols is null",
);

if (dryRun) {
  console.log(
    `total=${rows.length} extracted=0 failed=0 skipped_by_guard=0 (dry run)`,
  );
  process.exit(0);
}

let extracted = 0;
let failed = 0;
let skipped = 0;

for (const row of rows as Row[]) {
  try {
    const body = decryptEntryField(
      masterKey,
      row.user_id,
      row.id,
      "body",
      row.body,
    );
    const items = await requestSymbols({
      apiKey: apiKey ?? "",
      url: chatUrl,
      body,
    });
    const sealed = encryptEntryField(
      masterKey,
      row.user_id,
      row.id,
      "symbols",
      JSON.stringify({ v: 1, source: "ai", items }),
    );
    const { rowCount } = await sql.query(
      "update dream_entries set symbols = $1 where id = $2 and symbols is null and body = $3",
      [sealed, row.id, row.body],
    );
    if (rowCount === 0) {
      skipped += 1;
      continue;
    }
    extracted += 1;
  } catch {
    failed += 1;
  }
}

console.log(
  `total=${rows.length} extracted=${extracted} failed=${failed} skipped_by_guard=${skipped}`,
);
