"use client";

import type { ReactNode } from "react";
import { PwaRegistration } from "@/features/pwa-registration";

type SiteProvidersProps = {
  children: ReactNode;
};

export function SiteProviders({ children }: SiteProvidersProps) {
  return (
    <>
      {children}
      <PwaRegistration />
    </>
  );
}
