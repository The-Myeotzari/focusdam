import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: '문장 교정',
};

export default function WritingHelperHistoryPage() {
  redirect('/writing-helper');
}
