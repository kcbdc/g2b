나라장터 + SMPP 여성기업·장애인기업 자동조회 V13

1. Cloudflare Workers > g2b > Edit code 에 cloudflare-worker.js 전체 붙여넣기 및 Deploy.
2. Settings > Variables and secrets > Secret 이름 G2B_API_KEY, 값 공공데이터포털 디코딩 인증키.
3. 공공데이터포털에서 나라장터 사용자정보 서비스와 공공구매종합정보망 인증서 정보 제공 서비스 각각 활용승인 필요.
4. ?action=health 접속해 version V13, keyConfigured true 확인.
5. 1건 통합시험 후 전체 자동조회. 조회 기준일은 한국시간 오늘.
6. 여성기업 getFnrssList, 장애인기업 getDspsnList; XML, ServiceKey + stdrDate(YYYYMMDD) + bsnmNo + numOfRows + pageNo.
7. 정상 응답의 인증정보가 있을 때 Y, totalCount=0이면 N, 오류면 —(미확인).
8. 사회적기업 여부는 이 기술문서의 API에 없으므로 —(미확인)으로 유지.
9. 로컬 저장: 동일 브라우저/동일 주소의 localStorage 사용. TXT 다운로드 가능.
10. 대량 조회는 인증서 API 호출량(445 * 2회)과 활용승인/한도 확인 필요. 공개 Worker 접근제한 권장.

로컬 모의시험과 문법검사를 수행했으며 실 서비스키 조회는 검증하지 못했습니다.
