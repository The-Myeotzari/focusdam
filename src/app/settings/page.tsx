import type { Metadata } from 'next';

import { SettingsPage } from '@/widgets/settings-page';

export const metadata: Metadata = {
  title: '설정',
};

export default function Page() {
  return <SettingsPage />;
}
