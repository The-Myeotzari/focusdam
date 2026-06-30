import { WEEKLY_REVIEW } from '../model/weekly-review.constants';
import type { WeeklyReview } from '../model/weekly-review.types';

export async function getWeeklyReview(): Promise<WeeklyReview> {
  return WEEKLY_REVIEW;
}
