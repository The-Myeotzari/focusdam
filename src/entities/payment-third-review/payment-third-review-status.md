# 결제 3심 상태 정의

결제 3심은 사용자의 최초 판단과 이후 후속 처리 결과가 달라질 수 있습니다.
백엔드에서는 `status`를 세부 상태의 기준값으로 저장하고, 화면의 큰 분류는 `outcomeType`을 기준으로 사용합니다.

## 핵심 필드

| 필드 | 타입 | 용도 |
| --- | --- | --- |
| `decisionType` | `buy \| save \| hold` | 결제 3심 생성 시 사용자가 처음 선택한 판단입니다. |
| `outcomeType` | `buy \| save \| hold` | 현재 리스트/필터에서 어느 묶음으로 보여줄지 나타냅니다. |
| `status` | `PaymentReviewStatus` | 백엔드 저장과 화면 분기의 기준이 되는 세부 상태입니다. |
| `followUpType` | `satisfaction \| reminder \| saved` | 후속 처리 UI 종류를 나타냅니다. |
| `satisfaction.status` | `scheduled \| required \| completed` | 결제 이후 만족도 체크 진행 상태입니다. |
| `reminder.status` | `scheduled \| required \| completed` | 보류 이후 리마인드 진행 상태입니다. |
| `reminder.reminderCount` | `number` | 몇 번째 리마인드인지 나타냅니다. 첫 보류는 `1`, 재보류는 `2`입니다. |
| `reminder.result.completedType` | `after-first-hold \| after-rehold` | 보류 이후 완료인지, 재보류 이후 완료인지 구분합니다. |
| `reminder.result.decision` | `buy \| cancel \| hold` | 리마인드에서 사용자가 선택한 최종 판단입니다. |

## 판단별 상태

### 즉시 결제

| status | outcomeType | 의미 |
| --- | --- | --- |
| `buy_satisfaction_scheduled` | `buy` | 즉시 결제를 선택했고 24시간 뒤 만족도 체크가 예정된 상태입니다. |
| `buy_satisfaction_required` | `buy` | 즉시 결제 후 24시간이 지나 만족도 체크가 필요한 상태입니다. |
| `buy_satisfaction_completed` | `buy` | 즉시 결제 후 만족도 체크까지 완료된 상태입니다. |

### 즉시 저축

| status | outcomeType | 의미 |
| --- | --- | --- |
| `save_completed` | `save` | 처음부터 결제를 취소하고 목표 저축으로 반영한 상태입니다. |

### 1차 보류

| status | outcomeType | 의미 |
| --- | --- | --- |
| `hold_reminder_scheduled` | `hold` | 24시간 보류를 선택했고 리마인드가 아직 도래하지 않은 상태입니다. |
| `hold_reminder_required` | `hold` | 24시간 보류 후 리마인드 판단이 필요한 상태입니다. |
| `hold_after_buy` | `buy` | 24시간 보류 후 결제 진행을 선택한 상태입니다. |
| `hold_after_save` | `save` | 24시간 보류 후 결제 미진행을 선택해 저축으로 볼 수 있는 상태입니다. |
| `hold_after_hold_scheduled` | `hold` | 24시간 보류 후 다시 보류를 선택해 3일 뒤 재보류 리마인드가 예정된 상태입니다. |

### 재보류

| status | outcomeType | 의미 |
| --- | --- | --- |
| `rehold_reminder_scheduled` | `hold` | 재보류를 선택했고 3일 뒤 리마인드가 아직 도래하지 않은 상태입니다. |
| `rehold_reminder_required` | `hold` | 재보류 후 3일이 지나 다시 판단이 필요한 상태입니다. |
| `rehold_after_buy` | `buy` | 재보류 이후 결제 진행을 선택한 상태입니다. |
| `rehold_after_save` | `save` | 재보류 이후 결제 미진행을 선택해 저축으로 볼 수 있는 상태입니다. |
| `rehold_after_hold_scheduled` | `hold` | 재보류 이후 다시 보류를 선택해 추가 리마인드가 예정된 상태입니다. |

## 보류 이후 선택 해석

| 사용자가 선택한 값 | 1차 보류 이후 status | 재보류 이후 status | outcomeType |
| --- | --- | --- | --- |
| 결제 진행 | `hold_after_buy` | `rehold_after_buy` | `buy` |
| 결제 미진행 | `hold_after_save` | `rehold_after_save` | `save` |
| 보류 | `hold_after_hold_scheduled` | `rehold_after_hold_scheduled` | `hold` |

`결제 미진행`은 사용자가 실제로 소비하지 않은 결과이므로 `save` 묶음으로 분류합니다.
`보류`를 다시 선택한 경우는 완료가 아니라 다음 리마인드가 예약된 진행 상태로 봅니다.

## 예약 상태 자동 전환

`payment_review_followups.scheduled_at`이 현재 시각보다 이전이고 후속 작업의 상태가
`scheduled`이면 `activate_due_payment_review_followups` 함수가 다음 상태로 전환합니다.
Supabase Cron은 이 함수를 5분마다 최대 100건씩 실행합니다.

| followupType | 기존 status | 변경 status |
| --- | --- | --- |
| `satisfaction` | `buy_satisfaction_scheduled` | `buy_satisfaction_required` |
| `reminder` | `hold_reminder_scheduled` | `hold_reminder_required` |
| `reminder` | `hold_after_hold_scheduled` | `rehold_reminder_required` |
| `reminder` | `rehold_reminder_scheduled` | `rehold_reminder_required` |
| `reminder` | `rehold_after_hold_scheduled` | `rehold_reminder_required` |

완료·취소된 후속 작업과 삭제된 결제 3심은 처리하지 않습니다. 함수는 대상 행을 잠그고
기존 상태를 다시 확인하므로 Cron과 수동 실행이 겹치거나 반복되어도 중복 처리되지 않습니다.

예약 작업과 향후 알림 실행은 외부 스케줄러가 아니라 Supabase 내장 기능을 기준으로 구성합니다.
현재 단계에서는 Database Cron(`pg_cron`)이 후속 작업의 도래 상태를 갱신합니다. 실제 모바일 푸시가
필요해지면 이 상태 변경을 Supabase Database Webhook과 Edge Function에 연결합니다.

## 후속 작업 완료 트랜잭션

만족도 제출은 `complete_payment_third_review_satisfaction`, 리마인드 판단 제출은
`complete_payment_third_review_reminder` RPC에서 처리합니다. 각 함수는 `auth.uid()`로
소유권을 확인하고 대상 결제 3심과 최신 후속 작업을 잠급니다.

- 만족도 제출은 후속 작업 완료와 `buy_satisfaction_completed` 전환을 함께 처리합니다.
- 리마인드 제출은 후속 작업 완료와 현재 판단 결과 반영을 함께 처리합니다.
- 재보류를 선택하면 다음 3일 리마인드 생성까지 같은 트랜잭션에서 처리합니다.
- 결제 미진행을 선택하면 연결된 목표의 저축 원장 생성까지 같은 트랜잭션에서 처리합니다.

처리 중 하나라도 실패하면 RPC 전체가 롤백되므로 애플리케이션에서 별도 복구 요청을 실행하지
않습니다. 같은 요청이 다시 들어오면 완료 상태를 확인해 중복 반영을 방지합니다.

## 예시 데이터

각 `PaymentReviewStatus`별 예시 데이터는 `PAYMENT_REVIEW_HISTORY_ITEMS`에 하나씩 포함되어 있습니다.

| status | 예시 id |
| --- | --- |
| `buy_satisfaction_scheduled` | `ptr-001` |
| `buy_satisfaction_required` | `ptr-006` |
| `buy_satisfaction_completed` | `ptr-007` |
| `save_completed` | `ptr-003` |
| `hold_reminder_scheduled` | `ptr-005` |
| `hold_reminder_required` | `ptr-002` |
| `hold_after_buy` | `ptr-010` |
| `hold_after_save` | `ptr-008` |
| `hold_after_hold_scheduled` | `ptr-011` |
| `rehold_reminder_scheduled` | `ptr-012` |
| `rehold_reminder_required` | `ptr-013` |
| `rehold_after_buy` | `ptr-014` |
| `rehold_after_save` | `ptr-009` |
| `rehold_after_hold_scheduled` | `ptr-015` |
