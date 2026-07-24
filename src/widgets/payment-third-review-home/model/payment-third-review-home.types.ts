import type { LucideIcon } from 'lucide-react';

export type PaymentReviewOverview = {
  goalName: string;
  goalAmount: string;
  description: string;
};

export type SummaryCard = {
  title: string;
  value?: string;
  description: string;
  icon: LucideIcon;
  tone: string;
};
