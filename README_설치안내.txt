나라장터 업체 통합조회 V25 — D1 단일 조회 명단 + 직관형 UI
====================================================

1. 무엇이 바뀌었나요?
- 기존 화면에 박혀 있던 445개 업체 배열(COMPANIES)을 조회 대상으로 사용하지 않습니다.
- 서버의 고정 ALLOWED 사업자번호 배열을 제거했습니다.
- 화면 목록은 D1 companies 테이블에서 읽고, POST /api/lookup 역시 같은 D1 테이블에서 존재 여부를 확인합니다.
- 엑셀(.xlsx/.xls) 또는 CSV/TXT 파일의 업체명·사업자등록번호 열을 자동 인식합니다.
- 업로드 전에 업체수·중복·제외행과 샘플 미리보기를 확인할 수 있습니다.
- '이 명단으로 교체'는 기존 조회 대상의 완전 교체, '기존 명단에 추가'는 추가/이름 갱신입니다.
- 브라우저의 기존 조회 결과(STORE: komsco-g2b-v13)를 그대로 보존합니다.
- 완료/확인필요/미조회 카운터는 현재 D1 목록 기준으로 재계산합니다.
- 개업일/여성기업/장애인기업 API, 사회적기업 명단 대조, 중소기업 사용자 규칙, 429 중단 후 재개, CP949 CSV를 유지합니다.

2. GitHub 배포
- GitHub 저장소 kcbdc/g2b의 worker.js를 패키지의 worker.js로 교체하고 main 브랜치에 반영하세요.
- 이미 합의한 단일 Worker 배포를 유지하세요. 구버전 index.html을 저장소에 다시 추가하지 마세요.
- 기존 wrangler.jsonc 또는 wrangler.toml의 main이 ./worker.js인지 확인하세요.
- Assets 정적 파일이 Worker 요청을 가로채는 별도 설정이 있으면 제거하거나 Worker 우선 실행 설정을 확인하세요.
- Cloudflare Deployments에서 V25가 Production 트래픽을 받는지 확인하세요.

3. Cloudflare 설정 (필수)
- Workers & Pages → g2b → Settings → Variables and secrets
   Secret: G2B_API_KEY = 공공데이터포털 디코딩 인증키 (기존 값 유지)
   Secret: UPLOAD_KEY = 관리자용 임의의 충분히 긴 비밀번호
- Settings → Bindings에서 D1 데이터베이스를 연결하고 이름을 정확하게 DB로 설정합니다.
- D1에는 이전 버전에서 companies 테이블이 있어도 됩니다. 없으면 Worker가 자동 생성합니다.
- GitHub 코드 및 wrangler 설정파일에 인증키/관리 비밀번호 원문을 넣지 마세요.

4. 첫 사용
- https://g2b.junewoopark16.workers.dev/api/health 를 열어 JSON version V25, dbConfigured true,
  adminConfigured true, keyConfigured true인지 확인합니다.
- 사이트의 '관리자 연결'에 UPLOAD_KEY를 입력하고 연결합니다.
- D1에 명단이 없으면 0개로 표시됩니다. (445개가 자동 삽입되지는 않습니다.)
- 엑셀 파일 선택 → 시트 선택(여러 개일 때) → 미리보기 → '이 명단으로 교체'를 클릭합니다.
- D1 업체 수를 확인하고 '1건 시험' → '미완료 업체 조회' 순으로 실행합니다.
- 결과를 'CSV 다운로드 (엑셀용)'으로 저장합니다.

5. API / 권한
- GET  /api/health             : 서버 버전, D1/Secret 등록 여부만 조회 (키 값 비공개)
- GET  /api/companies          : D1 조회 대상 목록 (x-upload-key 필요)
- POST /api/companies/upload   : D1 명단 교체/추가 (x-upload-key 필요)
- POST /api/lookup             : D1 명단에 존재하는 사업자번호만 조회 (x-upload-key 필요)
- 페이지 조회 결과는 사용자 브라우저 localStorage에 남고 D1에는 별도로 저장하지 않습니다.
- 관리자 비밀번호는 sessionStorage에만 보관하여 탭이 닫히면 다시 입력해야 합니다.

6. 중요 주의 사항
- 중소기업: 과거 제공된 기업구분 자료 중 코드 3에 등록된 24개는 N, 그 외는 사용자 요청에 따른 Y입니다.
  신규 업체에 표시되는 Y는 중소기업확인서로 검증된 결과가 아닙니다.
- 사회적기업: 기존 첨부 누적명단(2026-11-02) 기준으로만 판정합니다. 새 사업자번호가 명단에 없으면
  '—'로 표시합니다. 이는 사회적기업이 아님을 확정하는 N이 아닙니다.
- 여성·장애인기업: API 오류는 미확인으로 표시하며, 429/LIMITED_NU 발생 시 중단 후 다시 실행하세요.
- 기존 브라우저 저장소의 완료 기록은 유지되지만, 다른 브라우저에서는 JSON 백업/복원 기능을 사용하세요.
- 서버에 엑셀 바이너리를 직접 저장하지 않습니다. 브라우저에서 열 이름과 유효 사업자번호를 추출해
  {bizNo,name} 목록만 전송합니다.
- xlsx/xls 파일 파싱에는 CDN의 SheetJS 라이브러리 로드가 필요합니다. 차단되면 CSV로 저장해 업로드하세요.

7. 검증 결과 (로컬 모의 D1/응답 기준)
- Worker와 페이지 JavaScript 문법 통과
- D1 빈 목록, 관리 비밀번호 불일치, 명단 업로드, 화면 목록 읽기, 명단 교체, 구사업자번호 조회 차단,
  명단 추가, 동적 조회 허용 경로 테스트 통과
- Excel 열 자동 인식, 중복/무효 사업자번호 제외 테스트 통과
- CP949 CSV에서 한국어 문자열 복원 테스트 통과
- 실제 Cloudflare Production D1/API 인증키 운영환경 배포 및 연속 조회는 아직 수행하지 않았습니다.
