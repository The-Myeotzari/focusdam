import { z } from 'zod';

export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

export const PaginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(DEFAULT_PAGE),
  size: z.coerce.number().int().min(1).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
});

export const PaginationMetaSchema = z.object({
  page: z.number().int().min(1),
  size: z.number().int().min(1).max(MAX_PAGE_SIZE),
  totalElements: z.number().int().min(0),
  totalPages: z.number().int().min(0),
});

export type PaginationQuery = z.infer<typeof PaginationQuerySchema>;
export type PaginationMeta = z.infer<typeof PaginationMetaSchema>;

export function parsePagination(searchParams: URLSearchParams) {
  return PaginationQuerySchema.safeParse({
    page: searchParams.get('page') ?? undefined,
    size: searchParams.get('size') ?? undefined,
  });
}

export function getPaginationRange({ page, size }: PaginationQuery) {
  const from = (page - 1) * size;
  return { from, to: from + size - 1 };
}

export function createPaginationMeta(
  { page, size }: PaginationQuery,
  totalElements: number,
): PaginationMeta {
  return {
    page,
    size,
    totalElements,
    totalPages: totalElements === 0 ? 0 : Math.ceil(totalElements / size),
  };
}
