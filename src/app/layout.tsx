import type { Metadata, Viewport } from "next";
import { SiteProviders } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "focusdam",
    template: "%s | focusdam"
  },
  description: "A Next.js app scaffolded with FSD and PWA basics.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "focusdam"
  },
  icons: {
    icon: "/icon.svg",
    apple: "/apple-touch-icon.svg"
  }
};

export const viewport: Viewport = {
  themeColor: "#2f6f5e"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <SiteProviders>{children}</SiteProviders>
      </body>
    </html>
  );
}
