import type { Metadata } from 'next';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '개인정보처리방침',
};

const PRIVACY_POLICY_SECTIONS = [
  {
    id: 'privacy-purpose',
    title: '1. 개인정보 처리 목적',
    contents: [
      '집중이담은 ADHD 성향, 주의 전환 어려움, 실행 지연, 충동 소비, 감정 기복 등으로 일상 관리에 어려움을 느끼는 사용자의 습관 형성과 자기관리를 돕기 위해 개인정보를 처리합니다.',
      '개인정보는 계정 식별, 기록 저장 및 조회, 알림 제공, 선택 동의 관리, 데이터 내보내기 및 삭제 요청 처리, 서비스 안정화와 개선을 위해 사용됩니다.',
    ],
  },
  {
    id: 'privacy-required-items',
    title: '2. 필수 수집 항목',
    contents: [
      '계정 생성 및 로그인 과정에서 이름 또는 닉네임, 이메일, 소셜 로그인 제공자 정보, 서비스 이용 식별자를 수집할 수 있습니다.',
      '서비스 이용 과정에서 접속 일시, 기기 정보, 앱 버전, 오류 로그 등 서비스 운영에 필요한 기술 정보가 자동으로 생성될 수 있습니다.',
    ],
  },
  {
    id: 'privacy-optional-items',
    title: '3. 선택 수집 항목',
    contents: [
      '사용자의 선택 동의에 따라 감정 기록, 소비 기록, 집중 기록, 알림 설정, 분석 활용 데이터가 저장될 수 있습니다.',
      '선택 정보는 서비스 핵심 기능을 더 개인화하기 위한 정보이며, 사용자는 설정에서 동의 여부를 언제든 변경할 수 있습니다.',
      '감정, 소비, 집중 기록은 민감하게 느껴질 수 있는 개인 데이터이므로 필요한 범위 안에서만 활용합니다.',
    ],
  },
  {
    id: 'privacy-retention',
    title: '4. 보관 기간',
    contents: [
      '개인정보는 서비스 이용 기간 동안 보관하며, 회원 탈퇴 또는 삭제 요청 시 지체 없이 파기하는 것을 원칙으로 합니다.',
      '관계 법령 또는 분쟁 대응, 결제 내역 확인 등 정당한 사유로 일정 기간 보관이 필요한 정보는 해당 목적에 필요한 기간 동안 분리 보관할 수 있습니다.',
      '보관 기간이 끝나거나 처리 목적이 달성된 정보는 복구하기 어려운 방식으로 삭제합니다.',
    ],
  },
  {
    id: 'privacy-delete-export',
    title: '5. 데이터 내보내기 및 삭제',
    contents: [
      '사용자는 설정에서 자신의 기록을 내보내거나 특정 기간의 기록 삭제를 요청할 수 있습니다.',
      '삭제 요청이 처리된 기록은 복구할 수 없습니다. 필요한 데이터는 삭제 전에 먼저 내보내는 것을 권장합니다.',
      '삭제가 완료되기 전까지 서비스 화면에 일부 정보가 일시적으로 표시될 수 있으며, 시스템 백업 데이터는 운영 정책에 따라 순차적으로 삭제될 수 있습니다.',
    ],
  },
  {
    id: 'privacy-third-party',
    title: '6. 제3자 제공 및 처리위탁',
    contents: [
      '집중이담은 사용자의 동의 없이 개인정보를 외부에 판매하거나 임의로 제공하지 않습니다.',
      '로그인, 결제, 알림, 데이터 보관 등 서비스 운영에 필요한 외부 서비스가 사용될 수 있으며, 이 경우 필요한 범위에서만 정보를 처리합니다.',
      '구체적인 제3자 제공 또는 처리위탁 항목이 확정되면 제공받는 자, 목적, 항목, 보유 기간을 별도로 안내합니다.',
    ],
  },
  {
    id: 'privacy-user-rights',
    title: '7. 이용자의 권리',
    contents: [
      '사용자는 자신의 개인정보에 대해 열람, 정정, 삭제, 처리 정지, 동의 철회를 요청할 수 있습니다.',
      '선택 동의 항목은 설정 화면에서 직접 변경할 수 있으며, 계정 삭제나 기록 삭제 요청은 복구 불가 안내를 확인한 뒤 진행됩니다.',
      '요청 처리 과정에서 본인 확인이 필요할 수 있습니다.',
    ],
  },
  {
    id: 'privacy-security',
    title: '8. 보호 조치',
    contents: [
      '집중이담은 개인정보의 안전한 처리를 위해 접근 권한 관리, 전송 구간 보호, 오류 및 접근 로그 점검 등 필요한 보호 조치를 적용합니다.',
      '민감할 수 있는 기록 데이터는 서비스 제공에 필요한 사람과 시스템만 접근할 수 있도록 관리합니다.',
    ],
  },
  {
    id: 'privacy-changes',
    title: '9. 방침 변경',
    contents: [
      '개인정보처리방침이 변경되는 경우 서비스 내 공지, 설정 화면, 이메일 등 적절한 방법으로 안내합니다.',
      '중요한 변경 사항은 사용자가 내용을 확인할 수 있도록 충분한 고지 기간을 두는 것을 원칙으로 합니다.',
    ],
  },
] as const;

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col gap-8 px-5 py-4">
      {/* TODO: 페이지 헤더 영역 추후 분리 필요*/}
      <header className="flex items-center gap-3">
        <Link
          href="/settings/terms-safety"
          aria-label="약관·안전 안내로 돌아가기"
          className="grid size-11 place-items-center rounded-full"
        >
          <ChevronLeft size={24} aria-hidden="true" />
        </Link>

        <h1 className="flex-1 text-center text-[24px] leading-8">수집·보관·삭제</h1>
        <span className="min-w-11" aria-hidden="true" />
      </header>

      <section className="rounded-[var(--radius-xxl)] bg-[var(--color-surface-container-lowest)] px-5 py-6 shadow-[var(--shadow-card)]">
        <p className="text-xs font-semibold text-[var(--ds-safety-ink)]">
          개인정보처리방침 초안
        </p>
        <h2 className="mt-2 text-xl font-semibold text-[var(--color-on-surface)]">
          개인정보 수집·보관·삭제
        </h2>
        <p className="mt-3 text-xs leading-5 text-[var(--color-on-surface-variant)]">
          아래 내용은 제품 화면 구성을 위한 기본 방침 초안이며, 정식 배포 전 법무 및 개인정보
          담당자 검토가 필요합니다.
        </p>

        <div className="mt-6 grid gap-6">
          {PRIVACY_POLICY_SECTIONS.map((section) => (
            <section key={section.id} aria-labelledby={section.id}>
              <h3
                id={section.id}
                className="text-sm font-semibold text-[var(--color-on-surface)]"
              >
                {section.title}
              </h3>
              <ul className="mt-3 grid gap-2">
                {section.contents.map((content) => (
                  <li
                    key={content}
                    className="pl-3 text-xs leading-6 text-[var(--color-on-surface-variant)] before:mr-2 before:content-['•']"
                  >
                    {content}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}
