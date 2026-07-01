import { WRITING_HELPER_HISTORY_MOCK_ITEMS } from '../model/writing-helper-history.examples';

export function listWritingHelperHistoryItems() {
  return [...WRITING_HELPER_HISTORY_MOCK_ITEMS].sort((previousItem, nextItem) => {
    return new Date(nextItem.createdAt).getTime() - new Date(previousItem.createdAt).getTime();
  });
}

export function getWritingHelperHistoryItem(id: string) {
  return WRITING_HELPER_HISTORY_MOCK_ITEMS.find((item) => item.id === id) ?? null;
}
