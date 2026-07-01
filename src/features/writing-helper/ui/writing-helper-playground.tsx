'use client';

import { useMemo, useState } from 'react';

import { createWritingHelperHistoryItem } from '@/features/create-writing-helper-history';
import { updateWritingHelperHistoryItem } from '@/features/update-writing-helper-history';

import { buildWritingHelperResult } from '../lib/build-writing-helper-result';
import type { WritingHelperInput } from '../model/writing-helper.types';
import { WritingHelperInputPanel } from './writing-helper-input-panel';
import { WritingHelperReportPanel } from './writing-helper-report-panel';

const initialInput: WritingHelperInput = {
  messageType: 'email',
  tone: 'plain',
  recipient: '',
  reason: '',
  topic: '',
  action: '',
  closingRequest: '',
};

export function WritingHelperPlayground() {
  const [input, setInput] = useState<WritingHelperInput>(initialInput);
  const [draft, setDraft] = useState('');
  const [copyMessage, setCopyMessage] = useState('');
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [currentHistoryId, setCurrentHistoryId] = useState<string | null>(null);

  const result = useMemo(() => {
    return buildWritingHelperResult(input);
  }, [input]);

  const handleOpenReport = () => {
    const historyItem = createWritingHelperHistoryItem({
      input,
      result,
    });

    setCurrentHistoryId(historyItem.id);
    setDraft('');
    setCopyMessage('');
    setIsReportOpen(true);
  };

  const handleUseDraftExample = () => {
    setDraft(result.draftExample);
    setCopyMessage('');

    if (currentHistoryId) {
      updateWritingHelperHistoryItem(currentHistoryId, {
        editedDraft: result.draftExample,
      });
    }
  };

  const handleDraftChange = (nextDraft: string) => {
    setDraft(nextDraft);
    setCopyMessage('');

    if (currentHistoryId) {
      updateWritingHelperHistoryItem(currentHistoryId, {
        editedDraft: nextDraft,
      });
    }
  };

  const handleCopyDraft = async () => {
    const trimmedDraft = draft.trim();

    if (!trimmedDraft) {
      setCopyMessage('복사할 문장을 먼저 작성해주세요.');
      return;
    }

    await navigator.clipboard.writeText(trimmedDraft);
    setCopyMessage('작성한 문장을 복사했습니다.');
  };

  if (isReportOpen) {
    return (
      <WritingHelperReportPanel
        result={result}
        draft={draft}
        copyMessage={copyMessage}
        onBack={() => {
          setIsReportOpen(false);
        }}
        onUseDraftExample={handleUseDraftExample}
        onDraftChange={handleDraftChange}
        onCopyDraft={handleCopyDraft}
      />
    );
  }

  return (
    <WritingHelperInputPanel
      input={input}
      onInputChange={setInput}
      onSubmit={handleOpenReport}
    />
  );
}
