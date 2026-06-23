import type { Metadata } from 'next';

import { DataManagementPage } from '@/widgets/settings';

export const metadata: Metadata = {
  title: '데이터 관리',
};

export default function Page() {
  return <DataManagementPage />;
}
