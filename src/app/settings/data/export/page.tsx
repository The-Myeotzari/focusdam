import type { Metadata } from 'next';

import { DataExportPage } from '@/widgets/settings';

export const metadata: Metadata = {
  title: '데이터 내보내기',
};

export default function Page() {
  return <DataExportPage />;
}
