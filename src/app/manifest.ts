import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "focusdam",
    short_name: "focusdam",
    description: "A Next.js app scaffolded with FSD and PWA basics.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#f6f3ee",
    theme_color: "#2f6f5e",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable"
      },
      {
        src: "/apple-touch-icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any"
      }
    ]
  };
}
