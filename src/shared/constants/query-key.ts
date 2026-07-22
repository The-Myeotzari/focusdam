export const QUERY_KEYS = {
  paymentThirdReviews: {
    list: (outcomeType: 'all' | 'buy' | 'hold' | 'save') =>
      ['payment-third-reviews', 'list', outcomeType] as const,
    detail: (id: string) => ['payment-third-reviews', 'detail', id] as const,
  },
  user: {
    current: ["user", "current"] as const,
  },
} as const;
