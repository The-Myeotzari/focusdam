type Props = {
  label: string;
  value: string;
  stacked?: boolean;
};

// 결제 3심 상세 정보의 라벨-값 행을 렌더링합니다.
export function PaymentReviewInfoRow({ label, value, stacked = false }: Props) {
  return (
    <div
      className={`flex border-b border-[#eceff2] py-4 last:border-b-0 ${
        stacked ? 'flex-col gap-1.5' : 'items-start justify-between gap-4'
      }`}
    >
      <p className="shrink-0 text-sm font-medium leading-6 text-[#72777e]">{label}</p>
      <p
        className={`min-w-0 whitespace-pre-wrap break-words text-[16px] font-semibold leading-6 text-[#1a1c1e] ${
          stacked ? 'text-left' : 'text-right'
        }`}
      >
        {value}
      </p>
    </div>
  );
}
