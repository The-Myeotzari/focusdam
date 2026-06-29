// 숫자 금액을 결제 3심 화면에서 사용하는 원화 문자열로 변환합니다.
export function formatPaymentReviewWon(amount: number) {
  return `${amount.toLocaleString('ko-KR')}원`;
}

// 원화 문자열에서 숫자 금액만 추출합니다.
export function parsePaymentReviewWon(amount: string) {
  return Number(amount.replace(/[^0-9]/g, ''));
}
