"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Circle, Search, Zap } from "lucide-react";

const categories = ["업무", "집안일", "공부", "소비"] as const;

const templates = [
  {
    label: "완성보다 착수",
    title: "보고서 목차만 정리하기",
    difficulty: "낮음"
  },
  {
    label: "답장 부담 줄이기",
    title: "메일 제목만 쓰기",
    difficulty: "낮음"
  },
  {
    label: "시작 장벽 낮추기",
    title: "문서 1장만 열기",
    difficulty: "매우 낮음"
  },
  {
    label: "환경 정리",
    title: "책상 위 종이 3장 정리",
    difficulty: "보통"
  }
] as const;

export function StarterTemplatesPage() {
  const [selectedCategory, setSelectedCategory] = useState<(typeof categories)[number]>("업무");
  const [selectedTemplate, setSelectedTemplate] = useState<string>(templates[0].title);

  return (
    <main className="relative isolate mx-auto flex min-h-[100svh] w-full max-w-[390px] flex-col overflow-hidden bg-[#faf9fc] pb-[176px] font-['42dot_Sans','Hanken_Grotesk','Noto_Sans_KR',sans-serif]">
      <header className="z-[2] flex h-[49px] w-full items-center justify-between bg-[#faf9fc] px-5 py-2">
        <Link
          href="/starter/new"
          aria-label="이전 화면으로 돌아가기"
          className="flex size-8 items-center justify-center rounded-full text-[#3c5f7c]"
        >
          <ArrowLeft size={24} strokeWidth={2.4} />
        </Link>
        <h1 className="m-0 text-[18px] font-medium leading-[34px] text-[#3c5f7c]">마음 챙김</h1>
      </header>

      <section className="flex flex-1 flex-col gap-8 px-5 pt-[64px]">
        <label className="relative flex h-14 w-full items-center rounded-full border border-[#c2c7ce] bg-white px-4 pl-12">
          <Search
            size={24}
            strokeWidth={2.6}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#42474d]"
            aria-hidden="true"
          />
          <input
            aria-label="템플릿 검색"
            placeholder="검색 예: 보고서, 메일, 정리"
            className="h-full w-full bg-transparent text-[16px] font-medium leading-[19px] text-[#1a1c1e] outline-none placeholder:text-[#6b7280]"
          />
        </label>

        <div className="-mr-5 flex gap-4 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              aria-pressed={selectedCategory === category}
              onClick={() => setSelectedCategory(category)}
              className={[
                "flex h-[42px] shrink-0 items-center justify-center rounded-full px-6 text-[16px] font-medium leading-6",
                selectedCategory === category
                  ? "border-2 border-[#557896] bg-[#3c5f7c] text-white shadow-[0_0_0_3px_rgba(85,120,150,0.12)]"
                  : "border border-transparent bg-[#e8e8ea] text-[#42474d]"
              ].join(" ")}
            >
              {category}
            </button>
          ))}
        </div>

        <section className="flex flex-col gap-6" aria-label="템플릿 목록">
          {templates.map((template) => {
            const isSelected = selectedTemplate === template.title;

            return (
              <button
                key={template.title}
                type="button"
                aria-pressed={isSelected}
                onClick={() => setSelectedTemplate(template.title)}
                className={[
                  "flex min-h-[116px] w-full items-start justify-between rounded-xl bg-white p-4 text-left shadow-[0_10px_40px_rgba(107,142,173,0.06)]",
                  isSelected
                    ? "border-2 border-[#557896] shadow-[0_0_0_2px_rgba(85,120,150,0.12),0_10px_40px_rgba(107,142,173,0.06)]"
                    : "border border-transparent"
                ].join(" ")}
              >
                <span className="flex flex-col gap-1">
                  <span className="text-[16px] font-medium uppercase leading-6 tracking-[0.8px] text-[#3c5f7c]">
                    {template.label}
                  </span>
                  <span className="text-[16px] font-medium leading-6 text-[#1a1c1e]">
                    {template.title}
                  </span>
                  <span className="flex items-center gap-1 text-[16px] font-medium leading-6 text-[#42474d]">
                    <Zap size={15} fill="currentColor" strokeWidth={0} aria-hidden="true" />
                    난이도: {template.difficulty}
                  </span>
                </span>
                <span
                  className={[
                    "mt-2 flex size-6 items-center justify-center rounded-full border-[3px]",
                    isSelected ? "border-[#3c5f7c] bg-[#3c5f7c]" : "border-[#c2c7ce] bg-white"
                  ].join(" ")}
                  aria-hidden="true"
                >
                  {isSelected ? <Circle size={10} fill="white" strokeWidth={0} /> : null}
                </span>
              </button>
            );
          })}
        </section>
      </section>

      <div className="fixed bottom-0 left-1/2 z-[3] flex w-full max-w-[390px] -translate-x-1/2 flex-col gap-2 bg-gradient-to-t from-[#faf9fc] via-[#faf9fc]/95 to-[#faf9fc00] px-5 pb-8 pt-6">
        <Link
          href="/starter/time"
          className="flex h-14 w-full items-center justify-center rounded-full bg-[#3c5f7c] text-[16px] font-medium leading-6 text-white shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-4px_rgba(0,0,0,0.1)]"
        >
          이 템플릿 선택
        </Link>
        <Link
          href="/starter/new"
          className="flex h-12 w-full items-center justify-center rounded-full border border-[#c2c7ce] bg-white text-[16px] font-medium leading-6 text-[#42474d]"
        >
          닫기
        </Link>
      </div>
    </main>
  );
}
