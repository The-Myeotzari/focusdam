import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

import { SiteBottomNav, shouldHideBottomNav } from './site-bottom-nav';

vi.mock('next/navigation', () => ({
  usePathname: () => '/home',
}));

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

  it.each(['/home', '/starter/recent', '/focus/actions', '/focus/current', '/settings'])('일반 경로 %s에서 표시한다', (pathname) => {
    expect(shouldHideBottomNav(pathname)).toBe(false);
  });
});

describe('SiteBottomNav', () => {
  it('집중 메뉴에서 행동 목록으로 이동한다', () => {
    const html = renderToStaticMarkup(createElement(SiteBottomNav));

    expect(html).toContain('href="/focus/actions"');
    expect(html).toContain('>집중<');
  });
});
