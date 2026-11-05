-- Cloudflare D1 스키마: 계약업체 명단
CREATE TABLE IF NOT EXISTS companies (
  biz_no      TEXT PRIMARY KEY,                 -- 사업자등록번호(숫자 10자리, 하이픈 제거)
  name        TEXT NOT NULL,                    -- 업체명
  source_file TEXT,                             -- 마지막으로 반영된 업로드 파일명
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_companies_name ON companies(name);

-- 업로드 이력
CREATE TABLE IF NOT EXISTS upload_log (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  file_name    TEXT,
  received     INTEGER NOT NULL,                -- 수신 행 수(중복 포함)
  unique_count INTEGER NOT NULL,                -- 중복 제거 후 업체 수
  inserted     INTEGER NOT NULL,                -- 신규 저장
  updated      INTEGER NOT NULL,                -- 기존 업체 갱신
  created_at   TEXT NOT NULL DEFAULT (datetime('now'))
);
