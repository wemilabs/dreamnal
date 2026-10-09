import { useTranslations } from "next-intl";
import { TypeInsteadButton } from "@/components/journal/record-dream-cta";

export function EmptyState() {
  const t = useTranslations("Journal");

  return (
    <div className="flex flex-col items-start gap-6 pt-6 md:pt-0">
      <h2 className="text-section-title font-semibold tracking-tight text-foreground">
        {t("emptyTitle")}
      </h2>
      <p className="text-lead text-muted-foreground">{t("emptyDescription")}</p>
      <p className="text-lead text-muted-foreground md:hidden">
        {t("emptyPromptBefore")}{" "}
        <TypeInsteadButton>{t("emptyPromptAction")}</TypeInsteadButton>.
      </p>
    </div>
  );
}
