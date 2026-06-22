import type { Metadata } from 'next';

import { NotificationManagementPage } from '@/widgets/settings';

export const metadata: Metadata = {
  title: '알림 관리',
};

export default function Page() {
  return <NotificationManagementPage />;
}
