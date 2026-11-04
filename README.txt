나라장터 통합조회 V24: Excel 한글 깨짐 수정

1. GitHub kcbdc/g2b 저장소에서 worker.js를 이 파일로 교체하세요.
2. 기존 wrangler.jsonc, Cloudflare Secret G2B_API_KEY는 유지합니다.
3. 별도 index.html을 추가하지 마세요(Worker가 화면과 API를 모두 제공).
4. 배포 후 /api/health 에서 V24 확인, 기존 브라우저에서 새로고침.
5. 통합 결과 CSV 버튼은 CP949(Windows 한국어 Excel 호환) 파일을 내려받습니다.

중요: 기존 조회 기록은 이전 로컬 저장소 그대로 유지합니다.
기존 UTF-8 BOM CSV를 한글이 깨지게 열었던 환경에서 더블클릭 시 개선됩니다.
CP949 범위에 없는 희귀 문자(이모지 등)는 ?로 대체될 수 있습니다.
기타 시스템(macOS, Linux, Google Sheets)에서는 UTF-8 CSV가 더 적합할 수 있습니다.
