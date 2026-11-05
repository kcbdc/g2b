# 업체 명단 엑셀 업로드 → Cloudflare D1 저장

## 파일
- `schema.sql` : D1 테이블(companies, upload_log)
- `companies.js` : Worker API (`POST /api/companies/upload`, `GET /api/companies`)
- `upload-section.html` : 화면에 붙여넣는 업로드 카드(HTML+CSS+JS)
- `wrangler.toml.example` : D1 바인딩 예시

## 적용 순서
1. D1 생성: `npx wrangler d1 create g2b-db` (대시보드: Storage & Databases → D1 → Create)
2. 테이블 생성: `npx wrangler d1 execute g2b-db --remote --file=schema.sql` (대시보드 Console에 schema.sql 내용을 붙여넣어도 됨)
3. Worker에 D1 바인딩 추가: 변수명 **DB**
4. 시크릿 등록: `npx wrangler secret put UPLOAD_KEY` (업로드·조회용 비밀번호, 대시보드에서는 Variables and Secrets)
5. Worker 코드: `companies.js`의 함수를 넣고 fetch 맨 위에 추가
   `const r = await handleCompanies(request, env); if (r) return r;`
6. 화면: `upload-section.html` 내용을 기존 HTML 원하는 위치에 붙여넣기 후 배포

## 동작
- 엑셀에서 "계약업체", "업체사업자번호" 열을 자동 탐색 (상단 안내 문구 행은 무시)
- 사업자번호(숫자 10자리) 기준 중복 제거. 같은 번호에 업체명이 다르면 최신 계약일자의 업체명 사용
- 번호가 10자리가 아니거나 업체명이 없는 행은 제외하고 건수 표시
- 재업로드 시 신규는 추가, 기존은 업체명 갱신 (중복 저장 없음)
