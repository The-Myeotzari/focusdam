'use client';

import { Mail, MessageCircle, PenLine, Send, ShieldCheck } from 'lucide-react';

import {
  WRITING_HELPER_MESSAGE_TYPE_LABELS,
  WRITING_HELPER_MESSAGE_TYPES,
  WRITING_HELPER_TONE_LABELS,
  WRITING_HELPER_TONES,
} from '../model/writing-helper.constants';
import type { WritingHelperInput, WritingHelperMessageType } from '../model/writing-helper.types';

type WritingHelperInputPanelProps = {
  input: WritingHelperInput;
  onInputChange: (input: WritingHelperInput) => void;
  onSubmit: () => void;
};

const messageTypeIcons = {
  email: Mail,
  check_in: MessageCircle,
  request: Send,
  apology: ShieldCheck,
};

export function WritingHelperInputPanel({
  input,
  onInputChange,
  onSubmit,
}: WritingHelperInputPanelProps) {
  const updateInput = (nextInput: Partial<WritingHelperInput>) => {
    onInputChange({
      ...input,
      ...nextInput,
    });
  };

  return (
    <main className="flex flex-col gap-6 px-5 pb-8 pt-4">
      <section className="flex flex-col gap-7">
        <section className="rounded-[32px] bg-white p-6 shadow-[0_12px_30px_rgba(107,142,173,0.08)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase leading-4 tracking-[0.02em] text-[var(--color-primary)]">
                STEP 01
              </p>
              <h2 className="mt-1 text-[22px] font-normal leading-[1.35] tracking-[-0.03em] text-[var(--color-on-surface)]">
                어떤 글인지 골라주세요
              </h2>
            </div>
            <div className="flex size-12 items-center justify-center rounded-full bg-[#e8f5f1] text-[#2d6a4f]">
              <PenLine size={22} aria-hidden="true" />
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2">
            {WRITING_HELPER_MESSAGE_TYPES.map((type) => {
              const Icon = messageTypeIcons[type];
              const isSelected = input.messageType === type;

              return (
                <button
                  key={type}
                  type="button"
                  className="flex min-h-[74px] flex-col items-start justify-between rounded-[16px] border px-4 py-3 text-left transition"
                  style={{
                    borderColor: isSelected ? 'var(--color-primary)' : 'rgba(194,199,206,0.55)',
                    background: isSelected ? '#f0f7f4' : 'var(--color-surface-container-lowest)',
                    color: isSelected ? 'var(--color-primary)' : 'var(--color-on-surface)',
                  }}
                  onClick={() => {
                    updateInput({ messageType: type as WritingHelperMessageType });
                  }}
                >
                  <Icon size={18} aria-hidden="true" />
                  <span className="text-sm font-semibold leading-5">
                    {WRITING_HELPER_MESSAGE_TYPE_LABELS[type]}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-5 grid grid-cols-3 gap-2 rounded-[18px] bg-[var(--color-surface-container-low)] p-1.5">
            {WRITING_HELPER_TONES.map((type) => {
              const isSelected = input.tone === type;

              return (
                <button
                  key={type}
                  type="button"
                  className="min-h-10 rounded-[14px] px-2 text-sm font-semibold transition"
                  style={{
                    background: isSelected ? 'white' : 'transparent',
                    color: isSelected ? 'var(--color-primary)' : 'var(--color-on-surface-variant)',
                    boxShadow: isSelected ? '0 4px 10px rgba(60,95,124,0.08)' : 'none',
                  }}
                  onClick={() => {
                    updateInput({ tone: type });
                  }}
                >
                  {WRITING_HELPER_TONE_LABELS[type]}
                </button>
              );
            })}
          </div>
        </section>

        <section className="rounded-[32px] bg-white p-6 shadow-[0_12px_30px_rgba(107,142,173,0.08)]">
          <div>
            <p className="text-xs font-bold uppercase leading-4 tracking-[0.02em] text-[var(--color-primary)]">
              STEP 02
            </p>
            <h2 className="mt-1 text-[22px] font-normal leading-[1.35] tracking-[-0.03em] text-[var(--color-on-surface)]">
              핵심만 짧게 적어주세요
            </h2>
          </div>

          <div className="mt-5 grid gap-4">
            <WritingHelperTextField
              label="상대"
              placeholder="예) 주임님"
              value={input.recipient}
              onChange={(value) => updateInput({ recipient: value })}
            />
            <WritingHelperTextField
              label="왜 연락하나요?"
              placeholder="예) 급한 사정이 생겨서"
              value={input.reason}
              onChange={(value) => updateInput({ reason: value })}
            />
            <WritingHelperTextField
              label="무엇을 말하고 싶나요?"
              placeholder="예) 모레 연차 사용 가능 여부"
              value={input.topic}
              onChange={(value) => updateInput({ topic: value })}
            />
            <WritingHelperTextField
              label="어떻게 말하고 싶나요?"
              placeholder="예) 여쭤보고자 연락드립니다"
              value={input.action}
              onChange={(value) => updateInput({ action: value })}
            />
            <WritingHelperTextField
              label="마지막에 어떤 반응을 받고 싶나요?"
              placeholder="예) 확인 부탁드립니다"
              value={input.closingRequest}
              onChange={(value) => updateInput({ closingRequest: value })}
            />
          </div>

          <button
            type="button"
            className="site-button site-button--primary mt-5 !min-h-[54px] !w-full !gap-2 !text-base"
            onClick={onSubmit}
          >
            <PenLine size={18} aria-hidden="true" />
            문장 교정하기
          </button>
        </section>
      </section>
    </main>
  );
}

function WritingHelperTextField({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-xs font-semibold text-[var(--color-on-surface-variant)]">
        {label}
      </span>
      <input
        className="site-input !min-h-[54px] !rounded-[16px]"
        placeholder={placeholder}
        value={value}
        onChange={(event) => {
          onChange(event.target.value);
        }}
      />
    </label>
  );
}
