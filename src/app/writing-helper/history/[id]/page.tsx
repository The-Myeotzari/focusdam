import type { Metadata } from 'next';

import { WritingHelperHistoryDetailPage } from '@/widgets/writing-helper-history-detail-page';

export const metadata: Metadata = {
  title: '문장 작성 기록 상세',
};

type WritingHelperHistoryDetailRouteProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function WritingHelperHistoryDetailRoute({
  params,
}: WritingHelperHistoryDetailRouteProps) {
  const { id } = await params;

  return <WritingHelperHistoryDetailPage id={id} />;
}
