나라장터 개업일 + 여성·장애인기업 인증 자동조회 V14

오류 분석
- 화면에서 HTTP 200 + <!doctype html>이 뜬 것은 공공데이터포털 오류가 아닙니다.
- V13의 화면에서 요청한 API 경로가 Cloudflare에서 Worker JSON 대신 HTML을 반환한 것입니다.
- 원인은 Worker 스크립트가 실제 배포되지 않았거나 정적 자산(index.html)이 라우팅을 가로채는 등의 배포 구조 문제일 수 있습니다.

Cloudflare 배포 (중요)
1. Cloudflare 대시보드 > Workers & Pages > g2b > Edit code
2. 기존 Worker 코드를 cloudflare-worker.js 파일의 전체 내용으로 교체합니다.
3. Deploy를 눌러 Production 배포가 성공했는지 확인합니다.
4. HTML 파일(index.html)을 단독 업로드하거나 정적 사이트로 배포하지 마세요. HTML은 Worker 소스 내부에 이미 포함되어 있습니다.
5. Secret: Settings > Variables and secrets > G2B_API_KEY (Secret) 유지
6. 아래 URL을 새 탭에서 직접 열어 검사:
   https://g2b.junewoopark16.workers.dev/__g2b_v14_api?action=health
7. 정상이라면 Content-Type: application/json, version: V14, keyConfigured: true가 표시됩니다.
8. HTML이 나오면 API 코드 자체가 서비스 요청을 받고 있지 않으므로 Deployments에서 활성 Production 배포와 Worker entrypoint를 확인해야 합니다.
9. 정상 확인 후 메인 페이지를 강력 새로고침(Ctrl+Shift+R)하고 1건 통합시험부터 실행합니다.

API 요청: GET /__g2b_v14_api?action=lookup&number=사업자등록번호
요청 키는 Cloudflare Secret에서만 읽으며 클라이언트에 내려주지 않습니다.
SMPP 여성기업: getFnrssList, 장애인기업: getDspsnList, XML 응답 파싱 및 기준일 유효 확인서 조회.
사회적기업은 별도 API 명세가 없어 미확인으로 표시합니다.

테스트: JavaScript 문법, 모의 Worker health/lookup 검사. 실제 Cloudflare Production 배포 및 인증키 조회는 확인할 수 없습니다.
