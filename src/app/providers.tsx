"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { PwaRegistration } from "@/features/pwa-registration";

type SiteProvidersProps = {
  children: ReactNode;
};

export function SiteProviders({ children }: SiteProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <PwaRegistration />
    </QueryClientProvider>
  );
}
