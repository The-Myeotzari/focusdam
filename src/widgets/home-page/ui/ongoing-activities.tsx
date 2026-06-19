// 기존 유저 홈 화면 진행 중인 활동 위젯

import {
  getOngoingStarters,
  OngoingStarterItem
} from '@/entities/starter';

export async function OngoingActivities() {
  const starters = await getOngoingStarters();

  if (starters.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="ongoing-activity-title">
      <h2
        id="ongoing-activity-title"
        className="text-[22px] font-medium leading-[1.5] text-[var(--color-on-surface)]"
      >
        진행 중인 활동
      </h2>

      <div className="mt-4 grid gap-4">
        {starters.map((starter) => (
          <OngoingStarterItem
            key={starter.id}
            starter={starter}
          />
        ))}
      </div>
    </section>
  );
}