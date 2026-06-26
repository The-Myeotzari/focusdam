type Props = {
  className?: string;
  dotClassName?: string;
  label: string;
};

// 결제 3심 판단 및 후속 상태를 작은 배지로 렌더링합니다.
export function PaymentReviewStatusBadge({ className, dotClassName, label }: Props) {
  return (
    <span
      className={[
        'inline-flex items-center gap-1.5 rounded-full bg-[#f4f3f6] px-2.5 py-1 text-[11px] font-semibold leading-4 text-[#72777e]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {dotClassName ? (
        <span className={`size-1.5 rounded-full ${dotClassName}`} aria-hidden="true" />
      ) : null}
      {label}
    </span>
  );
}
