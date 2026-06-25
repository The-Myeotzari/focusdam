import type { SummaryCard } from '@/widgets/payment-third-review-home/model/payment-third-review-home.types';

type Props = {
  items: SummaryCard[];
};

export function PaymentThirdReviewGoalSummary({ items }: Props) {
  return (
    <section aria-labelledby="spend-summary-title" className="grid gap-3">
      <h2 id="spend-summary-title" className="text-lg font-semibold leading-7 text-[#1a1c1e]">
        소비 요약
      </h2>

      <div className="grid grid-cols-2 gap-3">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <article key={item.title} className="rounded-[24px] bg-white p-4 shadow-[0_4px_12px_rgba(0,0,0,0.04)]">
              <span className={`grid size-9 place-items-center rounded-full ${item.tone}`}>
                <Icon size={18} strokeWidth={2.1} aria-hidden="true" />
              </span>
              <p className="mt-3 text-xs font-medium leading-5 text-[#72777e]">{item.title}</p>
              <p className="text-[22px] font-semibold leading-8 text-[#1a1c1e]">{item.value}</p>
              <p className="mt-1 text-xs leading-5 text-[#72777e]">{item.description}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
