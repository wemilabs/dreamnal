import { pgSchema, uuid } from "drizzle-orm/pg-core";

export const neonAuth = pgSchema("neon_auth");

export const authUsers = neonAuth.table("user", {
  id: uuid("id").primaryKey(),
});
