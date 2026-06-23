import type { Metadata } from 'next';

import { TermsSafetyPage } from '@/widgets/settings';

export const metadata: Metadata = {
  title: '약관·안전 안내',
};

export default function Page() {
  return <TermsSafetyPage />;
}
