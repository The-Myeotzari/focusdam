import type { LucideIcon } from 'lucide-react';

export type WeeklyReviewMetric = {
  id: string;
  label: string;
  value: string;
  description: string;
  tone: 'success' | 'caution' | 'premium' | 'surface';
};

export type WeeklyReviewPlusFeature = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

export type WeeklyReviewInsightSection = {
  id: string;
  subject: string;
  value: string;
  description: string;
};

export type WeeklyReviewInsight = {
  id: string;
  menu: '할일' | '소비' | '감정' | '대화';
  badge: string;
  title: string;
  description: string;
  accent: 'blue' | 'orange' | 'pink' | 'mint' | 'purple';
  sections: WeeklyReviewInsightSection[];
};

export type WeeklyReviewGoal = {
  title: string;
  description: string;
  progressLabel: string;
  completed: number;
  total: number;
};

export type WeeklyReviewRecommendation = {
  title: string;
  description: string;
  actions: WeeklyReviewMetric[];
};

export type WeeklyReview = {
  weekLabel: string;
  summary: {
    title: string;
    description: string;
    savedAmount: string;
    startedCount: string;
  };
  summaryMetrics: WeeklyReviewMetric[];
  plusFeatures: WeeklyReviewPlusFeature[];
  insights: WeeklyReviewInsight[];
  goal: WeeklyReviewGoal;
  recommendation: WeeklyReviewRecommendation;
};

export type WeeklyReviewListItem = {
  id: string;
  year: number;
  month: number;
  weekLabel: string;
  title: string;
  description: string;
  savedAmount: string;
  startedCount: string;
  returnRate: string;
  href: string;
  plusHref: string;
};
