import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { SiteTopBar } from './site-top-bar';

describe('SiteTopBar', () => {
  it('메뉴명만 있으면 링크 없이 헤더를 표시한다', () => {
    const html = renderToStaticMarkup(createElement(SiteTopBar, { title: '집중이담' }));

    expect(html).toContain('data-site-header="true"');
    expect(html).toContain('집중이담');
    expect(html).not.toContain('<a');
  });

  it('설정된 좌우 이동 링크를 표시한다', () => {
    const html = renderToStaticMarkup(
      createElement(SiteTopBar, {
        title: '주간 리포트',
        backHref: '/',
        skipHref: '/review/plus',
        skipLabel: 'Plus',
      }),
    );

    expect(html).toContain('href="/"');
    expect(html).toContain('href="/review/plus"');
    expect(html).toContain('Plus');
  });

  it('긴 메뉴명을 한 줄로 제한하는 스타일을 적용한다', () => {
    const html = renderToStaticMarkup(
      createElement(SiteTopBar, { title: '전문기관 및 신뢰할 수 있는 연락처' }),
    );

    expect(html).toContain('truncate');
  });
});
