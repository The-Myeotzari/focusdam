'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowRight, Flag } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, type FormEvent } from 'react';

import { activePaymentSavingGoalQueryOptions } from '@/entities/payment-third-review/api/payment-third-review-query-options';
import { savePaymentSavingGoalClient } from '@/entities/payment-third-review/api/payment-saving-goal.client';
import { validatePaymentSavingGoalForm } from '@/entities/payment-third-review/lib/payment-saving-goal-form';
import { getPaymentThirdReviewSubmitErrorMessage } from '@/entities/payment-third-review/lib/payment-third-review-submit-error';
import { PaymentThirdReviewSubmitError } from '@/entities/payment-third-review';
import { QUERY_KEYS } from '@/shared/constants/query-key';
import { SiteButton, SiteInput, SiteTopBar } from '@/shared/ui';

export function PaymentThirdReviewGoalSettingPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const goalQuery = useQuery(activePaymentSavingGoalQueryOptions());
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [touchedFields, setTouchedFields] = useState({ amount: false, name: false });
  const [initializedGoalId, setInitializedGoalId] = useState<string | null | undefined>(
    undefined,
  );
  const activeGoal = goalQuery.data?.item ?? null;
  const formValidation = validatePaymentSavingGoalForm(name, amount);
  const isFormValid = Boolean(formValidation.data);
  const saveMutation = useMutation({
    mutationFn: (input: { name: string; targetAmountKrw: number }) =>
      savePaymentSavingGoalClient(input, activeGoal ? 'update' : 'create'),
    onSuccess: async (response) => {
      queryClient.setQueryData(QUERY_KEYS.paymentThirdReviews.activeGoal, {
        ok: true,
        item: response.item,
      });
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.paymentThirdReviews.home,
      });
      router.replace('/payment-third-review');
    },
  });

  useEffect(() => {
    if (!goalQuery.isSuccess || initializedGoalId !== undefined) {
      return;
    }

    const goal = goalQuery.data.item;
    setName(goal?.name ?? '');
    setAmount(goal ? goal.targetAmountKrw.toLocaleString('ko-KR') : '');
    setInitializedGoalId(goal?.id ?? null);
  }, [goalQuery.data, goalQuery.isSuccess, initializedGoalId]);

  const handleAmountChange = (value: string) => {
    const digits = value.replace(/[^0-9]/g, '');
    setAmount(digits ? Number(digits).toLocaleString('ko-KR') : '');
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setTouchedFields({ amount: true, name: true });

    retrySubmit();
  };

  const retrySubmit = () => {
    if (!formValidation.data || saveMutation.isPending) {
      return;
    }

    saveMutation.mutate(formValidation.data);
  };

  const submitError = getPaymentThirdReviewSubmitErrorMessage(saveMutation.error, 'goal');

  return (
    <>
      <SiteTopBar
        title="목표 설정"
        backHref="/payment-third-review"
        skipHref="/payment-third-review"
      />
      <form
        onSubmit={handleSubmit}
        className="mx-auto flex min-h-[calc(100svh-56px)] w-full max-w-[430px] flex-col gap-5 px-5 pb-8 pt-4"
      >
        <section className="rounded-[32px] bg-[#e6f4f1] px-5 py-6">
          <span className="grid size-12 place-items-center rounded-full bg-white text-[#3c5f7c] shadow-[0_8px_18px_rgba(60,95,124,0.08)]">
            <Flag size={24} strokeWidth={2.1} aria-hidden="true" />
          </span>
          <h1 className="mt-5 text-[26px] font-semibold leading-9 text-[#1a1c1e]">
            결제 3심 목표를
            <br />
            {activeGoal ? '수정해요' : '설정해요'}
          </h1>
          <p className="mt-3 text-sm font-medium leading-6 text-[#5f656c]">
            이번 달 결제 전 점검에서 비교할 기준 금액입니다.
          </p>
        </section>

        {goalQuery.isError ? (
          <div
            className="rounded-[20px] border border-[#eadfdd] bg-white p-4 text-sm text-[#72777e]"
            role="alert"
          >
            <p>기존 목표를 불러오지 못했어요.</p>
            <button
              type="button"
              onClick={() => void goalQuery.refetch()}
              className="mt-2 font-semibold text-[#3c5f7c]"
            >
              다시 불러오기
            </button>
          </div>
        ) : null}

        <label className="grid gap-2">
          <span className="text-xs font-medium leading-5 text-[#72777e]">목표 이름</span>
          <SiteInput
            value={name}
            onChange={(event) => setName(event.target.value)}
            onBlur={() => setTouchedFields((current) => ({ ...current, name: true }))}
            aria-invalid={touchedFields.name && Boolean(formValidation.errors.name)}
            aria-describedby="payment-saving-goal-name-error"
            maxLength={40}
            placeholder="예: 여행비"
            disabled={goalQuery.isPending || saveMutation.isPending}
            className="!min-h-[56px] !rounded-[20px] !border-transparent !bg-white !shadow-[0_4px_12px_rgba(0,0,0,0.04)]"
          />
          {touchedFields.name && formValidation.errors.name ? (
            <span
              id="payment-saving-goal-name-error"
              className="text-sm font-medium leading-6 text-[#ba1a1a]"
            >
              {formValidation.errors.name}
            </span>
          ) : null}
        </label>

        <label className="grid gap-2">
          <span className="text-xs font-medium leading-5 text-[#72777e]">목표 금액</span>
          <span className="relative block">
            <SiteInput
              value={amount}
              onChange={(event) => handleAmountChange(event.target.value)}
              onBlur={() => setTouchedFields((current) => ({ ...current, amount: true }))}
              aria-invalid={touchedFields.amount && Boolean(formValidation.errors.amount)}
              aria-describedby="payment-saving-goal-amount-error"
              inputMode="numeric"
              placeholder="예: 86,000"
              disabled={goalQuery.isPending || saveMutation.isPending}
              className="!min-h-[64px] !rounded-[24px] !border-transparent !py-0 !pl-5 !pr-12 !text-[24px] !font-semibold !leading-8 !shadow-[0_4px_12px_rgba(0,0,0,0.04)]"
            />
            <span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-[20px] font-semibold leading-7 text-[#72777e]">
              원
            </span>
          </span>
          {touchedFields.amount && formValidation.errors.amount ? (
            <span
              id="payment-saving-goal-amount-error"
              className="text-sm font-medium leading-6 text-[#ba1a1a]"
            >
              {formValidation.errors.amount}
            </span>
          ) : null}
        </label>

        {submitError ? (
          <PaymentThirdReviewSubmitError
            isRetrying={saveMutation.isPending}
            message={submitError}
            onRetry={retrySubmit}
          />
        ) : null}

        <div className="mt-auto grid gap-2 pt-4">
          <button
            type="submit"
            disabled={
              goalQuery.isPending || goalQuery.isError || saveMutation.isPending || !isFormValid
            }
            className="site-button site-button--primary min-h-[62px] w-full gap-2 rounded-full px-6 text-[17px] font-semibold disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saveMutation.isPending ? '저장 중...' : activeGoal ? '목표 수정' : '목표 저장'}
            <ArrowRight size={18} strokeWidth={2.2} aria-hidden="true" />
          </button>
          <SiteButton
            href="/payment-third-review"
            variant="secondary"
            className="!min-h-12 !w-full !rounded-full !text-sm !font-semibold"
          >
            돌아가기
          </SiteButton>
        </div>
      </form>
    </>
  );
}
