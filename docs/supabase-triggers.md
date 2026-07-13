# Focusdam Supabase Triggers

작성일: 2026-07-13

## 개요

초기 설계의 트리거는 두 종류다.

- `updated_at` 자동 갱신: 수정 가능한 테이블의 `updated_at` 값을 자동으로 현재 시각으로 바꾼다.
- 신규 가입 기본 row 생성: Supabase Auth에 새 사용자가 생기면 앱이 바로 조회할 기본 데이터를 만든다.

## Trigger Function

### `public.set_updated_at()`

`before update` 트리거에서 공통으로 사용하는 함수다.

- 실행 시점: 대상 테이블 row가 `update`되기 직전
- 동작: `new.updated_at = now()`로 갱신
- 목적: API/server action마다 `updated_at`을 직접 넣지 않아도 수정 시각을 일관되게 유지
- 주의: `updated_at`이 없는 테이블에는 연결하면 안 된다.

### `public.handle_new_user()`

Supabase Auth 가입 이벤트에서 사용하는 함수다.

- 실행 시점: `auth.users`에 row가 `insert`된 직후
- 동작: `profiles`, `consent_settings`, `notification_settings` 기본 row 생성
- 목적: 첫 로그인 직후 앱이 프로필/설정 데이터를 바로 조회할 수 있게 함
- 주의: `security definer` 함수이므로 내부에서 사용자 입력을 SQL 문자열로 조립하지 않는다.

## `updated_at` Triggers

### `set_profiles_updated_at`

| item | value |
| --- | --- |
| 대상 테이블 | `public.profiles` |
| 실행 시점 | `before update` |
| 실행 함수 | `public.set_updated_at()` |
| 변경 필드 | `updated_at` |

사용자 표시명, 시간대, 언어, 온보딩 완료 상태가 바뀔 때 프로필 수정 시각을 자동 기록한다.

### `set_consent_settings_updated_at`

| item | value |
| --- | --- |
| 대상 테이블 | `public.consent_settings` |
| 실행 시점 | `before update` |
| 실행 함수 | `public.set_updated_at()` |
| 변경 필드 | `updated_at` |

선택 동의의 현재 상태가 바뀐 시각을 자동 기록한다. 동의 변경 이력 자체는 `consent_events`에 별도로 남긴다.

### `set_notification_settings_updated_at`

| item | value |
| --- | --- |
| 대상 테이블 | `public.notification_settings` |
| 실행 시점 | `before update` |
| 실행 함수 | `public.set_updated_at()` |
| 변경 필드 | `updated_at` |

시작 알림, 소비 보류 알림, 감정 리셋 알림, 방해금지 시간 설정이 바뀐 시각을 기록한다.

### `set_plus_plans_updated_at`

| item | value |
| --- | --- |
| 대상 테이블 | `public.plus_plans` |
| 실행 시점 | `before update` |
| 실행 함수 | `public.set_updated_at()` |
| 변경 필드 | `updated_at` |

플랜명, 가격, 판매 여부, 결제사 가격 ID 등이 바뀐 시각을 기록한다. 일반 사용자가 직접 수정하지 않고 운영자/service role이 수정하는 기준 데이터다.

### `set_user_subscriptions_updated_at`

| item | value |
| --- | --- |
| 대상 테이블 | `public.user_subscriptions` |
| 실행 시점 | `before update` |
| 실행 함수 | `public.set_updated_at()` |
| 변경 필드 | `updated_at` |

구독 상태, 이용 기간, 해지 상태, 결제수단 요약이 바뀐 시각을 기록한다. 결제 웹훅이나 운영성 server action에서 주로 갱신한다.

### `set_starter_action_templates_updated_at`

| item | value |
| --- | --- |
| 대상 테이블 | `public.starter_action_templates` |
| 실행 시점 | `before update` |
| 실행 함수 | `public.set_updated_at()` |
| 변경 필드 | `updated_at` |

앱 제공 시작 행동 템플릿의 문구, 난이도, 노출 여부가 바뀐 시각을 기록한다.

### `set_starter_actions_updated_at`

| item | value |
| --- | --- |
| 대상 테이블 | `public.starter_actions` |
| 실행 시점 | `before update` |
| 실행 함수 | `public.set_updated_at()` |
| 변경 필드 | `updated_at` |

사용자가 만든 최소 행동의 제목, 즐겨찾기 여부, 보관 상태, 마지막 시작일 등이 바뀐 시각을 기록한다.

### `set_starter_schedules_updated_at`

| item | value |
| --- | --- |
| 대상 테이블 | `public.starter_schedules` |
| 실행 시점 | `before update` |
| 실행 함수 | `public.set_updated_at()` |
| 변경 필드 | `updated_at` |

예약 행동의 예약 시각이나 상태가 바뀐 시각을 기록한다. 예를 들어 `scheduled`에서 `started`, `completed`, `canceled`로 바뀔 때 갱신된다.

### `set_focus_sessions_updated_at`

| item | value |
| --- | --- |
| 대상 테이블 | `public.focus_sessions` |
| 실행 시점 | `before update` |
| 실행 함수 | `public.set_updated_at()` |
| 변경 필드 | `updated_at` |

타이머 세션의 상태, 종료 시각, 실제 소요 시간, 완료감, 집중도가 바뀐 시각을 기록한다.

### `set_payment_saving_goals_updated_at`

| item | value |
| --- | --- |
| 대상 테이블 | `public.payment_saving_goals` |
| 실행 시점 | `before update` |
| 실행 함수 | `public.set_updated_at()` |
| 변경 필드 | `updated_at` |

저축 목표명, 목표 금액, 현재 저축액, 목표 상태가 바뀐 시각을 기록한다. 현재 저축액은 원장 집계의 캐시로 다룬다.

### `set_payment_reviews_updated_at`

| item | value |
| --- | --- |
| 대상 테이블 | `public.payment_reviews` |
| 실행 시점 | `before update` |
| 실행 함수 | `public.set_updated_at()` |
| 변경 필드 | `updated_at` |

결제 3심 기록의 상태, 결과 유형, 판단 이유, 삭제 표시 등이 바뀐 시각을 기록한다.

### `set_payment_review_followups_updated_at`

| item | value |
| --- | --- |
| 대상 테이블 | `public.payment_review_followups` |
| 실행 시점 | `before update` |
| 실행 함수 | `public.set_updated_at()` |
| 변경 필드 | `updated_at` |

보류 리마인드나 만족도 체크의 예정/필요/완료 상태, 완료 메모, 만족도 점수가 바뀐 시각을 기록한다.

### `set_writing_helper_histories_updated_at`

| item | value |
| --- | --- |
| 대상 테이블 | `public.writing_helper_histories` |
| 실행 시점 | `before update` |
| 실행 함수 | `public.set_updated_at()` |
| 변경 필드 | `updated_at` |

글쓰기 도우미 기록의 직접 작성 문장, 복사 횟수, 마지막 복사 시각, 삭제 표시가 바뀐 시각을 기록한다.

### `set_weekly_reviews_updated_at`

| item | value |
| --- | --- |
| 대상 테이블 | `public.weekly_reviews` |
| 실행 시점 | `before update` |
| 실행 함수 | `public.set_updated_at()` |
| 변경 필드 | `updated_at` |

주간 리뷰 스냅샷이 재생성되거나 상태가 `stale`, `generated`, `failed` 등으로 바뀐 시각을 기록한다.

### `set_data_jobs_updated_at`

| item | value |
| --- | --- |
| 대상 테이블 | `public.data_jobs` |
| 실행 시점 | `before update` |
| 실행 함수 | `public.set_updated_at()` |
| 변경 필드 | `updated_at` |

데이터 내보내기/삭제 작업의 처리 상태, 결과 파일 경로, 처리 시각, 오류 메시지가 바뀐 시각을 기록한다.

## Auth Trigger

### `on_auth_user_created`

| item | value |
| --- | --- |
| 대상 테이블 | `auth.users` |
| 실행 시점 | `after insert` |
| 실행 함수 | `public.handle_new_user()` |
| 생성 데이터 | `profiles`, `consent_settings`, `notification_settings` |

Supabase Auth에 새 사용자가 생성되면 앱 기본 데이터를 자동 생성한다.

처리 흐름:

1. `profiles`에 사용자 ID, 이메일, 표시명, 소셜 로그인 제공자를 저장한다.
2. `consent_settings`에 선택 동의 기본값을 만든다.
3. `notification_settings`에 알림 기본값을 만든다.
4. 이미 row가 있으면 `on conflict`로 중복 생성을 피한다.

이 트리거 덕분에 카카오 OAuth 첫 로그인 직후에도 앱은 별도 초기화 API 없이 기본 설정을 조회할 수 있다.

## 트리거가 없는 테이블

아래 테이블은 `updated_at`이 없거나 이벤트/원장성 데이터라서 수정보다 append를 전제로 한다.

| table | reason |
| --- | --- |
| `consent_events` | 동의 변경 이력은 append-only에 가깝다. |
| `push_subscriptions` | `last_seen_at`, `is_active`로 상태를 관리한다. |
| `focus_session_events` | 세션 이벤트는 발생 기록이므로 수정하지 않는 편이 좋다. |
| `emotion_records` | 감정 기록은 생성 후 원본 보존을 우선한다. |
| `payment_saving_entries` | 저축 원장은 금액 이력 보존이 중요하다. |
| `payment_goal_achievements` | 목표 달성 스냅샷은 생성 후 보존한다. |

## 운영 주의사항

- SQL Editor에 전체 schema를 다시 실행하면 이미 존재하는 trigger/type/table 때문에 에러가 날 수 있다.
- `updated_at` 트리거는 수정 시각만 바꾼다. 변경 이력이 필요하면 별도 events 테이블이 필요하다.
- `on_auth_user_created`는 `auth.users` 트리거라 Supabase 권한/스키마 차이에 민감하다. 적용 후 신규 테스트 계정으로 `profiles`, `consent_settings`, `notification_settings` row가 생기는지 확인해야 한다.
