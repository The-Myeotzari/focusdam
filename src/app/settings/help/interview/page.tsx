import type { Metadata } from 'next';
import { CalendarCheck, ChevronLeft, Mail } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '인터뷰 신청',
};

const INTERVIEW_GUIDE_SECTIONS = [
  {
    id: 'interview-purpose',
    title: '1. 인터뷰 목적',
    contents: [
      '집중이담은 ADHD 성향, 실행 지연, 감정 기복, 충동 소비 등으로 일상 관리에 어려움을 느끼는 사용자의 실제 경험을 듣고 제품을 개선합니다.',
      '인터뷰는 사용자를 평가하거나 진단하기 위한 과정이 아니라, 앱의 흐름과 표현, 알림 방식이 실제로 도움이 되는지 확인하기 위한 대화입니다.',
    ],
  },
  {
    id: 'interview-topic',
    title: '2. 이야기할 수 있는 주제',
    contents: [
      '할 일을 시작하기 어려운 순간과 도움이 되었던 방식',
      '감정 기록, 소비 기록, 집중 기록을 사용할 때 부담스럽거나 편했던 점',
      '알림이 도움이 되는 타이밍과 방해로 느껴지는 타이밍',
      '설정, 데이터 관리, 약관·안전 안내에서 더 명확했으면 하는 부분',
    ],
  },
  {
    id: 'interview-duration',
    title: '3. 진행 방식',
    contents: [
      '인터뷰는 보통 20~40분 정도를 예상합니다.',
      '온라인 화상 통화 또는 텍스트 기반 대화 방식으로 진행할 수 있습니다.',
      '참여자는 답하기 어려운 질문에 답하지 않아도 되며, 언제든 중단을 요청할 수 있습니다.',
    ],
  },
  {
    id: 'interview-privacy',
    title: '4. 개인정보와 기록',
    contents: [
      '인터뷰 신청에는 연락 가능한 이메일, 가능한 시간대, 이야기하고 싶은 주제 정도의 최소 정보만 요청하는 것을 원칙으로 합니다.',
      '인터뷰 내용은 제품 개선 목적으로만 활용하며, 외부 공개가 필요한 경우 별도의 동의를 받습니다.',
      '민감한 진단명, 치료 이력, 결제 정보, 주민등록번호 등은 인터뷰 신청 단계에서 요청하지 않습니다.',
    ],
  },
  {
    id: 'interview-not-medical',
    title: '5. 상담이나 치료가 아님',
    contents: [
      '인터뷰는 의료 상담, 심리상담, 진단, 치료가 아닙니다.',
      '위기 상황이 있거나 즉각적인 도움이 필요하다면 인터뷰 신청보다 전문기관 또는 긴급 신고가 우선입니다.',
    ],
  },
] as const;

const INTERVIEW_APPLICATION_FIELDS = [
  '연락 가능한 이메일',
  '가능한 시간대',
  '관심 있는 주제',
  '사용 중 불편했던 화면',
] as const;

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col gap-8 px-5 py-4">
      {/* TODO: 페이지 헤더 영역 추후 분리 필요*/}
      <header className="flex items-center gap-3">
        <Link
          href="/settings/help"
          aria-label="도움말·피드백으로 돌아가기"
          className="grid size-11 place-items-center rounded-full"
        >
          <ChevronLeft size={24} aria-hidden="true" />
        </Link>

        <h1 className="flex-1 text-center text-[24px] leading-8">인터뷰 신청</h1>
        <span className="min-w-11" aria-hidden="true" />
      </header>

      <section className="rounded-[var(--radius-xxl)] bg-[var(--color-surface-container-low)] px-8 py-8 shadow-[var(--shadow-card)]">
        <span
          className="grid size-12 place-items-center rounded-full bg-[var(--ds-safety)] text-[var(--ds-safety-ink)]"
          aria-hidden="true"
        >
          <CalendarCheck size={24} strokeWidth={1.8} />
        </span>
        <h2 className="mt-5 text-[26px] font-medium leading-9 text-[var(--color-on-surface)]">
          사용자의 실제 경험을 들려주세요
        </h2>
        <p className="mt-4 text-sm leading-6 text-[var(--color-on-surface-variant)]">
          짧은 인터뷰를 통해 집중이담이 더 부담 없고 안전한 습관 코치가 되도록 개선합니다.
        </p>
      </section>

      <section aria-labelledby="interview-fields-title">
        <h2
          id="interview-fields-title"
          className="mb-3 px-1 text-sm font-semibold text-[var(--color-on-surface)]"
        >
          신청 시 준비할 정보
        </h2>
        <ul className="grid grid-cols-2 gap-2">
          {INTERVIEW_APPLICATION_FIELDS.map((field) => (
            <li
              key={field}
              className="rounded-full bg-[var(--color-surface-container-lowest)] px-4 py-3 text-center text-xs font-semibold text-[var(--color-on-surface-variant)] shadow-[var(--shadow-card)]"
            >
              {field}
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-[var(--radius-xxl)] bg-[var(--color-surface-container-lowest)] px-5 py-6 shadow-[var(--shadow-card)]">
        <p className="text-xs font-semibold text-[var(--ds-safety-ink)]">베타 참여 안내</p>
        <h2 className="mt-2 text-xl font-semibold text-[var(--color-on-surface)]">
          인터뷰는 이렇게 진행돼요
        </h2>

        <div className="mt-6 grid gap-6">
          {INTERVIEW_GUIDE_SECTIONS.map((section) => (
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
        <a
          href="mailto:research@focusdam.app"
          className="site-button site-button--primary w-full gap-2"
        >
          <Mail size={18} aria-hidden="true" />
          인터뷰 신청 메일 보내기
        </a>
        <Link
          href="/settings/terms-safety/crisis-contact"
          className="site-button site-button--secondary w-full"
        >
          위기 안내 먼저 보기
        </Link>
      </div>
    </main>
  );
}
