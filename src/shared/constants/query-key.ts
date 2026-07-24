export const QUERY_KEYS = {
  paymentThirdReviews: {
    all: ['payment-third-reviews'] as const,
    activeGoal: ['payment-third-reviews', 'active-goal'] as const,
    home: ['payment-third-reviews', 'home'] as const,
    list: (outcomeType: 'all' | 'buy' | 'hold' | 'save') =>
      ['payment-third-reviews', 'list', outcomeType] as const,
    detail: (id: string) => ['payment-third-reviews', 'detail', id] as const,
  },
  user: {
    current: ["user", "current"] as const,
  },
} as const;
