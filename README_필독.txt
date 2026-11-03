나라장터 통합조회 - GitHub 정적 index.html 충돌 해결

[정확히 확인한 사실]
- 업로드된 index.html에는 화면 버전 V17이 박혀 있습니다.
- index.html은 /api/health를 호출하고 응답 version이 정확히 V17이어야 성공으로 판정합니다.
- V18 Worker에는 HTML_PAGE가 내장되어 있고, /api/health 및 /api/lookup 경로도 정의되어 있습니다.
- 둘을 서로 다른 경로/버전으로 배포하면 화면 V17 / 서버 V18 불일치가 발생할 수 있습니다.

[GitHub kcbdc/g2b 의 권장 파일 구성]
- worker.js : 본 ZIP의 worker.js 파일로 교체(Worker V18 소스)
- wrangler.jsonc : 본 ZIP의 wrangler.jsonc 파일로 생성/교체
- index.html : 저장소에서 삭제 (Worker가 화면을 직접 제공하므로 불필요)
- 기존 wrangler.toml, wrangler.json, wrangler.jsonc가 중복되는 경우 하나만 남기고 설정 확인
- 정적 assets 디렉터리 설정이 남아 있다면 제거. 단, 다른 정적 자산을 쓰는 앱이라면 별도 검토 필수.

[배포]
1. GitHub 저장소에서 위 3개 파일 구성을 적용해 main 브랜치에 커밋
2. Cloudflare Builds의 API token 문제를 해소하고 실제 배포 성공을 확인
3. Cloudflare Production 환경의 Secret G2B_API_KEY 존재 확인(인증키 자체는 GitHub에 넣지 않기)
4. https://g2b.junewoopark16.workers.dev/api/health 에서 JSON version V18 확인
5. 사이트 홈에서 화면 V18 / 서버 V18 확인
6. 1건 통합시험 성공 후 전체 조회

[주의]
- Cloudflare 편집기에서 수동으로 코드 배포했더라도 이후 GitHub 배포가 다른 설정/코드를 덮어쓸 수 있습니다.
- Cloudflare에서 동일 Worker에 GitHub 자동배포와 Dashboard 수동수정을 혼용하지 않는 것을 권장합니다.
- 이 패키지는 기존 V18 조회 코드를 보존하고 배포 설정만 바로잡은 것입니다. 실제 API 인증 응답과 오류 90 해석은 별도 검증 대상입니다.
