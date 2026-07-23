export function PaymentThirdReviewPageLoading() {
  return (
    <main
      className="mx-auto grid min-h-[calc(100svh-56px)] w-full max-w-[430px] animate-pulse content-start gap-5 px-5 pb-8 pt-4"
      role="status"
      aria-label="결제 3심 화면을 불러오는 중입니다."
    >
      <div className="h-7 w-28 rounded-full bg-[#e5e8eb]" aria-hidden="true" />
      <div className="h-56 rounded-[32px] bg-[#e3e8ec]" aria-hidden="true" />
      <div className="grid gap-3" aria-hidden="true">
        <div className="h-24 rounded-[26px] bg-white" />
        <div className="h-24 rounded-[26px] bg-white" />
        <div className="h-24 rounded-[26px] bg-white" />
      </div>
    </main>
  );
}
