import type { Metadata } from 'next';

import { WritingHelperCreatePage as WritingHelperCreatePageWidget } from '@/widgets/writing-helper-create-page';

export const metadata: Metadata = {
  title: '문장 작성하기',
};

export default function WritingHelperCreatePage() {
  return <WritingHelperCreatePageWidget />;
}
