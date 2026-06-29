import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: '결제 3심 생성 - 품목',
};

export default function Page() {
  redirect('/payment-third-review/create/step-1');
}
