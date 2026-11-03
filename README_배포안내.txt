V18 배포 안내

1. Cloudflare Workers & Pages > g2b > Edit code 에서 cloudflare-worker.js 코드 전체를 붙여넣고 Deploy. HTML 파일을 별도로 업로드하지 마세요.
2. Settings > Variables and secrets > G2B_API_KEY 는 Secret으로 유지.
3. https://g2b.junewoopark16.workers.dev/api/health 에서 version V18 반환 확인.
4. /api/health가 404면 https://g2b.junewoopark16.workers.dev/?g2b_action=health 확인. 양쪽 모두 HTML이면 정적자산 우선 라우팅 문제가 유력합니다.
5. Cloudflare Worker에 Assets 연결/정적 파일이 있으면 Workers 우선 실행(run_worker_first=true)을 설정하거나 정적자산 배포를 제거하고 Worker만 배포해야 합니다. 코드가 실제로 실행되지 않는 라우팅 문제는 코드 변경만으로 해결되지 않습니다.
6. 브라우저 Ctrl+Shift+R, V18 연결 점검, 1건 통합시험 후 445건 조회.
7. 사회적기업 2026-11-02 명단 반영, 여성기업/장애인기업 SMPP XML API 조회. 별도의 SMPP API 활용승인이 필요할 수 있습니다.
8. API 키는 웹 클라이언트로 전송되지 않습니다. 445건 대량 조회 전에 공공데이터포털 서비스별 호출한도를 확인하세요.

이 코드는 로컬 모의 실행으로 검증했으며 실제 사용자 Production 설정은 직접 변경할 수 없습니다.
