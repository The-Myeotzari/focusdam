import type { Metadata } from 'next';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '전문기관/신뢰 연락처',
};

const CRISIS_CONTACT_SECTIONS = [
  {
    id: 'crisis-emergency',
    title: '1. 즉시 위험한 상황',
    contents: [
      '자해나 타해 위험이 있거나, 지금 혼자 있기 어렵다고 느껴진다면 앱의 안내를 기다리지 말고 즉시 112 또는 119에 연락하세요.',
      '주변에 신뢰할 수 있는 사람이 있다면 지금 바로 연락하고, 혼자 있지 않도록 도움을 요청하세요.',
      '집중이담은 긴급 구조나 실시간 안전 확인을 제공하지 않습니다.',
    ],
  },
  {
    id: 'crisis-public-lines',
    title: '2. 공공 상담 및 전문기관',
    contents: [
      '자살예방 상담전화 109: 자살 생각, 극심한 위기감, 삶을 포기하고 싶은 생각이 들 때 24시간 상담을 요청할 수 있습니다.',
      '보건복지상담센터 129: 보건·복지 지원, 정신건강 관련 도움 경로를 문의할 수 있습니다.',
      '청소년상담 1388: 청소년 또는 보호자가 위기, 학교, 가정, 정서 문제에 대해 상담을 받을 수 있습니다.',
      '여성긴급전화 1366: 폭력, 위기, 긴급 보호가 필요한 상황에서 상담과 지원을 요청할 수 있습니다.',
    ],
  },
  {
    id: 'crisis-trusted-contact',
    title: '3. 신뢰 연락처 정하기',
    contents: [
      '평소 위기 상황에 연락할 사람을 미리 정해두면 긴급한 순간에 도움을 요청하기가 더 쉬워집니다.',
      '가족, 친구, 동료, 담당 의사, 상담사, 학교 또는 직장 내 신뢰할 수 있는 사람을 후보로 정할 수 있습니다.',
      '가능하다면 “내가 연락하면 바로 받아주기”, “혼자 있지 않게 도와주기”, “필요하면 112/119에 함께 연락하기”처럼 구체적인 도움 방식을 미리 공유해 주세요.',
    ],
  },
  {
    id: 'crisis-adhd-support',
    title: '4. ADHD 성향과 위기 신호',
    contents: [
      'ADHD 성향이 있는 사용자는 실행 지연, 충동성, 감정 기복, 과부하 상황에서 도움 요청을 미루거나 놓칠 수 있습니다.',
      '충동적인 소비, 수면 붕괴, 극심한 자기비난, 관계 단절, 약속·업무의 반복 실패가 이어진다면 혼자 해결하려고 버티기보다 전문가와 상의하는 것을 권장합니다.',
      '집중이담의 기록은 패턴을 돌아보는 참고 자료일 뿐이며, 치료나 상담 방향은 전문가와 함께 결정해야 합니다.',
    ],
  },
  {
    id: 'crisis-app-limit',
    title: '5. 앱의 한계',
    contents: [
      '집중이담은 사용자의 현재 위치, 안전 상태, 생명 위험 여부를 실시간으로 확인하지 않습니다.',
      '앱의 알림이나 코칭 문구는 긴급 상황에서 전문기관의 도움을 대체할 수 없습니다.',
      '위험하다고 느껴지는 순간에는 앱보다 사람과 기관에 먼저 연결되는 것이 우선입니다.',
    ],
  },
] as const;

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col gap-8 px-5 py-4">
      {/* TODO: 페이지 헤더 영역 추후 분리 필요*/}
      <header className="flex items-center gap-3">
        <Link
          href="/settings/terms-safety"
          aria-label="약관·안전 안내로 돌아가기"
          className="grid size-11 place-items-center rounded-full"
        >
          <ChevronLeft size={24} aria-hidden="true" />
        </Link>

        <h1 className="flex-1 text-center text-[24px] leading-8">전문기관/신뢰 연락처</h1>
        <span className="min-w-11" aria-hidden="true" />
      </header>

      <section className="rounded-[var(--radius-xxl)] bg-[var(--ds-safety)] px-5 py-5">
        <p className="text-sm font-semibold leading-6 text-[var(--ds-safety-ink)]">
          지금 즉시 위험하다고 느껴진다면 앱을 닫고 112 또는 119에 연락하세요.
        </p>
      </section>

      <section className="rounded-[var(--radius-xxl)] bg-[var(--color-surface-container-lowest)] px-5 py-6 shadow-[var(--shadow-card)]">
        <p className="text-xs font-semibold text-[var(--ds-safety-ink)]">위기 안내</p>
        <h2 className="mt-2 text-xl font-semibold text-[var(--color-on-surface)]">
          사람과 기관에 먼저 연결되기
        </h2>
        <p className="mt-3 text-xs leading-5 text-[var(--color-on-surface-variant)]">
          집중이담은 자기관리 보조 앱입니다. 긴급 상황에서는 전문기관, 긴급 신고, 신뢰할 수
          있는 사람의 도움이 우선입니다.
        </p>

        <div className="mt-6 grid gap-6">
          {CRISIS_CONTACT_SECTIONS.map((section) => (
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

      <div className="grid gap-3">
        <a href="tel:112" className="site-button site-button--primary w-full">
          112 긴급 신고
        </a>
        <a href="tel:119" className="site-button site-button--secondary w-full">
          119 긴급 구조
        </a>
      </div>
    </main>
  );
}
