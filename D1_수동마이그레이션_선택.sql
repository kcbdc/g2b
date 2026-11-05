-- V26 D1 schema extension. Existing V25 `companies` and `upload_log` are retained.
-- Normally these statements are applied automatically on first authenticated request.
CREATE TABLE IF NOT EXISTS upload_batches (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category TEXT NOT NULL,
  file_name TEXT NOT NULL,
  uploaded_at TEXT NOT NULL DEFAULT (datetime('now')),
  row_count INTEGER NOT NULL,
  active INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE IF NOT EXISTS upload_items (
  batch_id INTEGER NOT NULL,
  biz_no TEXT NOT NULL,
  name TEXT NOT NULL,
  PRIMARY KEY(batch_id,biz_no),
  FOREIGN KEY(batch_id) REFERENCES upload_batches(id)
);
CREATE INDEX IF NOT EXISTS idx_upload_batches_category_date
ON upload_batches(category,uploaded_at,active);
CREATE INDEX IF NOT EXISTS idx_upload_items_biz ON upload_items(biz_no);
-- Existing companies are imported as a legacy (unclassified) batch on first V26 request.
-- Do not manually delete or truncate `companies`.
