import { NavUserClient } from "@/components/journal/sidebar/nav-user-client";
import { getCurrentUser } from "@/lib/auth/session";

export async function NavUser() {
  const user = await getCurrentUser();
  return <NavUserClient name={user.name} email={user.email} />;
}
