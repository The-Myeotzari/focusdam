import type { WritingHelperHistoryItem } from '@/entities/writing-helper-history';

import type { CreateWritingHelperHistoryItemPayload } from '../model/create-writing-helper-history.types';

function createMockHistoryId() {
  return `mock-${Date.now()}`;
}

export function createWritingHelperHistoryItem(payload: CreateWritingHelperHistoryItemPayload) {
  const now = new Date().toISOString();

  return {
    id: createMockHistoryId(),
    createdAt: now,
    updatedAt: now,
    input: payload.input,
    result: payload.result,
    editedDraft: '',
  } satisfies WritingHelperHistoryItem;
}
