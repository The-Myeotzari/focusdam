import type { LucideIcon } from 'lucide-react';

export type PaymentReviewOverview = {
  actionLabel: string;
  goalName: string;
  goalAmount: string;
  description: string;
  status: 'active' | 'achieved' | 'empty';
};

export type SummaryCard = {
  title: string;
  value?: string;
  description: string;
  icon: LucideIcon;
  tone: string;
};
