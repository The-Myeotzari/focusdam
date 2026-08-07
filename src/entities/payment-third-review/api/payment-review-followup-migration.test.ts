import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

const migrationDirectory = join(process.cwd(), 'supabase', 'migrations');

describe('payment review followup migrations', () => {
  it('defines every scheduled-to-required review transition', () => {
    const migration = readFileSync(
      join(
        migrationDirectory,
        '20260807000000_activate_due_payment_review_followups.sql',
      ),
      'utf8',
    );

    expect(migration).toContain("'buy_satisfaction_required'::public.payment_review_status");
    expect(migration).toContain("'hold_reminder_required'::public.payment_review_status");
    expect(migration).toContain("'rehold_reminder_required'::public.payment_review_status");
    expect(migration).toContain('followup.scheduled_at <= activated_at');
    expect(migration).toContain('review.deleted_at is null');
    expect(migration).toMatch(/for update of followup, review skip locked/i);
  });

  it('schedules the activation function every five minutes', () => {
    const migration = readFileSync(
      join(
        migrationDirectory,
        '20260807010000_schedule_due_payment_review_followups.sql',
      ),
      'utf8',
    );

    expect(migration).toContain("'activate-due-payment-review-followups'");
    expect(migration).toContain("'*/5 * * * *'");
    expect(migration).toContain('public.activate_due_payment_review_followups(100)');
  });
});

