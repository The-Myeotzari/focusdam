import {
  AlarmClock,
  BellRing,
  CalendarCheck,
  CheckCircle2,
  Clock3,
  CreditCard,
  MessageCircle,
  PiggyBank,
  RotateCcw,
  Sparkles,
  Target,
} from 'lucide-react';

import type { WeeklyReview } from './weekly-review.types';

export const WEEKLY_REVIEW: WeeklyReview = {
  weekLabel: '6월 4주',
  summary: {
    title: '착수 12회 · 절약 86,000원',
    description: '이번 주 행동 변화를 숫자로 쌓았습니다.',
    savedAmount: '86,000원',
    startedCount: '12회',
  },
  summaryMetrics: [
    {
      id: 'routine',
      label: 'D7 유지',
      value: '5일 사용',
      description: '주간 루틴이 끊기지 않고 이어졌어요.',
      tone: 'success',
    },
    {
      id: 'goal',
      label: '후·선 착수',
      value: '달성',
      description: '계획한 착수 목표를 채웠습니다.',
      tone: 'caution',
    },
    {
      id: 'return-rate',
      label: '복귀율',
      value: '68%',
      description: '흔들린 뒤 다시 돌아온 비율입니다.',
      tone: 'premium',
    },
  ],
  plusFeatures: [
    {
      id: 'time',
      title: '시간대/감정/소비 패턴',
      description: '당신의 실행 패턴을 더 자세히 분석해요.',
      icon: CalendarCheck,
    },
    {
      id: 'context',
      title: '상황별 문장 추천',
      description: '자주 막히는 순간에 쓸 수 있는 문장을 제안해요.',
      icon: Sparkles,
    },
    {
      id: 'archive',
      title: '동기화/기록 보관',
      description: '기록을 오래 보관하고 흐름을 비교해요.',
      icon: BellRing,
    },
  ],
  insights: [
    {
      id: 'time-window',
      badge: '실행 리포트',
      title: '시작이 쉬워진 시간대',
      description:
        '언제 착수가 잘 됐는지 패턴을 보여줍니다. 이번 주 당신의 황금 시간대를 확인해 보세요.',
      accent: 'blue',
      sections: [
        {
          id: 'best-time',
          subject: '착수 최다 시간',
          content:
            '이번 주 가장 자주 시작한 시간은 오전 10시였습니다. 집중을 시작하기 전 준비 시간이 짧고, 방해 요소가 적은 구간으로 보입니다.',
        },
        {
          id: 'average-start',
          subject: '지난 주 대비 변화',
          content:
            '평균 시작 지연은 지난 주보다 14분 줄었습니다. 시작을 미루는 시간이 짧아졌고, 루틴에 들어가는 속도가 조금 더 안정됐습니다.',
        },
        {
          id: 'recommend-time',
          subject: '다음 주 제안',
          content:
            '다음 주에도 오전 루틴을 유지해보세요. 알림은 오전 10시 직전에 두고, 시작 단위는 10분 이하로 작게 잡는 편이 좋습니다.',
        },
      ],
    },
    {
      id: 'spending-effect',
      badge: '소비 리포트',
      title: '결제 3심이 효과를 냈어요',
      description: '보류와 취소 전환을 통해 실제 절약된 지출을 모았습니다.',
      accent: 'orange',
      sections: [
        {
          id: 'saved',
          subject: '절약 누적',
          content:
            '이번 주 결제 3심을 거치며 86,000원을 아꼈습니다. 금액보다 중요한 점은 결제 직전 멈추는 행동이 반복됐다는 것입니다.',
        },
        {
          id: 'hold-rate',
          subject: '보류 성공률',
          content:
            '보류 후 결제를 멈춘 비율은 63%였습니다. 즉시 결제보다 한 번 미루는 선택이 실제 지출 감소로 이어졌습니다.',
        },
      ],
    },
    {
      id: 'reset-return',
      badge: '감정 리포트',
      title: '리셋 후 다시 돌아온 비율',
      description: '감정이 흔들렸던 순간과 행동 복귀율을 함께 봅니다.',
      accent: 'pink',
      sections: [
        {
          id: 'reset-count',
          subject: '리셋 사용',
          content:
            '이번 주 리셋은 6회 사용했습니다. 흔들림을 무시하지 않고 알아차린 기록이 남아 있다는 점이 먼저 좋은 신호입니다.',
        },
        {
          id: 'return-success',
          subject: '복귀 성공',
          content:
            '리셋 이후 다시 루틴으로 돌아온 횟수는 4회였습니다. 완벽하게 유지하는 것보다 돌아오는 힘이 더 분명하게 쌓였습니다.',
        },
        {
          id: 'repeat-emotion',
          subject: '반복 감정',
          content:
            '가장 자주 기록된 감정은 불안이었습니다. 다음 주에는 불안이 올라오는 순간 바로 끝내기보다, 7분짜리 복귀 행동을 먼저 두는 편이 좋습니다.',
        },
      ],
    },
    {
      id: 'dialogue',
      badge: '대화 리포트',
      title: '자주 막힌 대화 상황',
      description: '복사·저장한 문장을 기반으로 필요한 말들을 추천합니다.',
      accent: 'purple',
      sections: [
        {
          id: 'request',
          subject: '가장 자주 막힌 상황',
          content:
            '이번 주에는 요청 상황에서 가장 자주 멈췄습니다. 필요한 것을 말하기 전 상대 반응을 먼저 걱정하는 흐름이 반복됐습니다.',
        },
        {
          id: 'copy',
          subject: '도움이 된 문장',
          content:
            '문장 복사는 5회 발생했습니다. 직접 쓰기 어려운 말은 미리 만든 문장으로 시작하면 부담이 줄어드는 패턴이 보입니다.',
        },
        {
          id: 'saved-message',
          subject: '다음에 다시 쓸 문장',
          content:
            '저장한 문장은 2개입니다. 다음 주에는 요청, 피드백, 일정 조정 상황별로 하나씩만 더 모아도 충분합니다.',
        },
      ],
    },
  ],
  goal: {
    title: '이번 주 목표를 달성했어요',
    description: '작은 성공을 다음 주 반복으로 연결합니다.',
    progressLabel: '4/4회 완료',
    completed: 4,
    total: 4,
  },
  recommendation: {
    title: '다음 주는 이렇게 해볼까요?',
    description: '이번 주 데이터를 바탕으로 더 나은 흐름을 위한 작은 조정을 제안합니다.',
    actions: [
      {
        id: 'alarm',
        label: '착수 알림',
        value: '오전 10시',
        description: '반복된 성공 시간에 맞춰 알려드려요.',
        tone: 'success',
      },
      {
        id: 'spending-goal',
        label: '소비 목표',
        value: '보류 10만원',
        description: '이번 주보다 조금 높은 절약 목표입니다.',
        tone: 'caution',
      },
      {
        id: 'recovery',
        label: '실패 단위',
        value: '10분 -> 7분',
        description: '복귀 시작 단위를 더 짧게 가져갑니다.',
        tone: 'premium',
      },
    ],
  },
};

export const WEEKLY_REVIEW_SUMMARY_ICONS = [AlarmClock, Target, RotateCcw] as const;
export const WEEKLY_REVIEW_DETAIL_ICONS = [Clock3, CreditCard, RotateCcw, MessageCircle] as const;
export const WEEKLY_REVIEW_RECOMMENDATION_ICONS = [BellRing, PiggyBank, CheckCircle2] as const;
