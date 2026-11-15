"use client";

import { BookOpen, Feather } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function FavoriteTabs({
  dreams,
  whispers,
}: {
  dreams: ReactNode;
  whispers: ReactNode;
}) {
  const t = useTranslations("Journal");

  return (
    <Tabs defaultValue="dreams">
      <TabsList aria-label={t("navFavorites")}>
        <TabsTrigger value="dreams" data-testid="favorites-tab-dreams">
          <BookOpen aria-hidden />
          {t("favoritesTabDreams")}
        </TabsTrigger>
        <TabsTrigger value="whispers" data-testid="favorites-tab-whispers">
          <Feather aria-hidden />
          {t("favoritesTabWhispers")}
        </TabsTrigger>
      </TabsList>
      <TabsContent value="dreams" keepMounted className="mt-6">
        {dreams}
      </TabsContent>
      <TabsContent value="whispers" keepMounted className="mt-6">
        {whispers}
      </TabsContent>
    </Tabs>
  );
}
