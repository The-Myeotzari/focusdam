'use client';

import { CheckCircle2 } from 'lucide-react';
import { useMemo, useState } from 'react';

const PLUS_PLAN_OPTIONS = [
  {
    id: 'monthly',
    name: '월간 Plus',
    price: '4,900원',
    period: '월',
    badge: '가볍게 시작',
    description: '필요한 달에만 Plus 기능을 사용해요.',
  },
  {
    id: 'yearly',
    name: '연간 Plus',
    price: '49,000원',
    period: '년',
    badge: '추천',
    description: '꾸준히 사용할 계획이라면 더 합리적이에요.',
  },
] as const;

type PlusPlanId = (typeof PLUS_PLAN_OPTIONS)[number]['id'];

export function PlusPlanSelector() {
  const [selectedPlanId, setSelectedPlanId] = useState<PlusPlanId>('yearly');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const selectedPlan = useMemo(
    () => PLUS_PLAN_OPTIONS.find((plan) => plan.id === selectedPlanId) ?? PLUS_PLAN_OPTIONS[0],
    [selectedPlanId],
  );

  function subscribeSelectedPlan() {
    setStatusMessage(`${selectedPlan.name} 결제 연결 전 단계입니다.`);
  }

  return (
    <section aria-labelledby="plus-plan-title" className="grid gap-4">
      <div>
        <h3 id="plus-plan-title" className="text-lg font-semibold text-[var(--color-on-surface)]">
          플랜 선택
        </h3>
        <p className="mt-1 text-sm leading-6 text-[var(--color-on-surface-variant)]">
          실제 결제 API 연결 전까지 선택 흐름만 먼저 준비해요.
        </p>
      </div>

      <div className="grid gap-3" role="radiogroup" aria-label="Plus 플랜">
        {PLUS_PLAN_OPTIONS.map((plan) => {
          const isSelected = selectedPlanId === plan.id;

          return (
            <button
              key={plan.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => {
                setSelectedPlanId(plan.id);
                setStatusMessage(null);
              }}
              className={`flex min-h-[112px] items-center gap-4 rounded-[var(--radius-xxl)] border px-5 py-4 text-left shadow-[var(--shadow-card)] transition-colors ${
                isSelected
                  ? 'border-[var(--color-primary)] bg-[var(--color-primary-container)]'
                  : 'border-transparent bg-[var(--color-surface-container-lowest)]'
              }`}
            >
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2">
                  <strong className="text-base font-semibold text-[var(--color-on-surface)]">
                    {plan.name}
                  </strong>
                  <span className="rounded-full bg-[var(--ds-premium)] px-2.5 py-1 text-xs font-semibold text-[var(--ds-premium-ink)]">
                    {plan.badge}
                  </span>
                </span>

                <span className="mt-2 block text-sm leading-5 text-[var(--color-on-surface-variant)]">
                  {plan.description}
                </span>
              </span>

              <span className="grid justify-items-end gap-2">
                <span className="text-lg font-semibold text-[var(--color-on-surface)]">
                  {plan.price}
                  <span className="text-sm font-medium text-[var(--color-on-surface-variant)]">
                    /{plan.period}
                  </span>
                </span>
                {isSelected ? (
                  <CheckCircle2 size={22} className="text-[var(--color-primary)]" />
                ) : null}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-2 grid gap-4">
        <button
          type="button"
          onClick={subscribeSelectedPlan}
          className="site-button site-button--primary w-full"
        >
          {selectedPlan.name} 구독하기
        </button>
        <button
          type="button"
          onClick={() => setStatusMessage('무료 플랜으로 계속 이용합니다.')}
          className="site-button site-button--secondary w-full"
        >
          무료로 계속
        </button>
        <p
          aria-live="polite"
          className="min-h-5 text-center text-xs text-[var(--color-on-surface-variant)]"
        >
          {statusMessage}
        </p>
      </div>
    </section>
  );
}
