// 데이터 관리 페이지

import { Download, FileText, Info, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { SiteTopBar } from '@/shared/ui';

type DataActionItemProps = {
  title: string;
  description: string;
  icon: typeof Download;
  badge: string;
  href?: string;
  tone: 'primary' | 'safety';
};

const ACTION_TONE_CLASS_NAMES: Record<DataActionItemProps['tone'], string> = {
  primary: 'bg-[var(--color-surface-container-low)] text-[var(--color-primary)]',
  safety: 'bg-[var(--ds-safety)] text-[var(--ds-safety-ink)]',
};

function DataActionItem({ badge, description, href, icon: Icon, title, tone }: DataActionItemProps) {
  const content = (
    <>
      <span
        className={`grid size-12 shrink-0 place-items-center rounded-full ${ACTION_TONE_CLASS_NAMES[tone]}`}
        aria-hidden="true"
      >
        <Icon size={22} strokeWidth={1.8} />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-base font-semibold text-[var(--color-on-surface)]">
          {title}
        </span>
        <span className="mt-1 block text-xs leading-5 text-[var(--color-on-surface-variant)]">
          {description}
        </span>
      </span>

      <span className="rounded-full bg-[var(--color-surface-container-low)] px-3 py-1 text-xs font-semibold text-[var(--color-on-surface-variant)]">
        {badge}
      </span>
    </>
  );

  if (href) {
    return (
      <li>
        <Link
          href={href}
          className="flex min-h-[88px] items-center gap-4 rounded-[var(--radius-xl)] bg-[var(--color-surface-container-lowest)] px-4 py-3 shadow-[var(--shadow-card)] transition-colors hover:bg-[var(--color-surface-container-low)] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-primary)]"
        >
          {content}
        </Link>
      </li>
    );
  }

  return (
    <li className="flex min-h-[88px] items-center gap-4 rounded-[var(--radius-xl)] bg-[var(--color-surface-container-lowest)] px-4 py-3 shadow-[var(--shadow-card)]">
      {content}
    </li>
  );
}

export function DataManagementPage() {
  return (
    <main className="flex min-h-screen flex-col gap-8 px-5 py-4">
      {/* TODO: 페이지 헤더 영역 추후 분리 필요*/}
      <SiteTopBar title="데이터 관리" backHref="/settings" />

      <section className="rounded-[var(--radius-xxl)] bg-[var(--color-surface-container-low)] px-8 py-8">
        <h2 className="text-[26px] font-medium leading-9 text-[var(--color-on-surface)]">
          내 데이터 관리
        </h2>
        <p className="mt-3 text-sm leading-6 text-[var(--color-on-surface-variant)]">
          기록을 내보내거나 삭제 요청할 수 있습니다.
        </p>
      </section>

      <section aria-label="데이터 관리 작업">
        <ul className="grid gap-4">
          <DataActionItem
            title="데이터 내보내기"
            description="나의 기록을 파일로 받아요."
            icon={Download}
            badge="CSV/PDF"
            href="/settings/data/export"
            tone="primary"
          />
          <DataActionItem
            title="기록 삭제"
            description="불필요한 기록을 삭제 요청해요."
            icon={Trash2}
            badge="기간 선택"
            tone="safety"
          />
        </ul>
      </section>

      <section className="grid gap-3">
        <div className="rounded-[var(--radius-xxl)] bg-[var(--color-surface-container-low)] px-5 py-4">
          <p className="flex items-start gap-3 text-xs leading-5 text-[var(--color-on-surface-variant)]">
            <Info size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
            삭제 요청이 처리된 기록은 복구할 수 없습니다. 필요한 데이터는 삭제 전에 먼저 내보내
            주세요.
          </p>
        </div>

        <details className="group rounded-[var(--radius-xxl)] bg-[var(--color-surface-container-lowest)] px-5 py-4 shadow-[var(--shadow-card)]">
          <summary className="flex cursor-pointer list-none items-center gap-3 text-sm font-semibold text-[var(--color-on-surface)]">
            <span
              className="grid size-9 shrink-0 place-items-center rounded-full bg-[var(--ds-caution)] text-[var(--ds-caution-ink)]"
              aria-hidden="true"
            >
              <FileText size={18} strokeWidth={1.8} />
            </span>
            관련 약관 보기
          </summary>
          <p className="mt-3 pl-12 text-xs leading-5 text-[var(--color-on-surface-variant)]">
            데이터 보관, 내보내기, 삭제 요청 처리 기준은 서비스 이용약관 및 개인정보 처리방침을
            따릅니다.
          </p>
        </details>
      </section>
    </main>
  );
}
