import type { LucideIcon } from 'lucide-react';

export type PaymentReviewOverview = {
  goalAmount: string;
  currentSpend: string;
  progressLabel: string;
};

export type SummaryCard = {
  title: string;
  value?: string;
  description: string;
  icon: LucideIcon;
  tone: string;
};
