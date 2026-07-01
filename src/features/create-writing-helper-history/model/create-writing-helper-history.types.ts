import type { WritingHelperHistoryInput, WritingHelperHistoryResult } from '@/entities/writing-helper-history';

export type CreateWritingHelperHistoryItemPayload = {
  input: WritingHelperHistoryInput;
  result: WritingHelperHistoryResult;
};
