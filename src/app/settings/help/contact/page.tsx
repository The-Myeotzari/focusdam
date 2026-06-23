import type { Metadata } from 'next';
import { ChevronLeft, CircleHelp, Mail } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '계정·결제·오류 문의',
};

const CONTACT_GUIDE_SECTIONS = [
  {
    id: 'account-help',
    title: '계정 문제',
    contents: [
      '로그인이 되지 않거나 소셜 로그인 계정이 헷갈리는 경우, 사용한 이메일과 로그인 제공자 정보를 먼저 확인해 주세요.',
      '계정 삭제를 요청하면 복구가 어려울 수 있으므로, 삭제 전에 필요한 데이터는 먼저 내보내 주세요.',
      '선택 동의, 알림 설정, 데이터 관리 내역은 설정 화면에서 직접 확인할 수 있습니다.',
    ],
  },
  {
    id: 'billing-help',
    title: '결제 및 구독 문제',
    contents: [
      'Plus 구독 상태, 다음 갱신일, 결제 수단은 Plus 구독 관리 화면에서 확인할 수 있습니다.',
      '앱 스토어 또는 결제 플랫폼을 통해 결제한 경우, 환불과 결제 취소는 해당 플랫폼 정책을 따를 수 있습니다.',
      '결제 문의 시 결제일, 결제 수단, 영수증 또는 주문 번호를 함께 준비하면 확인이 더 빠릅니다.',
    ],
  },
  {
    id: 'error-help',
    title: '오류 신고',
    contents: [
      '앱이 멈추거나 화면이 다르게 보이면 문제가 발생한 화면 이름과 발생 시간을 기록해 주세요.',
      '가능하다면 오류 화면 캡처, 사용 중인 기기, OS 버전, 앱 버전을 함께 전달해 주세요.',
      '반복되는 오류는 로그 확인이 필요할 수 있으며, 재현 경로가 자세할수록 원인 파악이 쉬워집니다.',
    ],
  },
  {
    id: 'before-contact',
    title: '문의 전 확인할 것',
    contents: [
      'FAQ에 이미 답변이 있는지 확인해 주세요.',
      '앱을 최신 버전으로 업데이트한 뒤에도 문제가 계속되는지 확인해 주세요.',
      '개인정보나 결제 정보 전체를 문의 내용에 직접 적지 말고, 필요한 경우 담당자가 안전한 방식으로 추가 확인을 요청합니다.',
    ],
  },
] as const;

const CONTACT_TYPES = [
  '로그인/계정',
  'Plus 구독/결제',
  '데이터 내보내기/삭제',
  '알림/설정 오류',
  '기타 오류',
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

        <h1 className="flex-1 text-center text-[24px] leading-8">계정/결제/오류</h1>
        <span className="min-w-11" aria-hidden="true" />
      </header>

      <section className="rounded-[var(--radius-xxl)] bg-[var(--color-surface-container-low)] px-8 py-8 shadow-[var(--shadow-card)]">
        <span
          className="grid size-12 place-items-center rounded-full bg-[var(--ds-success)] text-[var(--ds-success-ink)]"
          aria-hidden="true"
        >
          <CircleHelp size={24} strokeWidth={1.8} />
        </span>
        <h2 className="mt-5 text-[26px] font-medium leading-9 text-[var(--color-on-surface)]">
          문의 전 필요한 정보를 정리해요
        </h2>
        <p className="mt-4 text-sm leading-6 text-[var(--color-on-surface-variant)]">
          계정, 결제, 오류 문의는 상황과 재현 정보를 함께 남기면 더 빠르게 확인할 수 있습니다.
        </p>
      </section>

      <section aria-labelledby="contact-type-title">
        <h2
          id="contact-type-title"
          className="mb-3 px-1 text-sm font-semibold text-[var(--color-on-surface)]"
        >
          문의 유형
        </h2>
        <ul className="grid grid-cols-2 gap-2">
          {CONTACT_TYPES.map((type) => (
            <li
              key={type}
              className="rounded-full bg-[var(--color-surface-container-lowest)] px-4 py-3 text-center text-xs font-semibold text-[var(--color-on-surface-variant)] shadow-[var(--shadow-card)]"
            >
              {type}
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-[var(--radius-xxl)] bg-[var(--color-surface-container-lowest)] px-5 py-6 shadow-[var(--shadow-card)]">
        <p className="text-xs font-semibold text-[var(--ds-success-ink)]">문의 가이드 초안</p>
        <h2 className="mt-2 text-xl font-semibold text-[var(--color-on-surface)]">
          어떤 정보를 준비하면 좋나요?
        </h2>

        <div className="mt-6 grid gap-6">
          {CONTACT_GUIDE_SECTIONS.map((section) => (
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
          href="mailto:support@focusdam.app"
          className="site-button site-button--primary w-full gap-2"
        >
          <Mail size={18} aria-hidden="true" />
          문의 메일 보내기
        </a>
        <Link href="/settings/help/faq" className="site-button site-button--secondary w-full">
          FAQ 먼저 보기
        </Link>
      </div>
    </main>
  );
}
