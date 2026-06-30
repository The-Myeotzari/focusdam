import type { Metadata } from 'next';

import { ReviewPlusRoutePage } from '@/widgets/review';

export const metadata: Metadata = {
  title: 'Plus 주간 리포트',
};

export default function Page() {
  return <ReviewPlusRoutePage />;
}
