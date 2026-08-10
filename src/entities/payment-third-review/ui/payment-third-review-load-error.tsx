import { RotateCcw, type LucideIcon } from 'lucide-react';
import Link from 'next/link';

type Props = {
  actionLabel?: string;
  description: string;
  fullPage?: boolean;
  href?: string;
  icon?: LucideIcon;
  iconClassName?: string;
  isRetrying?: boolean;
  onRetry?: () => void;
  title: string;
};

const actionClassName =
  'mt-6 flex min-h-12 items-center justify-center rounded-full bg-[#3c5f7c] px-5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-[#9eabb5]';

export function getPaymentThirdReviewLoadErrorActionLabel(
  isRetrying: boolean,
  actionLabel?: string,
) {
  return isRetrying ? '불러오는 중...' : (actionLabel ?? '다시 불러오기');
}

export function PaymentThirdReviewLoadError({
  actionLabel,
  description,
  fullPage = false,
  href,
  icon: Icon = RotateCcw,
  iconClassName = 'bg-[#e8edf1] text-[#3c5f7c]',
  isRetrying = false,
  onRetry,
  title,
}: Props) {
  const content = (
    <>
      <span
        className={`mx-auto grid size-14 place-items-center rounded-full ${iconClassName}`}
        aria-hidden="true"
      >
        <Icon size={26} />
      </span>
      <h1 className="mt-4 text-xl font-semibold text-[#1a1c1e]">{title}</h1>
      <p className="mt-2 text-sm leading-6 text-[#72777e]">{description}</p>
      {href ? (
        <Link href={href} className={actionClassName}>
          {actionLabel ?? '목록으로 돌아가기'}
        </Link>
      ) : onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          disabled={isRetrying}
          className={actionClassName}
        >
          {getPaymentThirdReviewLoadErrorActionLabel(isRetrying, actionLabel)}
        </button>
      ) : null}
    </>
  );

  if (fullPage) {
    return (
      <main
        className="mx-auto grid min-h-[calc(100svh-56px)] w-full max-w-[430px] place-content-center px-5 py-10 text-center"
        role="alert"
      >
        {content}
      </main>
    );
  }

  return (
    <section
      className="rounded-[24px] border border-[#eadfdd] bg-white px-5 py-9 text-center shadow-[0_4px_12px_rgba(0,0,0,0.04)]"
      role="alert"
    >
      {content}
    </section>
  );
}
