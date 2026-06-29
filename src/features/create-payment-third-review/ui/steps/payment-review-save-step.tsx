import { Gift, GraduationCap, PiggyBank } from 'lucide-react';

import type { ReactNode } from 'react';
import type {
  CreatePaymentThirdReviewDraft,
  CreatePaymentThirdReviewDraftUpdater,
  PaymentSavingTarget,
} from '@/features/create-payment-third-review/model/create-payment-third-review.draft';
import { formatPaymentAmount } from '@/features/create-payment-third-review/lib/create-payment-third-review-format';

type Props = {
  draft: CreatePaymentThirdReviewDraft;
  updateDraft: CreatePaymentThirdReviewDraftUpdater;
};

const savingTargetOptions: Array<{
  description: string;
  icon: ReactNode;
  id: PaymentSavingTarget;
  title: string;
}> = [
  {
    id: 'goal',
    icon: <PiggyBank size={22} strokeWidth={2.1} />,
    title: '목표 저축',
    description: '여행비 / 비상금',
  },
  {
    id: 'reward',
    icon: <Gift size={22} strokeWidth={2.1} />,
    title: '자기보상',
    description: '주간 보상으로 저장',
  },
  {
    id: 'benefit',
    icon: <GraduationCap size={22} strokeWidth={2.1} />,
    title: '제휴 혜택',
    description: '교육 / 건강 / 복지 후보',
  },
];

// 취소 후 목표 저축 판단에 필요한 반영 위치 선택 화면을 렌더링합니다.
export function PaymentReviewSaveStep({ draft, updateDraft }: Props) {
  return (
    <div className="grid gap-4">
      <section className="rounded-[32px] bg-[#e6f4f1] px-5 py-6">
        <h2 className="text-[22px] font-semibold leading-8 text-[#1a1c1e]">
          아낀 금액을
          <br />
          어디에 둘까요?
        </h2>
        <p className="mt-3 text-sm font-medium leading-6 text-[#5f656c]">
          {formatPaymentAmount(draft.amount)}을 목표나 보상으로 연결해 절약이 실제 성취로 남게
          합니다.
        </p>
      </section>

      <div className="grid gap-3">
        {savingTargetOptions.map((option) => (
          <SaveChoiceCard
            key={option.id}
            checked={draft.savingTarget === option.id}
            description={option.description}
            icon={option.icon}
            title={option.title}
            onClick={() => updateDraft({ savingTarget: option.id })}
          />
        ))}
      </div>

      <p className="rounded-[24px] bg-[#ececee] px-5 py-4 text-sm font-medium leading-6 text-[#72777e]">
        절약은 참는 것이 아니라, 더 가치 있는 곳으로 자원을 이동시키는 과정입니다.
      </p>
    </div>
  );
}

type SaveChoiceCardProps = {
  checked?: boolean;
  description: string;
  icon: ReactNode;
  onClick: () => void;
  title: string;
};

// 목표 저축 반영 후보를 카드 형태로 보여줍니다.
function SaveChoiceCard({
  checked = false,
  description,
  icon,
  onClick,
  title,
}: SaveChoiceCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-[82px] w-full items-center gap-4 rounded-[28px] bg-white p-4 text-left shadow-[0_4px_12px_rgba(0,0,0,0.04)]"
      aria-pressed={checked}
    >
      <span
        className={[
          'grid size-11 shrink-0 place-items-center rounded-full',
          checked ? 'bg-[#dde3eb] text-[#3c5f7c]' : 'bg-[#f1f3f5] text-[#72777e]',
        ].join(' ')}
        aria-hidden="true"
      >
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[17px] font-semibold leading-7 text-[#1a1c1e]">{title}</span>
        <span className="block text-sm leading-6 text-[#72777e]">{description}</span>
      </span>
      <span
        className={[
          'size-5 rounded-full border',
          checked ? 'border-[#3c5f7c] bg-[#3c5f7c]' : 'border-[#c2c7ce]',
        ].join(' ')}
        aria-hidden="true"
      />
    </button>
  );
}
