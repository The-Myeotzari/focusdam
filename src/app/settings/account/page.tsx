import type { Metadata } from 'next';

import { AccountManagementPage } from '@/widgets/settings';

export const metadata: Metadata = {
  title: '계정 관리',
};

export default function Page() {
  return <AccountManagementPage />;
}
