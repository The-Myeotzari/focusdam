import Link from "next/link";
import { ArrowLeft, CheckCircle, Info } from "lucide-react";

const thoughtPatterns = [
  { title: "재앙화", quote: "\"다 망한 것 같아\"" },
  { title: "흑백논리", quote: "\"완벽 아니면 실패야\"" },
  { title: "개인화", quote: "\"전부 내 탓이야\"" },
  { title: "과잉일반화", quote: "\"항상 이래\"" }
] as const;

export function FocusEmotionThoughtPage() {
  return (
    <main className="relative mx-auto flex min-h-[100svh] w-full max-w-[390px] flex-col overflow-hidden bg-[#faf9fc] pb-[134px] font-['42dot_Sans','Hanken_Grotesk','Noto_Sans_KR',sans-serif]">
      <header className="z-[2] flex h-[76px] w-full items-center bg-[#faf9fc] px-5 py-4">
        <Link
          href="/focus/emotion-reset/name"
          aria-label="이전 화면으로 돌아가기"
          className="flex size-[34.67px] items-center justify-center rounded-full text-[#3c5f7c]"
        >
          <ArrowLeft size={24} strokeWidth={2.3} />
        </Link>
        <h1 className="m-0 flex flex-1 items-center justify-center pr-[34.67px] text-[16px] font-medium leading-6 tracking-normal text-[#3c5f7c]">
          마음 챙김
        </h1>
      </header>

      <section className="flex flex-1 flex-col gap-10 overflow-y-auto px-5 pb-6 pt-8">
        <section className="flex w-full flex-col gap-4">
          <h2 className="m-0 text-[32px] font-medium leading-[38px] tracking-normal text-[#1a1c1e]">
            어떤 생각 패턴에 가까운가요?
          </h2>
          <p className="m-0 text-[18px] font-medium leading-7 text-[#42474d]">
            감정이 커질 때 자주 나타나는 생각 습관을 확인합니다.
          </p>
        </section>

        <section className="flex w-full flex-col gap-4" aria-label="사고 패턴 선택">
          {thoughtPatterns.map((pattern) => (
            <ThoughtPatternCard key={pattern.title} {...pattern} />
          ))}
        </section>

        <aside className="flex h-[122px] w-full items-start gap-4 rounded-[32px] border border-[#e2e2e5] bg-[#eeedf0] p-6">
          <Info size={20} strokeWidth={2.3} className="mt-0.5 shrink-0 text-[#557896]" aria-hidden="true" />
          <p className="m-0 max-w-[222px] text-[16px] font-medium leading-6 text-[#42474d]">
            자신도 모르게 반복되는 생각의 틀을 인지하는 것만으로도 감정의 무게를 덜 수 있습니다.
          </p>
        </aside>
      </section>

      <div className="absolute bottom-0 left-0 z-[3] flex h-[157px] w-full flex-col border-t border-[#e2e2e5] bg-[rgba(250,249,252,0.8)] p-5 backdrop-blur-[6px]">
        <div className="flex w-full flex-col gap-3">
          <Link
            href="/focus/emotion-reset/reframe"
            className="flex h-14 w-full items-center justify-center rounded-full bg-[#3c5f7c] text-[16px] font-medium leading-6 text-white shadow-[0_10px_15px_-3px_rgba(60,95,124,0.1),0_4px_6px_-4px_rgba(60,95,124,0.1)]"
          >
            문장 바꿔보기
          </Link>
          <Link
            href="/focus/current?duration=10"
            className="flex h-12 w-full items-center justify-center rounded-full text-[16px] font-medium leading-6 text-[#3c5f7c]"
          >
            바로 복귀
          </Link>
        </div>
      </div>
    </main>
  );
}

function ThoughtPatternCard({ title, quote }: { title: string; quote: string }) {
  return (
    <button
      type="button"
      className="flex h-[140px] w-full flex-col items-start rounded-[32px] border border-[#c2c7ce] bg-white p-6 text-left"
    >
      <span className="mb-3 flex w-full items-center justify-between">
        <span className="rounded-full bg-[rgba(237,190,133,0.2)] px-3 py-1 text-[13px] font-medium leading-[18px] tracking-[0.52px] text-[#785526]">
          사고 패턴
        </span>
        <CheckCircle size={20} strokeWidth={2.4} className="text-[#72777e]" aria-hidden="true" />
      </span>
      <span className="pb-1 text-[16px] font-medium leading-6 text-[#1a1c1e]">{title}</span>
      <span className="text-[16px] font-medium leading-6 text-[#42474d]">{quote}</span>
    </button>
  );
}
