# Focusdam Supabase DB Design

작성일: 2026-07-09

## 목적

현재 UI는 대부분 mock/localStorage 기반이지만, 화면 흐름은 이미 다음 백엔드 도메인을 요구한다.

- 계정/온보딩: Supabase Auth, 카카오 OAuth, 약관/선택 동의
- 시작 행동: 최근/즐겨찾기/템플릿/예약 행동
- 집중 세션: 타이머, 완료감/집중도, 일시정지, 감정 리셋, 오버타임, 쪼개기
- 결제 3심: 상품/금액/충동/필요성 판단, 보류 리마인드, 만족도 체크, 저축 목표 달성
- 글쓰기 도우미: 입력값, 생성 결과, 직접 수정한 문장, 복사 이력
- 주간 리뷰: 행동/소비/감정/대화 데이터를 집계한 캐시형 리포트
- 설정/운영: 알림 설정, 구독, 데이터 내보내기/삭제 요청

설계 기준은 다음과 같다.

- Supabase Auth의 `auth.users.id`를 모든 사용자 데이터의 소유자 키로 사용한다.
- UI에서 자주 조회하는 상태값은 컬럼으로 유지하고, 생성 당시 스냅샷은 `jsonb`로 보존한다.
- 행동/세션/소비 판단은 향후 주간 리뷰 집계가 가능하도록 이벤트와 원장을 분리한다.
- 모든 사용자 데이터 테이블은 `user_id = auth.uid()` 기반 RLS를 적용한다.
- 템플릿/플랜처럼 앱이 제공하는 기준 데이터는 공개 읽기, 서비스 역할 쓰기만 허용한다.

## 코드 검토 기준

주요 근거가 된 파일:

- `src/shared/lib/supabase/client.ts`, `src/shared/lib/supabase/server.ts`: Supabase SSR 클라이언트 구성
- `src/widgets/onboarding-account-page/ui/onboarding-account-page.tsx`: 카카오 OAuth, 필수/선택 동의
- `src/widgets/starter-*/ui/*.tsx`, `src/widgets/focus-empty-page/ui/*.tsx`: starter/focus localStorage 플로우
- `src/entities/payment-third-review/model/*.ts`, `src/features/create-payment-third-review/model/*.ts`: 결제 3심 타입/상태
- `src/entities/writing-helper-history/model/*.ts`, `src/features/writing-helper/model/*.ts`: 글쓰기 도우미 입력/결과 구조
- `src/entities/review/model/weekly-review.types.ts`: 주간 리뷰 화면 계약
- `src/features/request-data-export`, `src/features/delete-data-records`: 데이터 작업 요청 계약

## 권장 테이블 구성

### 1. Auth/Profile

| table | purpose |
| --- | --- |
| `auth.users` | Supabase Auth가 관리하는 사용자 원본 |
| `profiles` | 앱 표시용 사용자 정보, locale/timezone, 온보딩 완료 시각 |

`profiles.user_id`는 `auth.users.id`를 참조한다. 이메일/소셜 제공자는 Auth metadata에서 초기 동기화하되, 권한 판단에는 사용하지 않는다.

### 2. Consent/Notification

| table | purpose |
| --- | --- |
| `consent_settings` | 현재 선택 동의 상태 |
| `consent_events` | 동의 변경 감사 이력 |
| `notification_settings` | 알림 토글, 조용한 시간 |
| `push_subscriptions` | PWA push endpoint/device별 구독 |

동의는 현재값만 있으면 법적/운영 추적이 부족하므로 `consent_events`를 함께 둔다.

### 3. Subscription

| table | purpose |
| --- | --- |
| `plus_plans` | 월간/연간 등 판매 플랜 기준 데이터 |
| `user_subscriptions` | 사용자별 구독 상태, provider subscription id, 기간 |

결제 provider는 아직 UI에 고정되어 있지 않으므로 `provider`, `provider_customer_id`, `provider_subscription_id`를 nullable text로 둔다.

### 4. Starter/Focus

| table | purpose |
| --- | --- |
| `starter_action_templates` | 앱 제공 템플릿 |
| `starter_actions` | 사용자가 만든 최소 행동 원본 |
| `starter_schedules` | 특정 날짜/시간 예약 |
| `focus_sessions` | 실제 타이머 실행 단위 |
| `focus_session_events` | pause/reset/overtime/split/complete 이벤트 |
| `emotion_records` | 감정 이름, 강도, 복귀 여부 |

집중 지표와 주간 리뷰는 `focus_sessions`, `focus_session_events`, `emotion_records`에서 계산한다. `starter_actions`는 사용자가 반복 선택하는 원본이고, 실행 당시 제목/시간은 `focus_sessions`에 snapshot으로 남긴다.

### 5. Payment Third Review

| table | purpose |
| --- | --- |
| `payment_saving_goals` | 결제 3심 목표 저축 |
| `payment_reviews` | 상품/금액/판단 본 기록 |
| `payment_review_followups` | 보류 리마인드, 만족도 체크 |
| `payment_saving_entries` | 저축 반영 원장 |
| `payment_goal_achievements` | 목표 달성 스냅샷 |

`payment_reviews.status`는 UI 목록/상세 배지에 바로 필요하므로 저장한다. 단, 저축 금액은 `payment_saving_entries`에 원장으로 쌓고 `payment_saving_goals.current_saved_amount_krw`는 캐시로 관리한다.

### 6. Writing Helper

| table | purpose |
| --- | --- |
| `writing_helper_histories` | 입력값, 결과 스냅샷, 직접 작성 문장 |

결과 구조는 향후 바뀔 수 있으므로 `result_snapshot jsonb`로 저장한다. 검색과 목록에 자주 쓰는 `message_type`, `tone`, `recipient`, `edited_draft`는 컬럼으로 둔다.

### 7. Weekly Review

| table | purpose |
| --- | --- |
| `weekly_reviews` | 주간 집계 결과 캐시/스냅샷 |

원천 데이터에서 매번 집계하면 비용이 커지므로 주간 리포트는 캐시한다. 원천 이벤트가 바뀌면 재생성 가능하도록 `generated_at`, `status`, `summary_snapshot`, `insights_snapshot`, `recommendation_snapshot`을 둔다.

### 8. Data Jobs

| table | purpose |
| --- | --- |
| `data_jobs` | 데이터 내보내기/삭제 요청과 처리 상태 |

`export`는 결과 파일 경로와 만료 시각을, `delete`는 삭제 기간을 사용한다. 실제 파일은 private Storage bucket `data-exports`에 둔다.

## 핵심 조회 패턴과 인덱스

- 홈: `focus_sessions(user_id, started_at desc)`, `starter_schedules(user_id, scheduled_at, status)`
- 시작 행동 목록: `starter_actions(user_id, last_started_at desc, created_at desc)`
- 결제 3심 목록: `payment_reviews(user_id, created_at desc)`, `payment_reviews(user_id, status)`
- 후속 처리 배지: `payment_review_followups(user_id, status, scheduled_at)`
- 글쓰기 히스토리: `writing_helper_histories(user_id, created_at desc)`
- 주간 리뷰: unique `weekly_reviews(user_id, week_start_date)`
- 한글 부분 검색: `pg_trgm` 기반 `gin_trgm_ops` 인덱스

## RLS 정책

모든 사용자 데이터 테이블은 아래 원칙을 적용한다.

- `select`: `auth.uid() = user_id`
- `insert`: `auth.uid() = user_id`
- `update`: `auth.uid() = user_id`
- `delete`: 필요 테이블만 허용. 운영 로그/구독/데이터 작업은 사용자가 직접 삭제하지 않는다.

공개 기준 데이터:

- `starter_action_templates`: authenticated/anonymous 모두 select 가능
- `plus_plans`: authenticated/anonymous 모두 select 가능

서비스 역할 전용 쓰기:

- `plus_plans`
- `user_subscriptions`
- `weekly_reviews` 생성/재생성
- `data_jobs` 처리 상태 변경
- Storage export 파일 업로드

## TypeScript 매핑

| UI type | DB source |
| --- | --- |
| `UserAccount` | `profiles` + `auth.users.email` |
| `ConsentSettings` | `consent_settings` |
| `NotificationSettings` | `notification_settings` |
| `PlusSubscription` | `user_subscriptions` + `plus_plans` |
| `OngoingStarter` | `focus_sessions where status = 'running'` |
| `FocusMetrics` | `focus_sessions`, `payment_saving_entries` aggregate |
| `PaymentReviewHistoryItem` | `payment_reviews` + latest `payment_review_followups` + saving goal progress |
| `PaymentReviewGoal` | active `payment_saving_goals` |
| `PaymentReviewGoalAchievement` | `payment_goal_achievements` |
| `WritingHelperHistoryItem` | `writing_helper_histories` |
| `WeeklyReview` | `weekly_reviews` snapshot |

## 구현 순서

1. `supabase/migrations/20260709000000_initial_schema.sql` 적용
2. Supabase Auth OAuth redirect URL 확인
3. `profiles`, `consent_settings`, `notification_settings` 기본 생성 trigger 검증
4. mock query를 Supabase query로 교체
5. localStorage draft는 유지하되 submit 시 server action으로 저장
6. 결제 3심 후속 처리 cron/edge function 추가
7. 주간 리뷰 생성 job 추가
8. 데이터 export/delete job 처리 worker 또는 edge function 추가

## 설계상 의도적으로 남긴 선택지

- 결제 provider는 아직 확정되지 않았으므로 `user_subscriptions.provider = 'manual'`을 기본값으로 둔다.
- `payment_saving_goals.current_saved_amount_krw`는 캐시다. 정확한 원장은 `payment_saving_entries`다.
- `weekly_reviews`는 원천 데이터가 아니라 화면 응답 캐시다. 리포트 생성 로직이 바뀌어도 과거 리포트 스냅샷은 보존된다.
- 글쓰기 도우미 결과는 generated text 구조가 바뀔 수 있어 `jsonb` 스냅샷이 가장 안정적이다.
