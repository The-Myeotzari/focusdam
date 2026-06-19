// 기존 유저 홈화면 2열 2행 버튼 및 통계 모음

import { Clock3, PiggyBank, TrendingUp } from 'lucide-react';

import { FocusMetricCard, getFocusMetrics } from '@/entities/focus-metrics';
import { CreateStarterCard } from '@/features/create-starter';

export async function HomeMetricCard() {
  const metrics = await getFocusMetrics();

  return (
    <section className="grid grid-cols-2 gap-4" aria-label="나의 집중 지표">
      <CreateStarterCard className="mt-4 w-full !rounded-[32px]" />

      <FocusMetricCard
        icon={TrendingUp}
        iconClassName="bg-[#e8f5e9] text-[#3c9149]"
        label="착수율"
        value={`${metrics.startRate}%`}
        description="지난주보다 좋아졌어요"
        descriptionClassName="text-[#3c9149]"
      />

      <FocusMetricCard
        icon={Clock3}
        iconClassName="bg-[#fff8e1] text-[#f2a526]"
        label="평균 시간 오차"
        value={`${metrics.averageTimeErrorMinutes}분`}
        description="예측 정확도가 높아지고 있어요"
        descriptionClassName="text-[#f2a526]"
      />

      <FocusMetricCard
        icon={PiggyBank}
        iconClassName="bg-[#e1f5fe] text-[#178dce]"
        label="보류로 아낀 금액"
        value={`${metrics.savedAmount.toLocaleString('ko-KR')}원`}
        description="충동 소비를 잘 막았어요"
        descriptionClassName="text-[#178dce]"
      />
    </section>
  );
}
