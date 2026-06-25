import { Check, Circle, Zap } from 'lucide-react';

import type { PaymentImpulseStrength } from '@/features/create-payment-third-review/model/create-payment-third-review.draft';

type ChoiceCardProps = {
  checked?: boolean;
  description: string;
  onClick: () => void;
  title: string;
};

// 선택형 카드 UI를 공통 버튼 컴포넌트로 렌더링합니다.
export function ChoiceCard({ checked = false, description, onClick, title }: ChoiceCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'flex min-h-[88px] items-center gap-3 rounded-[28px] border bg-white p-4 text-left shadow-[0_4px_12px_rgba(0,0,0,0.04)]',
        checked ? 'border-[#3c5f7c]' : 'border-transparent',
      ].join(' ')}
      aria-pressed={checked}
    >
      <span
        className={[
          'grid size-11 shrink-0 place-items-center rounded-full',
          checked ? 'bg-[#dde3eb] text-[#3c5f7c]' : 'bg-[#f4f3f6] text-[#72777e]',
        ].join(' ')}
        aria-hidden="true"
      >
        {checked ? <Check size={19} strokeWidth={2.4} /> : <Circle size={19} strokeWidth={2.2} />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[17px] font-semibold leading-7 text-[#1a1c1e]">{title}</span>
        <span className="block text-sm leading-6 text-[#72777e]">{description}</span>
      </span>
    </button>
  );
}

type ImpulseStrengthCardProps = {
  value: PaymentImpulseStrength;
  onChange: (value: PaymentImpulseStrength) => void;
};

const impulseStrengthOptions: Array<{ label: string; value: PaymentImpulseStrength }> = [
  { label: '낮음', value: 'low' },
  { label: '보통', value: 'medium' },
  { label: '높음', value: 'high' },
];

// 결제 직전 충동 강도를 3단계 세그먼트 버튼으로 입력받습니다.
export function ImpulseStrengthCard({ onChange, value }: ImpulseStrengthCardProps) {
  return (
    <section
      className="grid gap-6 rounded-[32px] border border-[#c2c7ce4d] bg-white px-6 py-6 shadow-[0_12px_28px_rgba(60,95,124,0.08)]"
      aria-labelledby="impulse-strength-title"
    >
      <div className="flex items-center gap-4">
        <span
          className="grid size-12 shrink-0 place-items-center rounded-full bg-[#dde3eb4d] text-[#3c5f7c]"
          aria-hidden="true"
        >
          <Zap size={26} strokeWidth={2.2} />
        </span>
        <h2
          id="impulse-strength-title"
          className="text-[16px] font-semibold leading-6 text-[#72777e]"
        >
          충동 강도
        </h2>
      </div>
      <div className="grid grid-cols-3 gap-2.5" aria-label="충동 강도 선택">
        {impulseStrengthOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={[
              'min-h-11 rounded-full border px-3 text-[17px] font-semibold leading-6 transition-colors',
              value === option.value
                ? 'border-[#3c5f7c] bg-[#3c5f7c] text-white shadow-[0_0_0_7px_#dde3eb]'
                : 'border-[#c2c7ce66] bg-white text-[#595f66]',
            ].join(' ')}
            aria-pressed={value === option.value}
          >
            {option.label}
          </button>
        ))}
      </div>
    </section>
  );
}

// 완료 리포트 안의 요약 항목 한 줄을 렌더링합니다.
export function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/15 pb-3 last:border-b-0 last:pb-0">
      <dt className="text-white/72">{label}</dt>
      <dd className="text-right font-semibold text-white">{value}</dd>
    </div>
  );
}
