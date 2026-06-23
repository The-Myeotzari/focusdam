// 기존 유저 홈 화면

import { Play, Zap } from 'lucide-react';

import { SiteBadge, SiteButton, SiteCard } from '@/shared/ui';
import { HomeMetricCard, OngoingActivities } from '@/widgets/home-page';

export function ReturningUserHome() {
  return (
    <>
      {/* 스타터 추천 혹은 진행 중인 스타터 노출 */}
      <section aria-labelledby="today-small-goal">
        <SiteCard
          padded={false}
          className="relative overflow-hidden !rounded-[32px] !border !border-[#c2c7ce33] !bg-white !p-8 !shadow-[0_12px_30px_rgba(107,142,173,0.08)]"
        >
          <div
            className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-[#3c5f7c0d] blur-[32px]"
            aria-hidden="true"
          />

          <SiteBadge
            tone="success"
            className="relative !gap-1.5 !bg-[#e0f2f1] !px-3 !py-1.5 !text-xs !font-semibold !text-[#2f7d73]"
          >
            <Zap size={14} fill="currentColor" aria-hidden="true" />
            오늘의 작은 목표
          </SiteBadge>

          {/*
           - 기존 유저 전용 스타터 추천(스타터 미진행인 경우)
           - 기존 유저 전용 진행 중인 스타터 노출 */}
          <h1
            id="today-small-goal"
            className="relative mt-6 text-[26px] font-normal leading-[1.35] tracking-[-0.03em] text-[var(--color-on-surface)]"
          >
            보고서 목차만 정리하기
          </h1>

          {/* 진행 중인 경우에는 문구 다르게 출력하기 */}
          <p className="relative mt-6 text-sm leading-[1.7] text-[var(--color-on-surface-variant)]">
            큰 산을 넘기 전, 첫 발자국을 떼는 것이 가장 중요합니다.
            <br />
            가벼운 마음으로 10분만 집중해볼까요?
          </p>

          <SiteButton
            href="/starter/current"
            className="relative mt-6 !min-h-[50px] !w-fit !gap-2 !px-7 !text-xs !font-semibold"
          >
            Start Now
            <Play size={17} fill="currentColor" aria-hidden="true" />
          </SiteButton>
        </SiteCard>
      </section>

      {/* 기존 유저 2열 2행 메뉴(스타터 만들기/착수카드/시간카드/금액카드) */}
      <HomeMetricCard aria-label="나의 집중 지표" />

      {/* 기존 유저 진행 중인 활동 */}
      <OngoingActivities />
    </>
  );
}
