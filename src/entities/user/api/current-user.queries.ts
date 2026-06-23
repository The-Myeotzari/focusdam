import type { UserAccount } from '@/entities/user';

export async function getCurrentUser(): Promise<UserAccount> {
  // TODO: 실제 사용자 조회 API로 교체 필요
  return {
    name: '김포커스',
    email: 'focus@example.com',
    socialProvider: 'google',
  };
}
