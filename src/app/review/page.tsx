import type { Metadata } from 'next';

import { ReviewSummaryRoutePage } from '@/widgets/review';

export const metadata: Metadata = {
  title: '주간 리포트',
};

export default function Page() {
  return <ReviewSummaryRoutePage />;
}
