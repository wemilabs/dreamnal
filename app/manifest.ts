import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/journal",
    name: "Dreamnal",
    short_name: "Dreamnal",
    description:
      "Record your dreams the moment you wake. Dreamnal transcribes your voice into a journal entry you can edit and keep.",
    lang: "en",
    dir: "ltr",
    start_url: "/journal",
    scope: "/",
    display: "standalone",
    background_color: "#0d1420",
    theme_color: "#16233b",
    categories: ["lifestyle", "health"],
    prefer_related_applications: false,
    launch_handler: { client_mode: "navigate-existing" },
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    screenshots: [
      {
        src: "/screenshots/journal-narrow.png",
        sizes: "390x844",
        type: "image/png",
        form_factor: "narrow",
        label: "Your dream journal",
      },
      {
        src: "/screenshots/journal-wide.png",
        sizes: "1280x800",
        type: "image/png",
        form_factor: "wide",
        label: "Your dream journal",
      },
    ],
  };
}
