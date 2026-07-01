export type WritingHelperHistoryMessageType = 'email' | 'check_in' | 'request' | 'apology';

export type WritingHelperHistoryTone = 'plain' | 'warm' | 'formal';

export type WritingHelperHistoryInput = {
  messageType: WritingHelperHistoryMessageType;
  tone: WritingHelperHistoryTone;
  recipient: string;
  reason: string;
  topic: string;
  action: string;
  closingRequest: string;
};

export type WritingHelperHistorySection = {
  title: string;
  guide: string;
  starters: string[];
};

export type WritingHelperHistoryResult = {
  headline: string;
  summary: string[];
  draftExample: string;
  sections: WritingHelperHistorySection[];
  checklist: string[];
};

export type WritingHelperHistoryItem = {
  id: string;
  createdAt: string;
  updatedAt: string;
  input: WritingHelperHistoryInput;
  result: WritingHelperHistoryResult;
  editedDraft: string;
};
