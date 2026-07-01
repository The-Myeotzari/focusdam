import type { WritingHelperMessageType, WritingHelperTone } from './writing-helper.types';

export const WRITING_HELPER_MESSAGE_TYPE_LABELS: Record<WritingHelperMessageType, string> = {
  email: '간단한 메일',
  check_in: '안부 연락',
  request: '부탁/요청',
  apology: '사과/양해',
};

export const WRITING_HELPER_TONE_LABELS: Record<WritingHelperTone, string> = {
  plain: '담백하게',
  warm: '따뜻하게',
  formal: '정중하게',
};

export const WRITING_HELPER_MESSAGE_TYPES: WritingHelperMessageType[] = [
  'email',
  'check_in',
  'request',
  'apology',
];

export const WRITING_HELPER_TONES: WritingHelperTone[] = ['plain', 'warm', 'formal'];
