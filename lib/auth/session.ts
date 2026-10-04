import "server-only";

import { redirect } from "next/navigation";
import { cache } from "react";
import { auth } from "./server";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
};

export const getCurrentUser = cache(async (): Promise<SessionUser> => {
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
});
