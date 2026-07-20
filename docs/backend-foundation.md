# 백엔드 공통 기반

## 환경변수

`.env.example`을 `.env.local`로 복사한 뒤 모든 값을 설정합니다. Supabase 설정은
클라이언트를 생성할 때 검증합니다. 인증 설정이 누락되거나 올바르지 않으면 세션 검증 없이
요청을 통과시키지 않고 즉시 실패하도록 처리합니다.

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxx
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

`NEXT_PUBLIC_SUPABASE_URL`은 HTTPS를 사용해야 합니다. 로컬 Supabase 개발 환경인
`localhost`와 `127.0.0.1`에서만 HTTP를 허용합니다.

## Route Handler 작성 규칙

- Route Handler는 `src/app/api/**/route.ts` 아래에 작성합니다.
- 사용자 소유 데이터에 접근하기 전에 `getUser(request)`를 호출합니다.
- JSON 요청 본문은 `parseJsonBody(request, schema)`로 검증합니다.
- 실패 응답은 `apiError()`를 사용해 공통 오류 형식으로 반환합니다.
- 서버의 높은 권한이 명시적으로 필요한 작업이 아니라면 Route Handler에 service role
  인증 정보를 노출하지 않습니다.
- RLS가 적용되어 있어도 사용자 소유 데이터 쿼리에는 인증된 `user.id` 조건을 추가합니다.

```ts
const auth = await getUser(request);
if (!auth.ok) return auth.response;

const body = await parseJsonBody(request, InputSchema);
if (!body.success) return body.response;
```

## 오류 응답

```json
{
  "type": "about:blank",
  "title": "VALIDATION_ERROR",
  "status": 400,
  "detail": "name: Too small",
  "timestamp": "2026-07-20T00:00:00.000Z",
  "path": "/api/example"
}
```

프론트엔드 `Api` 클라이언트는 이 오류 형식을 검증합니다. JSON이 아니거나 공통 형식과
일치하지 않는 오류 응답은 안전한 기본 오류 본문을 포함한 `ApiRequestError`로 변환합니다.

## 페이지네이션 규격

목록 API는 1부터 시작하는 `page`와 1~100 사이의 `size`를 사용합니다.

```text
GET /api/items?page=1&size=20
```

응답에는 다음 페이지네이션 정보를 포함합니다.

```json
{
  "page": 1,
  "size": 20,
  "totalElements": 42,
  "totalPages": 3
}
```

모든 Route Handler가 동일하게 동작하도록 `parsePagination()`, `getPaginationRange()`,
`createPaginationMeta()`를 사용합니다.

## 인증 및 RLS 검증

다음 API 시나리오는 `npm test`로 검증합니다.

- 인증된 사용자의 요청은 성공합니다.
- 세션이 없으면 공통 형식의 `401` 응답을 반환합니다.
- 유효하지 않은 토큰은 `401` 응답을 반환합니다.
- 프로필 쿼리는 인증된 사용자 ID로 제한합니다.
- 데이터베이스 오류와 프로필 없음 응답은 공통 오류 형식을 사용합니다.

초기 데이터베이스 스키마를 적용한 다음
`supabase/migrations/20260720000000_enable_rls.sql`을 적용합니다. 이후 Supabase SQL
Editor에서 `supabase/tests/rls_audit.sql`을 실행합니다. 두 감사 쿼리 모두 0행을 반환해야
합니다.

마이그레이션에는 다음 정책이 포함됩니다.

- 사용자 데이터는 인증된 본인만 접근할 수 있습니다.
- 이벤트와 원장 데이터는 추가만 가능하도록 제한합니다.
- 서비스가 관리하는 구독과 주간 리뷰는 사용자가 직접 수정할 수 없습니다.
- `starter_action_templates`와 `plus_plans`는 공개 읽기만 허용합니다.

## 검증 명령어

```bash
npm run typecheck
npm test
npm run build
```
