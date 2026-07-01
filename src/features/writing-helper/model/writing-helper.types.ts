export type WritingHelperMessageType = 'email' | 'check_in' | 'request' | 'apology';

export type WritingHelperTone = 'plain' | 'warm' | 'formal';

export type WritingHelperInput = {
  messageType: WritingHelperMessageType;
  tone: WritingHelperTone;
  recipient: string;
  reason: string;
  topic: string;
  action: string;
  closingRequest: string;
};

export type WritingHelperSection = {
  title: string;
  guide: string;
  starters: string[];
};

export type WritingHelperResult = {
  headline: string;
  summary: string[];
  draftExample: string;
  sections: WritingHelperSection[];
  checklist: string[];
};
