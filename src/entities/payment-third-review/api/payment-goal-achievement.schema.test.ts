import { describe, expect, it } from 'vitest';

import { PaymentGoalAchievementSchema } from './payment-goal-achievement.schema';

const baseAchievement = {
  id: '40000000-0000-0000-0000-000000000001',
  goalId: '20000000-0000-0000-0000-000000000001',
  goalName: '여행비',
  targetAmount: 100000,
  achievedAmount: 110000,
  savedAmount: 20000,
  savedReviewCount: 3,
  triggerReviewId: '10000000-0000-0000-0000-000000000001',
  triggerStatus: 'save_completed' as const,
};

describe('PaymentGoalAchievementSchema', () => {
  it.each([
    '2026-07-24T10:00:00.000Z',
    '2026-07-24T10:00:00+00:00',
    '2026-07-24T19:00:00+09:00',
  ])('Supabase가 반환할 수 있는 시간 형식 %s을 허용한다', (achievedAt) => {
    expect(
      PaymentGoalAchievementSchema.safeParse({
        ...baseAchievement,
        achievedAt,
      }).success,
    ).toBe(true);
  });
});
