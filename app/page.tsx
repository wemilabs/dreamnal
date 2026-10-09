import type { Metadata } from "next";
import { Footer } from "@/components/landing/footer";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { NightCta } from "@/components/landing/night-cta";

export const metadata: Metadata = {
  title: { absolute: "Dreamnal | Say it before it fades" },
  description:
    "Record your dreams the moment you wake. Dreamnal transcribes your voice into a journal entry you can edit and keep.",
};

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
