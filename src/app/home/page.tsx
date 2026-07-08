import { redirect } from 'next/navigation';
import { HomePage } from '@/widgets/home-page';
import { createClient } from '@/shared/lib/supabase/server';

export default async function Page() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    redirect('/');
  }

  return <HomePage userKind="returning" />;
}
