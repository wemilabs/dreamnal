import { Trash2 } from "lucide-react";
import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/journal/placeholder-page";

export const metadata: Metadata = {
  title: "Trash",
};

export default function TrashPage() {
  return (
    <PlaceholderPage
      title="Trash"
      description="Deleted dreams live here until they’re gone for good."
      icon={Trash2}
    />
  );
}
