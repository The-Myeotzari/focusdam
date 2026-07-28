import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { QuickStartMenu } from './quick-start-menu';

describe('QuickStartMenu', () => {
  it('Action 메뉴에서 행동 목록으로 이동한다', () => {
    const html = renderToStaticMarkup(createElement(QuickStartMenu));

    expect(html).toContain('href="/focus/actions"');
  });
});
