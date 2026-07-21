// Plus 구독 페이지

import {
  BadgeCheck,
  CalendarDays,
  CreditCard,
  Info,
  LockKeyhole,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { SiteTopBar } from '@/shared/ui';

import type { PlusSubscription } from '@/entities/plus-subscription';
import { getPlusSubscription } from '@/entities/plus-subscription';

import { PlusPlanSelector } from './plus-plan-selector';

type SubscriptionInfoRowProps = {
  icon: typeof BadgeCheck;
  label: string;
  value: string;
};

type PlusPageCopy = {
  badge: string;
  description: string;
  guide: string;
  primaryAction: string;
  secondaryAction: string;
  title: string;
};

const PLUS_FEATURES = [
  '시각화된 리포트와 고급 분석',
  '루틴 템플릿과 재시작 가이드',
  '장기 보관과 데이터 내보내기',
] as const;

const PLUS_PAGE_COPY: Record<PlusSubscription['status'], PlusPageCopy> = {
  notSubscribed: {
    badge: '구독 전',
    title: 'Plus로 더 자세한 패턴을 확인해요',
    description: '무료 기능으로 시작하고, 필요할 때 고급 리포트와 템플릿을 열어보세요.',
    guide: '백엔드 연결 전 단계입니다. 플랜 선택과 결제 진입 흐름만 먼저 확인합니다.',
    primaryAction: 'Plus 구독하기',
    secondaryAction: '무료로 계속',
  },
  active: {
    badge: '구독 중',
    title: 'Plus가 활성화되어 있어요',
    description: '고급 리포트, 템플릿, 장기 보관 기능을 현재 플랜에서 사용할 수 있습니다.',
    guide: '구독 변경과 해지는 다크패턴 없이 명확한 경로로 제공하는 것을 원칙으로 합니다.',
    primaryAction: '구독 변경',
    secondaryAction: '무료로 전환',
  },
  canceled: {
    badge: '구독 취소',
    title: 'Plus가 곧 만료돼요',
    description: '남은 이용 기간까지 Plus 기능을 사용할 수 있고, 원하면 다시 시작할 수 있습니다.',
    guide: '구독 취소 후에도 무료 기능은 계속 사용할 수 있습니다. 만료 전 재시작할 수 있어요.',
    primaryAction: 'Plus 다시 시작',
    secondaryAction: '무료로 계속',
  },
};

function formatBillingDate(date?: string) {
  if (!date) {
    return '미정';
  }

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

function SubscriptionSummary({ subscription }: { subscription: PlusSubscription }) {
  if (subscription.status === 'notSubscribed') {
    return (
      <section className="rounded-[var(--radius-xxl)] bg-[var(--color-surface-container-lowest)] px-6 py-6 shadow-[var(--shadow-card)]">
        <h3 className="text-lg font-semibold text-[var(--color-on-surface)]">
          Plus에서 열리는 기능
        </h3>
        <ul className="mt-5 grid gap-3">
          {PLUS_FEATURES.map((feature) => (
            <li
              key={feature}
              className="flex items-center gap-3 text-sm text-[var(--color-on-surface-variant)]"
            >
              <span
                className="grid size-8 shrink-0 place-items-center rounded-full bg-[var(--ds-premium)] text-[var(--ds-premium-ink)]"
                aria-hidden="true"
              >
                <Sparkles size={16} strokeWidth={1.8} />
              </span>
              {feature}
            </li>
          ))}
        </ul>
      </section>
    );
  }

  return (
    <section
      aria-label="Plus 구독 정보"
      className="rounded-[var(--radius-xxl)] bg-[var(--color-surface-container-lowest)] px-6 py-6 shadow-[var(--shadow-card)]"
    >
      <ul className="grid gap-3">
        <SubscriptionInfoRow
          icon={BadgeCheck}
          label="현재 플랜"
          value={subscription.planName ?? 'Plus'}
        />
        <SubscriptionInfoRow
          icon={CalendarDays}
          label={subscription.status === 'canceled' ? '이용 종료일' : '다음 갱신일'}
          value={formatBillingDate(subscription.currentPeriodEnd ?? subscription.nextBillingDate)}
        />
        <SubscriptionInfoRow
          icon={CreditCard}
          label="결제 수단"
          value={subscription.paymentMethod ?? '미등록'}
        />
        <SubscriptionInfoRow
          icon={subscription.status === 'canceled' ? RotateCcw : LockKeyhole}
          label={subscription.status === 'canceled' ? '상태' : '해지'}
          value={
            subscription.status === 'canceled'
              ? `취소됨 ${formatBillingDate(subscription.canceledAt)}`
              : subscription.canCancel
                ? '언제든 가능'
                : '문의 필요'
          }
        />
      </ul>
    </section>
  );
}

export async function PlusSubscriptionPage() {
  const subscription = await getPlusSubscription();
  const copy = PLUS_PAGE_COPY[subscription.status];

  return (
    <main className="flex min-h-screen flex-col gap-8 px-5 py-4">
      {/* TODO: 페이지 헤더 영역 추후 분리 필요*/}
      <SiteTopBar title="Plus 구독" backHref="/settings" />

      <section className="grid justify-items-center gap-5 rounded-[var(--radius-xxl)] bg-[var(--color-surface-container-low)] px-7 py-8 text-center shadow-[var(--shadow-card)]">
        <span
          className="grid size-14 place-items-center rounded-full bg-[var(--ds-premium)] text-[var(--ds-premium-ink)]"
          aria-hidden="true"
        >
          <Sparkles size={28} strokeWidth={1.8} />
        </span>

        <div>
          <p className="mb-3 text-xs font-semibold text-[var(--ds-premium-ink)]">
            {copy.badge}
          </p>
          <h2 className="text-[28px] font-semibold leading-9 text-[var(--color-on-surface)]">
            {copy.title}
          </h2>
          <p className="mt-4 text-sm leading-6 text-[var(--color-on-surface-variant)]">
            {copy.description}
          </p>
        </div>
      </section>

      <SubscriptionSummary subscription={subscription} />

      {subscription.status === 'notSubscribed' ? <PlusPlanSelector /> : null}

      <div className="rounded-[var(--radius-xxl)] bg-[var(--color-surface-container-low)] px-5 py-4">
        <p className="flex items-start gap-3 text-sm leading-6 text-[var(--color-primary)]">
          <Info size={20} className="mt-0.5 shrink-0" aria-hidden="true" />
          {copy.guide}
        </p>
      </div>

      {subscription.status !== 'notSubscribed' ? (
        <div className="mt-auto grid gap-4">
          <button type="button" className="site-button site-button--primary w-full">
            {copy.primaryAction}
          </button>
          <button type="button" className="site-button site-button--secondary w-full">
            {copy.secondaryAction}
          </button>
        </div>
      ) : null}
    </main>
  );
}
