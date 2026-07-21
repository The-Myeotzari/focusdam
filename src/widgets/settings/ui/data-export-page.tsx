// 데이터 내보내기 페이지


import { DeleteDataRecordsForm } from '@/features/delete-data-records';
import { DataExportForm } from '@/features/request-data-export';
import { SiteTopBar } from '@/shared/ui';

export function DataExportPage() {
  return (
    <main className="flex min-h-screen flex-col gap-8 px-5 py-4">
      {/* TODO: 페이지 헤더 영역 추후 분리 필요*/}
      <SiteTopBar title="데이터 내보내기" backHref="/settings/data" />

      <section className="rounded-[var(--radius-xxl)] bg-[var(--color-surface-container-low)] px-8 py-8">
        <h2 className="text-[26px] font-medium leading-9 text-[var(--color-on-surface)]">
          필요한 기록을 안전하게 관리해요
        </h2>
        <p className="mt-3 text-sm leading-6 text-[var(--color-on-surface-variant)]">
          내보내기 요청과 특정 기간 기록 삭제 요청을 API 연결 전 흐름으로 확인합니다.
        </p>
      </section>

      <div className="mt-auto grid gap-8">
        <DataExportForm />
        <DeleteDataRecordsForm />
      </div>
    </main>
  );
}
