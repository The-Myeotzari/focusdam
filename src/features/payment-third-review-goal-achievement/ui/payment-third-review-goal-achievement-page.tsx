'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { toPng } from 'html-to-image';
import { Award, Download, ListChecks, Sparkles } from 'lucide-react';

import {
  formatPaymentReviewWon,
  getPaymentReviewGoalAchievementTriggerLabel,
  type PaymentReviewGoalAchievement,
} from '@/entities/payment-third-review';
import { SiteTopBar } from '@/shared/ui';

type Props = {
  achievement: PaymentReviewGoalAchievement;
};

// 결제 3심 저축 반영으로 목표를 달성했을 때 축하 화면을 렌더링합니다.
export function PaymentThirdReviewGoalAchievementPage({ achievement }: Props) {
  const shareCardRef = useRef<HTMLElement>(null);
  const formattedTargetAmount = formatPaymentReviewWon(achievement.targetAmount);
  const formattedSavedAmount = formatPaymentReviewWon(achievement.savedAmount);
  const formattedAchievedAmount = formatPaymentReviewWon(achievement.achievedAmount);
  const triggerStatusLabel = getPaymentReviewGoalAchievementTriggerLabel(
    achievement.triggerStatus,
  );

  // 화면에 보이는 공유용 목표 달성 카드 그대로 PNG 이미지로 저장합니다.
  const handleDownloadImage = async () => {
    if (!shareCardRef.current) {
      return;
    }

    const imageUrl = await toPng(shareCardRef.current, {
      cacheBust: true,
      pixelRatio: 3,
    });

    downloadDataUrl(imageUrl, `payment-review-goal-achievement-${achievement.id}.png`);
  };

  return (
    <>
      <SiteTopBar
        title="목표 달성"
        backHref="/payment-third-review"
        skipHref="/payment-third-review"
      />
      <main className="mx-auto flex min-h-[calc(100svh-56px)] w-full max-w-[430px] flex-col gap-5 px-5 pb-8 pt-4">
        <section className="px-4 py-7 text-center">
          <span className="relative mx-auto grid size-24 place-items-center">
            <span className="absolute inset-2 rounded-full bg-[#e6f1ee] opacity-60 [animation:goal-pulse_1.8s_ease-in-out_infinite]" />
            <span className="absolute right-0 top-2 text-[#3c5f7c] [animation:goal-spark_1.4s_ease-in-out_infinite]">
              <Sparkles size={18} strokeWidth={2.2} aria-hidden="true" />
            </span>
            <span className="absolute bottom-4 left-1 text-[#7aa494] [animation:goal-spark_1.4s_ease-in-out_0.35s_infinite]">
              <Sparkles size={14} strokeWidth={2.2} aria-hidden="true" />
            </span>
            <span className="relative grid size-20 place-items-center rounded-full bg-white text-[#3c5f7c] shadow-[0_16px_32px_rgba(60,95,124,0.12)] [animation:goal-celebrate_1.8s_ease-in-out_infinite]">
              <Award size={38} strokeWidth={2.05} aria-hidden="true" />
            </span>
          </span>
          <p className="mt-6 text-sm font-semibold leading-6 text-[#3c5f7c]">
            결제 3심 목표 달성
          </p>
          <h1 className="mt-1 text-[32px] font-semibold leading-[42px] text-[#1a1c1e]">
            목표 달성!
          </h1>
          <p className="mt-3 text-[15px] font-medium leading-7 text-[#5f656c]">
            저축 반영으로 {achievement.goalName} 목표에 도달했어요.
          </p>
        </section>

        <section
          ref={shareCardRef}
          className="relative overflow-hidden rounded-[32px] border border-[#cfe5df] bg-white shadow-[0_20px_40px_rgba(60,95,124,0.08)]"
          aria-label="목표 달성 공유 카드"
        >
          <div className="bg-[#f1faf7] px-6 pb-7 pt-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold leading-6 text-[#3c5f7c]">
                  {achievement.achievedAt}
                </p>
                <h2 className="mt-1 text-[30px] font-semibold leading-[38px] text-[#1a1c1e]">
                  {achievement.goalName}
                </h2>
              </div>
              <span className="grid size-16 shrink-0 place-items-center rounded-full bg-white text-[#3c5f7c] shadow-[0_14px_28px_rgba(60,95,124,0.1)]">
                <Sparkles size={30} strokeWidth={2.1} aria-hidden="true" />
              </span>
            </div>
          </div>
          <div className="border-t border-dashed border-[#cfe5df] px-6 py-7">
            <p className="text-sm font-semibold leading-6 text-[#72777e]">달성 금액</p>
            <p className="mt-2 text-[44px] font-semibold leading-[52px] text-[#1a1c1e]">
              {formattedAchievedAmount}
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <ShareStat label="목표 금액" value={formattedTargetAmount} />
              <ShareStat label="저축 반영" value={formattedSavedAmount} />
            </div>
            <p className="mt-6 rounded-[24px] bg-[#f4f3f6] px-4 py-4 text-center text-[15px] font-semibold leading-6 text-[#5f656c]">
              총 {achievement.savedReviewCount}번의 소비를 목표로 바꿨어요.
            </p>
            <div className="mt-5 grid gap-3 border-t border-[#edf0f2] pt-5">
              <TicketSummaryRow label="달성일" value={achievement.achievedAt} />
              <TicketSummaryRow label="달성 방식" value={triggerStatusLabel} />
            </div>
          </div>
        </section>

        <div className="mt-auto grid gap-2 pt-4">
          <button
            type="button"
            onClick={handleDownloadImage}
            className="flex min-h-[62px] w-full items-center justify-center gap-2 rounded-full bg-[#3c5f7c] px-6 text-[17px] font-semibold leading-7 text-white shadow-[0_20px_25px_-5px_rgba(60,95,124,0.2)]"
          >
            이미지 저장하기
            <Download size={18} strokeWidth={2.2} aria-hidden="true" />
          </button>
          <Link
            href="/payment-third-review/goal-achievement"
            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full text-sm font-semibold leading-5 text-[#42474d]"
          >
            <ListChecks size={16} strokeWidth={2.2} aria-hidden="true" />
            달성 기록 보기
          </Link>
        </div>
        <style jsx>{`
          @keyframes goal-celebrate {
            0%,
            100% {
              transform: translateY(0) rotate(0deg) scale(1);
            }
            35% {
              transform: translateY(-5px) rotate(-4deg) scale(1.04);
            }
            70% {
              transform: translateY(-2px) rotate(4deg) scale(1.02);
            }
          }

          @keyframes goal-pulse {
            0%,
            100% {
              transform: scale(0.9);
              opacity: 0.45;
            }
            50% {
              transform: scale(1.08);
              opacity: 0.8;
            }
          }

          @keyframes goal-spark {
            0%,
            100% {
              transform: translateY(0) scale(0.9);
              opacity: 0.45;
            }
            50% {
              transform: translateY(-4px) scale(1.12);
              opacity: 1;
            }
          }
        `}</style>
      </main>
    </>
  );
}

// 목표 달성 공유 카드의 작은 통계 값을 렌더링합니다.
function ShareStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[22px] bg-[#f7f8f8] px-4 py-4">
      <p className="text-sm font-semibold leading-5 text-[#72777e]">{label}</p>
      <p className="mt-2 text-[18px] font-semibold leading-7 text-[#1a1c1e]">{value}</p>
    </div>
  );
}

// 티켓 카드 안에서 달성 요약 정보를 한 줄로 보여줍니다.
function TicketSummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 text-[14px] leading-5">
      <span className="font-semibold text-[#72777e]">{label}</span>
      <span className="text-right font-semibold text-[#1a1c1e]">{value}</span>
    </div>
  );
}

// data URL을 파일로 내려받습니다.
function downloadDataUrl(dataUrl: string, fileName: string) {
  const link = document.createElement('a');

  link.href = dataUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
}
