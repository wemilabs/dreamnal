import type { LucideIcon } from "lucide-react";
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
  return (
    <PageFade>
      <h1 className="font-display text-[44px] leading-tight tracking-display text-foreground">
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
          <Badge variant="secondary">Coming soon</Badge>
        </EmptyContent>
      </Empty>
    </PageFade>
  );
}
