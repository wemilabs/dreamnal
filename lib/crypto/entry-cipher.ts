import {
  createCipheriv,
  createDecipheriv,
  hkdfSync,
  randomBytes,
} from "node:crypto";

export type EntryField = "title" | "body";

const KEY_INFO = "dreamnal:entries:v1";
const IV_BYTES = 12;
const TAG_BYTES = 16;
const ENCRYPTED_FIELD = /^v1\.[A-Za-z0-9_-]{16}\.[A-Za-z0-9_-]+$/;

export function parseEntryKey(base64: string): Buffer {
  const key = Buffer.from(base64, "base64");
  if (key.length !== 32) {
    throw new Error("entry key must be base64 for exactly 32 bytes");
  }
  return key;
}

export function isEncryptedField(stored: string): boolean {
  return ENCRYPTED_FIELD.test(stored);
}

export function encryptEntryField(
  masterKey: Buffer,
  userId: string,
  entryId: string,
  field: EntryField,
  plaintext: string,
): string {
  const iv = randomBytes(IV_BYTES);
  const cipher = createCipheriv(
    "aes-256-gcm",
    entryKey(masterKey, userId),
    iv,
    {
      authTagLength: TAG_BYTES,
    },
  );
  cipher.setAAD(Buffer.from(`${entryId}:${field}`));
  const payload = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
    cipher.getAuthTag(),
  ]);
  return `v1.${iv.toString("base64url")}.${payload.toString("base64url")}`;
}

export function decryptEntryField(
  masterKey: Buffer,
  userId: string,
  entryId: string,
  field: EntryField,
  stored: string,
): string {
  if (!isEncryptedField(stored)) {
    return stored;
  }
  const [, ivPart, payloadPart] = stored.split(".");
  const payload = Buffer.from(payloadPart, "base64url");
  const decipher = createDecipheriv(
    "aes-256-gcm",
    entryKey(masterKey, userId),
    Buffer.from(ivPart, "base64url"),
    { authTagLength: TAG_BYTES },
  );
  decipher.setAAD(Buffer.from(`${entryId}:${field}`));
  decipher.setAuthTag(payload.subarray(payload.length - TAG_BYTES));
  return Buffer.concat([
    decipher.update(payload.subarray(0, payload.length - TAG_BYTES)),
    decipher.final(),
  ]).toString("utf8");
}

function entryKey(masterKey: Buffer, userId: string): Buffer {
  return Buffer.from(hkdfSync("sha256", masterKey, KEY_INFO, userId, 32));
}
