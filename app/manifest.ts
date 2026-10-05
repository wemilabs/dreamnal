import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Dreamnal",
    short_name: "Dreamnal",
    description:
      "Record your dreams the moment you wake. Dreamnal transcribes your voice into a journal entry you can edit and keep.",
    start_url: "/journal",
    display: "standalone",
    background_color: "#0d1420",
    theme_color: "#16233b",
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
  };
}
