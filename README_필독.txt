V26 D1 바인딩 유실 재발 방지 (2026-11-05)

확인된 문제:
GitHub kcbdc/g2b/main/wrangler.jsonc에는 d1_databases 선언이 없음.
이 상태로 Wrangler 자동배포하면 기존 D1 바인딩이 새 배포에 유지되지 않을 수 있음.

수정 절차:
1) Cloudflare 대시보드 -> Workers & Pages -> g2b -> Bindings에서 기존 DB 바인딩의 D1 데이터베이스 이름 확인.
2) D1 -> 기존 데이터베이스 -> Settings/Overview에서 'Database ID' (UUID) 확인.
3) 이 폴더의 wrangler.jsonc에서 다음 두 자리만 실제 값으로 변경.
   REPLACE_WITH_EXISTING_D1_DATABASE_NAME -> 현재 연결된 기존 D1 이름
   REPLACE_WITH_EXISTING_D1_DATABASE_ID   -> 기존 D1 UUID
4) GitHub kcbdc/g2b 저장소 최상위의 wrangler.jsonc를 이 파일로 교체하고 커밋.
5) 소스 전체 교체가 필요하지 않다면 worker.js는 유지. 이 ZIP의 worker.js는 V26 원본 복사본.
6) GitHub/Cloudflare 빌드 명령은 npx wrangler deploy를 유지.
7) https://g2b.junewoopark16.workers.dev/api/health 에서 version=V26, dbConfigured=true 확인.
8) 실제 관리자 연결/기존 명단 조회로 DB 쿼리 동작 확인.

중요:
- database_name이나 database_id를 짐작해서 넣지 말 것.
- 새 D1를 생성하지 말 것: 기존 업체/이력 보존 필요.
- G2B_API_KEY, UPLOAD_KEY 등의 Secret 실제 값을 파일에 넣지 말 것.
- keep_vars=true는 대시보드 변수/Secret 덮어쓰기를 줄이기 위한 설정이며 D1 바인딩 자체를 보장하는 것은 d1_databases 항목.
- env.production 같은 배포환경을 쓰면 해당 환경에도 D1 바인딩을 별도 설정해야 함.
- placeholder 상태에서 배포하지 말 것: 실제 DB 정보를 넣지 않으면 바인딩 실패함.
