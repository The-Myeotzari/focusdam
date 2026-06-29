// 결제 3심 상세 정보의 라벨-값 행을 렌더링합니다.
export function PaymentReviewInfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-[#eceff2] py-4 last:border-b-0">
      <p className="shrink-0 text-sm font-medium leading-6 text-[#72777e]">{label}</p>
      <p className="text-right text-[16px] font-semibold leading-6 text-[#1a1c1e]">{value}</p>
    </div>
  );
}
