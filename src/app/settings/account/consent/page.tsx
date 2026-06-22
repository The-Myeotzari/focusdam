import type { Metadata } from 'next';

import { ConsentManagementPage } from '@/widgets/settings';

export const metadata: Metadata = {
  title: '선택 동의 관리',
};

export default function Page() {
  return <ConsentManagementPage />;
}
