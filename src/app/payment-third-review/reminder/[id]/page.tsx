import type { Metadata } from 'next';

import { PaymentThirdReviewReminderPage } from '@/features/payment-third-review-reminder';

type Props = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = {
  title: '결제 3심 리마인드',
};

export default async function Page({ params }: Props) {
  const { id } = await params;

  return <PaymentThirdReviewReminderPage id={id} />;
}
