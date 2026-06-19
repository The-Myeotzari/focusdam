// Starter 상태 관련 타입 임의로 정의
export type StarterStatus =
  | 'READY'
  | 'IN_PROGRESS'
  | 'COMPLETED';

  // Starter 레코드 관련 타입 임의로 정의
export type OngoingStarter = {
  id: string;
  title: string;
  startedAt: string;
  durationMinutes: number;
  status: 'IN_PROGRESS';
};