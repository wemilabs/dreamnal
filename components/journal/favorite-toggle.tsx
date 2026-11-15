"use client";

import { Star } from "lucide-react";
import { useTranslations } from "next-intl";
import { useActionState } from "react";
import { setFavorite } from "@/app/[locale]/journal/[id]/favorite-actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function FavoriteToggle({
  id,
  favorite,
}: {
  id: string;
  favorite: boolean;
}) {
  const t = useTranslations("Entry");
  const [state, formAction, pending] = useActionState(setFavorite, null);

  return (
    <form action={formAction} className="flex flex-col items-end gap-1">
      <input type="hidden" name="id" value={id} />
      <input
        type="hidden"
        name="favorite"
        value={favorite ? "false" : "true"}
      />
      <Button
        type="submit"
        variant="ghost"
        size="icon-lg"
        disabled={pending}
        aria-pressed={favorite}
        aria-label={favorite ? t("unmarkFavorite") : t("markFavorite")}
        title={favorite ? t("unmarkFavorite") : t("markFavorite")}
        data-testid="favorite-toggle"
        className="pressable shrink-0"
      >
        <Star
          className={cn(
            "size-4",
            favorite
              ? "fill-amber-400 text-amber-400"
              : "text-muted-foreground",
          )}
          aria-hidden
        />
      </Button>
      {state?.error ? (
        <p role="alert" className="text-sm/tight text-rec">
          {state.error}
        </p>
      ) : null}
    </form>
  );
}
