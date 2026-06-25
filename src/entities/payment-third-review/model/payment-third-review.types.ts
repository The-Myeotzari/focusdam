export type PaymentReviewHistoryItem = {
  id: string;
  title: string;
  date: string;
  amount: string;
  progressLabel: string;
  statusLabel: string;
  statusTone: 'success' | 'caution';
};
