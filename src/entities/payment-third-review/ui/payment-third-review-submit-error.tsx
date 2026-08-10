type Props = {
  isRetrying: boolean;
  message: string;
  onRetry: () => void;
};

export function PaymentThirdReviewSubmitError({ isRetrying, message, onRetry }: Props) {
  return (
    <div
      className="rounded-2xl bg-[#f9e9e6] px-4 py-3 text-sm leading-6 text-[#9f3e30]"
      role="alert"
    >
      <p>{message}</p>
      <button
        type="button"
        onClick={onRetry}
        disabled={isRetrying}
        className="mt-2 min-h-9 rounded-full border border-[#9f3e30]/30 bg-white/70 px-4 font-semibold disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isRetrying ? '다시 시도 중...' : '다시 시도'}
      </button>
    </div>
  );
}
