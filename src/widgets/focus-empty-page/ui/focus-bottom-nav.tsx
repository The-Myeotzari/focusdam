import Link from "next/link";
import { CalendarDays, Target, UserRound } from "lucide-react";

export function FocusBottomNav() {
  return (
    <nav className="fixed bottom-0 left-1/2 z-[3] flex h-[86px] w-full max-w-[390px] -translate-x-1/2 items-start justify-center gap-[64.5px] rounded-t-[32px] bg-white px-[48.26px] pb-6 pt-3 shadow-[0_-4px_30px_rgba(107,142,173,0.06)]">
      <Link
        href="/"
        className="flex h-[42px] flex-col items-center justify-center p-0 font-['Hanken_Grotesk','Noto_Sans_KR',sans-serif] text-[13px] font-semibold leading-[18px] tracking-[0.52px] text-[#5f656c]"
      >
        <CalendarDays size={22} strokeWidth={2.4} aria-hidden="true" />
        <span className="pt-1">Today</span>
      </Link>
      <Link
        href="/focus"
        aria-current="page"
        className="flex h-[50px] w-[85.14px] flex-col items-center justify-center rounded-full bg-[#557896] px-6 py-1 font-['Hanken_Grotesk','Noto_Sans_KR',sans-serif] text-[13px] font-semibold leading-[18px] tracking-[0.52px] text-[#fcfcff]"
      >
        <Target size={22} strokeWidth={2.4} aria-hidden="true" />
        <span className="pt-1">Focus</span>
      </Link>
      <Link
        href="/settings"
        className="flex h-[38px] flex-col items-center justify-center p-0 font-['Hanken_Grotesk','Noto_Sans_KR',sans-serif] text-[13px] font-semibold leading-[18px] tracking-[0.52px] text-[#5f656c]"
      >
        <UserRound size={21} strokeWidth={2.4} aria-hidden="true" />
        <span className="pt-1">Profile</span>
      </Link>
    </nav>
  );
}
