V16 - Cloudflare Workers 단일 파일 배포

1. 반드시 Cloudflare Workers & Pages > g2b > Edit code 에서 기존 내용을 모두 지우고 cloudflare-worker.js 파일의 전체 내용을 붙여 넣은 뒤 Deploy. index.html만 붙여 넣으면 API가 동작하지 않습니다.
2. Settings > Variables and secrets 의 G2B_API_KEY Secret 유지.
3. 배포 후 https://g2b.junewoopark16.workers.dev/?g2b_action=health 를 새 탭에서 열어 JSON의 version V16 / servedBy g2b Worker 확인.
4. 기존 웹페이지도 새로고침(Ctrl+Shift+R). 제목이 V16인지 확인.
5. 1건 통합시험 후 전체 조회.
6. /__g2b_v14_api /__g2b_v15_api 등 이전 경로도 신규 배포 시 처리함. 만약 기본 주소의 JSON 점검도 HTML 또는 404이면 Worker 자체가 최신 코드로 배포되지 않았거나 다른 라우트/정적자산이 우선 처리되는 문제로, Cloudflare Deployments에서 Production 최신 버전과 Worker 이름, 도메인 연결을 확인해야 합니다.
7. 사회적기업은 2026-11-02 명단 스냅샷 기준 17개 Y, 428개 N입니다.
8. 여성/장애인 인증은 각 SMPP API 활용승인이 필요합니다. G2B_API_KEY는 응답에 노출하지 않습니다.

테스트 범위: Node 문법 및 모의 Worker 요청 테스트. 실제 Secret 실조회 미검증.
