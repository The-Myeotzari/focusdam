import { describe, expect, it } from 'vitest';

import { shouldHideBottomNav } from './site-bottom-nav';

describe('shouldHideBottomNav', () => {
  it.each(['/', '/onboarding/start', '/onboarding/account'])('온보딩 경로 %s에서 숨긴다', (pathname) => {
    expect(shouldHideBottomNav(pathname)).toBe(true);
  });

  it.each([
    '/starter/new',
    '/writing-helper/create',
    '/payment-third-review/create/step-1',
    '/feature/edit',
  ])('생성·수정 경로 %s에서 숨긴다', (pathname) => {
    expect(shouldHideBottomNav(pathname)).toBe(true);
  });

  it.each(['/home', '/starter/recent', '/focus/current', '/settings'])('일반 경로 %s에서 표시한다', (pathname) => {
    expect(shouldHideBottomNav(pathname)).toBe(false);
  });
});
