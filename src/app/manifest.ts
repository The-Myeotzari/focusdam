import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "집중이담",
    short_name: "집중이담",
    description: "ADHD와 실행곤란 사용자를 위한 10분 단위 자기관리 PWA",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#faf9fc",
    theme_color: "#3c5f7c",
    icons: [
      {
        src: "/logo_128.png",
        sizes: "128x128",
        type: "image/png",
        purpose: "any"
      },
      {
        src: "/logo_192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable"
      },
      {
        src: "/logo_512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable"
      }
    ]
  };
}
