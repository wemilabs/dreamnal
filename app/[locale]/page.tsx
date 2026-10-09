import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Footer } from "@/components/landing/footer";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { NightCta } from "@/components/landing/night-cta";

export async function generateMetadata(): Promise<Metadata> {
  const landing = await getTranslations("Landing");
  const metadata = await getTranslations("Metadata");
  return {
    title: { absolute: landing("metadataTitle") },
    description: metadata("description"),
  };
}

export const ensureStatic = "navigation";

export default function Home() {
  return (
    <div className="bg-background font-sans text-foreground antialiased [font-synthesis:none]">
      <main>
        <Hero />
        <HowItWorks />
        <NightCta />
      </main>
      <Footer />
    </div>
  );
}
