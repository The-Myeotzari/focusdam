import { describe, expect, it, vi } from 'vitest';

import { completePaymentThirdReviewReminder } from './complete-payment-third-review-reminder';

function createQuery(result: unknown) {
  const builder = {
    eq: vi.fn(),
    insert: vi.fn(),
    is: vi.fn(),
    limit: vi.fn(),
    maybeSingle: vi.fn(),
    order: vi.fn(),
    select: vi.fn(),
    update: vi.fn(),
  };

  builder.eq.mockReturnValue(builder);
  builder.insert.mockReturnValue(builder);
  builder.is.mockReturnValue(builder);
  builder.limit.mockReturnValue(builder);
  builder.order.mockReturnValue(builder);
  builder.select.mockReturnValue(builder);
  builder.update.mockReturnValue(builder);
  builder.maybeSingle.mockResolvedValue(result);

  return builder;
}

const reviewId = '10000000-0000-0000-0000-000000000001';
const followUpId = '30000000-0000-0000-0000-000000000001';
const goalId = '20000000-0000-0000-0000-000000000001';

function createFrom(queries: Record<string, ReturnType<typeof createQuery>[]>) {
  return vi.fn((table: string) => queries[table]?.shift());
}

describe('completePaymentThirdReviewReminder', () => {
  it('completes a first reminder with a buy decision', async () => {
    const reviewQuery = createQuery({
      data: {
        id: reviewId,
        amount_krw: 78000,
        goal_id: goalId,
        outcome_type: 'hold',
        status: 'hold_reminder_required',
      },
      error: null,
    });
    const followUpQuery = createQuery({
      data: { id: followUpId, sequence: 1, status: 'required' },
      error: null,
    });
    const followUpUpdate = createQuery({ data: { id: followUpId }, error: null });
    const reviewUpdate = createQuery({ data: { id: reviewId }, error: null });
    const from = createFrom({
      payment_reviews: [reviewQuery, reviewUpdate],
      payment_review_followups: [followUpQuery, followUpUpdate],
    });

    const result = await completePaymentThirdReviewReminder(
      { from } as never,
      'user-1',
      reviewId,
      { decision: 'buy', memo: '계속 필요해요' },
    );

    expect(followUpUpdate.update).toHaveBeenCalledWith(
      expect.objectContaining({ reminder_decision: 'buy', status: 'completed' }),
    );
    expect(reviewUpdate.update).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'hold_after_buy', outcome_type: 'buy' }),
    );
    expect(result).toMatchObject({
      ok: true,
      item: { decision: 'buy', status: 'hold_after_buy', outcomeType: 'buy' },
    });
  });

  it('schedules the next reminder after a rehold decision', async () => {
    const reviewQuery = createQuery({
      data: {
        id: reviewId,
        amount_krw: 78000,
        goal_id: goalId,
        outcome_type: 'hold',
        status: 'rehold_reminder_required',
      },
      error: null,
    });
    const followUpQuery = createQuery({
      data: { id: followUpId, sequence: 2, status: 'required' },
      error: null,
    });
    const followUpUpdate = createQuery({ data: { id: followUpId }, error: null });
    const reviewUpdate = createQuery({ data: { id: reviewId }, error: null });
    const nextFollowUp = createQuery({
      data: { id: '30000000-0000-0000-0000-000000000002' },
      error: null,
    });
    const from = createFrom({
      payment_reviews: [reviewQuery, reviewUpdate],
      payment_review_followups: [followUpQuery, followUpUpdate, nextFollowUp],
    });

    const result = await completePaymentThirdReviewReminder(
      { from } as never,
      'user-1',
      reviewId,
      { decision: 'hold', memo: '' },
    );

    expect(reviewUpdate.update).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'rehold_after_hold_scheduled', outcome_type: 'hold' }),
    );
    expect(nextFollowUp.insert).toHaveBeenCalledWith(
      expect.objectContaining({ sequence: 3, status: 'scheduled', followup_type: 'reminder' }),
    );
    expect(result).toMatchObject({
      ok: true,
      item: {
        decision: 'hold',
        status: 'rehold_after_hold_scheduled',
        nextFollowUpId: '30000000-0000-0000-0000-000000000002',
      },
    });
  });

  it('creates a goal saving entry after a cancel decision', async () => {
    const reviewQuery = createQuery({
      data: {
        id: reviewId,
        amount_krw: 78000,
        goal_id: goalId,
        outcome_type: 'hold',
        status: 'hold_reminder_required',
      },
      error: null,
    });
    const followUpQuery = createQuery({
      data: { id: followUpId, sequence: 1, status: 'required' },
      error: null,
    });
    const followUpUpdate = createQuery({ data: { id: followUpId }, error: null });
    const reviewUpdate = createQuery({ data: { id: reviewId }, error: null });
    const savingEntry = createQuery({
      data: { id: '40000000-0000-0000-0000-000000000001' },
      error: null,
    });
    const goalAchievement = createQuery({
      data: { id: '50000000-0000-0000-0000-000000000001' },
      error: null,
    });
    const from = createFrom({
      payment_reviews: [reviewQuery, reviewUpdate],
      payment_review_followups: [followUpQuery, followUpUpdate],
      payment_saving_entries: [savingEntry],
      payment_goal_achievements: [goalAchievement],
    });

    const result = await completePaymentThirdReviewReminder(
      { from } as never,
      'user-1',
      reviewId,
      { decision: 'cancel', memo: '사지 않기로 했어요' },
    );

    expect(savingEntry.insert).toHaveBeenCalledWith({
      user_id: 'user-1',
      goal_id: goalId,
      review_id: reviewId,
      followup_id: followUpId,
      amount_krw: 78000,
      source: 'hold_cancel',
      note: '사지 않기로 했어요',
    });
    expect(result).toMatchObject({
      ok: true,
      item: {
        decision: 'cancel',
        status: 'hold_after_save',
        outcomeType: 'save',
        goalAchievementId: '50000000-0000-0000-0000-000000000001',
      },
    });
  });

  it('rejects a scheduled reminder', async () => {
    const from = createFrom({
      payment_reviews: [
        createQuery({
          data: {
            id: reviewId,
            amount_krw: 78000,
            goal_id: null,
            outcome_type: 'hold',
            status: 'hold_reminder_scheduled',
          },
          error: null,
        }),
      ],
      payment_review_followups: [
        createQuery({ data: { id: followUpId, sequence: 1, status: 'scheduled' }, error: null }),
      ],
    });

    const result = await completePaymentThirdReviewReminder(
      { from } as never,
      'user-1',
      reviewId,
      { decision: 'buy', memo: '' },
    );

    expect(result).toEqual({ ok: false, reason: 'not_ready' });
  });

  it('returns not found without querying follow-ups for another user review', async () => {
    const from = createFrom({
      payment_reviews: [createQuery({ data: null, error: null })],
    });

    const result = await completePaymentThirdReviewReminder(
      { from } as never,
      'user-1',
      reviewId,
      { decision: 'buy', memo: '' },
    );

    expect(from).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ ok: false, reason: 'not_found' });
  });

  it('rejects an already completed reminder', async () => {
    const from = createFrom({
      payment_reviews: [
        createQuery({
          data: {
            id: reviewId,
            amount_krw: 78000,
            goal_id: null,
            outcome_type: 'buy',
            status: 'hold_after_buy',
          },
          error: null,
        }),
      ],
      payment_review_followups: [
        createQuery({ data: { id: followUpId, sequence: 1, status: 'completed' }, error: null }),
      ],
    });

    const result = await completePaymentThirdReviewReminder(
      { from } as never,
      'user-1',
      reviewId,
      { decision: 'buy', memo: '' },
    );

    expect(result).toEqual({ ok: false, reason: 'already_completed' });
  });

  it('restores the review and current follow-up when next reminder creation fails', async () => {
    const reviewQuery = createQuery({
      data: {
        id: reviewId,
        amount_krw: 78000,
        goal_id: null,
        outcome_type: 'hold',
        status: 'hold_reminder_required',
      },
      error: null,
    });
    const followUpQuery = createQuery({
      data: { id: followUpId, sequence: 1, status: 'required' },
      error: null,
    });
    const followUpUpdate = createQuery({ data: { id: followUpId }, error: null });
    const reviewUpdate = createQuery({ data: { id: reviewId }, error: null });
    const nextFollowUp = createQuery({
      data: null,
      error: { message: 'insert next reminder failed' },
    });
    const reviewRollback = createQuery({ data: null, error: null });
    const followUpRollback = createQuery({ data: null, error: null });
    const from = createFrom({
      payment_reviews: [reviewQuery, reviewUpdate, reviewRollback],
      payment_review_followups: [
        followUpQuery,
        followUpUpdate,
        nextFollowUp,
        followUpRollback,
      ],
    });

    const result = await completePaymentThirdReviewReminder(
      { from } as never,
      'user-1',
      reviewId,
      { decision: 'hold', memo: '' },
    );

    expect(reviewRollback.update).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'hold_reminder_required', outcome_type: 'hold' }),
    );
    expect(followUpRollback.update).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'required', reminder_decision: null }),
    );
    expect(result).toEqual({
      ok: false,
      reason: 'database_error',
      errorMessage: 'insert next reminder failed',
    });
  });
});
