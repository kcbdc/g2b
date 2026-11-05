// 계약업체 명단 API (Cloudflare Worker + D1)
// 기존 Worker의 fetch 맨 위에 아래 두 줄을 추가하세요.
//   const r = await handleCompanies(request, env);
//   if (r) return r;
// 파일을 따로 두지 않고 한 파일에 붙여넣을 경우 `export` 키워드만 지우면 됩니다.
//
// 필요 설정: D1 바인딩 이름 DB, 시크릿 UPLOAD_KEY (업로드·조회 보호용)

const JSON_HEADERS = { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' };
const json = (obj, status = 200) => new Response(JSON.stringify(obj), { status, headers: JSON_HEADERS });

const MAX_ROWS = 5000;      // 1회 업로드 최대 행 수
const CHUNK = 30;           // 멀티로우 INSERT 1건당 30행 (D1 바인딩 변수 100개 제한 대비 30x3=90)

const digits = (s) => String(s ?? '').replace(/\D/g, '');
const cleanName = (s) => String(s ?? '').replace(/\s+/g, ' ').trim();

function safeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function authError(request, env) {
  if (!env.DB) return json({ ok: false, error: 'D1 바인딩(DB)이 설정되지 않았습니다.' }, 500);
  if (!env.UPLOAD_KEY) return json({ ok: false, error: 'UPLOAD_KEY 시크릿이 설정되지 않았습니다.' }, 500);
  if (!safeEqual(request.headers.get('x-upload-key') || '', env.UPLOAD_KEY)) {
    return json({ ok: false, error: '업로드 키가 올바르지 않습니다.' }, 401);
  }
  return null;
}

export async function handleCompanies(request, env) {
  const url = new URL(request.url);
  if (url.pathname !== '/api/companies' && url.pathname !== '/api/companies/upload') return null;

  const denied = authError(request, env);
  if (denied) return denied;

  try {
    if (url.pathname === '/api/companies/upload') {
      if (request.method !== 'POST') return json({ ok: false, error: 'POST만 허용됩니다.' }, 405);
      return await upload(request, env);
    }
    if (request.method !== 'GET') return json({ ok: false, error: 'GET만 허용됩니다.' }, 405);
    return await list(url, env);
  } catch (e) {
    return json({ ok: false, error: 'DB 처리 중 오류: ' + (e && e.message ? e.message : String(e)) }, 500);
  }
}

async function upload(request, env) {
  let body;
  try { body = await request.json(); } catch { return json({ ok: false, error: '잘못된 요청 형식입니다.' }, 400); }

  const rows = Array.isArray(body && body.rows) ? body.rows : null;
  if (!rows || rows.length === 0) return json({ ok: false, error: '저장할 업체 데이터가 없습니다.' }, 400);
  if (rows.length > MAX_ROWS) return json({ ok: false, error: `한 번에 ${MAX_ROWS}행까지 업로드할 수 있습니다.` }, 413);

  const fileName = cleanName(body.fileName).slice(0, 200) || null;

  // 서버에서도 한 번 더 검증·중복 제거 (사업자번호 기준, 먼저 나온 값 유지)
  const map = new Map();
  let invalid = 0, duplicate = 0;
  for (const r of rows) {
    const biz = digits(r && r.bizNo);
    const name = cleanName(r && r.name).slice(0, 200);
    if (biz.length !== 10 || !name) { invalid++; continue; }
    if (map.has(biz)) { duplicate++; continue; }
    map.set(biz, name);
  }
  const list = [...map];
  if (list.length === 0) return json({ ok: false, error: '유효한 사업자등록번호가 없습니다.' }, 400);

  const before = (await env.DB.prepare('SELECT COUNT(*) AS n FROM companies').first()).n;

  const stmts = [];
  for (let i = 0; i < list.length; i += CHUNK) {
    const part = list.slice(i, i + CHUNK);
    const placeholders = part.map(() => '(?,?,?)').join(',');
    const binds = part.flatMap(([biz, name]) => [biz, name, fileName]);
    stmts.push(
      env.DB.prepare(
        `INSERT INTO companies (biz_no, name, source_file) VALUES ${placeholders}
         ON CONFLICT(biz_no) DO UPDATE SET
           name = excluded.name,
           source_file = excluded.source_file,
           updated_at = datetime('now')`
      ).bind(...binds)
    );
  }
  await env.DB.batch(stmts); // 하나의 트랜잭션: 실패 시 전체 롤백

  const after = (await env.DB.prepare('SELECT COUNT(*) AS n FROM companies').first()).n;
  const inserted = after - before;
  const updated = list.length - inserted;

  await env.DB.prepare(
    'INSERT INTO upload_log (file_name, received, unique_count, inserted, updated) VALUES (?,?,?,?,?)'
  ).bind(fileName, rows.length, list.length, inserted, updated).run();

  return json({ ok: true, received: rows.length, invalid, duplicate, unique: list.length, inserted, updated, total: after });
}

async function list(url, env) {
  const q = cleanName(url.searchParams.get('q'));
  const limit = Math.min(Math.max(parseInt(url.searchParams.get('limit') || '100', 10) || 100, 1), 1000);
  const offset = Math.max(parseInt(url.searchParams.get('offset') || '0', 10) || 0, 0);

  let where = '';
  const binds = [];
  if (q) {
    const esc = q.replace(/[\\%_]/g, (c) => '\\' + c);
    const d = digits(q);
    if (d.length >= 3 && d.length === q.replace(/[-\s]/g, '').length) {
      where = "WHERE biz_no LIKE ? ESCAPE '\\'";
      binds.push(`%${d}%`);
    } else {
      where = "WHERE name LIKE ? ESCAPE '\\'";
      binds.push(`%${esc}%`);
    }
  }
  const total = (await env.DB.prepare('SELECT COUNT(*) AS n FROM companies').first()).n;
  const matched = where
    ? (await env.DB.prepare(`SELECT COUNT(*) AS n FROM companies ${where}`).bind(...binds).first()).n
    : total;
  const { results } = await env.DB.prepare(
    `SELECT biz_no AS bizNo, name, source_file AS sourceFile, updated_at AS updatedAt
       FROM companies ${where} ORDER BY name LIMIT ? OFFSET ?`
  ).bind(...binds, limit, offset).all();

  return json({ ok: true, total, matched, limit, offset, rows: results });
}
