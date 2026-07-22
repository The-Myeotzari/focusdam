type Props = {
  count?: number;
  label?: string;
};

// 결제 3심 목록 행 스켈레톤
export function PaymentThirdReviewListSkeleton({
  count = 4,
  label = '결제 3심 내역을 불러오는 중입니다.',
}: Props) {
  return (
    <div className="grid gap-2" role="status" aria-label={label}>
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className="animate-pulse rounded-[22px] bg-white p-4 shadow-[0_4px_12px_rgba(0,0,0,0.04)]"
          aria-hidden="true"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <span className="size-10 shrink-0 rounded-full bg-[#e5e8eb]" />
              <span className="grid flex-1 gap-2">
                <span className="h-4 w-2/3 rounded-full bg-[#e5e8eb]" />
                <span className="h-3 w-1/2 rounded-full bg-[#eef0f2]" />
              </span>
            </div>
            <span className="grid w-20 justify-items-end gap-2">
              <span className="h-4 w-16 rounded-full bg-[#e5e8eb]" />
              <span className="h-3 w-11 rounded-full bg-[#eef0f2]" />
            </span>
          </div>
          <div className="mt-3 flex gap-1.5">
            <span className="h-6 w-24 rounded-full bg-[#eef0f2]" />
            <span className="h-6 w-16 rounded-full bg-[#eef0f2]" />
          </div>
        </div>
      ))}
    </div>
  );
}
