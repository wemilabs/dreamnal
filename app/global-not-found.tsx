import type { Metadata } from "next";
import { Bodoni_Moda, Geist_Mono, Hanken_Grotesk } from "next/font/google";
import { Link } from "@/i18n/navigation";
import messages from "@/messages/en.json";
import "./globals.css";

export const metadata: Metadata = {
  title: messages.NotFound.metadataTitle,
  description: messages.NotFound.metadataDescription,
};

const bodoni = Bodoni_Moda({
  variable: "--font-bodoni",
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
});

const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400"],
});

export default function GlobalNotFound() {
  return (
    <html
      lang="en"
      className={`${bodoni.variable} ${hanken.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <div
          className="flex min-h-svh flex-col items-center justify-center gap-6 px-6 text-center"
          style={{ backgroundImage: "var(--hero-bg)" }}
        >
          <h1 className="font-display text-headline tracking-display text-foreground">
            {messages.NotFound.title}
          </h1>
          <p className="text-lead text-muted-foreground">
            {messages.NotFound.description}
          </p>
          <Link
            href="/journal"
            className="pressable flex items-center rounded-full bg-primary px-6 py-2.5 text-control font-semibold text-primary-foreground"
          >
            {messages.NotFound.back}
          </Link>
        </div>
      </body>
    </html>
  );
}
