import type { WritingHelperHistoryItem } from '@/entities/writing-helper-history';
import { getWritingHelperHistoryItem } from '@/entities/writing-helper-history';

import type { UpdateWritingHelperHistoryItemPayload } from '../model/update-writing-helper-history.types';

export function updateWritingHelperHistoryItem(
  id: string,
  payload: UpdateWritingHelperHistoryItemPayload,
) {
  const mockItem = getWritingHelperHistoryItem(id);

  if (!mockItem) {
    return null;
  }

  return {
    ...mockItem,
    ...payload,
    updatedAt: new Date().toISOString(),
  } satisfies WritingHelperHistoryItem;
}
