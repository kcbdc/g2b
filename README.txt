나라장터 통합조회 V23 · Excel CSV 다운로드

1. GitHub kcbdc/g2b의 worker.js를 본 파일로 교체 후 main 브랜치에 반영합니다.
2. wrangler.jsonc는 기존 것을 유지합니다. index.html은 다시 배포하지 마십시오.
3. /api/health에서 V23 확인 후 사용합니다.
4. 조회 결과 > 통합 결과 CSV로 내려받습니다.

CSV: UTF-8 BOM, sep=, 안내행, 쉼표 분리, RFC 방식 큰따옴표 이스케이프, CRLF 줄바꿈. 사업자번호는 Excel에서 텍스트로 유지되도록 유효한 10자리 숫자만 ="번호"로 출력합니다.
기존 조회결과 로컬 저장소와 JSON 백업/복원 로직은 변경하지 않았습니다.
