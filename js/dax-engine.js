/* =====================================================================
   dax-engine.js — Motor DAX da trilha de Power BI
   ---------------------------------------------------------------------
   Calcula medidas, colunas calculadas e tabelas sobre o modelo
   DaxData (esquema estrela), com as regras do Power BI:
   • Contexto de filtro: filtros por coluna (ou por linha) em cada
     tabela, propagados da dimensão (lado 1) para o fato (lado N)
     pelos relacionamentos ativos.
   • Contexto de linha: iteradores (SUMX, FILTER, ADDCOLUMNS…) e
     colunas calculadas. Medidas e CALCULATE fazem transição de
     contexto (a linha atual vira filtro).
   • CALCULATE: filtros booleanos, tabelas (FILTER, VALUES, datas),
     modificadores ALL / ALLEXCEPT / REMOVEFILTERS / ALLSELECTED /
     KEEPFILTERS / USERELATIONSHIP. dCalendario é tabela de datas
     marcada (filtrar dCalendario[Data] remove os demais filtros dela).
   • BLANK como no DAX: SUM sem linhas = BLANK; BLANK + 1 = 1.
   • Separadores: vírgula (padrão do Power BI) ou ponto e vírgula
     (com vírgula decimal), detectados automaticamente.
   • Erros em português, com a posição no código.
   ===================================================================== */
(function (global) {
  'use strict';
  const M = function () { return global.DaxData; };
  function DaxError(msg, pos) { this.msg = msg; this.pos = pos == null ? null : pos; }
  DaxError.prototype.toString = function () { return this.msg; };
  function fail(msg, node) { throw new DaxError(msg, node && node.pos != null ? node.pos : null); }
  const lk = function (s) { return String(s).trim().toLowerCase(); };

  /* ------------------------------- Modelo ------------------------------- */
  let MODEL = null;
  function model() {
    if (MODEL) return MODEL;
    const T = {};
    Object.keys(M().TABLES).forEach(function (name) {
      const t = M().TABLES[name];
      const colIdx = {}; t.cols.forEach(function (c, i) { colIdx[lk(c)] = i; });
      T[lk(name)] = { name: name, lk: lk(name), cols: t.cols, colIdx: colIdx, rows: t.rows, types: t.types || {}, sortBy: t.sortBy || {}, dateCol: t.dateTable ? lk(t.dateTable) : null, all: t.rows.map(function (_, i) { return i; }) };
    });
    const R = M().RELATIONSHIPS.map(function (r, i) { return { id: i, from: lk(r.from), fromCol: lk(r.fromCol), to: lk(r.to), toCol: lk(r.toCol), active: r.active }; });
    const measures = {};
    M().MEASURES.forEach(function (m) { measures[lk(m.name)] = { name: m.name, src: m.expr, fmt: m.fmt }; });
    MODEL = { T: T, R: R, measures: measures };
    return MODEL;
  }
  function table(name, node) { const t = model().T[lk(name)]; if (!t) fail('A tabela ' + name + ' não existe no modelo. Tabelas: ' + Object.keys(M().TABLES).join(', ') + '.', node); return t; }
  function colIndex(t, col, node) {
    const i = t.colIdx[lk(col)];
    if (i == null) fail('A coluna ' + t.name + '[' + col + '] não existe. Colunas de ' + t.name + ': ' + t.cols.join(', ') + '.', node);
    return i;
  }

  /* ------------------------------ Tokenizador ------------------------------ */
  function semicolonMode(src) {
    let inS = false, inQ = false;
    for (let i = 0; i < src.length; i++) {
      const ch = src[i];
      if (ch === '"' && !inQ) inS = !inS; else if (ch === "'" && !inS) inQ = !inQ;
      else if (!inS && !inQ && ch === ';') return true;
    }
    return false;
  }
  function tokenize(src) {
    const semi = semicolonMode(src);
    const out = []; let i = 0;
    const numRe = semi ? /^(?:\d+(?:,\d+)?|,\d+)/ : /^(?:\d+(?:\.\d+)?|\.\d+)/;
    while (i < src.length) {
      const r = src.slice(i), ch = src[i];
      let m;
      if (/\s/.test(ch)) { i++; continue; }
      if (r.startsWith('//') || r.startsWith('--')) { const e = src.indexOf('\n', i); i = e < 0 ? src.length : e; continue; }
      if (r.startsWith('/*')) { const e = src.indexOf('*/', i + 2); if (e < 0) fail('Comentário /* sem fechamento */.', { pos: i }); i = e + 2; continue; }
      if (ch === '"') {
        let j = i + 1, s = '';
        for (;;) { if (j >= src.length) fail('Texto sem aspas de fechamento.', { pos: i }); if (src[j] === '"') { if (src[j + 1] === '"') { s += '"'; j += 2; continue; } break; } s += src[j++]; }
        out.push({ t: 'str', v: s, pos: i }); i = j + 1; continue;
      }
      if (ch === "'") { const e = src.indexOf("'", i + 1); if (e < 0) fail("Nome de tabela sem aspas de fechamento (').", { pos: i }); out.push({ t: 'tbl', v: src.slice(i + 1, e), pos: i }); i = e + 1; continue; }
      if (ch === '[') { const e = src.indexOf(']', i + 1); if (e < 0) fail('Colchete [ sem fechamento ].', { pos: i }); out.push({ t: 'br', v: src.slice(i + 1, e), pos: i }); i = e + 1; continue; }
      if ((m = r.match(numRe))) { out.push({ t: 'num', v: parseFloat(m[0].replace(',', '.')), pos: i }); i += m[0].length; continue; }
      if ((m = r.match(/^[A-Za-zÀ-ÿ_][\wÀ-ÿ.]*/))) { out.push({ t: 'id', v: m[0], pos: i }); i += m[0].length; continue; }
      if ((m = r.match(/^(?:&&|\|\||<>|<=|>=|==|:=)/))) { out.push({ t: 'op', v: m[0], pos: i }); i += 2; continue; }
      if ('+-*/^&=<>'.indexOf(ch) >= 0) { out.push({ t: 'op', v: ch, pos: i }); i++; continue; }
      if (ch === '(' || ch === ')' || ch === '{' || ch === '}') { out.push({ t: ch, v: ch, pos: i }); i++; continue; }
      if (ch === (semi ? ';' : ',')) { out.push({ t: 'sep', v: ch, pos: i }); i++; continue; }
      if (ch === ',' || ch === ';') fail(semi ? 'Com ponto e vírgula como separador, a vírgula é decimal. Revise este trecho.' : 'Separador inesperado "' + ch + '".', { pos: i });
      fail('Caractere inesperado "' + ch + '".', { pos: i });
    }
    out.push({ t: 'eof', v: '', pos: src.length });
    return out;
  }

  /* -------------------------------- Parser -------------------------------- */
  function parse(src) {
    const toks = tokenize(src); let p = 0;
    const peek = function (o) { return toks[p + (o || 0)]; };
    const next = function () { return toks[p++]; };
    const isOp = function (v) { const t = peek(); return t.t === 'op' && t.v === v; };
    const isId = function (v) { const t = peek(); return t.t === 'id' && t.v.toUpperCase() === v; };
    function expect(type, msg) { const t = peek(); if (t.t !== type) fail(msg || ('Era esperado "' + type + '" aqui.'), t); return next(); }
    function expr() { return orE(); }
    function orE() { let l = andE(); while (isOp('||')) { const t = next(); l = { k: 'bin', op: '||', l: l, r: andE(), pos: t.pos }; } return l; }
    function andE() { let l = notE(); while (isOp('&&')) { const t = next(); l = { k: 'bin', op: '&&', l: l, r: notE(), pos: t.pos }; } return l; }
    function notE() { if (isId('NOT') && peek(1).t !== '(') { const t = next(); return { k: 'un', op: 'NOT', e: notE(), pos: t.pos }; } return cmpE(); }
    function cmpE() {
      let l = catE();
      for (;;) {
        const t = peek();
        if (t.t === 'op' && ['=', '==', '<>', '<', '>', '<=', '>='].indexOf(t.v) >= 0) { next(); l = { k: 'bin', op: t.v === '==' ? '=' : t.v, l: l, r: catE(), pos: t.pos }; continue; }
        if (t.t === 'id' && t.v.toUpperCase() === 'IN') { next(); l = { k: 'in', l: l, r: catE(), pos: t.pos }; continue; }
        if (t.t === 'id' && t.v.toUpperCase() === 'NOT' && peek(1).t === 'id' && peek(1).v.toUpperCase() === 'IN') { next(); next(); l = { k: 'un', op: 'NOT', e: { k: 'in', l: l, r: catE(), pos: t.pos }, pos: t.pos }; continue; }
        return l;
      }
    }
    function catE() { let l = addE(); while (isOp('&')) { const t = next(); l = { k: 'bin', op: '&', l: l, r: addE(), pos: t.pos }; } return l; }
    function addE() { let l = mulE(); while (isOp('+') || isOp('-')) { const t = next(); l = { k: 'bin', op: t.v, l: l, r: mulE(), pos: t.pos }; } return l; }
    function mulE() { let l = powE(); while (isOp('*') || isOp('/')) { const t = next(); l = { k: 'bin', op: t.v, l: l, r: powE(), pos: t.pos }; } return l; }
    function powE() { let l = unE(); while (isOp('^')) { const t = next(); l = { k: 'bin', op: '^', l: l, r: unE(), pos: t.pos }; } return l; }
    function unE() { if (isOp('-') || isOp('+')) { const t = next(); return { k: 'un', op: t.v, e: unE(), pos: t.pos }; } return prim(); }
    function args() {
      const list = [];
      if (peek().t === ')') { next(); return list; }
      for (;;) {
        if (peek().t === 'sep' || peek().t === ')') { list.push({ k: 'skip', pos: peek().pos }); }
        else list.push(expr());
        const t = peek();
        if (t.t === 'sep') { next(); continue; }
        if (t.t === ')') { next(); return list; }
        fail(t.t === 'eof' ? 'Faltou fechar o parêntese ")".' : 'Era esperado um separador ou ")" aqui.', t);
      }
    }
    function prim() {
      const t = peek();
      if (t.t === 'num') { next(); return { k: 'num', v: t.v, pos: t.pos }; }
      if (t.t === 'str') { next(); return { k: 'str', v: t.v, pos: t.pos }; }
      if (t.t === '(') {
        next(); const first = expr();
        if (peek().t === 'sep') { const items = [first]; while (peek().t === 'sep') { next(); items.push(expr()); } expect(')', 'Faltou fechar o parêntese ")".'); return { k: 'tuple', items: items, pos: t.pos }; }
        expect(')', 'Faltou fechar o parêntese ")".'); return first;
      }
      if (t.t === '{') {
        next(); const items = [];
        if (peek().t !== '}') { for (;;) { items.push(expr()); if (peek().t === 'sep') { next(); continue; } break; } }
        expect('}', 'Faltou fechar a chave "}".');
        return { k: 'tablector', items: items, pos: t.pos };
      }
      if (t.t === 'br') { next(); return { k: 'bracket', name: t.v, pos: t.pos }; }
      if (t.t === 'tbl') { next(); if (peek().t === 'br') { const c = next(); return { k: 'col', table: t.v, col: c.v, pos: t.pos }; } return { k: 'tableref', name: t.v, pos: t.pos }; }
      if (t.t === 'id') {
        const up = t.v.toUpperCase();
        if (up === 'VAR') return varBlock();
        if (up === 'RETURN') fail('RETURN sem VAR antes.', t);
        next();
        if (peek().t === '(') { next(); return { k: 'call', name: up, args: args(), pos: t.pos, raw: t.v }; }
        if (peek().t === 'br') { const c = next(); return { k: 'col', table: t.v, col: c.v, pos: t.pos }; }
        if (up === 'TRUE' || up === 'FALSE') return { k: 'bool', v: up === 'TRUE', pos: t.pos };
        return { k: 'name', name: t.v, pos: t.pos };
      }
      if (t.t === 'eof') fail('A expressão terminou antes do esperado.', t);
      if (t.t === ')') fail('Parêntese ")" sem abertura correspondente.', t);
      fail('Trecho inesperado "' + t.v + '".', t);
    }
    function varBlock() {
      const vars = [];
      while (isId('VAR')) {
        next();
        const n = expect('id', 'Depois de VAR vem o nome da variável.');
        const eq = peek(); if (!(eq.t === 'op' && eq.v === '=')) fail('Depois do nome da variável vem "=".', eq);
        next();
        vars.push({ name: n.v, e: expr(), pos: n.pos });
      }
      if (!isId('RETURN')) fail('Faltou o RETURN depois das variáveis.', peek());
      next();
      return { k: 'var', vars: vars, ret: expr(), pos: vars.length ? vars[0].pos : 0 };
    }
    const ast = expr();
    if (peek().t !== 'eof') { const t = peek(); fail(t.t === ')' ? 'Parêntese ")" sem abertura correspondente.' : 'Trecho a mais no fim da expressão: "' + t.v + '". Faltou um operador ou separador?', t); }
    return ast;
  }

  /** Separa "Nome = expressão" (medida ou coluna) e devolve a AST. */
  function compile(src) {
    let text = String(src || ''), offset = 0, name = null;
    const m = text.match(/^\s*([^\s=\[\]"'(),;{}][^=\[\]"'(),;{}]*?)\s*(:=|=)(?!=)/);
    if (m && !/^VAR\b/i.test(m[1].trim())) { name = m[1].trim(); offset = m[0].length; text = text.slice(offset); }
    if (!text.trim()) fail(name ? 'Escreva a expressão depois de "' + name + ' =".' : 'Escreva uma expressão DAX.', { pos: offset });
    try { return { ast: parse(text), name: name, offset: offset }; }
    catch (e) { if (e instanceof DaxError && e.pos != null) e.pos += offset; throw e; }
  }

  /* ------------------------------- Valores ------------------------------- */
  const isTV = function (v) { return v && v.__tv; };
  function keyOf(v) { return v === null || v === undefined ? '∅' : (typeof v === 'number' ? 'n' + v : typeof v === 'boolean' ? 'b' + v : 's' + v); }
  function tupleKey(vals) { return vals.length === 1 ? keyOf(vals[0]) : vals.map(keyOf).join('\u0001'); }
  function physical(t, idx) {
    return { __tv: true, cols: t.cols.map(function (c) { return { t: t.lk, c: lk(c), name: c }; }), rows: idx.map(function (i) { return t.rows[i]; }), src: { t: t.lk, idx: idx } };
  }
  function virtual(cols, rows) { return { __tv: true, cols: cols, rows: rows, src: null }; }
  function scalar(v, node) {
    if (!isTV(v)) return v;
    if (v.rows.length === 0) return null;
    if (v.rows.length === 1 && v.cols.length === 1) return v.rows[0][0];
    fail(v.cols.length > 1 ? 'Uma tabela com várias colunas foi usada onde era esperado um único valor.' : 'Uma tabela com vários valores foi usada onde era esperado um único valor. Use uma agregação (SUM, MAX…), SELECTEDVALUE ou um iterador.', node);
  }
  const truthy = function (v) { return v === null ? false : typeof v === 'string' ? v !== '' : !!v; };
  const toNum = function (v, node) {
    if (v === null) return 0;
    if (typeof v === 'number') return v;
    if (typeof v === 'boolean') return v ? 1 : 0;
    const n = Number(String(v).replace(',', '.'));
    if (isNaN(n)) fail('Não é possível converter o texto "' + v + '" em número.', node);
    return n;
  };

  /* ---------------------------- Contexto de filtro ---------------------------- */
  // ctx = { filters: [{ t, cols:[...], keys:Set, origin }], userel: [relId] }
  function activeRels(ctx) {
    const R = model().R, ur = ctx.userel || [];
    return R.filter(function (r) {
      if (ur.indexOf(r.id) >= 0) return true;
      if (!r.active) return false;
      return !ur.some(function (id) { const o = R[id]; return o.from === r.from && o.to === r.to; });
    });
  }
  function filteredUp(tl, ctx, seen) {
    if (ctx.filters.some(function (f) { return f.t === tl; })) return true;
    seen = seen || {}; if (seen[tl]) return false; seen[tl] = true;
    return activeRels(ctx).some(function (r) { return r.from === tl && filteredUp(r.to, ctx, seen); });
  }
  function rowsOf(tl, ctx) {
    ctx._c = ctx._c || {};
    if (ctx._c[tl]) return ctx._c[tl];
    const t = model().T[tl];
    let idx = t.all;
    ctx.filters.forEach(function (f) {
      if (f.t !== tl) return;
      if (f.cols[0] === '#row') { idx = idx.filter(function (i) { return f.keys.has('r' + i); }); return; }
      const ci = f.cols.map(function (c) { return t.colIdx[c]; });
      idx = idx.filter(function (i) { const row = t.rows[i]; return f.keys.has(tupleKey(ci.map(function (k) { return row[k]; }))); });
    });
    activeRels(ctx).forEach(function (r) {
      if (r.from !== tl || !filteredUp(r.to, ctx)) return;
      const dt = model().T[r.to], dci = dt.colIdx[r.toCol], fci = t.colIdx[r.fromCol];
      const set = new Set(rowsOf(r.to, ctx).map(function (i) { return keyOf(dt.rows[i][dci]); }));
      idx = idx.filter(function (i) { return set.has(keyOf(t.rows[i][fci])); });
    });
    ctx._c[tl] = idx;
    return idx;
  }
  function mkCtx(filters, userel) { return { filters: filters, userel: userel || [] }; }
  function overrides(f, g) {
    if (f.t !== g.t) return false;
    if (f.cols[0] === '#row') return true;
    const t = model().T[f.t];
    if (t.dateCol && f.cols.indexOf(t.dateCol) >= 0) return true;   // tabela de datas marcada
    if (g.cols[0] === '#row') return false;
    return f.cols.some(function (c) { return g.cols.indexOf(c) >= 0; });
  }
  function addFilter(ctx, f, keep) {
    const fs = keep ? ctx.filters.slice() : ctx.filters.filter(function (g) { return !overrides(f, g); });
    fs.push(f);
    return mkCtx(fs, ctx.userel);
  }
  function expandTables(tl) {
    // a tabela e as dimensões que ela alcança (tabela expandida)
    const out = [tl], R = model().R;
    for (let i = 0; i < out.length; i++) R.forEach(function (r) { if (r.from === out[i] && out.indexOf(r.to) < 0) out.push(r.to); });
    return out;
  }
  function removeFilters(ctx, spec) {
    let fs = ctx.filters;
    if (spec.all) fs = spec.visualOnly ? fs.filter(function (g) { return g.origin !== 'visual'; }) : [];
    else {
      fs = fs.filter(function (g) {
        if (spec.visualOnly && g.origin !== 'visual') return true;
        if (spec.tables) {
          const hit = spec.tables.some(function (tl) { return expandTables(tl).indexOf(g.t) >= 0; });
          if (!hit) return true;
          if (spec.except && g.cols[0] !== '#row' && g.cols.every(function (c) { return spec.except.some(function (e) { return e.t === g.t && e.c === c; }); })) return true;
          return false;
        }
        if (spec.cols) return !spec.cols.some(function (c) { return c.t === g.t && (g.cols[0] === '#row' || g.cols.indexOf(c.c) >= 0); });
        return true;
      });
    }
    return mkCtx(fs, ctx.userel);
  }
  /** Filtros que representam as linhas de uma tabela (para CALCULATE e transição de contexto). */
  function tvFilters(tv, origin) {
    if (tv.src) return [{ t: tv.src.t, cols: ['#row'], keys: new Set(tv.src.idx.map(function (i) { return 'r' + i; })), origin: origin }];
    const byT = {};
    tv.cols.forEach(function (c, i) { if (c.t) (byT[c.t] = byT[c.t] || []).push(i); });
    return Object.keys(byT).map(function (t) {
      const ix = byT[t];
      return { t: t, cols: ix.map(function (i) { return tv.cols[i].c; }), keys: new Set(tv.rows.map(function (r) { return tupleKey(ix.map(function (i) { return r[i]; })); })), origin: origin };
    });
  }
  function transition(env) {
    let ctx = env.ctx;
    env.rows.forEach(function (rc) {
      const one = { __tv: true, cols: rc.tv.cols, rows: [rc.tv.rows[rc.i]], src: rc.tv.src ? { t: rc.tv.src.t, idx: [rc.tv.src.idx[rc.i]] } : null };
      tvFilters(one).forEach(function (f) { ctx = addFilter(ctx, f); });
    });
    return ctx;
  }

  /* ------------------------------- Avaliação ------------------------------- */
  function withRow(env, tv, i) { return { ctx: env.ctx, rows: env.rows.concat([{ tv: tv, i: i }]), vars: env.vars, ms: env.ms, depth: env.depth }; }
  function colOfRow(rc, tl, cl) {
    const tv = rc.tv;
    if (tv.src && tv.src.t === tl) { const t = model().T[tl]; const ci = t.colIdx[cl]; if (ci == null) return undefined; return { v: tv.rows[rc.i][ci] }; }
    for (let k = 0; k < tv.cols.length; k++) if (tv.cols[k].c === cl && (tv.cols[k].t === tl || (!tv.cols[k].t && !tl))) return { v: tv.rows[rc.i][k] };
    return undefined;
  }
  function rowValue(env, node, skip) {
    const t = table(node.table, node); colIndex(t, node.col, node);
    let skipped = 0;
    for (let k = env.rows.length - 1; k >= 0; k--) {
      const got = colOfRow(env.rows[k], t.lk, lk(node.col));
      if (got) { if (skipped < (skip || 0)) { skipped++; continue; } return got.v; }
    }
    fail('A coluna ' + t.name + '[' + node.col + '] foi usada sem contexto de linha. Numa medida, use uma agregação (SUM, MAX…) ou um iterador (SUMX…); para buscar na dimensão a partir do fato, use RELATED.', node);
  }
  function measure(env, name) {
    const m = env.ms[lk(name)] || model().measures[lk(name)];
    if (!m) return null;
    if (!m.ast) m.ast = compile(m.src).ast;
    return m;
  }
  function evalMeasure(m, env, node) {
    if ((env.depth || 0) > 40) fail('Referência circular entre medidas.', node);
    return ev(m.ast, { ctx: transition(env), rows: [], vars: {}, ms: env.ms, depth: (env.depth || 0) + 1 });
  }

  function ev(n, env) {
    switch (n.k) {
      case 'num': return n.v;
      case 'str': return n.v;
      case 'bool': return n.v;
      case 'skip': return null;
      case 'var': {
        const vars = Object.assign({}, env.vars);
        n.vars.forEach(function (v) { vars[lk(v.name)] = evAny(v.e, Object.assign({}, env, { vars: vars })); });
        return ev(n.ret, Object.assign({}, env, { vars: vars }));
      }
      case 'name': {
        if (lk(n.name) in env.vars) return scalar(env.vars[lk(n.name)], n);
        if (model().T[lk(n.name)]) return scalar(evTable(n, env), n);
        fail('"' + n.name + '" não é uma variável, tabela ou função conhecida.', n);
      }
      case 'tableref': return scalar(evTable(n, env), n);
      case 'col': return rowValue(env, n);
      case 'bracket': {
        const m = measure(env, n.name);
        if (m) return evalMeasure(m, env, n);
        for (let k = env.rows.length - 1; k >= 0; k--) {
          const rc = env.rows[k];
          if (rc.tv.src) { const t = model().T[rc.tv.src.t]; const ci = t.colIdx[lk(n.name)]; if (ci != null) return rc.tv.rows[rc.i][ci]; }
          for (let j = 0; j < rc.tv.cols.length; j++) if (rc.tv.cols[j].c === lk(n.name)) return rc.tv.rows[rc.i][j];
        }
        fail('A medida [' + n.name + '] não existe. Medidas do modelo: ' + Object.keys(model().measures).map(function (k) { return '[' + model().measures[k].name + ']'; }).join(', ') + '.', n);
      }
      case 'un': {
        if (n.op === 'NOT') return !truthy(ev(n.e, env));
        const v = ev(n.e, env);
        if (v === null) return null;
        return n.op === '-' ? -toNum(v, n) : toNum(v, n);
      }
      case 'in': {
        const l = ev(n.l, env); const tv = evTable(n.r, env);
        return tv.rows.some(function (r) { return eq(r[0], l); });
      }
      case 'bin': return binop(n, env);
      case 'tablector': case 'tuple': return scalar(evTable(n, env), n);
      case 'call': {
        const f = FN[n.name];
        if (f) return f(n.args, env, n);
        if (TFN[n.name]) return scalar(TFN[n.name](n.args, env, n), n);
        fail('A função ' + n.raw + ' não existe ou não está disponível nesta plataforma.', n);
      }
    }
    fail('Expressão não suportada.', n);
  }
  function evAny(n, env) { return isTableExpr(n, env) ? evTable(n, env) : ev(n, env); }
  function isTableExpr(n, env) {
    if (n.k === 'tableref' || n.k === 'tablector') return true;
    if (n.k === 'name') return isTV(env.vars[lk(n.name)]) || (!(lk(n.name) in env.vars) && !!model().T[lk(n.name)]);
    if (n.k === 'call') return !!TFN[n.name];
    return false;
  }
  function eq(a, b) {
    if (a === null && b === null) return true;
    if (a === null) return b === 0 || b === '' || b === false;
    if (b === null) return a === 0 || a === '' || a === false;
    if (typeof a === 'string' || typeof b === 'string') return String(a).toLowerCase() === String(b).toLowerCase();
    return Math.abs(Number(a) - Number(b)) < 1e-9;
  }
  function cmp(a, b) {
    if (a === null) a = typeof b === 'string' ? '' : 0;
    if (b === null) b = typeof a === 'string' ? '' : 0;
    if (typeof a === 'string' || typeof b === 'string') return String(a).localeCompare(String(b), 'pt-BR', { sensitivity: 'base' });
    return Number(a) - Number(b);
  }
  function binop(n, env) {
    if (n.op === '&&') return truthy(ev(n.l, env)) && truthy(ev(n.r, env));
    if (n.op === '||') return truthy(ev(n.l, env)) || truthy(ev(n.r, env));
    const a = ev(n.l, env), b = ev(n.r, env);
    switch (n.op) {
      case '+': if (a === null && b === null) return null; return toNum(a, n.l) + toNum(b, n.r);
      case '-': if (a === null && b === null) return null; return toNum(a, n.l) - toNum(b, n.r);
      case '*': if (a === null || b === null) return null; return toNum(a, n.l) * toNum(b, n.r);
      case '/': {
        if (a === null) return null;
        const d = toNum(b, n.r);
        if (d === 0) return toNum(a, n.l) === 0 ? NaN : Infinity;
        return toNum(a, n.l) / d;
      }
      case '^': if (a === null) return null; return Math.pow(toNum(a, n.l), toNum(b, n.r));
      case '&': return text(a) + text(b);
      case '=': return eq(a, b);
      case '<>': return !eq(a, b);
      case '<': return cmp(a, b) < 0;
      case '>': return cmp(a, b) > 0;
      case '<=': return cmp(a, b) <= 0;
      case '>=': return cmp(a, b) >= 0;
    }
  }
  function text(v) {
    if (v === null) return '';
    if (typeof v === 'boolean') return v ? 'Verdadeiro' : 'Falso';
    if (typeof v === 'number') return Number.isInteger(v) ? String(v) : String(Math.round(v * 1e6) / 1e6).replace('.', ',');
    return String(v);
  }

  /* ------------------------------ Tabelas ------------------------------ */
  function evTable(n, env) {
    if (n.k === '__tv') return n.tv;   // tabela já calculada (SUMMARIZE → ADDCOLUMNS)
    if (n.k === 'tableref') { const t = table(n.name, n); return physical(t, rowsOf(t.lk, env.ctx)); }
    if (n.k === 'name') {
      if (isTV(env.vars[lk(n.name)])) return env.vars[lk(n.name)];
      if (lk(n.name) in env.vars) fail('A variável ' + n.name + ' guarda um valor, não uma tabela.', n);
      const t = table(n.name, n); return physical(t, rowsOf(t.lk, env.ctx));
    }
    if (n.k === 'tablector') {
      const rows = n.items.map(function (it) { return it.k === 'tuple' ? it.items.map(function (x) { return ev(x, env); }) : [ev(it, env)]; });
      const w = rows.length ? rows[0].length : 1;
      const cols = []; for (let i = 0; i < w; i++) cols.push({ t: null, c: i === 0 ? 'value' : 'value' + (i + 1), name: i === 0 ? 'Value' : 'Value' + (i + 1) });
      return virtual(cols, rows);
    }
    if (n.k === 'call') {
      if (TFN[n.name]) return TFN[n.name](n.args, env, n);
      if (FN[n.name]) fail('A função ' + n.raw + ' devolve um valor, mas aqui era esperada uma tabela.', n);
      fail('A função ' + n.raw + ' não existe ou não está disponível nesta plataforma.', n);
    }
    if (n.k === 'col') fail('Aqui era esperada uma tabela. Para usar os valores da coluna, escreva VALUES(' + n.table + '[' + n.col + ']).', n);
    fail('Aqui era esperada uma tabela (por exemplo fVendas, FILTER(...), VALUES(...)).', n);
  }
  function colArg(n, fnName) {
    if (n.k !== 'col') fail(fnName + ' espera uma coluna no formato Tabela[Coluna].', n);
    const t = table(n.table, n); const ci = colIndex(t, n.col, n);
    return { t: t, ci: ci, c: lk(n.col), name: t.cols[ci] };
  }
  function colValues(n, env, fnName) {
    const c = colArg(n, fnName);
    return rowsOf(c.t.lk, env.ctx).map(function (i) { return c.t.rows[i][c.ci]; });
  }
  function distinctTV(cols, rows) {
    const seen = new Set(), out = [];
    rows.forEach(function (r) { const k = tupleKey(r); if (!seen.has(k)) { seen.add(k); out.push(r); } });
    return virtual(cols, out);
  }
  function colsTV(argNodes, env, idxFn) {
    const cs = argNodes.map(function (a) { return colArg(a, 'A função'); });
    const t = cs[0].t;
    if (cs.some(function (c) { return c.t !== t; })) fail('As colunas precisam ser da mesma tabela.', argNodes[0]);
    const idx = idxFn(t);
    return distinctTV(cs.map(function (c) { return { t: t.lk, c: c.c, name: c.name }; }), idx.map(function (i) { return cs.map(function (c) { return t.rows[i][c.ci]; }); }));
  }
  function iterate(tv, env, fn) { for (let i = 0; i < tv.rows.length; i++) fn(withRow(env, tv, i), i); }
  function nameArg(n) { return n && (n.k === 'name' ? n.name.toUpperCase() : n.k === 'col' ? null : null); }

  /* ---------------------------- Datas (tabela de datas) ---------------------------- */
  const F2 = function () { return global.DaxData; };
  function datesIn(n, env) {
    const c = colArg(n, 'A função de inteligência de tempo');
    const vals = rowsOf(c.t.lk, env.ctx).map(function (i) { return c.t.rows[i][c.ci]; }).filter(function (v) { return v !== null; });
    return { c: c, dates: Array.from(new Set(vals)).sort(function (a, b) { return a - b; }) };
  }
  function allDates(c) { return c.t.rows.map(function (r) { return r[c.ci]; }); }
  function dateTV(c, dates) {
    const exist = new Set(allDates(c));
    const ds = Array.from(new Set(dates)).filter(function (d) { return exist.has(d); }).sort(function (a, b) { return a - b; });
    return virtual([{ t: c.t.lk, c: c.c, name: c.name }], ds.map(function (d) { return [d]; }));
  }
  const ymd = function (n) { return F2().fromSerial(n); };
  const ser = function (y, m, d) { return F2().serial(y, m, d); };
  function lastDay(y, m) { return ymd(ser(y, m + 1, 1) - 1).d; }
  function addMonths(n, k) {
    const d = ymd(n); let m = d.m - 1 + k; const y = d.y + Math.floor(m / 12); m = ((m % 12) + 12) % 12 + 1;
    return ser(y, m, Math.min(d.d, lastDay(y, m)));
  }
  function shiftDates(dates, k, unit) {
    if (unit === 'DAY') return dates.map(function (d) { return d + k; });
    const months = unit === 'MONTH' ? k : unit === 'QUARTER' ? 3 * k : 12 * k;
    // meses completos no contexto viram meses completos deslocados
    const set = new Set(dates), out = [];
    const byMonth = {};
    dates.forEach(function (d) { const x = ymd(d); const key = x.y * 100 + x.m; (byMonth[key] = byMonth[key] || []).push(d); });
    Object.keys(byMonth).forEach(function (key) {
      const y = Math.floor(key / 100), m = key % 100, list = byMonth[key];
      const full = list.length === lastDay(y, m) && list.every(function (d) { return set.has(d); });
      if (full) { const s = addMonths(ser(y, m, 1), months), t = ymd(s); for (let d = 1; d <= lastDay(t.y, t.m); d++) out.push(ser(t.y, t.m, d)); }
      else list.forEach(function (d) { out.push(addMonths(d, months)); });
    });
    return out;
  }
  function range(a, b) { const out = []; for (let d = a; d <= b; d++) out.push(d); return out; }
  function unitOf(n, fnName) {
    const u = n && n.k === 'name' ? n.name.toUpperCase() : '';
    if (['DAY', 'MONTH', 'QUARTER', 'YEAR'].indexOf(u) < 0) fail(fnName + ': o intervalo precisa ser DAY, MONTH, QUARTER ou YEAR.', n);
    return u;
  }

  /* ------------------------------ CALCULATE ------------------------------ */
  function collectCols(n, out) {
    out = out || [];
    if (!n || typeof n !== 'object') return out;
    if (n.k === 'col') out.push(n);
    if (n.k === 'call' && (n.name === 'CALCULATE' || n.name === 'CALCULATETABLE')) return out;
    ['l', 'r', 'e', 'ret'].forEach(function (k) { if (n[k]) collectCols(n[k], out); });
    if (n.args) n.args.forEach(function (a) { collectCols(a, out); });
    if (n.items) n.items.forEach(function (a) { collectCols(a, out); });
    if (n.vars) n.vars.forEach(function (v) { collectCols(v.e, out); });
    return out;
  }
  function hasMeasureRef(n, env) {
    if (!n || typeof n !== 'object') return false;
    if (n.k === 'bracket' && measure(env, n.name)) return true;
    return ['l', 'r', 'e'].some(function (k) { return n[k] && hasMeasureRef(n[k], env); }) || (n.args || []).some(function (a) { return hasMeasureRef(a, env); });
  }
  function filterOp(n, env) {
    if (n.k === 'call') {
      const nm = n.name;
      if (nm === 'KEEPFILTERS') { const op = filterOp(n.args[0], env); op.keep = true; return op; }
      if (nm === 'ALL' || nm === 'REMOVEFILTERS' || nm === 'ALLNOBLANKROW' || nm === 'ALLSELECTED' || nm === 'ALLEXCEPT') {
        const vis = nm === 'ALLSELECTED';
        if (!n.args.length) return { type: 'remove', spec: { all: true, visualOnly: vis } };
        if (nm === 'ALLEXCEPT') {
          const t = n.args[0].k === 'col' ? fail('ALLEXCEPT começa pela tabela: ALLEXCEPT(Tabela, Tabela[Coluna]).', n.args[0]) : table(n.args[0].name, n.args[0]);
          return { type: 'remove', spec: { tables: [t.lk], except: n.args.slice(1).map(function (a) { const c = colArg(a, 'ALLEXCEPT'); return { t: c.t.lk, c: c.c }; }) } };
        }
        if (n.args[0].k === 'tableref' || n.args[0].k === 'name') return { type: 'remove', spec: { tables: [table(n.args[0].name, n.args[0]).lk], visualOnly: vis } };
        return { type: 'remove', spec: { cols: n.args.map(function (a) { const c = colArg(a, nm); return { t: c.t.lk, c: c.c }; }), visualOnly: vis } };
      }
      if (nm === 'USERELATIONSHIP') {
        const a = colArg(n.args[0], 'USERELATIONSHIP'), b = colArg(n.args[1], 'USERELATIONSHIP');
        const r = model().R.find(function (r) { return (r.from === a.t.lk && r.fromCol === a.c && r.to === b.t.lk && r.toCol === b.c) || (r.from === b.t.lk && r.fromCol === b.c && r.to === a.t.lk && r.toCol === a.c); });
        if (!r) fail('Não existe relacionamento entre ' + a.t.name + '[' + a.name + '] e ' + b.t.name + '[' + b.name + '].', n);
        return { type: 'userel', id: r.id };
      }
      if (nm === 'CROSSFILTER') return { type: 'none' };
    }
    if (isTableExpr(n, env)) return { type: 'filters', fs: tvFilters(evTable(n, env)) };
    // filtro booleano: vira FILTER(ALL(colunas), condição)
    if (hasMeasureRef(n, env)) fail('Um filtro do CALCULATE não pode usar medida diretamente. Use FILTER(Tabela, condição) ou guarde a medida numa variável antes.', n);
    const cols = collectCols(n);
    if (!cols.length) fail('Este filtro do CALCULATE não usa nenhuma coluna. Exemplo: dProduto[Categoria] = "Casa".', n);
    const t = table(cols[0].table, cols[0]);
    cols.forEach(function (c) { if (lk(c.table) !== t.lk) fail('Um filtro booleano do CALCULATE só pode usar colunas de uma tabela. Separe em dois filtros ou use FILTER.', c); colIndex(t, c.col, c); });
    const names = Array.from(new Set(cols.map(function (c) { return lk(c.col); })));
    const ci = names.map(function (c) { return t.colIdx[c]; });
    const tv = distinctTV(names.map(function (c, i) { return { t: t.lk, c: c, name: t.cols[ci[i]] }; }), t.all.map(function (i) { return ci.map(function (k) { return t.rows[i][k]; }); }));
    const keep = [];
    iterate(tv, Object.assign({}, env, { rows: [] }), function (e2, i) { if (truthy(ev(n, e2))) keep.push(tv.rows[i]); });
    return { type: 'filters', fs: [{ t: t.lk, cols: names, keys: new Set(keep.map(tupleKey)) }] };
  }
  function calcCtx(filterNodes, env) {
    const ops = filterNodes.map(function (f) { return filterOp(f, env); });
    let ctx = transition(env);
    ops.forEach(function (op) {
      if (op.type === 'remove') ctx = removeFilters(ctx, op.spec);
      if (op.type === 'userel') ctx = mkCtx(ctx.filters, (ctx.userel || []).concat([op.id]));
    });
    ops.forEach(function (op) { if (op.type === 'filters') op.fs.forEach(function (f) { ctx = addFilter(ctx, f, op.keep); }); });
    return ctx;
  }
  function calculate(args, env, n, asTable) {
    if (!args.length) fail('CALCULATE precisa de uma expressão.', n);
    const ctx = calcCtx(args.slice(1), env);
    const env2 = { ctx: ctx, rows: [], vars: env.vars, ms: env.ms, depth: env.depth };
    return asTable ? evTable(args[0], env2) : ev(args[0], env2);
  }

  /* -------------------------- Funções de tabela -------------------------- */
  const TFN = {
    FILTER: function (a, env, n) {
      need(a, 2, n, 'FILTER(Tabela, condição)');
      const tv = evTable(a[0], env), keep = [], idx = [];
      iterate(tv, env, function (e2, i) { if (truthy(ev(a[1], e2))) { keep.push(tv.rows[i]); if (tv.src) idx.push(tv.src.idx[i]); } });
      return { __tv: true, cols: tv.cols, rows: keep, src: tv.src ? { t: tv.src.t, idx: idx } : null };
    },
    ALL: function (a, env, n) {
      if (!a.length) fail('Use ALL(Tabela) ou ALL(Tabela[Coluna]) quando precisar de uma tabela.', n);
      if (a[0].k === 'tableref' || a[0].k === 'name') { const t = table(a[0].name, a[0]); return physical(t, t.all); }
      return colsTV(a, env, function (t) { return t.all; });
    },
    ALLSELECTED: function (a, env, n) {
      const ctx = removeFilters(env.ctx, { all: true, visualOnly: true });
      if (!a.length) fail('Use ALLSELECTED(Tabela) ou ALLSELECTED(Tabela[Coluna]).', n);
      if (a[0].k === 'tableref' || a[0].k === 'name') { const t = table(a[0].name, a[0]); return physical(t, rowsOf(t.lk, ctx)); }
      return colsTV(a, env, function (t) { return rowsOf(t.lk, ctx); });
    },
    VALUES: function (a, env, n) {
      need(a, 1, n, 'VALUES(Tabela[Coluna])');
      if (a[0].k === 'tableref' || a[0].k === 'name') return evTable(a[0], env);
      return colsTV([a[0]], env, function (t) { return rowsOf(t.lk, env.ctx); });
    },
    CALCULATETABLE: function (a, env, n) { return calculate(a, env, n, true); },
    RELATEDTABLE: function (a, env, n) { need(a, 1, n, 'RELATEDTABLE(Tabela)'); return calculate([a[0]], env, n, true); },
    ADDCOLUMNS: function (a, env, n) {
      const tv = evTable(a[0], env);
      const extra = [];
      for (let i = 1; i < a.length; i += 2) { if (a[i].k !== 'str') fail('ADDCOLUMNS: o nome da nova coluna vai entre aspas.', a[i]); extra.push({ name: a[i].v, e: a[i + 1] }); }
      const cols = tv.cols.concat(extra.map(function (x) { return { t: null, c: lk(x.name), name: x.name }; }));
      const rows = tv.rows.map(function (r, i) { const e2 = withRow(env, tv, i); return r.concat(extra.map(function (x) { return ev(x.e, e2); })); });
      return { __tv: true, cols: cols, rows: rows, src: tv.src };
    },
    SELECTCOLUMNS: function (a, env, n) {
      const tv = evTable(a[0], env);
      const extra = [];
      for (let i = 1; i < a.length; i += 2) extra.push({ name: a[i].k === 'str' ? a[i].v : fail('SELECTCOLUMNS: o nome da coluna vai entre aspas.', a[i]), e: a[i + 1] });
      return virtual(extra.map(function (x) { return { t: x.e.k === 'col' ? lk(x.e.table) : null, c: x.e.k === 'col' ? lk(x.e.col) : lk(x.name), name: x.name }; }),
        tv.rows.map(function (r, i) { const e2 = withRow(env, tv, i); return extra.map(function (x) { return ev(x.e, e2); }); }));
    },
    SUMMARIZE: function (a, env, n) {
      const base = evTable(a[0], env);
      if (!base.src) fail('SUMMARIZE agrupa uma tabela do modelo, como fVendas.', a[0]);
      const groups = [], extra = [];
      for (let i = 1; i < a.length; i++) { if (a[i].k === 'str') { extra.push({ name: a[i].v, e: a[i + 1] }); i++; } else groups.push(a[i]); }
      const gc = groups.map(function (g) { return colArg(g, 'SUMMARIZE'); });
      const rows = base.rows.map(function (r, i) {
        return gc.map(function (c) { return lookupThrough(base.src.t, base.src.idx[i], c, env.ctx, groups[0]); });
      });
      const tv = distinctTV(gc.map(function (c) { return { t: c.t.lk, c: c.c, name: c.name }; }), rows);
      if (!extra.length) return tv;
      return TFN.ADDCOLUMNS([{ k: '__tv', tv: tv }].concat(extra.reduce(function (acc, x) { return acc.concat([{ k: 'str', v: x.name }, x.e]); }, [])), env, n);
    },
    TOPN: function (a, env, n) {
      need(a, 3, n, 'TOPN(N, Tabela, Expressão, [DESC|ASC])');
      const k = toNum(ev(a[0], env), a[0]);
      const tv = evTable(a[1], env);
      const desc = !(a[3] && nameArg(a[3]) === 'ASC') && !(a[3] && a[3].k === 'num' && a[3].v === 1);
      const vals = tv.rows.map(function (r, i) { return { i: i, v: ev(a[2], withRow(env, tv, i)) }; });
      vals.sort(function (x, y) { const c = cmp(x.v, y.v); return desc ? -c : c; });
      if (!vals.length) return { __tv: true, cols: tv.cols, rows: [], src: tv.src ? { t: tv.src.t, idx: [] } : null };
      const cut = vals[Math.min(k, vals.length) - 1];
      const pick = vals.filter(function (x, j) { return j < k || (cut && eq(x.v, cut.v)); });
      return { __tv: true, cols: tv.cols, rows: pick.map(function (x) { return tv.rows[x.i]; }), src: tv.src ? { t: tv.src.t, idx: pick.map(function (x) { return tv.src.idx[x.i]; }) } : null };
    },
    DISTINCT: function (a, env, n) {
      if (a[0] && a[0].k === 'col') return TFN.VALUES(a, env, n);
      const tv = evTable(a[0], env); return distinctTV(tv.cols, tv.rows);
    },
    GENERATESERIES: function (a, env) {
      const s = toNum(ev(a[0], env)), e = toNum(ev(a[1], env)), st = a[2] ? toNum(ev(a[2], env)) : 1;
      const rows = []; for (let x = s; x <= e + 1e-9 && rows.length < 5000; x += st) rows.push([Math.round(x * 1e9) / 1e9]);
      return virtual([{ t: null, c: 'value', name: 'Value' }], rows);
    },
    KEEPFILTERS: function (a, env) { return evTable(a[0], env); },
    REMOVEFILTERS: function (a, env, n) { return TFN.ALL(a, env, n); },
    ALLNOBLANKROW: function (a, env, n) { return TFN.ALL(a, env, n); },
    ALLEXCEPT: function (a, env, n) { const t = table(a[0].name, a[0]); return physical(t, t.all); },
    // ---- inteligência de tempo (coluna de datas)
    DATESYTD: function (a, env, n) { const x = datesIn(a[0], env); if (!x.dates.length) return dateTV(x.c, []); const last = x.dates[x.dates.length - 1], y = ymd(last).y; return dateTV(x.c, range(ser(y, 1, 1), last)); },
    DATESQTD: function (a, env, n) { const x = datesIn(a[0], env); if (!x.dates.length) return dateTV(x.c, []); const last = x.dates[x.dates.length - 1], d = ymd(last); return dateTV(x.c, range(ser(d.y, 3 * Math.floor((d.m - 1) / 3) + 1, 1), last)); },
    DATESMTD: function (a, env, n) { const x = datesIn(a[0], env); if (!x.dates.length) return dateTV(x.c, []); const last = x.dates[x.dates.length - 1], d = ymd(last); return dateTV(x.c, range(ser(d.y, d.m, 1), last)); },
    SAMEPERIODLASTYEAR: function (a, env, n) { const x = datesIn(a[0], env); return dateTV(x.c, shiftDates(x.dates, -1, 'YEAR')); },
    DATEADD: function (a, env, n) { need(a, 3, n, 'DATEADD(dCalendario[Data], -1, YEAR)'); const x = datesIn(a[0], env); return dateTV(x.c, shiftDates(x.dates, toNum(ev(a[1], env)), unitOf(a[2], 'DATEADD'))); },
    PARALLELPERIOD: function (a, env, n) {
      need(a, 3, n, 'PARALLELPERIOD(dCalendario[Data], -1, YEAR)');
      const x = datesIn(a[0], env); if (!x.dates.length) return dateTV(x.c, []);
      const u = unitOf(a[2], 'PARALLELPERIOD'), k = toNum(ev(a[1], env));
      const f = ymd(x.dates[0]), l = ymd(x.dates[x.dates.length - 1]);
      let s, e;
      if (u === 'YEAR') { s = ser(f.y, 1, 1); e = ser(l.y, 12, 31); }
      else if (u === 'QUARTER') { s = ser(f.y, 3 * Math.floor((f.m - 1) / 3) + 1, 1); const qm = 3 * Math.floor((l.m - 1) / 3) + 3; e = ser(l.y, qm, lastDay(l.y, qm)); }
      else { s = ser(f.y, f.m, 1); e = ser(l.y, l.m, lastDay(l.y, l.m)); }
      return dateTV(x.c, shiftDates(range(s, e), k, u === 'DAY' ? 'DAY' : u));
    },
    PREVIOUSMONTH: function (a, env) { const x = datesIn(a[0], env); if (!x.dates.length) return dateTV(x.c, []); const f = ymd(x.dates[0]); const s = addMonths(ser(f.y, f.m, 1), -1), d = ymd(s); return dateTV(x.c, range(s, ser(d.y, d.m, lastDay(d.y, d.m)))); },
    NEXTMONTH: function (a, env) { const x = datesIn(a[0], env); if (!x.dates.length) return dateTV(x.c, []); const l = ymd(x.dates[x.dates.length - 1]); const s = addMonths(ser(l.y, l.m, 1), 1), d = ymd(s); return dateTV(x.c, range(s, ser(d.y, d.m, lastDay(d.y, d.m)))); },
    PREVIOUSYEAR: function (a, env) { const x = datesIn(a[0], env); if (!x.dates.length) return dateTV(x.c, []); const y = ymd(x.dates[0]).y - 1; return dateTV(x.c, range(ser(y, 1, 1), ser(y, 12, 31))); },
    PREVIOUSQUARTER: function (a, env) { const x = datesIn(a[0], env); if (!x.dates.length) return dateTV(x.c, []); const f = ymd(x.dates[0]); const s = addMonths(ser(f.y, 3 * Math.floor((f.m - 1) / 3) + 1, 1), -3), d = ymd(s); return dateTV(x.c, range(s, ser(d.y, d.m + 2, lastDay(d.y, d.m + 2)))); },
    DATESINPERIOD: function (a, env, n) {
      need(a, 4, n, 'DATESINPERIOD(dCalendario[Data], MAX(dCalendario[Data]), -3, MONTH)');
      const c = colArg(a[0], 'DATESINPERIOD'); const start = toNum(ev(a[1], env)); const k = toNum(ev(a[2], env)); const u = unitOf(a[3], 'DATESINPERIOD');
      let other = u === 'DAY' ? start + k : addMonths(start, u === 'MONTH' ? k : u === 'QUARTER' ? 3 * k : 12 * k);
      const ds = k < 0 ? range(other + 1, start) : range(start, other - 1);
      return dateTV(c, ds);
    },
    DATESBETWEEN: function (a, env, n) { need(a, 3, n, 'DATESBETWEEN(dCalendario[Data], início, fim)'); const c = colArg(a[0], 'DATESBETWEEN'); const s = ev(a[1], env), e = ev(a[2], env); const all = allDates(c); return dateTV(c, all.filter(function (d) { return (s === null || d >= s) && (e === null || d <= e); })); },
    FIRSTDATE: function (a, env) { const x = datesIn(a[0], env); return dateTV(x.c, x.dates.slice(0, 1)); },
    LASTDATE: function (a, env) { const x = datesIn(a[0], env); return dateTV(x.c, x.dates.slice(-1)); },
    STARTOFMONTH: function (a, env) { const x = datesIn(a[0], env); if (!x.dates.length) return dateTV(x.c, []); const f = ymd(x.dates[0]); return dateTV(x.c, [ser(f.y, f.m, 1)]); },
    ENDOFMONTH: function (a, env) { const x = datesIn(a[0], env); if (!x.dates.length) return dateTV(x.c, []); const l = ymd(x.dates[x.dates.length - 1]); return dateTV(x.c, [ser(l.y, l.m, lastDay(l.y, l.m))]); },
    STARTOFYEAR: function (a, env) { const x = datesIn(a[0], env); if (!x.dates.length) return dateTV(x.c, []); return dateTV(x.c, [ser(ymd(x.dates[0]).y, 1, 1)]); },
    ENDOFYEAR: function (a, env) { const x = datesIn(a[0], env); if (!x.dates.length) return dateTV(x.c, []); return dateTV(x.c, [ser(ymd(x.dates[x.dates.length - 1]).y, 12, 31)]); },
  };

  /** Valor de uma coluna (da própria tabela ou de uma dimensão relacionada) a partir de uma linha do fato. */
  function lookupThrough(tl, rowIdx, c, ctx, node) {
    if (c.t.lk === tl) return model().T[tl].rows[rowIdx][c.ci];
    const path = findPath(tl, c.t.lk, ctx);
    if (!path) fail('Não há relacionamento de ' + model().T[tl].name + ' até ' + c.t.name + ' para usar ' + c.t.name + '[' + c.name + '].', node);
    let cur = tl, row = rowIdx;
    for (const r of path) {
      const ft = model().T[cur], tt = model().T[r.to];
      const v = ft.rows[row][ft.colIdx[r.fromCol]];
      const tci = tt.colIdx[r.toCol];
      row = tt.index && tt.index[r.toCol] ? tt.index[r.toCol][keyOf(v)] : buildIndex(tt, r.toCol)[keyOf(v)];
      if (row == null) return null;
      cur = r.to;
      void tci;
    }
    return model().T[cur].rows[row][c.ci];
  }
  function buildIndex(t, col) {
    t.index = t.index || {};
    if (!t.index[col]) { const ix = {}, ci = t.colIdx[col]; t.rows.forEach(function (r, i) { ix[keyOf(r[ci])] = i; }); t.index[col] = ix; }
    return t.index[col];
  }
  function findPath(from, to, ctx) {
    const rels = ctx ? activeRels(ctx) : model().R.filter(function (r) { return r.active; });
    const q = [[from, []]], seen = {};
    while (q.length) {
      const cur = q.shift();
      if (cur[0] === to) return cur[1];
      if (seen[cur[0]]) continue; seen[cur[0]] = true;
      rels.forEach(function (r) { if (r.from === cur[0]) q.push([r.to, cur[1].concat([r])]); });
    }
    return null;
  }

  /* ----------------------------- Funções escalares ----------------------------- */
  function need(a, k, n, sig) { if (a.length < k) fail('Faltam argumentos. Formato: ' + sig + '.', n); }
  function aggCol(fnName, combine) {
    return function (a, env, n) {
      need(a, 1, n, fnName + '(Tabela[Coluna])');
      if (a[0].k !== 'col') fail(fnName + ' espera uma coluna, como ' + fnName + '(fVendas[Valor]). Para somar uma expressão, use ' + fnName + 'X.', a[0]);
      return combine(colValues(a[0], env, fnName), n);
    };
  }
  const nums = function (vals) { return vals.filter(function (v) { return typeof v === 'number' && !isNaN(v); }); };
  function sumOf(vals) { const v = nums(vals); return v.length ? v.reduce(function (s, x) { return s + x; }, 0) : null; }
  function avgOf(vals) { const v = nums(vals); return v.length ? v.reduce(function (s, x) { return s + x; }, 0) / v.length : null; }
  function minOf(vals) { const v = vals.filter(function (x) { return x !== null; }); return v.length ? v.reduce(function (m, x) { return cmp(x, m) < 0 ? x : m; }) : null; }
  function maxOf(vals) { const v = vals.filter(function (x) { return x !== null; }); return v.length ? v.reduce(function (m, x) { return cmp(x, m) > 0 ? x : m; }) : null; }
  function median(vals) { const v = nums(vals).sort(function (a, b) { return a - b; }); if (!v.length) return null; const h = Math.floor(v.length / 2); return v.length % 2 ? v[h] : (v[h - 1] + v[h]) / 2; }
  function iterX(fnName, combine) {
    return function (a, env, n) {
      need(a, 2, n, fnName + '(Tabela, Expressão)');
      const tv = evTable(a[0], env), vals = [];
      iterate(tv, env, function (e2) { vals.push(ev(a[1], e2)); });
      return combine(vals);
    };
  }
  function round(x, d, mode) {
    if (x === null) return null;
    const f = Math.pow(10, d || 0);
    const v = x * f;
    const r = mode === 'up' ? (v < 0 ? -Math.ceil(-v - 1e-9) : Math.ceil(v - 1e-9)) : mode === 'down' ? Math.trunc(v + (v < 0 ? -1e-9 : 1e-9)) : Math.sign(v) * Math.round(Math.abs(v) + 1e-9);
    return r / f;
  }
  function lazyIf(a, env) { return truthy(ev(a[0], env)) ? (a[1] ? ev(a[1], env) : true) : (a[2] && a[2].k !== 'skip' ? ev(a[2], env) : null); }
  const FN = {
    CALCULATE: function (a, env, n) { return calculate(a, env, n, false); },
    SUM: aggCol('SUM', sumOf), AVERAGE: aggCol('AVERAGE', avgOf), MEDIAN: aggCol('MEDIAN', median),
    MIN: function (a, env, n) { if (a.length === 2) { const x = ev(a[0], env), y = ev(a[1], env); return x === null ? y : y === null ? x : cmp(x, y) <= 0 ? x : y; } return aggCol('MIN', minOf)(a, env, n); },
    MAX: function (a, env, n) { if (a.length === 2) { const x = ev(a[0], env), y = ev(a[1], env); return x === null ? y : y === null ? x : cmp(x, y) >= 0 ? x : y; } return aggCol('MAX', maxOf)(a, env, n); },
    COUNT: aggCol('COUNT', function (v) { const c = v.filter(function (x) { return typeof x === 'number'; }).length; return c || null; }),
    COUNTA: aggCol('COUNTA', function (v) { const c = v.filter(function (x) { return x !== null && x !== ''; }).length; return c || null; }),
    COUNTBLANK: aggCol('COUNTBLANK', function (v) { return v.filter(function (x) { return x === null || x === ''; }).length || null; }),
    DISTINCTCOUNT: aggCol('DISTINCTCOUNT', function (v) { return v.length ? new Set(v.map(keyOf)).size : null; }),
    COUNTROWS: function (a, env, n) { need(a, 1, n, 'COUNTROWS(Tabela)'); const tv = evTable(a[0], env); return tv.rows.length || null; },
    SUMX: iterX('SUMX', sumOf), AVERAGEX: iterX('AVERAGEX', avgOf), MINX: iterX('MINX', minOf), MAXX: iterX('MAXX', maxOf), MEDIANX: iterX('MEDIANX', median),
    COUNTX: iterX('COUNTX', function (v) { return v.filter(function (x) { return typeof x === 'number' || (x !== null && x !== ''); }).length || null; }),
    COUNTAX: iterX('COUNTAX', function (v) { return v.filter(function (x) { return x !== null && x !== ''; }).length || null; }),
    PRODUCTX: iterX('PRODUCTX', function (v) { const n = nums(v); return n.length ? n.reduce(function (p, x) { return p * x; }, 1) : null; }),
    CONCATENATEX: function (a, env, n) {
      need(a, 2, n, 'CONCATENATEX(Tabela, Expressão, [Delimitador])');
      const tv = evTable(a[0], env), items = [];
      iterate(tv, env, function (e2) { items.push({ v: ev(a[1], e2), o: a[3] ? ev(a[3], e2) : null }); });
      if (a[3]) { const desc = a[4] && nameArg(a[4]) === 'DESC'; items.sort(function (x, y) { const c = cmp(x.o, y.o); return desc ? -c : c; }); }
      return items.map(function (x) { return text(x.v); }).join(a[2] ? text(ev(a[2], env)) : '');
    },
    RANKX: function (a, env, n) {
      need(a, 2, n, 'RANKX(Tabela, Expressão, [Valor], [DESC|ASC], [Skip|Dense])');
      const tv = evTable(a[0], env), vals = [];
      iterate(tv, env, function (e2) { vals.push(ev(a[1], e2)); });
      const me = a[2] && a[2].k !== 'skip' ? ev(a[2], env) : ev(a[1], env);
      const asc = a[3] && (nameArg(a[3]) === 'ASC' || (a[3].k === 'num' && a[3].v === 1));
      const dense = a[4] && nameArg(a[4]) === 'DENSE';
      const better = function (v) { const c = cmp(v, me); return asc ? c < 0 : c > 0; };
      if (dense) return new Set(vals.filter(better).map(keyOf)).size + 1;
      return vals.filter(better).length + 1;
    },
    DIVIDE: function (a, env, n) {
      need(a, 2, n, 'DIVIDE(Numerador, Denominador, [ResultadoAlternativo])');
      const x = ev(a[0], env), y = ev(a[1], env);
      if (y === null || toNum(y) === 0) return a[2] ? ev(a[2], env) : null;
      if (x === null) return null;
      return toNum(x, a[0]) / toNum(y, a[1]);
    },
    IF: function (a, env, n) { need(a, 2, n, 'IF(Condição, ValorSeVerdadeiro, [ValorSeFalso])'); return lazyIf(a, env); },
    'IF.EAGER': function (a, env, n) { return lazyIf(a, env); },
    SWITCH: function (a, env, n) {
      need(a, 3, n, 'SWITCH(Expressão, Valor1, Resultado1, …, [Senão])');
      const v = ev(a[0], env);
      let i = 1;
      for (; i + 1 < a.length; i += 2) if (eq(ev(a[i], env), v) && (v !== null || ev(a[i], env) === null)) return ev(a[i + 1], env);
      return i < a.length ? ev(a[i], env) : null;
    },
    AND: function (a, env, n) { need(a, 2, n, 'AND(Condição1, Condição2)'); return truthy(ev(a[0], env)) && truthy(ev(a[1], env)); },
    OR: function (a, env, n) { need(a, 2, n, 'OR(Condição1, Condição2)'); return truthy(ev(a[0], env)) || truthy(ev(a[1], env)); },
    NOT: function (a, env) { return !truthy(ev(a[0], env)); },
    TRUE: function () { return true; }, FALSE: function () { return false; }, BLANK: function () { return null; },
    ISBLANK: function (a, env) { const v = ev(a[0], env); return v === null; },
    COALESCE: function (a, env) { for (const x of a) { const v = ev(x, env); if (v !== null) return v; } return null; },
    IFERROR: function (a, env) { try { const v = ev(a[0], env); if (typeof v === 'number' && !isFinite(v)) return ev(a[1], env); return v; } catch (e) { if (e instanceof DaxError) return ev(a[1], env); throw e; } },
    ISERROR: function (a, env) { try { const v = ev(a[0], env); return typeof v === 'number' && !isFinite(v); } catch (e) { return true; } },
    ROUND: function (a, env) { return round(ev(a[0], env) === null ? null : toNum(ev(a[0], env)), a[1] ? toNum(ev(a[1], env)) : 0); },
    ROUNDUP: function (a, env) { const v = ev(a[0], env); return round(v === null ? null : toNum(v), a[1] ? toNum(ev(a[1], env)) : 0, 'up'); },
    ROUNDDOWN: function (a, env) { const v = ev(a[0], env); return round(v === null ? null : toNum(v), a[1] ? toNum(ev(a[1], env)) : 0, 'down'); },
    INT: function (a, env) { const v = ev(a[0], env); return v === null ? null : Math.floor(toNum(v)); },
    TRUNC: function (a, env) { const v = ev(a[0], env); return v === null ? null : Math.trunc(toNum(v)); },
    ABS: function (a, env) { const v = ev(a[0], env); return v === null ? null : Math.abs(toNum(v)); },
    MOD: function (a, env) { const x = toNum(ev(a[0], env)), y = toNum(ev(a[1], env)); return x - y * Math.floor(x / y); },
    POWER: function (a, env) { return Math.pow(toNum(ev(a[0], env)), toNum(ev(a[1], env))); },
    SQRT: function (a, env) { return Math.sqrt(toNum(ev(a[0], env))); },
    // texto
    CONCATENATE: function (a, env) { return text(ev(a[0], env)) + text(ev(a[1], env)); },
    FORMAT: function (a, env, n) { need(a, 2, n, 'FORMAT(Valor, "Formato")'); return formatDax(ev(a[0], env), text(ev(a[1], env))); },
    LEFT: function (a, env) { return text(ev(a[0], env)).slice(0, a[1] ? toNum(ev(a[1], env)) : 1); },
    RIGHT: function (a, env) { const s = text(ev(a[0], env)), k = a[1] ? toNum(ev(a[1], env)) : 1; return k ? s.slice(-k) : ''; },
    MID: function (a, env) { const s = text(ev(a[0], env)); const st = toNum(ev(a[1], env)); return s.substr(st - 1, toNum(ev(a[2], env))); },
    LEN: function (a, env) { return text(ev(a[0], env)).length; },
    UPPER: function (a, env) { return text(ev(a[0], env)).toUpperCase(); },
    LOWER: function (a, env) { return text(ev(a[0], env)).toLowerCase(); },
    TRIM: function (a, env) { return text(ev(a[0], env)).trim().replace(/\s+/g, ' '); },
    SUBSTITUTE: function (a, env) { return text(ev(a[0], env)).split(text(ev(a[1], env))).join(text(ev(a[2], env))); },
    SEARCH: function (a, env, n) { const p = text(ev(a[1], env)).toLowerCase().indexOf(text(ev(a[0], env)).toLowerCase(), a[2] ? toNum(ev(a[2], env)) - 1 : 0); if (p < 0) { if (a[3]) return ev(a[3], env); fail('SEARCH não encontrou o texto. Use o 4º argumento para um valor alternativo.', n); } return p + 1; },
    FIND: function (a, env, n) { const p = text(ev(a[1], env)).indexOf(text(ev(a[0], env)), a[2] ? toNum(ev(a[2], env)) - 1 : 0); if (p < 0) { if (a[3]) return ev(a[3], env); fail('FIND não encontrou o texto.', n); } return p + 1; },
    CONTAINSSTRING: function (a, env) { return text(ev(a[0], env)).toLowerCase().indexOf(text(ev(a[1], env)).toLowerCase()) >= 0; },
    VALUE: function (a, env, n) { return toNum(ev(a[0], env), n); },
    REPT: function (a, env) { return text(ev(a[0], env)).repeat(Math.max(0, toNum(ev(a[1], env)))); },
    UNICHAR: function (a, env) { return String.fromCodePoint(toNum(ev(a[0], env))); },
    // datas
    DATE: function (a, env, n) { need(a, 3, n, 'DATE(Ano, Mês, Dia)'); const y = toNum(ev(a[0], env)), m = toNum(ev(a[1], env)), d = toNum(ev(a[2], env)); return Math.round((Date.UTC(y, m - 1, d) - Date.UTC(1899, 11, 30)) / 86400000); },
    YEAR: function (a, env) { const v = ev(a[0], env); return v === null ? null : ymd(toNum(v)).y; },
    MONTH: function (a, env) { const v = ev(a[0], env); return v === null ? null : ymd(toNum(v)).m; },
    DAY: function (a, env) { const v = ev(a[0], env); return v === null ? null : ymd(toNum(v)).d; },
    QUARTER: function (a, env) { const v = ev(a[0], env); return v === null ? null : Math.ceil(ymd(toNum(v)).m / 3); },
    WEEKDAY: function (a, env) { const v = ev(a[0], env); if (v === null) return null; const wd = ymd(toNum(v)).wd; const t = a[1] ? toNum(ev(a[1], env)) : 1; return t === 2 ? (wd === 0 ? 7 : wd) : t === 3 ? (wd + 6) % 7 : wd + 1; },
    WEEKNUM: function (a, env) { const v = toNum(ev(a[0], env)); const d = ymd(v); const jan1 = ser(d.y, 1, 1); return Math.floor((v - jan1 + ymd(jan1).wd) / 7) + 1; },
    TODAY: function () { return F2().TODAY; }, NOW: function () { return F2().TODAY; },
    EOMONTH: function (a, env) { const v = ev(a[0], env); if (v === null) return null; const s = addMonths(toNum(v), a[1] ? toNum(ev(a[1], env)) : 0), d = ymd(s); return ser(d.y, d.m, lastDay(d.y, d.m)); },
    EDATE: function (a, env) { const v = ev(a[0], env); return v === null ? null : addMonths(toNum(v), toNum(ev(a[1], env))); },
    DATEDIFF: function (a, env, n) {
      need(a, 3, n, 'DATEDIFF(DataInicial, DataFinal, DAY|MONTH|YEAR)');
      const s = ev(a[0], env), e = ev(a[1], env); if (s === null || e === null) return null;
      const u = a[2].k === 'name' ? a[2].name.toUpperCase() : '';
      const x = ymd(toNum(s)), y = ymd(toNum(e));
      if (u === 'DAY') return toNum(e) - toNum(s);
      if (u === 'WEEK') return Math.floor((toNum(e) - toNum(s)) / 7);
      if (u === 'MONTH') return (y.y - x.y) * 12 + (y.m - x.m);
      if (u === 'QUARTER') return (y.y - x.y) * 4 + (Math.ceil(y.m / 3) - Math.ceil(x.m / 3));
      if (u === 'YEAR') return y.y - x.y;
      fail('DATEDIFF: o intervalo precisa ser DAY, WEEK, MONTH, QUARTER ou YEAR.', a[2]);
    },
    // inteligência de tempo (escalar)
    TOTALYTD: function (a, env, n) { need(a, 2, n, 'TOTALYTD(Expressão, dCalendario[Data])'); return calculate([a[0], { k: 'call', name: 'DATESYTD', args: [a[1]], pos: a[1].pos }].concat(a.slice(2).filter(function (x) { return x.k !== 'str'; })), env, n); },
    TOTALQTD: function (a, env, n) { need(a, 2, n, 'TOTALQTD(Expressão, dCalendario[Data])'); return calculate([a[0], { k: 'call', name: 'DATESQTD', args: [a[1]], pos: a[1].pos }].concat(a.slice(2)), env, n); },
    TOTALMTD: function (a, env, n) { need(a, 2, n, 'TOTALMTD(Expressão, dCalendario[Data])'); return calculate([a[0], { k: 'call', name: 'DATESMTD', args: [a[1]], pos: a[1].pos }].concat(a.slice(2)), env, n); },
    // informações do contexto
    SELECTEDVALUE: function (a, env, n) {
      need(a, 1, n, 'SELECTEDVALUE(Tabela[Coluna], [Alternativo])');
      const v = Array.from(new Set(colValues(a[0], env, 'SELECTEDVALUE').map(keyOf)));
      if (v.length === 1) { const c = colArg(a[0]); const i = rowsOf(c.t.lk, env.ctx)[0]; return c.t.rows[i][c.ci]; }
      return a[1] ? ev(a[1], env) : null;
    },
    HASONEVALUE: function (a, env, n) { need(a, 1, n, 'HASONEVALUE(Tabela[Coluna])'); return new Set(colValues(a[0], env, 'HASONEVALUE').map(keyOf)).size === 1; },
    ISFILTERED: function (a, env) {
      if (a[0].k === 'col') { const c = colArg(a[0]); return env.ctx.filters.some(function (f) { return f.t === c.t.lk && (f.cols.indexOf(c.c) >= 0 || f.cols[0] === '#row'); }); }
      const t = table(a[0].name, a[0]); return env.ctx.filters.some(function (f) { return f.t === t.lk; });
    },
    ISCROSSFILTERED: function (a, env) { const t = a[0].k === 'col' ? colArg(a[0]).t : table(a[0].name, a[0]); return filteredUp(t.lk, env.ctx); },
    ISINSCOPE: function (a, env) { const c = colArg(a[0], 'ISINSCOPE'); return env.ctx.filters.some(function (f) { return f.origin === 'visual' && f.t === c.t.lk && f.cols.indexOf(c.c) >= 0; }); },
    RELATED: function (a, env, n) {
      need(a, 1, n, 'RELATED(Tabela[Coluna])');
      const c = colArg(a[0], 'RELATED');
      for (let k = env.rows.length - 1; k >= 0; k--) {
        const rc = env.rows[k];
        if (!rc.tv.src) continue;
        if (rc.tv.src.t === c.t.lk) return rc.tv.rows[rc.i][c.ci];
        if (findPath(rc.tv.src.t, c.t.lk, env.ctx)) return lookupThrough(rc.tv.src.t, rc.tv.src.idx[rc.i], c, env.ctx, n);
      }
      fail('RELATED precisa de um contexto de linha de uma tabela relacionada (por exemplo, dentro de SUMX(fVendas, …) ou numa coluna calculada de fVendas).', n);
    },
    LOOKUPVALUE: function (a, env, n) {
      need(a, 3, n, 'LOOKUPVALUE(ColunaResultado, ColunaBusca, Valor, …)');
      const rc = colArg(a[0], 'LOOKUPVALUE'), conds = [];
      for (let i = 1; i + 1 < a.length; i += 2) conds.push({ c: colArg(a[i], 'LOOKUPVALUE'), v: ev(a[i + 1], env) });
      const hits = rc.t.all.filter(function (i) { return conds.every(function (x) { return eq(rc.t.rows[i][x.c.ci], x.v); }); });
      const vals = Array.from(new Set(hits.map(function (i) { return rc.t.rows[i][rc.ci]; })));
      if (vals.length === 1) return vals[0];
      if (!vals.length) return a.length % 2 === 0 ? ev(a[a.length - 1], env) : null;
      fail('LOOKUPVALUE encontrou mais de um valor diferente.', n);
    },
    EARLIER: function (a, env, n) { return rowValue(env, a[0], a[1] ? toNum(ev(a[1], env)) : 1); },
    VALUES: function (a, env, n) { return scalar(TFN.VALUES(a, env, n), n); },
  };
  ['DATESYTD', 'FIRSTDATE', 'LASTDATE', 'STARTOFMONTH', 'ENDOFMONTH', 'STARTOFYEAR', 'ENDOFYEAR'].forEach(function (k) { if (!FN[k]) FN[k] = function (a, env, n) { return scalar(TFN[k](a, env, n), n); }; });

  /* ------------------------------ Formatação ------------------------------ */
  const nf = function (x, d) { return Number(x).toLocaleString('pt-BR', { minimumFractionDigits: d, maximumFractionDigits: d }); };
  function fmtDate(n, f) {
    const d = ymd(n), MES = F2().MESES, LONG = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
    const DIAS = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
    return f.replace(/yyyy|aaaa|yy|aa|mmmm|mmm|mm|m|dddd|ddd|dd|d/gi, function (t) {
      const k = t.toLowerCase();
      if (k === 'yyyy' || k === 'aaaa') return String(d.y);
      if (k === 'yy' || k === 'aa') return String(d.y).slice(2);
      if (k === 'mmmm') return LONG[d.m - 1];
      if (k === 'mmm') return MES[d.m - 1];
      if (k === 'mm') return String(d.m).padStart(2, '0');
      if (k === 'm') return String(d.m);
      if (k === 'dddd') return DIAS[d.wd];
      if (k === 'ddd') return DIAS[d.wd].slice(0, 3);
      if (k === 'dd') return String(d.d).padStart(2, '0');
      return String(d.d);
    });
  }
  function formatDax(v, f) {
    if (v === null) return '';
    const F = String(f);
    if (/^(yyyy|aaaa|dd|mm|mmm|mmmm|d|m|ddd|dddd|yy)([\/\- ]|$)/i.test(F) || /[dy]/i.test(F.replace(/"[^"]*"/g, '')) && !/[0#]/.test(F)) return fmtDate(toNum(v), F);
    if (/^percent$/i.test(F)) return nf(toNum(v) * 100, 2) + '%';
    if (/^currency$/i.test(F)) return 'R$ ' + nf(toNum(v), 2);
    if (/^general number$/i.test(F)) return text(v);
    const m = F.match(/^([^0#]*)([#0,.]+)(%?)(.*)$/);
    if (!m) return text(v);
    const pct = m[3] === '%';
    const dec = (m[2].split('.')[1] || '').length;
    const x = toNum(v) * (pct ? 100 : 1);
    let s = m[2].indexOf(',') >= 0 ? nf(x, dec) : (dec ? x.toFixed(dec).replace('.', ',') : String(Math.round(x)));
    return m[1].replace(/\\/g, '') + s + (pct ? '%' : '') + m[4];
  }
  function display(v, fmt) {
    if (v === null || v === undefined) return '';
    if (typeof v === 'boolean') return v ? 'Verdadeiro' : 'Falso';
    if (typeof v === 'string') return v;
    if (typeof v === 'number' && !isFinite(v)) return isNaN(v) ? 'NaN' : (v > 0 ? '∞' : '-∞');
    if (fmt === 'money') return 'R$ ' + nf(v, 2);
    if (fmt === 'pct') return nf(v * 100, 1) + '%';
    if (fmt === 'int') return nf(Math.round(v), 0);
    if (fmt === 'num') return nf(v, 2);
    if (fmt === 'date') return fmtDate(v, 'dd/mm/yyyy');
    if (Number.isInteger(v)) return Math.abs(v) < 10000 ? String(v) : nf(v, 0);
    return nf(v, 2);
  }
  function same(a, b) {
    if (a === null || b === null) return a === b || (a === null && b === null);
    if (typeof a === 'number' && typeof b === 'number') { if (!isFinite(a) || !isFinite(b)) return a === b || (isNaN(a) && isNaN(b)); return Math.abs(a - b) <= 1e-6 * Math.max(1, Math.abs(b)); }
    return a === b;
  }

  /* ---------------------------- API de avaliação ---------------------------- */
  function parseColRef(s) { const m = String(s).match(/^'?([^'\[]+)'?\[([^\]]+)\]$/); return { t: table(m[1]), c: m[2] }; }
  function slicerFilters(filters) {
    return Object.keys(filters || {}).map(function (k) {
      const r = parseColRef(k); const ci = colIndex(r.t, r.c);
      const vals = [].concat(filters[k]);
      return { t: r.t.lk, cols: [lk(r.t.cols[ci])], keys: new Set(vals.map(keyOf)), origin: 'slicer' };
    });
  }
  function msMap(extra) {
    const ms = {};
    (extra || []).forEach(function (m) { ms[lk(m.name)] = { name: m.name, ast: m.ast, src: m.src }; });
    return ms;
  }
  /**
   * Avalia uma medida num visual de matriz.
   * spec: { rows: 'Tabela[Coluna]' | null, filters: { 'Tabela[Coluna]': valor | [valores] } }
   * measure: { name, ast }   extra: outras medidas do usuário
   */
  function visual(spec, measureAst, measureName) {
    const slic = slicerFilters(spec.filters);
    const ms = msMap(measureName ? [{ name: measureName, ast: measureAst }] : []);
    const run = function (filters) {
      const env = { ctx: mkCtx(filters), rows: [], vars: {}, ms: ms, depth: 0 };
      try { const v = ev(measureAst, env); return { v: v }; }
      catch (e) { if (e instanceof DaxError) return { err: e }; throw e; }
    };
    if (!spec.rows) { const r = run(slic); return { groups: [], total: r }; }
    const g = parseColRef(spec.rows), ci = colIndex(g.t, g.c);
    const sortCol = g.t.sortBy[g.t.cols[ci]];
    const si = sortCol ? g.t.colIdx[lk(sortCol)] : ci;
    const seen = {}, vals = [];
    // só mostra valores existentes na tabela (respeitando os filtros da página)
    const base = rowsOf(g.t.lk, mkCtx(slic.filter(function (f) { return f.t === g.t.lk; })));
    base.forEach(function (i) { const v = g.t.rows[i][ci]; const k = keyOf(v); if (!(k in seen)) { seen[k] = g.t.rows[i][si]; vals.push(v); } });
    vals.sort(function (a, b) { return cmp(seen[keyOf(a)], seen[keyOf(b)]); });
    const groups = vals.map(function (v) {
      const r = run(slic.concat([{ t: g.t.lk, cols: [lk(g.t.cols[ci])], keys: new Set([keyOf(v)]), origin: 'visual' }]));
      return { label: v, v: r.v, err: r.err };
    });
    return { groups: groups, total: run(slic), rowsLabel: g.t.cols[ci], rowsType: g.t.types[g.t.cols[ci]] };
  }
  /** Coluna calculada: avalia a expressão em cada linha da tabela. */
  function column(tableName, ast) {
    const t = table(tableName);
    const tv = physical(t, t.all);
    const env = { ctx: mkCtx([]), rows: [], vars: {}, ms: {}, depth: 0 };
    return tv.rows.map(function (_, i) { return ev(ast, withRow(env, tv, i)); });
  }
  /** Tabela calculada / consulta: devolve { cols, rows }. */
  function tableExpr(ast) {
    const env = { ctx: mkCtx([]), rows: [], vars: {}, ms: {}, depth: 0 };
    const tv = evTable(ast, env);
    return { cols: tv.cols.map(function (c) { return c.name; }), rows: tv.rows.map(function (r) { return tv.cols.map(function (_, i) { return r[i]; }); }) };
  }
  /** Avalia uma expressão escalar sem filtros (cartão). */
  function scalarExpr(ast, filters) {
    const env = { ctx: mkCtx(slicerFilters(filters)), rows: [], vars: {}, ms: {}, depth: 0 };
    return ev(ast, env);
  }
  function functionsUsed(ast) {
    const out = [];
    (function walk(n) {
      if (!n || typeof n !== 'object') return;
      if (n.k === 'call') out.push(n.name);
      if (n.k === 'var') out.push('VAR');
      ['l', 'r', 'e', 'ret'].forEach(function (k) { if (n[k]) walk(n[k]); });
      (n.args || []).forEach(walk); (n.items || []).forEach(walk); (n.vars || []).forEach(function (v) { walk(v.e); });
    })(ast);
    return out;
  }
  /** Linha e coluna (1-based) de uma posição no texto. */
  function lineCol(src, pos) { const before = String(src).slice(0, pos); const lines = before.split('\n'); return { line: lines.length, col: lines[lines.length - 1].length + 1 }; }

  const FUNCTION_NAMES = Object.keys(FN).concat(Object.keys(TFN)).filter(function (v, i, a) { return a.indexOf(v) === i; }).sort();

  global.DaxEngine = {
    compile: compile, parse: parse, tokenize: tokenize, visual: visual, column: column, tableExpr: tableExpr, scalarExpr: scalarExpr,
    display: display, same: same, formatDax: formatDax, functionsUsed: functionsUsed, lineCol: lineCol, model: model,
    DaxError: DaxError, FUNCTION_NAMES: FUNCTION_NAMES, isTV: isTV, text: text,
  };
})(typeof window !== 'undefined' ? window : globalThis);
