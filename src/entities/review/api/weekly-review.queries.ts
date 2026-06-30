import { WEEKLY_REVIEW, WEEKLY_REVIEW_LIST_ITEMS } from '../model/weekly-review.constants';
import type { WeeklyReview, WeeklyReviewListItem } from '../model/weekly-review.types';

export async function getWeeklyReview(): Promise<WeeklyReview> {
  return WEEKLY_REVIEW;
}

export async function getWeeklyReviewList(): Promise<WeeklyReviewListItem[]> {
  return WEEKLY_REVIEW_LIST_ITEMS;
}
