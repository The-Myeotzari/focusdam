// Plus 구독 페이지

import {
  BadgeCheck,
  CalendarDays,
  ChevronLeft,
  CreditCard,
  Info,
  LockKeyhole,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';

import { getPlusSubscription } from '@/entities/plus-subscription';

type SubscriptionInfoRowProps = {
  icon: typeof BadgeCheck;
  label: string;
  value: string;
};

function formatBillingDate(date: string) {
  return date.replaceAll('-', '.');
}

function SubscriptionInfoRow({ icon: Icon, label, value }: SubscriptionInfoRowProps) {
  return (
    <li className="flex min-h-[72px] items-center gap-4">
      <span
        className="grid size-10 shrink-0 place-items-center rounded-full bg-[var(--color-surface-container-low)] text-[var(--color-primary)]"
        aria-hidden="true"
      >
        <Icon size={20} strokeWidth={1.8} />
      </span>

      <span className="text-base font-medium text-[var(--color-on-surface)]">{label}</span>
      <strong className="ml-auto text-base font-semibold text-[var(--color-on-surface)]">
        {value}
      </strong>
    </li>
  );
}

export async function PlusSubscriptionPage() {
  const subscription = await getPlusSubscription();

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

        <h1 className="flex-1 text-center text-[24px] leading-8">Plus 구독</h1>

        <Link
          href="/settings"
          className="min-w-11 text-right text-sm font-semibold text-[var(--color-on-surface-variant)]"
        >
          Skip
        </Link>
      </header>

      <section className="grid justify-items-center gap-5 text-center">
        <span
          className="grid size-14 place-items-center rounded-full bg-[var(--ds-premium)] text-[var(--ds-premium-ink)]"
          aria-hidden="true"
        >
          <Sparkles size={28} strokeWidth={1.8} />
        </span>

        <div>
          <h2 className="text-[30px] font-semibold leading-10 text-[var(--color-on-surface)]">
            Plus 구독
          </h2>
          <p className="mt-4 text-sm leading-7 text-[var(--color-on-surface-variant)]">
            플랜, 갱신일, 해지 방법을 투명하게 보여줍니다.
            <br />
            집중이담은 사용자의 성장을 언제나 지지합니다.
          </p>
        </div>
      </section>

      <section
        aria-label="Plus 구독 정보"
        className="rounded-[var(--radius-xxl)] bg-[var(--color-surface-container-lowest)] px-6 py-6 shadow-[var(--shadow-card)]"
      >
        <ul className="grid gap-3">
          <SubscriptionInfoRow
            icon={BadgeCheck}
            label="현재 플랜"
            value={subscription.planName}
          />
          <SubscriptionInfoRow
            icon={CalendarDays}
            label="다음 갱신일"
            value={formatBillingDate(subscription.nextBillingDate)}
          />
          <SubscriptionInfoRow
            icon={CreditCard}
            label="결제 수단"
            value={subscription.paymentMethod}
          />
          <SubscriptionInfoRow
            icon={LockKeyhole}
            label="해지"
            value={subscription.canCancel ? '언제든 가능' : '문의 필요'}
          />
        </ul>
      </section>

      <div className="rounded-[var(--radius-xxl)] bg-[var(--color-surface-container-low)] px-5 py-4">
        <p className="flex items-start gap-3 text-sm leading-6 text-[var(--color-primary)]">
          <Info size={20} className="mt-0.5 shrink-0" aria-hidden="true" />
          다크패턴 없이 해지/다운그레이드 경로를 제공하여 투명한 구독 환경을 약속합니다.
          언제든 마음 편히 조정하세요.
        </p>
      </div>

      <div className="mt-auto grid gap-4">
        <button type="button" className="site-button site-button--primary w-full">
          구독 변경
        </button>
        <button type="button" className="site-button site-button--secondary w-full">
          무료로 전환
        </button>
      </div>
    </main>
  );
}
