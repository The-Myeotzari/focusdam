import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';

type Props = {
  isFinal: boolean;
  nextHref: string;
  nextLabel: string;
  onSubmit: () => void;
  previousHref: string;
  secondaryHref: string;
  secondaryLabel: string;
  showCancel: boolean;
};

const primaryActionClassName =
  'flex min-h-[62px] w-full items-center justify-center gap-2 rounded-full bg-[#3c5f7c] px-6 text-[17px] font-semibold leading-7 text-white shadow-[0_20px_25px_-5px_rgba(60,95,124,0.2)]';

// 결제 3심 생성 화면의 하단 이동 및 완료 액션을 렌더링합니다.
export function CreatePaymentThirdReviewFooter({
  isFinal,
  nextHref,
  nextLabel,
  onSubmit,
  previousHref,
  secondaryHref,
  secondaryLabel,
  showCancel,
}: Props) {
  return (
    <div className="-mx-5 bg-gradient-to-t from-[#faf9fc] via-[#faf9fc] to-transparent px-5 pt-8">
      <div className="grid gap-2">
        {isFinal ? (
          <button
            type="button"
            onClick={onSubmit}
            className={primaryActionClassName}
          >
            {nextLabel}
            <ArrowRight size={18} strokeWidth={2.2} aria-hidden="true" />
          </button>
        ) : (
          <Link
            href={nextHref}
            className={primaryActionClassName}
          >
            {nextLabel}
            <ArrowRight size={18} strokeWidth={2.2} aria-hidden="true" />
          </Link>
        )}
        {isFinal ? (
          <Link
            href={secondaryHref}
            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full text-sm font-semibold leading-5 text-[#42474d]"
          >
            <ArrowLeft size={16} strokeWidth={2.2} aria-hidden="true" />
            {secondaryLabel}
          </Link>
        ) : (
          <Link
            href={showCancel ? secondaryHref : previousHref}
            className={[
              'flex min-h-12 w-full items-center justify-center gap-2 rounded-full text-sm font-semibold leading-5',
              showCancel
                ? 'border border-[#c2c7ce66] bg-white text-[#3c5f7c]'
                : 'text-[#42474d]',
            ].join(' ')}
          >
            {showCancel ? null : <ArrowLeft size={16} strokeWidth={2.2} aria-hidden="true" />}
            {showCancel ? secondaryLabel : '이전'}
          </Link>
        )}
      </div>
    </div>
  );
}
