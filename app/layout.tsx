import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Geist_Mono, Hanken_Grotesk } from "next/font/google";
import { Suspense } from "react";
import { PwaRegistrar } from "@/components/pwa/pwa-registrar";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

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

export const metadata: Metadata = {
  metadataBase: new URL("https://dreamnal.vercel.app"),
  applicationName: "Dreamnal",
  title: {
    default: "Dreamnal | Say it before it fades",
    template: "%s | Dreamnal",
  },
  description:
    "Record your dreams the moment you wake. Dreamnal transcribes your voice into a journal entry you can edit and keep.",
  twitter: { card: "summary_large_image" },
  formatDetection: { telephone: false },
  appleWebApp: {
    capable: true,
    title: "Dreamnal",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  viewportFit: "cover",
  maximumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#e8ebee" },
    { media: "(prefers-color-scheme: dark)", color: "#0d1420" },
  ],
};

export default function RootLayout({ children, auth }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${bodoni.variable} ${hanken.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          {auth}
        </ThemeProvider>
        <PwaRegistrar />
        <Suspense fallback={null}>
          <Analytics />
        </Suspense>
      </body>
    </html>
  );
}
