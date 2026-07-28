import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { paymentThirdReviewDetailQueryOptions } from '@/entities/payment-third-review/api/payment-third-review-query-options';
import { getPaymentThirdReviewDetailServer } from '@/entities/payment-third-review/api/payment-third-review.server';
import { parsePaymentThirdReviewListFilter } from '@/entities/payment-third-review/model/payment-third-review-list-filter';
import { PaymentThirdReviewSatisfactionCheckPage } from '@/features/payment-third-review-satisfaction-check';

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ filter?: string | string[] }>;
};

export const metadata: Metadata = {
  title: '결제 3심 만족도 체크',
};

export default async function Page({ params, searchParams }: Props) {
  const { id } = await params;
  const { filter } = await searchParams;
  const listFilter = parsePaymentThirdReviewListFilter(filter);
  const response = await getPaymentThirdReviewDetailServer(id).catch(() => undefined);

  if (response === null) {
    notFound();
  }

  const queryClient = new QueryClient();
  if (response) {
    queryClient.setQueryData(paymentThirdReviewDetailQueryOptions(id).queryKey, response);
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PaymentThirdReviewSatisfactionCheckPage id={id} listFilter={listFilter} />
    </HydrationBoundary>
  );
}
