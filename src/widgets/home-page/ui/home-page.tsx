import { NewUserHome, QuickStartMenu, ReturningUserHome } from '@/widgets/home-page';

type Props = {
  userKind: 'new' | 'returning';
  userName?: string | null;
};

export function HomePage({ userKind, userName }: Props) {
  return (
    <main className="flex flex-col gap-8 px-5 py-4">
      {userKind === 'new' ? <NewUserHome /> : <ReturningUserHome userName={userName} />}
      <QuickStartMenu />
    </main>
  );
}
