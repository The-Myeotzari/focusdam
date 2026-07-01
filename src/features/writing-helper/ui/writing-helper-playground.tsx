'use client';

import { useMemo, useState } from 'react';

import { createWritingHelperHistoryItem } from '@/features/create-writing-helper-history';
import { updateWritingHelperHistoryItem } from '@/features/update-writing-helper-history';
import { useCopyToClipboard } from '@/shared/lib/use-copy-to-clipboard';

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
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [currentHistoryId, setCurrentHistoryId] = useState<string | null>(null);
  const {
    copyText,
    resetStatus: resetCopyStatus,
    status: copyStatus,
  } = useCopyToClipboard({
    emptyMessage: '복사할 문장을 먼저 작성해주세요.',
    successMessage: '작성한 문장을 복사했습니다.',
  });

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
    resetCopyStatus();
    setIsReportOpen(true);
  };

  const handleUseDraftExample = () => {
    setDraft(result.draftExample);
    resetCopyStatus();

    if (currentHistoryId) {
      updateWritingHelperHistoryItem(currentHistoryId, {
        editedDraft: result.draftExample,
      });
    }
  };

  const handleDraftChange = (nextDraft: string) => {
    setDraft(nextDraft);
    resetCopyStatus();

    if (currentHistoryId) {
      updateWritingHelperHistoryItem(currentHistoryId, {
        editedDraft: nextDraft,
      });
    }
  };

  const handleCopyDraft = async () => {
    await copyText(draft);
  };

  if (isReportOpen) {
    return (
      <WritingHelperReportPanel
        result={result}
        draft={draft}
        copyMessage={copyStatus?.message ?? ''}
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
