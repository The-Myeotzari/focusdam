'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, type FormEvent } from 'react';

import { savePaymentSavingGoalClient } from '@/entities/payment-third-review/api/payment-saving-goal.client';
import { SavePaymentSavingGoalRequestSchema } from '@/entities/payment-third-review/api/payment-saving-goal.schema';
import { parsePaymentReviewWon } from '@/entities/payment-third-review/lib/payment-review-amount';
import { QUERY_KEYS } from '@/shared/constants/query-key';
import { ApiRequestError } from '@/shared/lib/api/api';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  SiteInput,
} from '@/shared/ui';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

// 결제 3심 작성 흐름을 벗어나지 않고 새 저축 목표를 설정합니다.
export function PaymentSavingGoalDialog({ open, onOpenChange }: Props) {
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const saveMutation = useMutation({
    mutationFn: (input: { name: string; targetAmountKrw: number }) =>
      savePaymentSavingGoalClient(input, 'create'),
    onSuccess: (response) => {
      queryClient.setQueryData(QUERY_KEYS.paymentThirdReviews.activeGoal, {
        ok: true,
        item: response.item,
      });
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.paymentThirdReviews.home,
        refetchType: 'none',
      });
      onOpenChange(false);
    },
  });

  const handleAmountChange = (value: string) => {
    const digits = value.replace(/[^0-9]/g, '');
    setAmount(digits ? Number(digits).toLocaleString('ko-KR') : '');
    setValidationError(null);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = SavePaymentSavingGoalRequestSchema.safeParse({
      name,
      targetAmountKrw: parsePaymentReviewWon(amount),
    });

    if (!result.success) {
      setValidationError(result.error.issues[0]?.message ?? '입력값을 확인해주세요.');
      return;
    }

    setValidationError(null);
    saveMutation.mutate(result.data);
  };

  const submitError =
    saveMutation.error instanceof ApiRequestError
      ? saveMutation.error.body.detail
      : saveMutation.error
        ? '목표를 저장하지 못했어요. 잠시 후 다시 시도해주세요.'
        : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새로운 저축 목표를 설정할까요?</DialogTitle>
          <DialogDescription>
            입력 중인 결제 3심은 그대로 유지되며, 저장 즉시 목표 영향을 확인할 수 있어요.
          </DialogDescription>
        </DialogHeader>

        <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-[#42474d]">목표 이름</span>
            <SiteInput
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                setValidationError(null);
              }}
              disabled={saveMutation.isPending}
              maxLength={40}
              placeholder="예: 여행비"
              autoFocus
            />
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-[#42474d]">목표 금액</span>
            <SiteInput
              value={amount}
              onChange={(event) => handleAmountChange(event.target.value)}
              disabled={saveMutation.isPending}
              inputMode="numeric"
              placeholder="예: 1,000,000"
            />
          </label>

          {validationError || submitError ? (
            <p
              role="alert"
              className="rounded-2xl bg-[#f9e9e6] px-4 py-3 text-sm leading-6 text-[#9f3e30]"
            >
              {validationError ?? submitError}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={saveMutation.isPending}
            className="site-button site-button--primary mt-2 w-full"
          >
            {saveMutation.isPending ? '저장 중...' : '목표 설정하기'}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
