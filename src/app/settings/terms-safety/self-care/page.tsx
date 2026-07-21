import type { Metadata } from 'next';
import { SiteTopBar } from '@/shared/ui';

export const metadata: Metadata = {
  title: '자기관리 보조',
};

const SELF_CARE_SECTIONS = [
  {
    id: 'self-care-purpose',
    title: '1. 자기관리 보조의 목적',
    contents: [
      '집중이담은 ADHD 성향, 주의 전환 어려움, 실행 지연, 감정 기복, 충동 소비 등으로 일상 관리에 어려움을 느끼는 사용자를 돕는 습관 코치 앱입니다.',
      '서비스는 사용자가 자신의 상태를 알아차리고, 작은 행동을 시작하며, 루틴을 이어갈 수 있도록 기록과 알림, 코칭 문구를 제공합니다.',
    ],
  },
  {
    id: 'self-care-not-medical',
    title: '2. 의료행위가 아님',
    contents: [
      '집중이담은 의료기기, 진단 도구, 치료 서비스, 전문 상담 서비스가 아닙니다.',
      '앱에서 제공하는 기록, 알림, 분석, 코칭 문구는 ADHD 진단, 약물 치료, 심리상담, 정신건강 치료를 대체하지 않습니다.',
      '앱의 안내는 사용자의 자기관리와 습관 형성을 돕기 위한 참고 정보입니다.',
    ],
  },
  {
    id: 'self-care-supported',
    title: '3. 앱이 도울 수 있는 것',
    contents: [
      '해야 할 일을 작게 나누고 시작 시점을 떠올리도록 돕습니다.',
      '감정, 소비, 집중 상태를 기록하여 사용자가 자신의 패턴을 돌아볼 수 있게 돕습니다.',
      '알림과 리마인더를 통해 사용자가 정한 루틴을 다시 떠올릴 수 있게 돕습니다.',
      '선택 동의 범위 안에서 기록을 정리하고, 사용자가 스스로 조정할 수 있는 설정을 제공합니다.',
    ],
  },
  {
    id: 'self-care-limits',
    title: '4. 앱이 할 수 없는 것',
    contents: [
      '집중이담은 사용자의 건강 상태를 진단하거나 증상의 원인을 판단하지 않습니다.',
      '집중이담은 약물 복용, 치료 계획, 상담 방향, 금융 의사결정, 법률 판단을 대신하지 않습니다.',
      '집중이담의 알림은 긴급 대응 수단이 아니며, 사용자의 안전을 직접 확인하거나 구조를 보장하지 않습니다.',
    ],
  },
  {
    id: 'self-care-when-help',
    title: '5. 전문가 도움이 필요한 경우',
    contents: [
      '주의력 문제, 충동성, 우울, 불안, 수면 문제, 감정 조절 어려움이 일상생활에 큰 영향을 주는 경우 전문가 상담을 권장합니다.',
      '자해 생각, 극심한 불안, 통제하기 어려운 충동, 위험한 상황이 있다면 앱의 안내를 기다리지 말고 즉시 전문기관이나 신뢰할 수 있는 사람에게 도움을 요청해야 합니다.',
      '이미 치료나 상담을 받고 있다면 앱의 기록을 참고 자료로 활용할 수 있지만, 치료 방향은 담당 전문가와 상의해야 합니다.',
    ],
  },
  {
    id: 'self-care-user-choice',
    title: '6. 사용자의 선택과 조정',
    contents: [
      '사용자는 알림, 선택 동의, 기록 저장 여부를 자신의 상황에 맞게 조정할 수 있습니다.',
      '앱의 제안이 부담스럽거나 맞지 않는다고 느껴지면 해당 기능을 끄거나 사용을 중단할 수 있습니다.',
      '집중이담은 사용자를 통제하기보다 사용자가 스스로 조절할 수 있는 환경을 제공하는 것을 목표로 합니다.',
    ],
  },
] as const;

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col gap-8 px-5 py-4">
      <SiteTopBar title="자기관리 보조" backHref="/settings/terms-safety" />

      <section className="rounded-[var(--radius-xxl)] bg-[var(--color-surface-container-lowest)] px-5 py-6 shadow-[var(--shadow-card)]">
        <p className="text-xs font-semibold text-[var(--ds-safety-ink)]">
          안전 안내
        </p>
        <h2 className="mt-2 text-xl font-semibold text-[var(--color-on-surface)]">
          의료행위가 아닌 습관 코칭 보조
        </h2>
        <p className="mt-3 text-xs leading-5 text-[var(--color-on-surface-variant)]">
          집중이담은 ADHD 습관 코치 앱으로, 사용자의 자기관리와 실행을 돕는 보조 도구입니다.
          진단이나 치료를 대신하지 않습니다.
        </p>

        <div className="mt-6 grid gap-6">
          {SELF_CARE_SECTIONS.map((section) => (
            <section key={section.id} aria-labelledby={section.id}>
              <h3
                id={section.id}
                className="text-sm font-semibold text-[var(--color-on-surface)]"
              >
                {section.title}
              </h3>
              <ul className="mt-3 grid gap-2">
                {section.contents.map((content) => (
                  <li
                    key={content}
                    className="pl-3 text-xs leading-6 text-[var(--color-on-surface-variant)] before:mr-2 before:content-['•']"
                  >
                    {content}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}
