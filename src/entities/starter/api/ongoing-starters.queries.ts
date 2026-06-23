import type { OngoingStarter } from '@/entities/starter';

// Starter 관련 레코드 임의로 정의
export const MOCK_ONGOING_STARTERS = [
  {
    id: 'starter-meditation',
    title: '명상: 저녁의 고요함',
    startedAt: '2026-06-19T20:00:00+09:00',
    durationMinutes: 15,
    status: 'IN_PROGRESS'
  },
  {
    id: 'starter-journal',
    title: '일기: 오늘의 작은 성취',
    startedAt: '2026-06-19T22:00:00+09:00',
    durationMinutes: 5,
    status: 'IN_PROGRESS'
  }
] satisfies OngoingStarter[];

// 임의로 정의한 진행 중인 스타터 목록을 반환하는 함수
export async function getOngoingStarters(): Promise<
  OngoingStarter[]
> {
  return MOCK_ONGOING_STARTERS;
}