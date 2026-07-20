import { describe, expect, it } from 'vitest';

import {
  createPaginationMeta,
  getPaginationRange,
  parsePagination,
} from '@/shared/lib/api/pagination';

describe('pagination', () => {
  it('uses the standard defaults', () => {
    const result = parsePagination(new URLSearchParams());

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({ page: 1, size: 20 });
      expect(getPaginationRange(result.data)).toEqual({ from: 0, to: 19 });
    }
  });

  it('converts a one-based page to a Supabase range', () => {
    const result = parsePagination(new URLSearchParams({ page: '3', size: '10' }));

    expect(result.success).toBe(true);
    if (result.success) {
      expect(getPaginationRange(result.data)).toEqual({ from: 20, to: 29 });
      expect(createPaginationMeta(result.data, 24)).toEqual({
        page: 3,
        size: 10,
        totalElements: 24,
        totalPages: 3,
      });
    }
  });

  it('rejects invalid and oversized values', () => {
    expect(parsePagination(new URLSearchParams({ page: '0' })).success).toBe(false);
    expect(parsePagination(new URLSearchParams({ size: '101' })).success).toBe(false);
  });
});
