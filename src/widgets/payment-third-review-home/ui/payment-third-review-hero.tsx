import { ShieldCheck } from 'lucide-react';

import { SiteBadge, SiteButton, SiteCard } from '@/shared/ui';

export function PaymentThirdReviewHero() {
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
          className="mt-4 text-[26px] font-semibold leading-[1.32] tracking-[-0.01em] text-[#1a1c1e]"
        >
          쓰기 전에 한 번 더 확인해요
        </h1>

        <div className="mt-5">
          <SiteButton
            href="/payment-third-review/create/step-1"
            className="!min-h-[52px] !w-full !gap-2 !px-6 !text-sm !font-semibold"
          >
            결제 3심 진행하기
          </SiteButton>
        </div>
      </SiteCard>
    </section>
  );
}
