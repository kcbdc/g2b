나라장터 통합조회 V17 — 정상 접속 V8 경로 복원

배포: Cloudflare Workers & Pages > g2b > Edit code에서 cloudflare-worker.js 전체 내용만 붙여넣고 Deploy (index.html 별도 배포 불필요).
Secret: Settings > Variables and secrets > G2B_API_KEY (Secret).
확인: https://g2b.junewoopark16.workers.dev/api/health 에서 JSON version V17 확인.
반드시 Worker 코드 전체를 붙여넣어야 합니다. index.html만 올리면 웹페이지는 보이지만 API는 작동하지 않습니다.
사용: 1건 통합시험 -> 전체 통합조회. 사회적기업은 첨부 명단 2026-11-02 기준 자동 표시.
여성/장애인 인증은 별도 SMPP API 활용승인이 필요하며, 인증서 유효기간을 기준으로 Y/N 판단. 오류는 미확인 표시.
실제 실서비스 인증키 조회는 이 실행 환경에서는 검증할 수 없으며 로컬 모의 API 응답으로 테스트합니다.
