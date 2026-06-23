import type { Metadata } from 'next';

import { SettingsHomePage } from '@/widgets/settings';

export const metadata: Metadata = {
  title: '설정',
};

export default function Page() {
  return <SettingsHomePage />;
}
