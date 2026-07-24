import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

import manifest from './manifest';

describe('PWA manifest', () => {
  it('manifest에 선언한 모든 로컬 아이콘 파일이 public 폴더에 존재한다', () => {
    const icons = manifest().icons ?? [];

    expect(icons.length).toBeGreaterThan(0);

    for (const icon of icons) {
      expect(
        existsSync(join(process.cwd(), 'public', icon.src.replace(/^\//, ''))),
      ).toBe(true);
    }
  });
});
