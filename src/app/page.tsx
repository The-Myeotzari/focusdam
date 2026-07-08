import { OnboardingStartPage } from '@/widgets/onboarding-start-page';
import { createClient } from '@/shared/lib/supabase/server';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    return <OnboardingStartPage />;
  }

  redirect('/home');
}
