"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { PwaRegistration } from "@/features/pwa-registration";
import { PaymentThirdReviewRealtimeNotifications } from '@/features/payment-third-review-realtime-notifications';

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
      <PaymentThirdReviewRealtimeNotifications />
      <PwaRegistration />
    </QueryClientProvider>
  );
}
