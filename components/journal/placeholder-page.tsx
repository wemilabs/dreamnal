import type { LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { PageFade } from "@/components/journal/page-fade";
import { Badge } from "@/components/ui/badge";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export function PlaceholderPage({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
}) {
  const t = useTranslations("Journal");
  return (
    <PageFade>
      <h1 className="text-page-title font-semibold tracking-tight text-foreground">
        {title}
      </h1>
      <Empty className="mt-8 rounded-lg border border-border border-dashed">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Icon aria-hidden />
          </EmptyMedia>
          <EmptyTitle>{title}</EmptyTitle>
          <EmptyDescription>{description}</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Badge variant="secondary">{t("comingSoon")}</Badge>
        </EmptyContent>
      </Empty>
    </PageFade>
  );
}
