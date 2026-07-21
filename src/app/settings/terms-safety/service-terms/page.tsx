import type { Metadata } from 'next';
import { SiteTopBar } from '@/shared/ui';

export const metadata: Metadata = {
  title: '서비스 조건',
};

const SERVICE_TERMS_SECTIONS = [
  {
    id: 'service-purpose',
    title: '1. 서비스 목적',
    contents: [
      '집중이담은 ADHD 성향, 주의 전환 어려움, 실행 지연, 충동 소비, 감정 기복 등으로 일상 관리에 어려움을 느끼는 사용자를 위한 습관 코치 서비스입니다.',
      '서비스는 사용자가 감정, 소비, 집중 상태를 기록하고 작은 행동을 시작하며 루틴을 이어갈 수 있도록 돕는 자기관리 보조 기능을 제공합니다.',
    ],
  },
  {
    id: 'service-scope',
    title: '2. 서비스 제공 범위',
    contents: [
      '집중이담은 감정 기록, 소비 기록, 집중 루틴, 알림, 선택 동의 관리, 데이터 내보내기 및 삭제 요청 기능을 제공할 수 있습니다.',
      '서비스의 일부 기능은 사용자의 선택 동의, 기기 권한, 네트워크 상태, 구독 상태에 따라 제한될 수 있습니다.',
    ],
  },
  {
    id: 'medical-disclaimer',
    title: '3. 의료·상담 대체 아님',
    contents: [
      '집중이담은 의료기기, 진단 도구, 치료 서비스 또는 전문 상담 서비스가 아닙니다.',
      '앱에서 제공하는 기록, 알림, 코칭 문구, 분석 결과는 ADHD 진단, 약물 치료, 심리상담, 정신건강 치료를 대체하지 않습니다.',
      '증상이 심하거나 일상생활에 큰 어려움이 있는 경우 정신건강의학과, 임상심리사, 상담기관 등 전문가의 도움을 받는 것이 필요합니다.',
    ],
  },
  {
    id: 'user-responsibility',
    title: '4. 사용자 책임',
    contents: [
      '사용자는 본인의 계정 정보를 안전하게 관리해야 하며, 타인의 계정 또는 정보를 무단으로 이용해서는 안 됩니다.',
      '사용자는 자신의 상태, 기록, 알림, 코칭 내용을 참고 자료로 활용하되, 최종 판단과 행동에 대한 책임은 사용자 본인에게 있습니다.',
    ],
  },
  {
    id: 'data-management',
    title: '5. 기록과 데이터 관리',
    contents: [
      '감정 기록, 소비 기록, 집중 기록은 민감할 수 있는 개인 데이터입니다. 집중이담은 사용자가 동의한 범위 안에서 데이터를 활용합니다.',
      '사용자는 설정에서 선택 동의 항목을 변경하거나 데이터 내보내기 및 기록 삭제를 요청할 수 있습니다.',
      '삭제 요청이 처리된 데이터는 복구할 수 없으므로 필요한 기록은 삭제 전에 내보내는 것을 권장합니다.',
    ],
  },
  {
    id: 'notifications-coaching',
    title: '6. 알림과 코칭',
    contents: [
      '집중이담의 알림과 코칭 문구는 사용자의 실행을 돕기 위한 보조 장치입니다.',
      '알림은 강제 개입이나 긴급 대응 수단이 아니며, 사용자는 언제든 알림 설정을 변경할 수 있습니다.',
    ],
  },
  {
    id: 'paid-service',
    title: '7. 유료 서비스',
    contents: [
      'Plus 구독 등 유료 서비스는 구독 상태, 결제 수단, 갱신일, 해지 가능 여부를 설정 화면에서 확인할 수 있도록 제공됩니다.',
      '결제, 환불, 해지 조건은 앱 스토어 정책 또는 서비스 내 별도 안내에 따릅니다.',
    ],
  },
  {
    id: 'terms-update',
    title: '8. 서비스 변경 및 약관 개정',
    contents: [
      '집중이담은 안정적인 서비스 제공을 위해 기능을 추가, 변경, 중단하거나 점검을 진행할 수 있습니다.',
      '약관이나 주요 정책이 변경되는 경우 서비스 내 공지, 설정 화면, 이메일 등 적절한 방법으로 안내합니다.',
    ],
  },
] as const;

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col gap-8 px-5 py-4">
      <SiteTopBar title="서비스 조건" backHref="/settings/terms-safety" />

      <section className="rounded-[var(--radius-xxl)] bg-[var(--color-surface-container-lowest)] px-5 py-6 shadow-[var(--shadow-card)]">
        <p className="text-xs font-semibold text-[var(--ds-safety-ink)]">이용약관 초안</p>
        <h2 className="mt-2 text-xl font-semibold text-[var(--color-on-surface)]">
          집중이담 서비스 조건
        </h2>
        <p className="mt-3 text-xs leading-5 text-[var(--color-on-surface-variant)]">
          아래 내용은 제품 화면 구성을 위한 기본 약관 초안이며, 정식 배포 전 법무 및 개인정보
          검토가 필요합니다.
        </p>

        <div className="mt-6 grid gap-6">
          {SERVICE_TERMS_SECTIONS.map((section) => (
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
