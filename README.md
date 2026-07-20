# focusdam

Next.js starter with an FSD-oriented folder structure and PWA basics.

## Scripts

- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run lint`
- `npm run typecheck`
- `npm test`

## Structure

- `src/app` for routing, layout, metadata, and global styles
- `src/widgets` for composed UI sections
- `src/features` for user-facing actions and flows
- `src/entities` for domain models
- `src/shared` for reusable UI, helpers, and config

## 백엔드 공통 기반

Supabase SSR, Route Handler 작성 규칙, 요청 검증, 페이지네이션, 테스트 및 RLS 정책은
[`docs/backend-foundation.md`](docs/backend-foundation.md)에 정리되어 있습니다.
