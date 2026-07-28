import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { PaymentThirdReviewListSkeleton } from './payment-third-review-list-skeleton';

describe('PaymentThirdReviewListSkeleton', () => {
  it('renders list-shaped placeholders with an accessible loading label', () => {
    const html = renderToStaticMarkup(
      createElement(PaymentThirdReviewListSkeleton, {
        count: 3,
        label: '목록 로딩 중',
      }),
    );

    expect(html).toContain('role="status"');
    expect(html).toContain('aria-label="목록 로딩 중"');
    expect(html.match(/animate-pulse/g)).toHaveLength(3);
  });
});
