import { HomePage } from '@/widgets/home-page';
import { createClient } from '@/shared/lib/supabase/server';
import type { User } from '@supabase/supabase-js';

export default async function Page() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  return (
    <HomePage
      userKind={user ? 'returning' : 'new'}
      userName={getUserDisplayName(user)}
    />
  );
}

function getUserDisplayName(user: User | null) {
  if (!user) {
    return null;
  }

  return (
    user.user_metadata.name ||
    user.user_metadata.full_name ||
    user.user_metadata.nickname ||
    user.email ||
    null
  );
}
