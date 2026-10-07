import { neon } from "@neondatabase/serverless";
import {
  encryptEntryField,
  isEncryptedField,
  parseEntryKey,
} from "../lib/crypto/entry-cipher.ts";

const dryRun = process.argv.includes("--dry-run");
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set");
}
const masterKey = parseEntryKey(process.env.ENTRY_ENCRYPTION_KEY ?? "");
const sql = neon(databaseUrl, { fullResults: true });

type Row = {
  id: string;
  user_id: string;
  title: string | null;
  body: string;
};

const { rows } = await sql.query(
  "select id, user_id, title, body from dream_entries",
);

let alreadyEncrypted = 0;
let encryptedNow = 0;
let skipped = 0;

for (const row of rows as Row[]) {
  const bodyEncrypted = isEncryptedField(row.body);
  const titleEncrypted = row.title === null || isEncryptedField(row.title);
  if (bodyEncrypted && titleEncrypted) {
    alreadyEncrypted += 1;
    continue;
  }

  const title =
    row.title === null || isEncryptedField(row.title)
      ? row.title
      : encryptEntryField(masterKey, row.user_id, row.id, "title", row.title);
  const body = bodyEncrypted
    ? row.body
    : encryptEntryField(masterKey, row.user_id, row.id, "body", row.body);

  if (!dryRun) {
    const { rowCount } = await sql.query(
      "update dream_entries set title = $1, body = $2 where id = $3 and body = $4",
      [title, body, row.id, row.body],
    );
    if (rowCount === 0) {
      skipped += 1;
      continue;
    }
  }
  encryptedNow += 1;
}

console.log(
  `total=${rows.length} already_encrypted=${alreadyEncrypted} encrypted_now=${encryptedNow} skipped_by_guard=${skipped}${dryRun ? " (dry run)" : ""}`,
);
