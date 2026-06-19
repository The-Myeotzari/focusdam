import type { FocusMetrics } from '@/entities/focus-metrics';

// 홈 화면 통계 카드 전용 API - 임시
export const MOCK_FOCUS_METRICS: FocusMetrics = {
  startRate: 75,
  averageTimeErrorMinutes: 18,
  savedAmount: 42000,
};

export async function getFocusMetrics(): Promise<FocusMetrics> {
  return MOCK_FOCUS_METRICS;
}
