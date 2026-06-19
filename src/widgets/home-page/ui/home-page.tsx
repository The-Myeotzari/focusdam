import { NewUserHome, QuickStartMenu, ReturningUserHome } from '@/widgets/home-page';

type Props = {
  userKind: 'new' | 'returning';
};

export function HomePage({ userKind }: Props) {
  return (
    <main className="flex gap-8 flex-col px-5 py-4">
      {userKind === 'new' ? (
        // 신규 회원 전용 홈 화면
        <NewUserHome />
      ) : (
        // 기존 회원 전용 홈 화면
        <ReturningUserHome />
      )}

      {/* (공통) Quick Start */}
      <QuickStartMenu />
    </main>
  );
}
