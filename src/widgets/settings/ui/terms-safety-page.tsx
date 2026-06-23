// 약관·안전 안내 페이지

import {
  BriefcaseMedical,
  ChevronLeft,
  ChevronRight,
  FileText,
  Info,
  LockKeyhole,
  ShieldCheck,
} from 'lucide-react';
import Link from 'next/link';

type TermsSafetyItem = {
  description: string;
  href: string;
  icon: typeof FileText;
  title: string;
};

const TERMS_SAFETY_ITEMS: TermsSafetyItem[] = [
  {
    href: '#service-terms',
    title: '서비스 조건',
    description: '이용약관',
    icon: FileText,
  },
  {
    href: '#privacy-policy',
    title: '수집·보관·삭제',
    description: '개인정보처리방침',
    icon: LockKeyhole,
  },
  {
    href: '#self-care',
    title: '자기관리 보조',
    description: '의료행위 아님',
    icon: BriefcaseMedical,
  },
  {
    href: '#crisis-contact',
    title: '전문기관/신뢰 연락처',
    description: '위기 안내',
    icon: Info,
  },
];

function TermsSafetyMenuItem({ description, href, icon: Icon, title }: TermsSafetyItem) {
  return (
    <li>
      <Link
        href={href}
        className="flex min-h-[88px] items-center gap-4 rounded-[var(--radius-xl)] bg-[var(--color-surface-container-lowest)] px-5 py-4 shadow-[var(--shadow-card)] transition-colors hover:bg-[var(--color-surface-container-low)] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-primary)]"
      >
        <span
          className="grid size-12 shrink-0 place-items-center rounded-full bg-[var(--ds-safety)] text-[var(--ds-safety-ink)]"
          aria-hidden="true"
        >
          <Icon size={22} strokeWidth={1.8} />
        </span>

        <span className="min-w-0 flex-1">
          <span className="block text-xs font-medium text-[var(--color-on-surface-variant)]">
            {description}
          </span>
          <strong className="mt-1 block text-base font-semibold text-[var(--color-on-surface)]">
            {title}
          </strong>
        </span>

        <ChevronRight size={20} className="shrink-0 text-[var(--color-outline)]" />
      </Link>
    </li>
  );
}

export function TermsSafetyPage() {
  return (
    <main className="flex min-h-screen flex-col gap-8 px-5 py-4">
      {/* TODO: 페이지 헤더 영역 추후 분리 필요*/}
      <header className="flex items-center gap-3">
        <Link
          href="/settings"
          aria-label="설정으로 돌아가기"
          className="grid size-11 place-items-center rounded-full"
        >
          <ChevronLeft size={24} aria-hidden="true" />
        </Link>

        <h1 className="flex-1 text-center text-[24px] leading-8">약관·안전 안내</h1>

        <Link
          href="/settings"
          className="min-w-11 text-right text-sm font-semibold text-[var(--color-on-surface-variant)]"
        >
          Skip
        </Link>
      </header>

      <section className="overflow-hidden rounded-[var(--radius-xxl)] bg-[var(--ds-safety)] px-7 py-8">
        <div>
          <h2 className="text-[30px] font-medium leading-10 text-[var(--ds-safety-ink)]">
            안전하게
            <br />
            사용하기
          </h2>
          <p className="mt-5 max-w-[260px] text-base leading-7 text-[var(--ds-safety-ink)]">
            집중이담의 역할과 한계를 명확히 안내합니다.
          </p>
        </div>

        <div className="mt-8 flex justify-end">
          <span
            className="grid size-24 place-items-center rounded-full bg-white/60 text-[#ff8fa3]"
            aria-hidden="true"
          >
            <ShieldCheck size={44} fill="currentColor" strokeWidth={1.6} />
          </span>
        </div>
      </section>

      <section aria-label="약관 및 안전 안내 항목">
        <ul className="grid gap-4">
          {TERMS_SAFETY_ITEMS.map((item) => (
            <TermsSafetyMenuItem key={item.href} {...item} />
          ))}
        </ul>
      </section>

      <div className="rounded-[var(--radius-xxl)] bg-[var(--color-surface-container-low)] px-5 py-4">
        <p className="flex items-start gap-3 text-xs leading-5 text-[var(--color-on-surface-variant)]">
          <Info size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
          법적/윤리적 안전장치는 설정에서 재확인 가능합니다. 모든 내용은 귀하의 안전과
          성장을 우선합니다.
        </p>
      </div>

      <div className="mt-auto grid gap-3">
        <Link href="#crisis-contact" className="site-button site-button--primary w-full gap-2">
          <Info size={18} aria-hidden="true" />
          위기 안내 보기
        </Link>
        <Link href="#service-terms" className="site-button site-button--secondary w-full">
          약관 보기
        </Link>
      </div>
    </main>
  );
}
