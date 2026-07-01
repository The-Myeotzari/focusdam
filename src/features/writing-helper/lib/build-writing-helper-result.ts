import {
  WRITING_HELPER_MESSAGE_TYPE_LABELS,
  WRITING_HELPER_TONE_LABELS,
} from '../model/writing-helper.constants';
import type {
  WritingHelperInput,
  WritingHelperResult,
  WritingHelperSection,
} from '../model/writing-helper.types';

function getRecipient(input: WritingHelperInput) {
  const recipient = input.recipient.trim();

  if (!recipient) {
    return '상대';
  }

  return recipient.endsWith('님') ? recipient : `${recipient}님`;
}

function getReason(input: WritingHelperInput) {
  return input.reason.trim() || '연락하게 된 이유';
}

function getTopic(input: WritingHelperInput) {
  return input.topic.trim() || '말하고 싶은 내용';
}

function getAction(input: WritingHelperInput) {
  return input.action.trim() || '어떻게 말할지';
}

function getClosingRequest(input: WritingHelperInput) {
  return input.closingRequest.trim() || '마지막에 부탁할 내용';
}

function hasSentenceEnding(value: string) {
  return /[.!?。]|요$|다$|니다$|드립니다$/.test(value.trim());
}

function ensureSentence(value: string) {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return '';
  }

  return hasSentenceEnding(trimmedValue) ? trimmedValue : `${trimmedValue}.`;
}

function removeSentenceEnding(value: string) {
  return value.trim().replace(/[.!?。]+$/g, '');
}

function hasObjectParticle(value: string) {
  return /[을를]$/.test(value.trim());
}

function getLastHangulChar(value: string) {
  const hangulChars = value.match(/[가-힣]/g);

  return hangulChars?.at(-1);
}

function hasFinalConsonant(value: string) {
  const lastHangulChar = getLastHangulChar(value);

  if (!lastHangulChar) {
    return false;
  }

  return (lastHangulChar.charCodeAt(0) - 0xac00) % 28 > 0;
}

function appendObjectParticle(value: string) {
  const trimmedValue = removeSentenceEnding(value);

  if (!trimmedValue || hasObjectParticle(trimmedValue)) {
    return trimmedValue;
  }

  return `${trimmedValue}${hasFinalConsonant(trimmedValue) ? '을' : '를'}`;
}

function buildMainLine(input: WritingHelperInput) {
  const reason = removeSentenceEnding(input.reason);
  const topic = removeSentenceEnding(input.topic);
  const action = removeSentenceEnding(input.action);

  if (!reason && !topic && !action) {
    return '전하고 싶은 내용을 한 문장으로 적어보세요.';
  }

  if (!topic || !action) {
    return ensureSentence([reason, topic, action].filter(Boolean).join(' '));
  }

  return ensureSentence([reason, appendObjectParticle(topic), action].filter(Boolean).join(' '));
}

function buildClosingLine(input: WritingHelperInput) {
  const closingRequest = input.closingRequest.trim();

  if (!closingRequest) {
    return '확인 부탁드립니다.';
  }

  if (hasSentenceEnding(closingRequest) || closingRequest.includes('부탁')) {
    return ensureSentence(closingRequest);
  }

  if (input.tone === 'warm') {
    return `${closingRequest}해주시면 감사하겠습니다.`;
  }

  return `${closingRequest}해 주세요.`;
}

function buildDraftExample(input: WritingHelperInput) {
  return [
    `${getRecipient(input)}, 안녕하세요.`,
    buildMainLine(input),
    buildClosingLine(input),
  ].filter(Boolean).join('\n');
}

function getOpeningStarters(input: WritingHelperInput) {
  const recipient = getRecipient(input);

  if (input.messageType === 'check_in') {
    return [`${recipient}, 잘 지내고 계신가요?`, `${recipient}, 문득 생각나서 연락드렸습니다.`];
  }

  if (input.tone === 'formal') {
    return [`${recipient}, 안녕하세요.`, `${recipient}께 확인드리고 싶은 내용이 있습니다.`];
  }

  return [`${recipient}, 안녕하세요.`, `${recipient}께 잠깐 전하고 싶은 내용이 있습니다.`];
}

function getBodyGuide(input: WritingHelperInput) {
  const reason = getReason(input);
  const topic = getTopic(input);
  const action = getAction(input);

  return `이유는 "${reason}", 말하고 싶은 내용은 "${topic}", 표현 방식은 "${action}"입니다. 이유를 먼저 말한 뒤 핵심 요청을 이어보세요.`;
}

function getClosingStarters(input: WritingHelperInput) {
  const closingLine = buildClosingLine(input);

  if (input.tone === 'formal') {
    return [closingLine, '확인 후 편하실 때 회신 부탁드립니다.'];
  }

  if (input.tone === 'warm') {
    return [closingLine, '부담 없이 편하실 때 답해 주세요.'];
  }

  return [closingLine, '확인하고 알려주세요.'];
}

function buildSections(input: WritingHelperInput): WritingHelperSection[] {
  const reason = removeSentenceEnding(input.reason);
  const topic = removeSentenceEnding(input.topic);
  const action = removeSentenceEnding(input.action);
  const reasonStarter = reason ? ensureSentence(`${reason} 연락드립니다`) : '연락드린 이유를 먼저 짧게 적어보세요.';
  const topicStarter =
    topic && action ? ensureSentence(`${appendObjectParticle(topic)} ${action}`) : buildMainLine(input);

  return [
    {
      title: '1. 첫 문장',
      guide: '상대가 바로 맥락을 잡을 수 있게 인사와 연락 이유를 짧게 시작하세요.',
      starters: getOpeningStarters(input),
    },
    {
      title: '2. 핵심 내용',
      guide: getBodyGuide(input),
      starters: [reasonStarter, topicStarter],
    },
    {
      title: '3. 마무리',
      guide: '상대가 무엇을 하면 되는지 한 문장으로 끝내세요.',
      starters: getClosingStarters(input),
    },
  ];
}

export function buildWritingHelperResult(input: WritingHelperInput): WritingHelperResult {
  const messageTypeLabel = WRITING_HELPER_MESSAGE_TYPE_LABELS[input.messageType];
  const toneLabel = WRITING_HELPER_TONE_LABELS[input.tone];

  return {
    headline: `${messageTypeLabel}을 ${toneLabel} 정리해봐요`,
    summary: [
      `상대: ${getRecipient(input)}`,
      `이유: ${getReason(input)}`,
      `말할 내용: ${getTopic(input)}`,
      `표현 방식: ${getAction(input)}`,
      `마무리: ${getClosingRequest(input)}`,
    ],
    draftExample: buildDraftExample(input),
    sections: buildSections(input),
    checklist: [
      '첫 문장에서 연락 이유가 보이나요?',
      '핵심 내용이 한 문장으로 정리되나요?',
      '상대가 해야 할 행동이 분명한가요?',
      '불필요한 설명이나 변명이 길어지지 않았나요?',
    ],
  };
}
