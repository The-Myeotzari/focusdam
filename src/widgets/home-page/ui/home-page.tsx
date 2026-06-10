import {
  SiteBadge,
  SiteButton,
  SiteCard,
  SiteInput,
  SiteSectionTitle
} from "@/shared/ui";

export function HomePage() {
  return (
    <main className="site-page site-shell">
      <section className="site-hero site-card--hero site-stack-lg">
        <SiteBadge tone="primary">small starts</SiteBadge>
        <div className="site-stack" style={{ gap: 12 }}>
          <h1 className="site-title-lg">
            괜찮아요. 지금 할 수 있는 것부터 작게 시작하면 됩니다.
          </h1>
          <p className="site-body-lg" style={{ color: "var(--color-on-surface-variant)" }}>
            집중이담의 디자인 시스템을 기준으로, 공통 컴포넌트와 기본 스타일을
            정리해두었습니다. 이제 새로운 화면도 같은 톤으로 빠르게 확장할 수 있어요.
          </p>
        </div>
        <div className="site-actions">
          <SiteButton href="#structure">시작하기</SiteButton>
          <SiteButton href="#checkin" variant="secondary">
            체크인
          </SiteButton>
        </div>
      </section>

      <section className="site-stack-lg" style={{ marginTop: 24 }}>
        <SiteSectionTitle
          eyebrow="foundation"
          title="기본 구성"
          description="디자인 문서의 색상, 타이포그래피, 카드, 버튼, 입력 필드를 코드 토큰으로 반영했습니다."
        />

        <div className="site-grid-2" id="structure">
          <SiteCard className="site-stack">
            <SiteBadge tone="success">구조</SiteBadge>
            <h2 className="site-title-md">레이어 중심의 구성</h2>
            <p className="site-body-md">
              app, widgets, features, entities, shared 구조를 유지하면서 공통 UI를 shared에
              모아두었습니다.
            </p>
          </SiteCard>

          <SiteCard className="site-stack">
            <SiteBadge tone="premium">PWA</SiteBadge>
            <h2 className="site-title-md">설치 가능한 앱 골격</h2>
            <p className="site-body-md">
              매니페스트와 서비스 워커 등록을 유지하면서, 홈 화면은 가볍고 명확한 진입점이
              되도록 맞췄습니다.
            </p>
          </SiteCard>
        </div>
      </section>

      <section id="checkin" className="site-stack" style={{ marginTop: 24 }}>
        <SiteCard className="site-stack">
          <div className="site-stack" style={{ gap: 8 }}>
            <SiteBadge tone="caution">check-in</SiteBadge>
            <h2 className="site-title-md">오늘의 한 줄</h2>
            <p className="site-body-md">
              입력 필드와 버튼 톤도 같은 시스템으로 맞춰두었습니다.
            </p>
          </div>
          <SiteInput placeholder="오늘은 어떤 것부터 작게 시작할까요?" />
          <div className="site-actions">
            <SiteButton href="/" variant="primary">
              저장하기
            </SiteButton>
            <SiteButton href="/" variant="outline">
              나중에
            </SiteButton>
          </div>
        </SiteCard>
      </section>
    </main>
  );
}
