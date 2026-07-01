import type { Metadata } from 'next';

import { WritingHelperHomePage } from '@/widgets/writing-helper-home';

export const metadata: Metadata = {
  title: '문장 교정',
};

export default function WritingHelperPage() {
  return <WritingHelperHomePage />;
}
