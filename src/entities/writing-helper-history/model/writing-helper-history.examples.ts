import type { WritingHelperHistoryInput, WritingHelperHistoryItem } from './writing-helper-history.types';

const messageTypeLabels: Record<WritingHelperHistoryInput['messageType'], string> = {
  email: '간단한 메일',
  check_in: '안부 연락',
  request: '부탁/요청',
  apology: '사과/양해',
};

const toneLabels: Record<WritingHelperHistoryInput['tone'], string> = {
  plain: '담백하게',
  warm: '따뜻하게',
  formal: '정중하게',
};

const sampleInputs: Array<{
  id: string;
  createdAt: string;
  input: WritingHelperHistoryInput;
  editedDraft: string;
}> = [
  {
    id: 'sample-annual-leave-request',
    createdAt: '2026-07-01T05:20:00.000Z',
    input: {
      messageType: 'email',
      tone: 'formal',
      recipient: '주임님',
      reason: '급한 사정이 생겨서',
      topic: '모레 연차 사용 가능 여부',
      action: '여쭤보고자 연락드립니다',
      closingRequest: '확인 부탁드립니다',
    },
    editedDraft:
      '주임님, 안녕하세요.\n급한 사정이 생겨서 모레 연차 사용 가능한지 여쭤보고자 연락드립니다.\n확인 부탁드립니다.',
  },
  {
    id: 'sample-check-in-message',
    createdAt: '2026-07-01T03:45:00.000Z',
    input: {
      messageType: 'check_in',
      tone: 'warm',
      recipient: '민지',
      reason: '요즘 정신없이 지내다 보니',
      topic: '안부',
      action: '전하고 싶었습니다',
      closingRequest: '편할 때 답장 주세요',
    },
    editedDraft:
      '민지님, 안녕하세요.\n요즘 정신없이 지내다 보니 문득 생각나서 안부 전하고 싶었습니다.\n편할 때 답장 주세요.',
  },
  {
    id: 'sample-schedule-change',
    createdAt: '2026-06-30T09:10:00.000Z',
    input: {
      messageType: 'request',
      tone: 'plain',
      recipient: '팀장님',
      reason: '자료 정리에 시간이 조금 더 필요해서',
      topic: '회의 시간을 30분 늦추는 것',
      action: '가능할지 여쭤보고 싶습니다',
      closingRequest: '가능 여부를 알려주세요',
    },
    editedDraft: '',
  },
  {
    id: 'sample-project-feedback',
    createdAt: '2026-06-30T02:30:00.000Z',
    input: {
      messageType: 'request',
      tone: 'formal',
      recipient: '선배님',
      reason: '작성한 초안을 한번 점검받고 싶어서',
      topic: '프로젝트 소개 문구',
      action: '피드백 부탁드리고자 연락드립니다',
      closingRequest: '가능하실 때 의견 부탁드립니다',
    },
    editedDraft:
      '선배님, 안녕하세요.\n작성한 초안을 한번 점검받고 싶어서 프로젝트 소개 문구에 대한 피드백 부탁드리고자 연락드립니다.\n가능하실 때 의견 부탁드립니다.',
  },
  {
    id: 'sample-lunch-menu',
    createdAt: '2026-06-29T04:15:00.000Z',
    input: {
      messageType: 'check_in',
      tone: 'warm',
      recipient: '지윤',
      reason: '점심 시간이 다가와서',
      topic: '메뉴',
      action: '같이 정하고 싶었습니다',
      closingRequest: '먹고 싶은 메뉴 있으면 알려주세요',
    },
    editedDraft:
      '지윤님, 안녕하세요.\n점심 시간이 다가와서 메뉴를 같이 정하고 싶었습니다.\n먹고 싶은 메뉴 있으면 알려주세요.',
  },
  {
    id: 'sample-apology-delay',
    createdAt: '2026-06-28T11:40:00.000Z',
    input: {
      messageType: 'apology',
      tone: 'plain',
      recipient: '민수',
      reason: '확인이 늦어져서',
      topic: '답장이 늦어진 점',
      action: '사과하고 싶습니다',
      closingRequest: '양해 부탁드립니다',
    },
    editedDraft: '',
  },
  {
    id: 'sample-document-request',
    createdAt: '2026-06-27T06:05:00.000Z',
    input: {
      messageType: 'email',
      tone: 'formal',
      recipient: '담당자님',
      reason: '제출 전 확인이 필요해서',
      topic: '증빙 서류 발급 가능 여부',
      action: '문의드립니다',
      closingRequest: '확인 후 회신 부탁드립니다',
    },
    editedDraft:
      '담당자님, 안녕하세요.\n제출 전 확인이 필요해서 증빙 서류 발급 가능 여부를 문의드립니다.\n확인 후 회신 부탁드립니다.',
  },
  {
    id: 'sample-family-check-in',
    createdAt: '2026-06-26T12:25:00.000Z',
    input: {
      messageType: 'check_in',
      tone: 'warm',
      recipient: '이모',
      reason: '오랜만에 생각이 나서',
      topic: '안부',
      action: '여쭤보고 싶었습니다',
      closingRequest: '편하실 때 연락 주세요',
    },
    editedDraft: '',
  },
  {
    id: 'sample-meeting-note',
    createdAt: '2026-06-25T08:55:00.000Z',
    input: {
      messageType: 'email',
      tone: 'plain',
      recipient: '팀원분들',
      reason: '회의 내용 정리가 끝나서',
      topic: '오늘 논의한 결정 사항',
      action: '공유드립니다',
      closingRequest: '빠진 내용이 있으면 알려주세요',
    },
    editedDraft:
      '팀원분들, 안녕하세요.\n회의 내용 정리가 끝나서 오늘 논의한 결정 사항을 공유드립니다.\n빠진 내용이 있으면 알려주세요.',
  },
];

export const WRITING_HELPER_HISTORY_MOCK_ITEMS: WritingHelperHistoryItem[] = sampleInputs.map(
  ({ id, createdAt, input, editedDraft }) => {
    const recipient = input.recipient.trim() || '상대';
    const draftExample = [
      `${recipient}, 안녕하세요.`,
      `${input.reason} ${input.topic}를 ${input.action}.`,
      input.closingRequest,
    ].join('\n');

    return {
      id,
      createdAt,
      updatedAt: createdAt,
      input,
      result: {
        headline: `${messageTypeLabels[input.messageType]}을 ${toneLabels[input.tone]} 정리해봐요`,
        summary: [
          `상대: ${recipient}`,
          `이유: ${input.reason}`,
          `말할 내용: ${input.topic}`,
          `표현 방식: ${input.action}`,
          `마무리: ${input.closingRequest}`,
        ],
        draftExample,
        sections: [],
        checklist: [],
      },
      editedDraft,
    };
  },
);
