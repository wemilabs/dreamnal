import type { Metadata } from "next";
import { CommandMenuProvider } from "@/components/journal/command-menu";
import { ComposerProvider } from "@/components/journal/composer/composer-provider";
import { RecordFab } from "@/components/journal/record-fab";
import { JournalSidebar } from "@/components/journal/sidebar/journal-sidebar";
import { TopBar } from "@/components/journal/top-bar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function JournalLayout({
  children,
  crumb,
}: LayoutProps<"/[locale]/journal">) {
  return (
    <ComposerProvider>
      <CommandMenuProvider>
        <TooltipProvider>
          <SidebarProvider
            defaultOpen
            className="bg-background font-sans text-foreground antialiased [font-synthesis:none]"
          >
            <JournalSidebar />
            <SidebarInset>
              <TopBar entryCrumb={crumb} />
              <div className="mx-auto w-full max-w-180 flex-1 px-6 pt-10 pb-24">
                {children}
              </div>
            </SidebarInset>
            <RecordFab />
          </SidebarProvider>
        </TooltipProvider>
      </CommandMenuProvider>
      <Toaster />
    </ComposerProvider>
  );
}
