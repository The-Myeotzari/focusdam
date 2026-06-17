import { NewUserHome, QuickStartMenu } from '@/widgets/home-page';

export function HomePage() {
  return (
    <main className="flex gap-8 flex-col px-5 py-4">
      {/* 신규 회원 전용 홈 화면 */}
      <NewUserHome />

      {/* 기존 유저 전용 스타터 추천(스타터 미진행인 경우) */}

      {/* 기존 유저 전용 진행 중인 스타터 노출 */}

      {/* 기존 유저 2열 2행 메뉴(스타터 만들기/착수카드/시간카드/금액카드) */}

      {/* 기존 유저 진행 중인 활동 */}

      {/* (공통) Quick Start */}
      <QuickStartMenu />
    </main>
  );
}
