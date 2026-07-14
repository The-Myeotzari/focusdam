import type { Metadata } from 'next';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import { getCurrentUserServer } from '@/entities/user/api/current-user.server';
import { QUERY_KEYS } from '@/shared/constants/query-key';
import { AccountManagementPage } from '@/widgets/settings';

export const metadata: Metadata = {
  title: '계정 관리',
};

export default async function Page() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: QUERY_KEYS.user.current,
    queryFn: getCurrentUserServer,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AccountManagementPage />
    </HydrationBoundary>
  );
}
