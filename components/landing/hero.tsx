import Link from "next/link";
import { Header } from "./header";
import { LiveTranscriptCard } from "./live-transcript-card";
import { RecordCta } from "./record-cta";
import { TheFold } from "./the-fold";

export function Hero() {
  return (
    <section
      className="relative min-h-svh overflow-hidden"
      style={{ backgroundImage: "var(--hero-bg)" }}
    >
      <Header />
      <TheFold />
      <div className="relative z-10 flex flex-col gap-7 px-6 pt-16 lg:absolute lg:top-49 lg:left-16 lg:w-155 lg:p-0">
        <h1 className="flex flex-col gap-5 font-display">
          <span className="anim-rise block text-hero tracking-display text-foreground">
            Say it before
          </span>
          <span
            className="anim-rise flex items-baseline gap-6.5 text-hero"
            style={{ animationDelay: "70ms" }}
          >
            <span className="tracking-display text-foreground">it</span>
            <span className="italic tracking-[-0.03em] text-display-accent">
              fades.
            </span>
          </span>
        </h1>
        <p
          className="anim-rise max-w-117.5 text-lg leading-7.5 text-muted-foreground"
          style={{ animationDelay: "140ms" }}
        >
          Dreams slip away minutes after you wake. Press record, talk it through
          half-asleep, and Dreamnal writes it down for you, ready to edit and
          keep.
        </p>
        <div
          className="anim-rise flex flex-wrap items-center gap-x-6 gap-y-4 pt-2"
          style={{ animationDelay: "210ms" }}
        >
          <RecordCta tone="ink" href="/journal">
            Record a dream
          </RecordCta>
          <Link
            href="/journal"
            className="pressable text-[17px] font-medium leading-6 whitespace-nowrap text-foreground underline decoration-foreground/30 decoration-1 underline-offset-[5px]"
          >
            or type it instead
          </Link>
        </div>
      </div>
      <LiveTranscriptCard />
    </section>
  );
}
