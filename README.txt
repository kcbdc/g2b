나라장터 사업자 개업일 및 인증기업 대조 V11

[설치]
1. Cloudflare 대시보드에서 Workers & Pages > g2b > Edit code로 들어갑니다.
2. cloudflare-worker.js 내용 전체를 붙여넣고 Deploy 합니다.
3. Settings > Variables and secrets > Add variable을 선택합니다.
4. Type: Secret / Name: G2B_API_KEY / Value: 공공데이터포털 디코딩(Decoding) 인증키
5. Save 후 Production 배포에 적용됐는지 확인합니다. 필요 시 재배포합니다.
6. https://g2b.junewoopark16.workers.dev/api/health 에서 version=V11, keyConfigured=true를 확인합니다.
7. 웹페이지를 새로고침(CTRL+F5)하고 1건 연결 시험 후 전체 조회합니다.

[주의]
- Secret은 Worker 서버에서만 읽으며 HTML/클라이언트 요청에 포함되지 않습니다.
- 같은 인증키 문자열을 쓰더라도 각 API별 활용승인이 별도로 필요할 수 있습니다.
- V11은 개업일 API 자동조회와 여성/장애인/사회적기업 공식 CSV/TXT 대조를 제공합니다. 3개 인증정보의 실시간 API 자동조회는 미구현입니다.
- 사이트가 공개 상태이면 다른 방문자도 API 조회를 호출할 수 있으므로 Cloudflare Access 등 접근제한을 권장합니다.
- 기존 브라우저 정상 조회결과는 그대로 유지합니다.
