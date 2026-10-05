"use client";

import { ChevronsUpDown, LogOut, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { signOut } from "@/app/auth/actions";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenuButton } from "@/components/ui/sidebar";

export function NavUserClient({
  name,
  email,
}: {
  name: string;
  email: string;
}) {
  const { resolvedTheme, setTheme } = useTheme();
  const initials = name.trim()
    ? name
        .trim()
        .split(/\s+/)
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : (email[0]?.toUpperCase() ?? "?");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Account menu"
        render={
          <SidebarMenuButton size="lg">
            <Avatar className="size-8 bg-petal">
              <AvatarFallback className="bg-petal font-display text-xs font-semibold text-ink">
                {initials}
              </AvatarFallback>
            </Avatar>
            <span className="flex min-w-0 flex-1 flex-col items-start leading-tight">
              <span className="truncate text-sm font-medium">
                {name || "Dreamer"}
              </span>
              <span className="truncate font-mono text-xs text-muted-foreground">
                {email}
              </span>
            </span>
            <ChevronsUpDown className="ml-auto" aria-hidden />
          </SidebarMenuButton>
        }
      />
      <DropdownMenuContent side="top" align="start" sideOffset={6}>
        <DropdownMenuGroup>
          <DropdownMenuLabel>
            <span className="flex flex-col gap-0.5">
              <span className="text-sm font-medium text-foreground">
                {name || "Dreamer"}
              </span>
              <span className="font-mono text-xs">{email}</span>
            </span>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() =>
              setTheme(resolvedTheme === "dark" ? "light" : "dark")
            }
          >
            <Sun className="dark:hidden" aria-hidden />
            <Moon className="hidden dark:block" aria-hidden />
            Toggle theme
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => signOut()}>
            <LogOut aria-hidden />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
