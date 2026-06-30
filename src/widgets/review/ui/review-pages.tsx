import { getPlusSubscription } from '@/entities/plus-subscription';
import { getWeeklyReview } from '@/entities/review';

import { ReviewPlusDetailPage } from './review-plus-detail-page';
import { ReviewPlusLockedPage } from './review-plus-locked-page';
import { ReviewSummaryPage } from './review-summary-page';

export async function ReviewSummaryRoutePage() {
  const review = await getWeeklyReview();

  return <ReviewSummaryPage review={review} />;
}

export async function ReviewPlusRoutePage() {
  const [review, subscription] = await Promise.all([getWeeklyReview(), getPlusSubscription()]);

  // 무료 사용자는 plus 안내 페이지로 이동
  if (subscription.status !== 'active') {
    return <ReviewPlusLockedPage review={review} />;
  }

  // 유료 사용자는 리포트 상세 페이지로 이동
  return <ReviewPlusDetailPage review={review} />;
}
