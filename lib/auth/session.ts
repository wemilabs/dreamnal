import "server-only";

import { redirect } from "@/i18n/redirect";
import { auth } from "./server";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
};

export async function getCurrentUser(): Promise<SessionUser> {
  "use cache: private";

  const { data: session } = await auth.getSession();
  const user = session?.user;
  if (!user) {
    redirect("/auth/sign-in");
  }
  return {
    id: user.id,
    name: user.name ?? "",
    email: user.email ?? "",
  };
}
