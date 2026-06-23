import type { Metadata } from 'next';

import { PlusSubscriptionPage } from '@/widgets/settings';

export const metadata: Metadata = {
  title: 'Plus 구독',
};

export default function Page() {
  return <PlusSubscriptionPage />;
}
