import type { Metadata } from 'next';

import { ReviewListRoutePage } from '@/widgets/review';

export const metadata: Metadata = {
  title: '리포트 목록',
};

export default function Page() {
  return <ReviewListRoutePage />;
}
