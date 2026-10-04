import { getCurrentUser } from "../../lib/auth/session";
import { UserMenuClient } from "./user-menu-client";

export async function UserMenu() {
  const user = await getCurrentUser();
  return <UserMenuClient name={user.name} email={user.email} />;
}
