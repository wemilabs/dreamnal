"use client";

import { CommandLoading, defaultFilter } from "cmdk";
import { BookOpen, Mic, Moon, PenLine, Sun } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useEffectEvent,
  useState,
} from "react";
import { getSearchEntries } from "@/app/[locale]/journal/actions";
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
import { useRouter } from "@/i18n/navigation";
import type { AppHref } from "@/i18n/paths";
import {
  DREAM_VALUE_PREFIX,
  matchSnippet,
  type SearchEntry,
  scoreDream,
} from "@/lib/dream-search";
import { titleFallback } from "@/lib/format";

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
  const t = useTranslations("Journal");
  const [open, setOpenState] = useState(false);
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState<SearchEntry[] | null>(null);
  const router = useRouter();
  const { startRecording, startTyping } = useComposer();
  const { resolvedTheme, setTheme } = useTheme();

  const setOpen = (next: boolean) => {
    setOpenState(next);
    if (next) {
      getSearchEntries().then(setEntries, () => {});
    } else {
      setSearch("");
    }
  };

  const onShortcut = useEffectEvent((event: KeyboardEvent) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      setOpen(!open);
    }
  });

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => onShortcut(event);
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const close = () => setOpen(false);

  return (
    <CommandMenuContext.Provider value={{ open, setOpen }}>
      {children}
      <CommandDialog
        className="top-1/2 -translate-y-1/2 sm:top-1/3 sm:translate-y-0 md:top-[20svh] md:max-w-2xl md:rounded-2xl!"
        open={open}
        onOpenChange={setOpen}
      >
        <Command
          className="md:**:data-[slot=command-group]:p-2 md:**:data-[slot=command-input-wrapper]:p-2 md:**:data-[slot=command-input-wrapper]:pb-0 md:**:data-[slot=command-input]:text-base md:**:data-[slot=command-item]:gap-3 md:**:data-[slot=command-item]:px-3 md:**:data-[slot=command-item]:py-2 md:**:data-[slot=input-group]:h-12! md:[&_[data-slot=input-group]_svg]:size-5"
          filter={(value, search, keywords) =>
            value.startsWith(DREAM_VALUE_PREFIX)
              ? scoreDream(search, keywords ?? [])
              : defaultFilter(value, search, keywords)
          }
        >
          <CommandInput
            placeholder={t("commandPlaceholder")}
            value={search}
            onValueChange={setSearch}
          />
          <CommandList className="max-h-[min(18rem,45svh)] overscroll-contain md:max-h-[min(28rem,60svh)]">
            <CommandEmpty>
              {entries === null && search.trim() !== "" ? "" : t("noResults")}
            </CommandEmpty>
            {entries === null && search.trim() !== "" && (
              <CommandLoading className="py-6 text-center text-sm text-muted-foreground">
                {t("searchingDreams")}
              </CommandLoading>
            )}
            {search.trim() !== "" && entries !== null && (
              <CommandGroup heading={t("commandDreams")}>
                {entries.map((e) => {
                  const title = e.title ?? titleFallback(e.body);
                  const snippet = matchSnippet(e.body, search);
                  return (
                    <CommandItem
                      key={e.id}
                      value={`${DREAM_VALUE_PREFIX}${e.id}`}
                      keywords={[title, e.body, ...e.labels]}
                      onSelect={() => {
                        close();
                        router.push(`/journal/${e.id}` as AppHref);
                      }}
                    >
                      <BookOpen aria-hidden />
                      <div className="min-w-0">
                        <div className="truncate">{title}</div>
                        {snippet !== null && (
                          <div className="line-clamp-1 text-xs text-muted-foreground">
                            {snippet}
                          </div>
                        )}
                      </div>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            )}
            <CommandGroup heading={t("commandActions")}>
              <CommandItem
                value={t("recordDream")}
                keywords={["record a dream"]}
                onSelect={() => {
                  close();
                  startRecording();
                }}
              >
                <Mic aria-hidden />
                {t("recordDream")}
              </CommandItem>
              <CommandItem
                value={t("typeDream")}
                keywords={["type a dream"]}
                onSelect={() => {
                  close();
                  startTyping();
                }}
              >
                <PenLine aria-hidden />
                {t("typeDream")}
              </CommandItem>
              <CommandItem
                value={t("toggleTheme")}
                keywords={["toggle theme"]}
                onSelect={() => {
                  close();
                  setTheme(resolvedTheme === "dark" ? "light" : "dark");
                }}
              >
                <Sun className="dark:hidden" aria-hidden />
                <Moon className="hidden dark:block" aria-hidden />
                {t("toggleTheme")}
              </CommandItem>
            </CommandGroup>
            <CommandGroup heading={t("goTo")}>
              {JOURNAL_NAV_LINKS.map((item) => {
                const title = t(item.titleKey);
                return (
                  <CommandItem
                    key={item.href}
                    value={title}
                    onSelect={() => {
                      close();
                      router.push(item.href);
                    }}
                  >
                    <item.icon aria-hidden />
                    {title}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </CommandMenuContext.Provider>
  );
}
