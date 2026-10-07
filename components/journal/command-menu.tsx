"use client";

import { Mic, Moon, PenLine, Sun } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useComposer } from "@/components/journal/composer/composer-provider";
import { JOURNAL_NAV_LINKS } from "@/components/journal/sidebar/nav-items";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

type CommandMenuContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const CommandMenuContext = createContext<CommandMenuContextValue | null>(null);

export function useCommandMenu() {
  const context = useContext(CommandMenuContext);
  if (!context) {
    throw new Error("useCommandMenu must be used within CommandMenuProvider");
  }
  return context;
}

export function CommandMenuProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { startRecording, startTyping } = useComposer();
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((v) => !v);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const close = () => setOpen(false);

  return (
    <CommandMenuContext.Provider value={{ open, setOpen }}>
      {children}
      <CommandDialog
        className="top-1/2 -translate-y-1/2 sm:top-1/3 sm:translate-y-0"
        open={open}
        onOpenChange={setOpen}
      >
        <Command>
          <CommandInput placeholder="Search dreams, pages, actions…" />
          <CommandList className="max-h-[min(18rem,45svh)] overscroll-contain">
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Actions">
              <CommandItem
                value="record a dream"
                onSelect={() => {
                  close();
                  startRecording();
                }}
              >
                <Mic aria-hidden />
                Record a dream
              </CommandItem>
              <CommandItem
                value="type a dream"
                onSelect={() => {
                  close();
                  startTyping();
                }}
              >
                <PenLine aria-hidden />
                Type a dream
              </CommandItem>
              <CommandItem
                value="toggle theme"
                onSelect={() => {
                  close();
                  setTheme(resolvedTheme === "dark" ? "light" : "dark");
                }}
              >
                <Sun className="dark:hidden" aria-hidden />
                <Moon className="hidden dark:block" aria-hidden />
                Toggle theme
              </CommandItem>
            </CommandGroup>
            <CommandGroup heading="Go to">
              {JOURNAL_NAV_LINKS.map((item) => (
                <CommandItem
                  key={item.href}
                  value={item.title}
                  onSelect={() => {
                    close();
                    router.push(item.href);
                  }}
                >
                  <item.icon aria-hidden />
                  {item.title}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </CommandMenuContext.Provider>
  );
}
