export const QUERY_KEYS = {
  paymentThirdReviews: {
    list: (outcomeType: 'all' | 'buy' | 'hold' | 'save') =>
      ['payment-third-reviews', 'list', outcomeType] as const,
  },
  user: {
    current: ["user", "current"] as const,
  },
} as const;
