import type { Metadata } from 'next';

import { HelpFeedbackPage } from '@/widgets/settings';

export const metadata: Metadata = {
  title: '도움말·피드백',
};

export default function Page() {
  return <HelpFeedbackPage />;
}
