나라장터 사용자정보서비스 공식 명세 1.1 기반 수정판 V7

원인: 기존 소스가 serviceKey(소문자)를 전달했으나 명세의 정확한 항목명은 ServiceKey(대문자)입니다. 추가로 조회구분 1,2는 조회기간이 필수입니다. 사업자번호 직접 조회에는 inqryDiv=3, bizno=10자리 사용.

공식 REST 예제: /getPrcrmntCorpBasicInfo02?inqryDiv=3&bizno=6168122531&pageNo=1&numOfRows=10&ServiceKey=인증키
개업일 결과 필드: opbizDt (날짜 YYYY-MM-DD HH:MM:SS)

배포: Cloudflare Workers > g2b > Edit code > cloudflare-worker.js 전체 복사 > Deploy.
접속: https://g2b.junewoopark16.workers.dev
1. 먼저 서버 연결 점검에서 V7 확인.
2. API 인증키 입력 (디코딩 키 또는 인코딩 키를 한 번 자동 디코딩 지원).
3. 1건 연결 시험 → 결과가 정상일 때만 전체 자동조회.
4. 조회결과 TXT 다운로드.

보안: 인증키는 브라우저 localStorage에 저장하지 않으며 Worker 서버에도 영구 저장하지 않습니다. 다만 요청마다 서버로 전송되므로 개인용/제한된 접속에만 사용하고, 공개 배포 시 접근제어를 추가하는 것을 권장합니다.
실조회: API 키가 없어 실제 상위 API 호출 테스트는 수행하지 못했습니다. 모의 JSON/XML 응답으로 검사했습니다.
주의: API opbizDt는 개업일시이며 법인등기상 설립일이 아닐 수 있습니다.
