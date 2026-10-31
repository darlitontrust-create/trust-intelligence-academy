/* =====================================================================
   sql-engine.js — Motor de execução e correção de SQL
   ---------------------------------------------------------------------
   • Executa SQL de verdade no navegador usando SQLite (sql.js).
   • Cada execução cria um banco novo a partir do seed, então DDL/DML do
     aluno nunca "suja" o próximo exercício.
   • Emula STORED PROCEDURES no estilo T-SQL (o SQLite não tem):
        CREATE PROCEDURE nome (@p1 TIPO, @p2 TIPO) AS BEGIN ... END;
        EXEC nome valor1, valor2;
   • Corrige comparando o resultado do aluno com o do gabarito,
     valida comandos obrigatórios/proibidos e traduz erros do SQLite
     para explicações amigáveis com linha e coluna.
   ===================================================================== */
(function (global) {
  'use strict';

  let SQL = null;                 // módulo sql.js depois de inicializado
  const expectedCache = new Map(); // id do exercício -> resultado esperado

  /* ----------------------------- Inicialização ----------------------------- */

  /** Inicializa o sql.js (precisa que window.initSqlJs já esteja carregado). */
  async function init() {
    if (SQL) return SQL;
    if (typeof global.initSqlJs !== 'function') throw new Error('Biblioteca sql.js não carregada');
    SQL = await global.initSqlJs();
    return SQL;
  }

  /** Cria um banco novo já populado com o seed da NexusMarket. */
  function freshDb() {
    const db = new SQL.Database();
    db.exec(global.SEED.schema + ';\n' + global.SEED.data);
    return db;
  }

  /* --------------------------- Utilidades de texto --------------------------- */

  /** Remove comentários e conteúdo de strings (mantém o tamanho p/ não deslocar posições). */
  function maskSql(sql) {
    let out = '', i = 0;
    while (i < sql.length) {
      const ch = sql[i], nx = sql[i + 1];
      if (ch === '-' && nx === '-') {               // comentário de linha
        while (i < sql.length && sql[i] !== '\n') { out += ' '; i++; }
      } else if (ch === '/' && nx === '*') {        // comentário de bloco
        while (i < sql.length && !(sql[i] === '*' && sql[i + 1] === '/')) { out += sql[i] === '\n' ? '\n' : ' '; i++; }
        out += '  '; i += 2;
      } else if (ch === "'" || ch === '"') {        // string / identificador entre aspas
        const q = ch; out += q; i++;
        while (i < sql.length && sql[i] !== q) { out += sql[i] === '\n' ? '\n' : ' '; i++; }
        if (i < sql.length) { out += q; i++; }
      } else { out += ch; i++; }
    }
    return out;
  }

  /** Divide um script em instruções respeitando strings e blocos BEGIN/CASE ... END. */
  function splitStatements(sql) {
    const masked = maskSql(sql);
    const parts = [];
    let depth = 0, start = 0;
    const re = /\b(BEGIN|CASE|END)\b|;/gi;
    let m;
    while ((m = re.exec(masked))) {
      const w = m[0].toUpperCase();
      if (w === 'BEGIN' || w === 'CASE') depth++;
      else if (w === 'END') depth = Math.max(0, depth - 1);
      else if (w === ';' && depth === 0) {
        parts.push({ sql: sql.slice(start, m.index + 1), start: start });
        start = m.index + 1;
      }
    }
    if (sql.slice(start).trim()) parts.push({ sql: sql.slice(start), start: start });
    return parts.filter(function (p) { return maskSql(p.sql).replace(/;/g, '').trim(); });
  }

  /** Divide argumentos "1, 'a,b', 3" respeitando aspas. */
  function splitArgs(s) {
    const out = []; let cur = '', q = false;
    for (const ch of s) {
      if (ch === "'") q = !q;
      if (ch === ',' && !q) { out.push(cur.trim()); cur = ''; } else cur += ch;
    }
    if (cur.trim()) out.push(cur.trim());
    return out;
  }

  /* ------------------------ Emulação de procedures ------------------------ */

  /**
   * Extrai CREATE PROCEDURE e expande EXEC/CALL.
   * `procs` guarda as procedures entre o código do aluno e a verificação.
   */
  function preprocess(sql, procs) {
    sql = sql.replace(/CREATE\s+(?:OR\s+REPLACE\s+)?PROC(?:EDURE)?\s+(\w+)\s*(\(([^)]*)\))?\s*AS\s+BEGIN([\s\S]*?)\bEND\s*;?/gi,
      function (_, name, _p, params, body) {
        procs[name.toLowerCase()] = {
          params: splitArgs(params || '').map(function (p) { return p.split(/\s+/)[0]; }),
          body: body,
        };
        return '';
      });
    return sql.replace(/\b(?:EXEC|EXECUTE|CALL)\s+(\w+)\s*([^;]*);?/gi, function (_, name, args) {
      const proc = procs[name.toLowerCase()];
      if (!proc) throw friendlyError({ message: 'procedure não encontrada: ' + name }, sql);
      const values = splitArgs(args.trim().replace(/^\(|\)$/g, ''));
      let body = proc.body;
      // substitui do nome mais longo para o mais curto (@inicio antes de @i)
      proc.params.map(function (p, i) { return [p, values[i]]; })
        .sort(function (a, b) { return b[0].length - a[0].length; })
        .forEach(function (pv) { body = body.split(pv[0]).join(pv[1] === undefined ? 'NULL' : pv[1]); });
      return body.trim().replace(/;?\s*$/, ';');
    });
  }

  /* ----------------------------- Execução ----------------------------- */

  /**
   * Executa um script e devolve o último conjunto de resultados.
   * Lança erro com `stmtStart` para localizar a linha.
   */
  function runScript(db, sql, procs) {
    const prepared = preprocess(sql, procs);
    const parts = splitStatements(prepared);
    let last = null;
    for (const p of parts) {
      try {
        const res = db.exec(p.sql);
        if (res.length) last = res[res.length - 1];
      } catch (e) {
        e.stmtStart = prepared === sql ? p.start : null;
        e.stmtSql = p.sql;
        throw e;
      }
    }
    return last; // {columns, values} ou null
  }

  /** Executa as verificações de um exercício DDL/DML. */
  function runChecks(db, checks, procs) {
    if (!Array.isArray(checks)) return runScript(db, checks, procs);
    const values = checks.map(function (c, i) {
      try {
        const r = runScript(db, c, procs);
        return [i + 1, r && r.values.length ? JSON.stringify(r.values[r.values.length - 1]) : 'ok'];
      } catch (e) { return [i + 1, 'ERRO']; }
    });
    return { columns: ['passo', 'resultado'], values: values };
  }

  /** Resultado esperado de um exercício (gabarito), com cache. */
  function expectedFor(ex) {
    if (expectedCache.has(ex.id)) return expectedCache.get(ex.id);
    const db = freshDb(); const procs = {};
    let res = runScript(db, ex.q, procs);
    if (ex.c) res = runChecks(db, ex.c, procs);
    db.close();
    expectedCache.set(ex.id, res);
    return res;
  }

  /** Execução livre (botão "Executar"): roda e mostra, sem corrigir. */
  function run(sql, ex) {
    const db = freshDb(); const procs = {};
    try {
      const t0 = performance.now();
      let res = runScript(db, sql, procs);
      if (!res && ex && ex.c) res = runChecks(db, ex.c, procs);
      return { ok: true, result: res, ms: performance.now() - t0 };
    } catch (e) {
      return Object.assign({ ok: false }, friendlyError(e, sql));
    } finally { db.close(); }
  }

  /* --------------------------- Comparação --------------------------- */

  /** Normaliza valores: números arredondados a 2 casas, nulos padronizados. */
  function norm(v) {
    if (v === null || v === undefined) return '∅';
    if (typeof v === 'number') return String(Math.round(v * 100) / 100);
    if (typeof v === 'string' && v !== '' && !isNaN(v) && /^-?\d+(\.\d+)?$/.test(v.trim())) return String(Math.round(Number(v) * 100) / 100);
    return String(v);
  }
  /** Igualdade tolerante: listas (GROUP_CONCAT) comparadas sem depender da ordem. */
  function cellEq(a, b) {
    const x = norm(a), y = norm(b);
    if (x === y) return true;
    if (typeof a === 'string' && typeof b === 'string' && a.indexOf(',') >= 0) {
      const s = function (t) { return t.split(',').map(function (z) { return z.trim(); }).sort().join('|'); };
      return s(a) === s(b);
    }
    return false;
  }
  function rowKey(r) { return r.map(norm).join('\u0001'); }

  /** Detecta ORDER BY no nível externo da consulta (ignora OVER(...) e subconsultas). */
  function hasOuterOrderBy(sql) {
    let s = maskSql(sql);
    let prev;
    do { prev = s; s = s.replace(/\([^()]*\)/g, ' '); } while (s !== prev);
    const stmts = s.split(';').filter(function (x) { return x.trim(); });
    return /\bORDER\s+BY\b/i.test(stmts[stmts.length - 1] || '');
  }

  /** Compara o resultado do aluno com o esperado. */
  function compare(actual, expected, ordered) {
    if (!actual) return { ok: false, reason: 'empty' };
    const ac = actual.columns.length, ec = expected.columns.length;
    if (ac !== ec) return { ok: false, reason: 'cols', ac: ac, ec: ec };
    const ar = actual.values.length, er = expected.values.length;
    if (ar !== er) return { ok: false, reason: 'rows', ar: ar, er: er };
    const rowsEq = function (A, B) {
      for (let i = 0; i < A.length; i++) for (let j = 0; j < A[i].length; j++) if (!cellEq(A[i][j], B[i][j])) return { i: i, j: j };
      return null;
    };
    if (ordered) {
      const diff = rowsEq(actual.values, expected.values);
      if (!diff) return { ok: true };
      // mesmos dados em outra ordem?
      const sa = actual.values.map(rowKey).sort(), se = expected.values.map(rowKey).sort();
      if (sa.join('\n') === se.join('\n')) return { ok: false, reason: 'order' };
      return { ok: false, reason: 'values', at: diff, actual: actual, expected: expected };
    }
    // sem ORDER BY no gabarito: compara como multiconjunto
    const sortRows = function (R) { return R.slice().sort(function (a, b) { return rowKey(a) < rowKey(b) ? -1 : rowKey(a) > rowKey(b) ? 1 : 0; }); };
    const A = sortRows(actual.values), E = sortRows(expected.values);
    const diff = rowsEq(A, E);
    if (!diff) return { ok: true };
    // tenta casar linha a linha com tolerância (GROUP_CONCAT em outra ordem)
    const pool = E.slice();
    const allMatch = A.every(function (r) {
      const k = pool.findIndex(function (e) { return e.every(function (v, j) { return cellEq(r[j], v); }); });
      if (k < 0) return false; pool.splice(k, 1); return true;
    });
    if (allMatch) return { ok: true };
    return { ok: false, reason: 'values', at: diff, actual: { columns: actual.columns, values: A }, expected: { columns: expected.columns, values: E } };
  }

  /* ---------------------- Comandos obrigatórios ---------------------- */

  function keywordRegex(k) {
    if (k === 'SUBQUERY') return /\(\s*SELECT\b/i;
    const body = k.trim().split(/\s+/).map(function (w) { return w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }).join('\\s+');
    return new RegExp('(^|[^A-Za-z0-9_])' + body + '(?![A-Za-z0-9_])', 'i');
  }
  const KW_LABEL = { SUBQUERY: 'uma subconsulta ( SELECT ... )' };

  /* ------------------------- Erros amigáveis ------------------------- */

  /** Converte índice absoluto em linha/coluna (1-based). */
  function posToLineCol(sql, idx) {
    const before = sql.slice(0, Math.max(0, idx));
    const lines = before.split('\n');
    return { line: lines.length, col: lines[lines.length - 1].length + 1 };
  }
  /** Procura um token no código (fora de strings/comentários), começando no trecho da instrução. */
  function locateToken(sql, token, from) {
    if (!token) return null;
    const masked = maskSql(sql);
    const esc = token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(/^\w/.test(token) ? '\\b' + esc + '\\b' : esc, 'gi');
    re.lastIndex = from || 0;
    let m = re.exec(masked);
    if (!m && from) { re.lastIndex = 0; m = re.exec(masked); }
    if (!m) { const raw = sql.toLowerCase().indexOf(token.toLowerCase()); return raw >= 0 ? raw : null; }
    return m.index;
  }

  /** Lista de colunas e tabelas do seed (para sugerir nomes parecidos). */
  let schemaInfo = null;
  function getSchema() {
    if (schemaInfo) return schemaInfo;
    const db = freshDb();
    const tables = db.exec("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'")[0].values.map(function (r) { return r[0]; });
    const cols = {};
    tables.forEach(function (t) { cols[t] = db.exec('PRAGMA table_info(' + t + ')')[0].values.map(function (r) { return r[1]; }); });
    db.close();
    schemaInfo = { tables: tables, cols: cols };
    return schemaInfo;
  }
  function lev(a, b) {
    a = a.toLowerCase(); b = b.toLowerCase();
    const d = Array.from({ length: a.length + 1 }, function (_, i) { return [i]; });
    for (let j = 1; j <= b.length; j++) d[0][j] = j;
    for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++)
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    return d[a.length][b.length];
  }
  function closest(word, list) {
    let best = null, bd = 99;
    list.forEach(function (w) { const x = lev(word, w); if (x < bd) { bd = x; best = w; } });
    return bd <= Math.max(2, Math.floor(word.length / 3)) ? best : null;
  }

  /** Traduz o erro do SQLite para uma explicação em português. */
  function friendlyError(err, sql) {
    const msg = String(err && err.message || err);
    const from = err && err.stmtStart != null ? err.stmtStart : 0;
    let token = null, explain = '', title = 'Erro ao executar a consulta';
    let m;
    const masked = maskSql(sql).toUpperCase();
    if ((m = msg.match(/near "([^"]+)": syntax error/i))) {
      token = m[1]; title = 'Erro de sintaxe';
      const T = token.toUpperCase();
      if (/,\s*FROM\b/.test(masked) && T === 'FROM') explain = 'Parece haver uma vírgula sobrando antes do FROM. A última coluna do SELECT não leva vírgula.';
      else if (T === 'WHERE' && /\bGROUP\s+BY\b[\s\S]*\bWHERE\b/.test(masked)) explain = 'O WHERE deve vir antes do GROUP BY. Para filtrar grupos, use HAVING.';
      else if (T === 'WHERE' && /\bORDER\s+BY\b[\s\S]*\bWHERE\b/.test(masked)) explain = 'O WHERE deve vir antes do ORDER BY. A ordem correta é SELECT → FROM → WHERE → GROUP BY → HAVING → ORDER BY → LIMIT.';
      else if (T === 'GROUP' && /\bORDER\s+BY\b[\s\S]*\bGROUP\s+BY\b/.test(masked)) explain = 'O GROUP BY deve vir antes do ORDER BY.';
      else if (T === 'FROM' && /\bSELECT\s+FROM\b/.test(masked)) explain = 'Faltou informar as colunas entre SELECT e FROM (use * para todas).';
      else if (/^(SELEC|SELET|SLECT|FORM|WERE|WHER|ODER|GROPU|GRUOP)$/.test(T)) explain = 'A palavra "' + token + '" parece um comando digitado errado. Confira a grafia (SELECT, FROM, WHERE, ORDER BY, GROUP BY).';
      else explain = 'O SQLite não entendeu o trecho próximo de "' + token + '". Verifique vírgulas, parênteses, aspas e a ordem das cláusulas (SELECT → FROM → WHERE → GROUP BY → HAVING → ORDER BY → LIMIT).';
    } else if ((m = msg.match(/no such column: ([\w.]+)/i))) {
      token = m[1].split('.').pop(); title = 'Coluna inexistente';
      const allCols = [].concat.apply([], Object.values(getSchema().cols));
      const sug = closest(token, Array.from(new Set(allCols)));
      explain = 'Verifique o nome da coluna informada: "' + m[1] + '" não existe nas tabelas usadas.' + (sug ? ' Você quis dizer "' + sug + '"?' : ' Confira a estrutura das tabelas ao lado.') +
        (/^'/.test(m[1]) ? '' : (m[1].indexOf('.') > 0 ? ' Confira também se o apelido da tabela está correto.' : ''));
      if (/"/.test(sql)) explain += ' Lembre-se: textos usam aspas simples (\'MG\'); aspas duplas indicam nomes de colunas.';
    } else if ((m = msg.match(/no such table: ([\w.]+)/i))) {
      token = m[1]; title = 'Tabela inexistente';
      const sug = closest(token, getSchema().tables.concat(['vw_pedidos_clientes']));
      explain = 'A tabela "' + token + '" não existe neste banco.' + (sug ? ' Você quis dizer "' + sug + '"?' : '');
    } else if ((m = msg.match(/ambiguous column name: ([\w.]+)/i))) {
      token = m[1]; title = 'Coluna ambígua';
      explain = 'A coluna "' + token + '" existe em mais de uma tabela do JOIN. Prefixe com o apelido da tabela, por exemplo p.' + token + '.';
    } else if (/incomplete input/i.test(msg)) {
      title = 'Consulta incompleta';
      explain = 'A consulta terminou antes do esperado. Faltou fechar parênteses, aspas, um END ou completar uma cláusula?';
      const lc = posToLineCol(sql, sql.replace(/\s+$/, '').length);
      return { title: title, message: msg, explain: explain, line: lc.line, col: lc.col };
    } else if (/unrecognized token: "?([^"]*)"?/i.test(msg)) {
      m = msg.match(/unrecognized token: "?(.*?)"?$/i); token = m && m[1] ? m[1].slice(0, 12) : null; title = 'Caractere não reconhecido';
      explain = 'Há um caractere inválido ou aspas que não foram fechadas.';
    } else if (/misuse of aggregate/i.test(msg)) {
      m = msg.match(/aggregate(?: function)?:? (\w+)/i); token = m ? m[1] : null; title = 'Agregação no lugar errado';
      explain = 'Funções como SUM, COUNT e AVG não podem ser usadas no WHERE. Para filtrar resultados agregados, use HAVING depois do GROUP BY.';
    } else if (/GROUP BY clause is required before HAVING|HAVING clause on a non-aggregate query/i.test(msg)) {
      token = 'HAVING'; title = 'HAVING sem GROUP BY';
      explain = 'HAVING filtra grupos, então precisa de um GROUP BY antes dele.';
    } else if ((m = msg.match(/no such function: (\w+)/i))) {
      token = m[1]; title = 'Função inexistente';
      const map = { NOW: "datetime('now')", GETDATE: "datetime('now')", ISNULL: 'IFNULL ou COALESCE', LEN: 'LENGTH', DATEDIFF: 'julianday(fim) - julianday(inicio)', YEAR: "strftime('%Y', coluna)", MONTH: "strftime('%m', coluna)", CONCAT: 'o operador ||', TOP: 'LIMIT' };
      explain = 'A função ' + token + ' não existe no SQLite.' + (map[token.toUpperCase()] ? ' Use ' + map[token.toUpperCase()] + '.' : '');
    } else if ((m = msg.match(/(table|view|index|trigger) (\w+) already exists/i))) {
      token = m[2]; title = 'Objeto já existe';
      explain = 'Você criou "' + token + '" mais de uma vez no mesmo código. Cada execução começa do zero, então basta criar uma vez.';
    } else if ((m = msg.match(/procedure não encontrada: (\w+)/i))) {
      token = m[1]; title = 'Procedure não encontrada';
      explain = 'Crie a procedure com CREATE PROCEDURE ' + token + ' AS BEGIN ... END; antes de chamar EXEC ' + token + '.';
    } else if (/SELECTs to the left and right of (UNION|INTERSECT|EXCEPT)/i.test(msg)) {
      token = msg.match(/(UNION ALL|UNION|INTERSECT|EXCEPT)/i)[1]; title = 'Colunas diferentes na união';
      explain = 'Os dois SELECTs de uma operação de conjunto precisam ter o mesmo número de colunas.';
    } else if (/wrong number of arguments/i.test(msg)) {
      m = msg.match(/function (\w+)/i); token = m ? m[1] : null; title = 'Argumentos incorretos';
      explain = 'A função foi chamada com a quantidade errada de argumentos.';
    } else if (/NOT NULL constraint failed|UNIQUE constraint failed|FOREIGN KEY constraint failed/i.test(msg)) {
      title = 'Restrição violada'; explain = 'A operação viola uma restrição da tabela (chave única, NOT NULL ou chave estrangeira).';
    } else if (/ON CONFLICT clause does not match/i.test(msg)) {
      token = 'ON CONFLICT'; title = 'Conflito sem chave correspondente';
      explain = 'As colunas do ON CONFLICT precisam corresponder a uma chave primária ou índice único (em metas: vendedor_id, mes).';
    } else {
      explain = 'O banco retornou um erro. Leia a mensagem técnica abaixo e revise o trecho indicado.';
    }
    let line = 1, col = 1;
    const idx = locateToken(sql, token, from);
    if (idx != null) { const lc = posToLineCol(sql, idx); line = lc.line; col = lc.col; }
    else if (from) { const lc = posToLineCol(sql, from + (sql.slice(from).match(/^\s*/)[0].length)); line = lc.line; col = lc.col; }
    return { title: title, message: msg, explain: explain, line: line, col: col, token: token };
  }

  /* ----------------------------- Correção ----------------------------- */

  /**
   * Avalia a resposta do aluno para um exercício.
   * @returns {{status:'correct'|'wrong'|'error', title, explain, ...}}
   */
  function evaluate(ex, userSql) {
    const code = (userSql || '').trim();
    if (!maskSql(code).replace(/;/g, '').trim()) {
      return { status: 'error', title: 'Editor vazio', explain: 'Escreva sua consulta no editor antes de enviar.', line: 1, col: 1 };
    }
    const masked = maskSql(code);

    // 1) Comandos proibidos (exercícios de otimização)
    for (const k of ex.nk || []) {
      if (keywordRegex(k).test(masked)) {
        const idx = locateToken(code, k, 0); const lc = posToLineCol(code, idx || 0);
        return { status: 'wrong', title: 'Comando não permitido nesta questão', explain: 'Este exercício pede para evitar ' + k + '. Reescreva o filtro sem aplicar funções na coluna.', line: lc.line, col: lc.col };
      }
    }

    // 2) Executa o gabarito e o código do aluno em bancos independentes
    let expected;
    try { expected = expectedFor(ex); } catch (e) { return { status: 'error', title: 'Falha interna', explain: 'Não foi possível gerar o gabarito: ' + e.message, line: 1, col: 1 }; }

    const db = freshDb(); const procs = {};
    let actual = null;
    const t0 = performance.now();
    try {
      actual = runScript(db, code, procs);
      if (ex.c) actual = runChecks(db, ex.c, procs);
    } catch (e) {
      db.close();
      return Object.assign({ status: 'error' }, friendlyError(e, code));
    }
    db.close();
    const ms = performance.now() - t0;

    // 3) Comandos obrigatórios
    const missing = (ex.k || []).filter(function (k) { return !keywordRegex(k).test(masked); });

    // 4) Comparação de resultados
    const ordered = !ex.c && hasOuterOrderBy(ex.q);
    const cmp = compare(actual, expected, ordered);

    if (cmp.ok && !missing.length) return { status: 'correct', result: actual, expected: expected, ms: ms };

    let explain = '', title = 'Consulta incorreta';
    if (missing.length) {
      const k = missing[0];
      title = cmp.ok ? 'Resultado certo, comando errado' : 'Consulta incorreta';
      explain = (cmp.ok ? 'O resultado bate, mas este exercício treina ' : 'Possivelmente está faltando ') +
        (KW_LABEL[k] || ('a cláusula ' + k)) + '.' + (cmp.ok ? ' Reescreva usando esse comando.' : '');
    } else if (cmp.reason === 'empty') {
      explain = ex.c ? 'Seu código executou, mas a verificação não encontrou o que foi pedido. Confira o nome do objeto criado.' : 'Seu código não retornou nenhuma tabela. Termine com um SELECT que mostre o resultado.';
    } else if (cmp.reason === 'cols') {
      explain = 'Sua consulta retornou ' + cmp.ac + ' coluna(s), mas o esperado são ' + cmp.ec + '. Confira quais colunas o objetivo pede.';
    } else if (cmp.reason === 'rows') {
      explain = 'Sua consulta retornou ' + cmp.ar + ' linha(s), mas o esperado são ' + cmp.er + '. ';
      if (cmp.ar > cmp.er) {
        if (/\bWHERE\b/i.test(maskSql(ex.q)) && !/\bWHERE\b/i.test(masked)) explain += 'Possivelmente está faltando a cláusula WHERE.';
        else if (/\bLIMIT\b/i.test(ex.q) && !/\bLIMIT\b/i.test(masked)) explain += 'Possivelmente está faltando o LIMIT.';
        else if (/\bDISTINCT\b/i.test(ex.q) && !/\bDISTINCT\b/i.test(masked)) explain += 'Há valores repetidos: talvez falte DISTINCT.';
        else if (/\bHAVING\b/i.test(ex.q) && !/\bHAVING\b/i.test(masked)) explain += 'Possivelmente está faltando filtrar os grupos com HAVING.';
        else explain += 'Seu filtro está trazendo registros a mais. Revise as condições.';
      } else explain += 'Seu filtro está restritivo demais ou o JOIN está descartando linhas (talvez seja um LEFT JOIN?).';
    } else if (cmp.reason === 'order') {
      explain = 'Os dados estão corretos, mas a ordenação não confere. Revise o ORDER BY (ASC/DESC e colunas).';
    } else if (cmp.reason === 'values') {
      const a = cmp.actual.values[cmp.at.i][cmp.at.j], e = cmp.expected.values[cmp.at.i][cmp.at.j];
      explain = 'Os valores não conferem na coluna ' + (cmp.at.j + 1) + ' ("' + actual.columns[cmp.at.j] + '"). Exemplo: esperado ' + fmtVal(e) + ', obtido ' + fmtVal(a) + '. ';
      explain += typeof e === 'number' ? 'Revise o cálculo, o filtro aplicado antes da agregação ou o arredondamento.' : 'Confira a ordem das colunas e os filtros.';
    }
    return { status: 'wrong', title: title, explain: explain, result: actual, expected: expected, ms: ms, line: null, col: null };
  }
  function fmtVal(v) { return v === null ? 'NULL' : typeof v === 'string' ? '"' + v + '"' : String(Math.round(v * 100) / 100); }

  /** Tabelas do seed citadas em um exercício (para mostrar estrutura e dados). */
  function tablesOf(ex) {
    const text = maskSql(ex.q + ' ' + (Array.isArray(ex.c) ? ex.c.join(' ') : ex.c || '')) + ' ' + ex.g + ' ' + ex.s;
    return getSchema().tables.filter(function (t) { return new RegExp('\\b' + t + '\\b', 'i').test(text); });
  }

  /** Amostra dos dados de uma tabela do seed. */
  function tableData(name) {
    const db = freshDb();
    try { return db.exec('SELECT * FROM ' + name)[0] || { columns: getSchema().cols[name], values: [] }; }
    finally { db.close(); }
  }

  const api = { init: init, run: run, evaluate: evaluate, expectedFor: expectedFor, tablesOf: tablesOf, tableData: tableData, getSchema: getSchema,
    _internal: { splitStatements: splitStatements, preprocess: preprocess, compare: compare, hasOuterOrderBy: hasOuterOrderBy, maskSql: maskSql, friendlyError: friendlyError } };
  global.SQLEngine = api;
})(typeof window !== 'undefined' ? window : globalThis);
