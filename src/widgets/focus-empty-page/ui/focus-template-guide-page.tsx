import {
  BanknoteX,
  Heart,
  MessageSquare,
  PlayCircle
} from "lucide-react";
import { SiteTopBar } from "@/shared/ui";

const tools = [
  {
    eyebrow: "1. 실행",
    title: "10분 스타터",
    description: "시작이 가장 힘들 때, 부담 없는 10분만 먼저 움직여 보세요.",
    icon: PlayCircle,
    color: "#8a6221",
    iconClassName: "bg-[#eeeae7] text-[#8a6221]"
  },
  {
    eyebrow: "2. 감정",
    title: "15초 리셋",
    description: "갑자기 밀려오는 불안이나 짜증을 15초의 호흡으로 잠재웁니다.",
    icon: Heart,
    color: "#e91668",
    iconClassName: "bg-[#ffe5ef] text-[#e91668]"
  },
  {
    eyebrow: "3. 소비",
    title: "결제 3심",
    description: "충동적인 구매 버튼을 누르기 전, 세 번만 더 질문해 보세요.",
    icon: BanknoteX,
    color: "#248337",
    iconClassName: "bg-[#e5f5e9] text-[#248337]"
  },
  {
    eyebrow: "4. 대화",
    title: "문장 템플릿",
    description: "거절하거나 의견을 말하기 어려울 때 바로 쓰는 문장 가이드.",
    icon: MessageSquare,
    color: "#0a61b9",
    iconClassName: "bg-[#e0f1ff] text-[#0a61b9]"
  }
] as const;

export function FocusTemplateGuidePage() {
  return (
    <main className="relative isolate mx-auto flex min-h-[100svh] w-full max-w-[390px] flex-col bg-[#faf9fc] pb-[194px] font-['42dot_Sans','Hanken_Grotesk','Noto_Sans_KR',sans-serif]">
      <SiteTopBar title="집중이담" backHref="/focus" variant="leading" className="z-[1]" />

      <section className="flex w-full flex-1 flex-col items-center px-5 pb-8 pt-8">
        <section className="flex w-full flex-col items-center gap-3 pb-10 text-center">
          <h2 className="m-0 text-[16px] font-medium leading-6 text-[#1a1c1e]">
            지금 필요한 도움을 바로 선택하세요
          </h2>
          <p className="m-0 w-[299px] text-[16px] font-medium leading-6 text-[#42474d]">
            일상의 집중력이 흐트러질 때, 감정을 다스리거나 행동을 시작하는 가장 빠른 길을
            제안합니다.
          </p>
        </section>

        <section className="flex w-full flex-col gap-6" aria-label="템플릿 설명 목록">
          {tools.map((tool) => {
            const Icon = tool.icon;

            return (
              <button
                key={tool.title}
                type="button"
                className="flex h-56 w-full flex-col items-start gap-4 rounded-[32px] border border-[#c2c7ce4d] bg-white p-6 text-left shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
              >
                <span className={`flex size-14 items-center justify-center rounded-full ${tool.iconClassName}`}>
                  <Icon size={28} strokeWidth={2.4} aria-hidden="true" />
                </span>
                <span className="flex w-full flex-col gap-1">
                  <span
                    className="font-['Hanken_Grotesk','Noto_Sans_KR',sans-serif] text-[13px] font-semibold leading-[18px] tracking-[0.52px]"
                    style={{ color: tool.color }}
                  >
                    {tool.eyebrow}
                  </span>
                  <span className="text-[16px] font-medium leading-6 text-[#1a1c1e]">{tool.title}</span>
                  <span className="pt-1 text-[16px] font-medium leading-6 text-[#42474d]">
                    {tool.description}
                  </span>
                </span>
              </button>
            );
          })}
        </section>
      </section>

      <div className="fixed bottom-[var(--bottom-nav-height)] left-1/2 z-[2] flex h-[108px] w-full max-w-[390px] -translate-x-1/2 items-start justify-center bg-[#faf9fccc] px-5 py-6 backdrop-blur">
        <button
          type="button"
          className="flex h-[60px] w-full max-w-[448px] items-center justify-center rounded-full bg-[#3c5f7c] text-[18px] font-medium leading-7 text-white opacity-50 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-4px_rgba(0,0,0,0.1)]"
        >
          선택한 기능 열기
        </button>
      </div>

    </main>
  );
}
