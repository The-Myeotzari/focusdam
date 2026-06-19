// 신규 유저 전용 '추천 작은 행동' 랜덤 출력 함수

import { RECOMMENDED_ACTIONS } from '@/features/create-starter';

export function getRandomRecommendedAction() {
  const randomIndex = Math.floor(Math.random() * RECOMMENDED_ACTIONS.length);

  return RECOMMENDED_ACTIONS[randomIndex];
}
