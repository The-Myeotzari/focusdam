// 사용자 정보 카드 컴포넌트

import type { UserAccount } from '@/entities/user/model/user.types';

type Props = {
  user: UserAccount;
};

const SOCIAL_PROVIDER_LABEL: Record<UserAccount['socialProvider'], string> = {
  google: 'Google',
  kakao: '카카오',
  apple: 'Apple',
};

export function UserAccountCard({ user }: Props) {
  return (
    <section
      aria-labelledby="account-profile-title"
      className="rounded-[var(--radius-xxl)] bg-[var(--color-surface-container-lowest)] p-6 shadow-[var(--shadow-card)]"
    >
      <h2
        id="account-profile-title"
        className="text-sm font-semibold text-[var(--color-on-surface-variant)]"
      >
        계정 정보
      </h2>

      <dl className="mt-5 grid gap-5">
        <div>
          <dt className="text-xs text-[var(--color-outline)]">이름</dt>
          <dd className="mt-1 text-base font-semibold text-[var(--color-on-surface)]">
            {user.name}
          </dd>
        </div>

        <div>
          <dt className="text-xs text-[var(--color-outline)]">로그인 계정</dt>
          <dd className="mt-1 text-base text-[var(--color-on-surface)]">
            {SOCIAL_PROVIDER_LABEL[user.socialProvider]}
          </dd>
          <dd className="mt-1 text-sm text-[var(--color-on-surface-variant)]">{user.email}</dd>
        </div>
      </dl>
    </section>
  );
}
