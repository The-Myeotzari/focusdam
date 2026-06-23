import type { Metadata } from 'next';
import { ChevronDown, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '자주 묻는 질문',
};

const FAQ_ITEMS = [
  {
    question: '집중이담은 어떤 앱인가요?',
    answer:
      '집중이담은 ADHD 성향, 실행 지연, 주의 전환 어려움, 감정 기복, 충동 소비 등으로 일상 관리가 어려운 사용자를 돕는 습관 코치 앱입니다. 할 일을 작게 시작하고, 기록을 통해 패턴을 돌아보고, 필요한 알림을 받을 수 있도록 돕습니다.',
  },
  {
    question: 'ADHD 진단이나 치료를 받을 수 있나요?',
    answer:
      '아니요. 집중이담은 의료기기나 진단 도구, 치료 서비스가 아닙니다. 앱의 기록, 알림, 코칭 문구는 자기관리 참고 자료이며, 진단이나 치료, 상담을 대신하지 않습니다. 증상이 일상에 큰 영향을 준다면 전문가와 상담해 주세요.',
  },
  {
    question: '감정 기록과 소비 기록은 꼭 입력해야 하나요?',
    answer:
      '아니요. 감정 기록, 소비 기록, 분석 활용 데이터는 선택 동의 항목입니다. 사용자는 설정에서 언제든 선택 동의를 켜거나 끌 수 있고, 필요하지 않은 기록은 남기지 않아도 됩니다.',
  },
  {
    question: '기록한 데이터는 삭제할 수 있나요?',
    answer:
      '네. 데이터 관리에서 기록 삭제 요청을 할 수 있습니다. 다만 삭제 요청이 처리된 데이터는 복구할 수 없으므로, 필요한 기록은 삭제 전에 먼저 내보내는 것을 권장합니다.',
  },
  {
    question: '알림은 어떻게 조정하나요?',
    answer:
      '알림 관리에서 착수 알림, 소비 보류, 감정 리셋, 방해금지 시간 등을 조정할 수 있습니다. 알림은 사용자를 강제로 통제하기 위한 기능이 아니라, 사용자가 정한 타이밍을 다시 떠올리도록 돕는 보조 장치입니다.',
  },
  {
    question: 'Plus 구독은 어디에서 확인하나요?',
    answer:
      '설정의 Plus 구독 관리에서 현재 플랜, 다음 갱신일, 결제 수단, 해지 가능 여부를 확인할 수 있습니다. 실제 결제와 환불 조건은 앱 스토어 정책 또는 서비스 내 별도 안내를 따릅니다.',
  },
  {
    question: '위기 상황에서는 어떻게 해야 하나요?',
    answer:
      '자해나 타해 위험이 있거나 지금 혼자 있기 어렵다고 느껴진다면 앱의 안내를 기다리지 말고 즉시 112 또는 119에 연락하세요. 자살예방 상담전화 109, 보건복지상담센터 129, 청소년상담 1388, 여성긴급전화 1366도 도움을 요청할 수 있는 창구입니다.',
  },
  {
    question: '문의나 피드백은 어디로 보내나요?',
    answer:
      '도움말·피드백 화면에서 계정/결제/오류 문의, 화면 단위 의견, 인터뷰 신청 메뉴를 통해 보낼 수 있도록 준비 중입니다. 실제 연결 전까지는 화면 구조와 흐름을 먼저 확인하는 단계입니다.',
  },
] as const;

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col gap-8 px-5 py-4">
      {/* TODO: 페이지 헤더 영역 추후 분리 필요*/}
      <header className="flex items-center gap-3">
        <Link
          href="/settings/help"
          aria-label="도움말·피드백으로 돌아가기"
          className="grid size-11 place-items-center rounded-full"
        >
          <ChevronLeft size={24} aria-hidden="true" />
        </Link>

        <h1 className="flex-1 text-center text-[24px] leading-8">자주 묻는 질문</h1>
        <span className="min-w-11" aria-hidden="true" />
      </header>

      <section className="rounded-[var(--radius-xxl)] bg-[var(--color-surface-container-low)] px-8 py-8 shadow-[var(--shadow-card)]">
        <h2 className="text-[26px] font-medium leading-9 text-[var(--color-on-surface)]">
          궁금한 점을 빠르게 확인해요
        </h2>
        <p className="mt-4 text-sm leading-6 text-[var(--color-on-surface-variant)]">
          앱의 역할, 기록 관리, 알림, 구독, 안전 안내에 대한 기본 답변을 모았습니다.
        </p>
      </section>

      <section aria-label="자주 묻는 질문 목록">
        <ul className="grid gap-3">
          {FAQ_ITEMS.map((item) => (
            <li key={item.question}>
              <details className="group rounded-[var(--radius-xl)] bg-[var(--color-surface-container-lowest)] px-5 py-4 shadow-[var(--shadow-card)]">
                <summary className="flex cursor-pointer list-none items-center gap-4 text-base font-semibold text-[var(--color-on-surface)]">
                  <span className="min-w-0 flex-1">{item.question}</span>
                  <ChevronDown
                    size={20}
                    className="shrink-0 text-[var(--color-outline)] transition-transform group-open:rotate-180"
                    aria-hidden="true"
                  />
                </summary>
                <p className="mt-4 text-sm leading-6 text-[var(--color-on-surface-variant)]">
                  {item.answer}
                </p>
              </details>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
