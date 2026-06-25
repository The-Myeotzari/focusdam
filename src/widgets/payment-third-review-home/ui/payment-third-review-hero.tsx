import { ArrowRight, Banknote, Flag, ShieldCheck } from 'lucide-react';

import { SiteBadge, SiteButton, SiteCard } from '@/shared/ui';
import type { PaymentReviewOverview } from '@/widgets/payment-third-review-home/model/payment-third-review-home.types';

type Props = {
  overview: PaymentReviewOverview;
};

export function PaymentThirdReviewHero({ overview }: Props) {
  return (
    <section aria-labelledby="payment-third-review-title">
      <SiteCard
        padded={false}
        className="relative overflow-hidden !rounded-[28px] !border !border-[#c2c7ce33] !bg-[#ffffff] !p-5 !shadow-[0_16px_34px_rgba(60,95,124,0.09)]"
      >
        <div className="absolute right-4 top-4 grid size-11 place-items-center rounded-full bg-[#e8f5f1] text-[#2d6a4f]">
          <ShieldCheck size={22} strokeWidth={2} aria-hidden="true" />
        </div>

        <SiteBadge tone="success" className="!bg-[#e8f5f1] !text-[#2d6a4f]">
          결제 전 점검
        </SiteBadge>

        <h1
          id="payment-third-review-title"
          className="mt-4 max-w-[250px] text-[26px] font-semibold leading-[1.32] tracking-[-0.01em] text-[#1a1c1e]"
        >
          쓰기 전에 한 번 더 확인해요
        </h1>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-[22px] bg-[#f4f3f6] p-4">
            <span className="grid size-9 place-items-center rounded-full bg-[#e0f1ff] text-[#3c5f7c]">
              <Flag size={18} strokeWidth={2.1} aria-hidden="true" />
            </span>
            <p className="mt-3 text-xs font-medium leading-5 text-[#72777e]">목표 금액</p>
            <p className="text-[22px] font-semibold leading-8 text-[#1a1c1e]">
              {overview.goalAmount}
            </p>
          </div>

          <div className="rounded-[22px] bg-[#f4f3f6] p-4">
            <span className="grid size-9 place-items-center rounded-full bg-[#e8f5f1] text-[#2d6a4f]">
              <Banknote size={18} strokeWidth={2.1} aria-hidden="true" />
            </span>
            <p className="mt-3 text-xs font-medium leading-5 text-[#72777e]">현재 소비</p>
            <p className="text-[22px] font-semibold leading-8 text-[#1a1c1e]">
              {overview.currentSpend}
            </p>
          </div>
        </div>

        <div className="mt-5">
          <SiteButton
            href="/payment-third-review/create/item"
            className="!min-h-[52px] !w-full !gap-2 !px-6 !text-sm !font-semibold"
          >
            결제 3심 진행
            <ArrowRight size={18} strokeWidth={2.2} aria-hidden="true" />
          </SiteButton>
        </div>
      </SiteCard>
    </section>
  );
}
