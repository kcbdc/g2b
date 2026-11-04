나라장터 통합조회 V22 - 기업구분 3 제외 중소기업 분류

적용 원본: 2026-3차_최종.xlsx / 전체 시트
445개 사업자등록번호와 첨부 자료 전체 시트 대조:
 기업구분 3 = 24개 → N
 기업구분 1 = 65개 → Y
 명단에 없는 번호 = 356개 → 사용자 요청에 따라 Y (중소기업확인서 미검증)
 결과 Y 421, N 24

중요: 기업구분 코드에 대한 사용자 분류 규칙이며 확인서 발급/유효성의 공식 판정은 아닙니다.

배포: GitHub kcbdc/g2b main 저장소에서 worker.js 교체, wrangler.jsonc 유지/교체, 구형 index.html 삭제. Cloudflare Deployments에서 새 버전 활성화 확인. 기존 Secret G2B_API_KEY 유지.
기존 조회 100건, 429 중단 후 이어 조회 및 진행기록 JSON 백업 기능 유지.

배포 후 /api/health에서 version V22 확인. 개발 모의검사 결과와 Production 실제 API 결과는 구분하세요.
