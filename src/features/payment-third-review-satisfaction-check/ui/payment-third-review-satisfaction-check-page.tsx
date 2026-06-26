'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Check, Circle, SmilePlus } from 'lucide-react';
import { useState } from 'react';

import type { PaymentReviewHistoryItem } from '@/entities/payment-third-review';
import { SiteTopBar } from '@/shared/ui';

type Props = {
  item: PaymentReviewHistoryItem;
};

type SatisfactionOption = {
  label: string;
  score: number;
  summary: string;
};

const satisfactionOptions: SatisfactionOption[] = [
  { label: '아쉬워요', score: 2, summary: '낮음' },
  { label: '괜찮아요', score: 3, summary: '보통' },
  { label: '만족해요', score: 4, summary: '만족' },
];

// 결제 3심 만족도 체크 상태에 맞는 입력 또는 결과 화면을 렌더링합니다.
export function PaymentThirdReviewSatisfactionCheckPage({ item }: Props) {
  const router = useRouter();
  const [selectedScore, setSelectedScore] = useState<number | null>(null);
  const [memo, setMemo] = useState('');
  const isRequired = item.satisfaction?.status === 'required';
  const selectedOption = satisfactionOptions.find((option) => option.score === selectedScore);

  // 만족도 체크 결과를 제출하고 상세 페이지로 이동합니다.
  const handleSubmit = () => {
    if (!selectedOption) {
      return;
    }

    const payload = {
      paymentThirdReviewId: item.id,
      memo,
      score: selectedOption.score,
      summary: selectedOption.summary,
    };

    console.group('[payment-third-review] satisfaction-check payload');
    console.log(payload);
    console.groupEnd();
    // TODO: 백엔드 연동 시 여기에서 만족도 체크 payload를 Server Action 또는 mutation으로 넘기면 됩니다.

    router.replace(`/payment-third-review/list/${item.id}`);
  };

  return (
    <>
      <SiteTopBar
        title="만족도 체크"
        backHref={`/payment-third-review/list/${item.id}`}
        skipHref="/payment-third-review"
      />
      <main className="mx-auto flex min-h-[calc(100svh-56px)] w-full max-w-[430px] flex-col gap-5 px-5 pb-8 pt-4">
        <section className="rounded-[32px] bg-[#e6f1ee] p-6">
          <span className="grid size-14 place-items-center rounded-full bg-white/70 text-[#3c5f7c]">
            <SmilePlus size={28} strokeWidth={2.1} aria-hidden="true" />
          </span>
          <p className="mt-6 text-sm font-semibold leading-6 text-[#3c5f7c]">{item.itemName}</p>
          <h1 className="mt-1 text-[30px] font-semibold leading-[40px] text-[#1a1c1e]">
            결제 후 만족도는
            <br />
            어땠나요?
          </h1>
          <p className="mt-4 text-[15px] leading-7 text-[#595f66]">
            {item.amount} 결제가 실제로 만족스러웠는지 기록해요.
          </p>
        </section>

        {item.satisfaction?.status === 'completed' && item.satisfaction.result ? (
          <SatisfactionResult item={item} />
        ) : null}

        {item.satisfaction?.status === 'scheduled' ? (
          <section className="rounded-[26px] border border-[#dce3ea] bg-white/60 px-5 py-4">
            <p className="text-xs font-semibold leading-5 text-[#72777e]">체크 예정</p>
            <p className="mt-1 text-[17px] font-semibold leading-7 text-[#1a1c1e]">
              {item.followUpLabel} 만족도를 확인해요
            </p>
          </section>
        ) : null}

        {isRequired ? (
          <section className="grid gap-3" aria-labelledby="satisfaction-check-form-title">
            <h2
              id="satisfaction-check-form-title"
              className="text-lg font-semibold leading-7 text-[#1a1c1e]"
            >
              만족도 선택
            </h2>
            <div className="grid gap-2">
              {satisfactionOptions.map((option) => (
                <SatisfactionChoice
                  key={option.score}
                  checked={selectedScore === option.score}
                  option={option}
                  onClick={() => setSelectedScore(option.score)}
                />
              ))}
            </div>

            <label className="grid gap-2">
              <span className="text-sm font-semibold leading-6 text-[#72777e]">회고 메모</span>
              <textarea
                value={memo}
                onChange={(event) => setMemo(event.target.value)}
                rows={4}
                placeholder="실제로 잘 썼는지, 아쉬웠던 점이 있었는지 적어보세요."
                className="resize-none rounded-[24px] border border-transparent bg-white px-5 py-4 text-[16px] font-medium leading-7 text-[#1a1c1e] shadow-[0_4px_12px_rgba(0,0,0,0.04)] outline-none placeholder:text-[#9da3aa] focus:border-[#3c5f7c]"
              />
            </label>
          </section>
        ) : null}

        <div className="mt-auto grid gap-2 pt-4">
          {isRequired ? (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!selectedOption}
              className={[
                'flex min-h-[62px] w-full items-center justify-center rounded-full px-6 text-[17px] font-semibold leading-7 text-white',
                selectedOption
                  ? 'bg-[#3c5f7c] shadow-[0_20px_25px_-5px_rgba(60,95,124,0.2)]'
                  : 'cursor-not-allowed bg-[#d7dde3]',
              ].join(' ')}
            >
              체크 완료
            </button>
          ) : (
            <Link
              href={`/payment-third-review/list/${item.id}`}
              className="flex min-h-[62px] w-full items-center justify-center rounded-full bg-[#3c5f7c] px-6 text-[17px] font-semibold leading-7 text-white shadow-[0_20px_25px_-5px_rgba(60,95,124,0.2)]"
            >
              상세로 돌아가기
            </Link>
          )}
        </div>
      </main>
    </>
  );
}

// 만족도 체크 선택지를 버튼으로 렌더링합니다.
function SatisfactionChoice({
  checked,
  onClick,
  option,
}: {
  checked: boolean;
  onClick: () => void;
  option: SatisfactionOption;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'flex min-h-[76px] items-center gap-3 rounded-[24px] border bg-white px-4 text-left shadow-[0_4px_12px_rgba(0,0,0,0.04)]',
        checked ? 'border-[#3c5f7c]' : 'border-transparent',
      ].join(' ')}
      aria-pressed={checked}
    >
      <span
        className={[
          'grid size-10 shrink-0 place-items-center rounded-full',
          checked ? 'bg-[#dde3eb] text-[#3c5f7c]' : 'bg-[#f4f3f6] text-[#72777e]',
        ].join(' ')}
      >
        {checked ? <Check size={18} strokeWidth={2.4} /> : <Circle size={18} strokeWidth={2.2} />}
      </span>
      <span>
        <span className="block text-[17px] font-semibold leading-7 text-[#1a1c1e]">
          {option.label}
        </span>
        <span className="block text-sm leading-6 text-[#72777e]">{option.score}/5</span>
      </span>
    </button>
  );
}

// 이미 완료된 만족도 체크 결과를 읽기 전용으로 보여줍니다.
function SatisfactionResult({ item }: { item: PaymentReviewHistoryItem }) {
  const result = item.satisfaction?.result;

  if (!result) {
    return null;
  }

  return (
    <section className="rounded-[28px] bg-white px-5 py-1 shadow-[0_4px_12px_rgba(0,0,0,0.04)]">
      <ResultRow label="체크 일자" value={result.checkedAt} />
      <ResultRow label="만족도" value={`${result.summary} ${result.score}/5`} />
      <ResultRow label="회고 메모" value={result.memo} />
    </section>
  );
}

// 만족도 체크 결과의 한 줄 정보를 렌더링합니다.
function ResultRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-[#eceff2] py-4 last:border-b-0">
      <p className="shrink-0 text-sm font-medium leading-6 text-[#72777e]">{label}</p>
      <p className="text-right text-[16px] font-semibold leading-6 text-[#1a1c1e]">{value}</p>
    </div>
  );
}
