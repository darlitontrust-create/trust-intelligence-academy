/* =====================================================================
   excel-engine.js — Motor de fórmulas no estilo Excel (pt-BR)
   ---------------------------------------------------------------------
   • Fórmulas em português com argumentos separados por ";" (vírgula é
     decimal). Nomes em inglês também funcionam (SUM, VLOOKUP, IF...).
     Acentos são opcionais: MEDIA = MÉDIA.
   • Referências A1, $A$1, intervalos A2:A31, colunas inteiras A:A e
     outras planilhas (Produtos!A2:D16 ou 'Minha Planilha'!A1).
   • "Arrastar para baixo": a fórmula escrita na linha N é recalculada
     nas linhas seguintes ajustando referências sem $.
   • Matrizes dinâmicas: FILTRO, CLASSIFICAR, ÚNICO, SEQUÊNCIA... o
     resultado "despeja" (spill) em várias células.
   • Erros como no Excel: #DIV/0!, #N/D, #VALOR!, #NOME?, #REF!, #NÚM!, #CALC!
   • Datas são números seriais (1 = 01/01/1900). HOJE() é fixo em
     30/06/2026 para que os exercícios tenham resposta estável.
   ===================================================================== */
(function (global) {
  'use strict';

  /* ------------------------------- Erros ------------------------------- */
  function XErr(code, msg) { this.code = code; this.msg = msg || ''; }
  XErr.prototype.toString = function () { return this.code; };
  const isErr = function (v) { return v instanceof XErr; };
  const E = {
    div0: function () { return new XErr('#DIV/0!', 'Divisão por zero.'); },
    na: function (m) { return new XErr('#N/D', m || 'Valor não encontrado.'); },
    value: function (m) { return new XErr('#VALOR!', m || 'Tipo de valor inválido.'); },
    name: function (m) { return new XErr('#NOME?', m || 'Nome não reconhecido.'); },
    ref: function (m) { return new XErr('#REF!', m || 'Referência inválida.'); },
    num: function (m) { return new XErr('#NÚM!', m || 'Número inválido.'); },
    calc: function (m) { return new XErr('#CALC!', m || 'Resultado vazio.'); },
  };
  /** Erro de digitação da fórmula (não é um valor de célula). */
  function SyntaxErr(msg, pos) { this.msg = msg; this.pos = pos; }

  /* ------------------------------- Datas ------------------------------- */
  const BASE = Date.UTC(1899, 11, 30);
  function serial(y, m, d) { return Math.round((Date.UTC(y, m - 1, d) - BASE) / 86400000); }
  function fromSerial(n) { const d = new Date(BASE + Math.floor(n) * 86400000); return { y: d.getUTCFullYear(), m: d.getUTCMonth() + 1, d: d.getUTCDate(), wd: d.getUTCDay() }; }
  const TODAY = serial(2026, 6, 30);
  const MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
  const DIAS = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];

  /* ------------------------------ Colunas ------------------------------ */
  function colNum(s) { let n = 0; for (const ch of s.toUpperCase()) n = n * 26 + (ch.charCodeAt(0) - 64); return n; }
  function colName(n) { let s = ''; while (n > 0) { const m = (n - 1) % 26; s = String.fromCharCode(65 + m) + s; n = Math.floor((n - 1) / 26); } return s; }
  const strip = function (s) { return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase(); };

  /* ------------------------------ Tokenizer ------------------------------ */
  const REF_RE = /^(?:('(?:[^']|'')+'|[A-Za-zÀ-ÿ_][\wÀ-ÿ.]*)!)?(\$?)([A-Za-z]{1,3})(\$?)(\d+)(?::(\$?)([A-Za-z]{1,3})(\$?)(\d+))?/;
  const COLRANGE_RE = /^(?:('(?:[^']|'')+'|[A-Za-zÀ-ÿ_][\wÀ-ÿ.]*)!)?(\$?)([A-Za-z]{1,3}):(\$?)([A-Za-z]{1,3})(?![\w(])/;
  function tokenize(src) {
    const out = []; let i = 0;
    while (i < src.length) {
      const ch = src[i], rest = src.slice(i);
      if (/\s/.test(ch)) { i++; continue; }
      if (ch === '"') {
        let j = i + 1, s = '';
        while (true) {
          if (j >= src.length) throw new SyntaxErr('Texto sem aspas de fechamento.', i);
          if (src[j] === '"') { if (src[j + 1] === '"') { s += '"'; j += 2; continue; } break; }
          s += src[j++];
        }
        out.push({ t: 'str', v: s, p: i }); i = j + 1; continue;
      }
      let m;
      if ((m = rest.match(/^\d+(?:[.,]\d+)?(?:[eE][+-]?\d+)?/)) && !/^[A-Za-z]/.test(rest.slice(m[0].length)) ) {
        out.push({ t: 'num', v: parseFloat(m[0].replace(',', '.')), p: i }); i += m[0].length; continue;
      }
      if ((m = rest.match(COLRANGE_RE))) {
        out.push({ t: 'ref', v: { sheet: m[1] ? m[1].replace(/^'|'$/g, '').replace(/''/g, "'") : null, c1: colNum(m[3]), r1: 1, ac1: !!m[2], ar1: true, c2: colNum(m[5]), r2: 1048576, ac2: !!m[4], ar2: true, colRange: true }, p: i });
        i += m[0].length; continue;
      }
      if ((m = rest.match(REF_RE)) && !/^[\w(]/.test(rest.slice(m[0].length))) {
        const v = { sheet: m[1] ? m[1].replace(/^'|'$/g, '').replace(/''/g, "'") : null, c1: colNum(m[3]), r1: +m[5], ac1: !!m[2], ar1: !!m[4] };
        if (m[7]) Object.assign(v, { c2: colNum(m[7]), r2: +m[9], ac2: !!m[6], ar2: !!m[8] });
        out.push({ t: 'ref', v: v, p: i }); i += m[0].length; continue;
      }
      if ((m = rest.match(/^[A-Za-zÀ-ÿ_][\wÀ-ÿ.]*/))) {
        const word = m[0], after = src.slice(i + word.length).match(/^\s*\(/);
        if (after) { out.push({ t: 'fn', v: word, p: i }); i += word.length; continue; }
        const W = strip(word);
        if (W === 'VERDADEIRO' || W === 'TRUE') { out.push({ t: 'bool', v: true, p: i }); i += word.length; continue; }
        if (W === 'FALSO' || W === 'FALSE') { out.push({ t: 'bool', v: false, p: i }); i += word.length; continue; }
        out.push({ t: 'name', v: word, p: i }); i += word.length; continue;
      }
      if ((m = rest.match(/^(<=|>=|<>)/))) { out.push({ t: 'op', v: m[1], p: i }); i += 2; continue; }
      if ('+-*/^&=<>%'.indexOf(ch) >= 0) { out.push({ t: 'op', v: ch, p: i }); i++; continue; }
      if (ch === '(' || ch === ')') { out.push({ t: ch, p: i }); i++; continue; }
      if (ch === ';') { out.push({ t: ';', p: i }); i++; continue; }
      if (ch === '{' || ch === '}') { out.push({ t: ch, p: i }); i++; continue; }
      if (ch === ',') throw new SyntaxErr('No Excel em português os argumentos são separados por ponto e vírgula (;). A vírgula é usada só em números decimais, como 0,15.', i);
      throw new SyntaxErr('Caractere inesperado: "' + ch + '".', i);
    }
    return out;
  }

  /* -------------------------------- Parser -------------------------------- */
  function parse(src) {
    const toks = tokenize(src); let k = 0;
    const peek = function () { return toks[k]; };
    const next = function () { return toks[k++]; };
    const expectT = function (t, msg) { const x = next(); if (!x || x.t !== t) throw new SyntaxErr(msg, x ? x.p : src.length); return x; };
    function cmp() {
      let l = concat();
      while (peek() && peek().t === 'op' && ['=', '<>', '<', '>', '<=', '>='].indexOf(peek().v) >= 0) { const op = next().v; l = { k: 'bin', op: op, l: l, r: concat() }; }
      return l;
    }
    function concat() { let l = add(); while (peek() && peek().t === 'op' && peek().v === '&') { next(); l = { k: 'bin', op: '&', l: l, r: add() }; } return l; }
    function add() { let l = mul(); while (peek() && peek().t === 'op' && (peek().v === '+' || peek().v === '-')) { const op = next().v; l = { k: 'bin', op: op, l: l, r: mul() }; } return l; }
    function mul() { let l = pow(); while (peek() && peek().t === 'op' && (peek().v === '*' || peek().v === '/')) { const op = next().v; l = { k: 'bin', op: op, l: l, r: pow() }; } return l; }
    function pow() { let l = unary(); while (peek() && peek().t === 'op' && peek().v === '^') { next(); l = { k: 'bin', op: '^', l: l, r: unary() }; } return l; }
    function unary() {
      if (peek() && peek().t === 'op' && (peek().v === '-' || peek().v === '+')) { const op = next().v; const e = unary(); return op === '-' ? { k: 'neg', e: e } : e; }
      return postfix();
    }
    function postfix() { let e = primary(); while (peek() && peek().t === 'op' && peek().v === '%') { next(); e = { k: 'pct', e: e }; } return e; }
    function primary() {
      const x = next();
      if (!x) throw new SyntaxErr('A fórmula terminou antes do esperado. Faltou completar um argumento ou fechar um parêntese?', src.length);
      if (x.t === 'num') return { k: 'num', v: x.v };
      if (x.t === 'str') return { k: 'str', v: x.v };
      if (x.t === 'bool') return { k: 'bool', v: x.v };
      if (x.t === 'ref') return { k: 'ref', v: x.v, p: x.p };
      if (x.t === 'name') return { k: 'name', v: x.v, p: x.p };
      if (x.t === '(') { const e = cmp(); expectT(')', 'Faltou fechar um parêntese.'); return e; }
      if (x.t === '{') {
        const rows = [[]];
        while (true) {
          const v = next();
          if (!v) throw new SyntaxErr('Matriz constante sem }.', src.length);
          if (v.t === '}') break;
          if (v.t === ';') { rows.push([]); continue; }
          if (v.t === 'op' && v.v === '-') { const n = next(); rows[rows.length - 1].push(-n.v); continue; }
          rows[rows.length - 1].push(v.v);
        }
        return { k: 'arr', v: rows };
      }
      if (x.t === 'fn') {
        expectT('(', 'Faltou abrir parêntese depois de ' + x.v + '.');
        const args = [];
        if (peek() && peek().t === ')') { next(); return { k: 'fn', name: x.v, args: args, p: x.p }; }
        while (true) {
          if (peek() && (peek().t === ';' || peek().t === ')')) args.push({ k: 'empty' });
          else args.push(cmp());
          const sep = next();
          if (!sep) throw new SyntaxErr('Faltou fechar o parêntese de ' + x.v + '.', src.length);
          if (sep.t === ')') break;
          if (sep.t !== ';') throw new SyntaxErr('Esperava ";" ou ")" nos argumentos de ' + x.v + '.', sep.p);
        }
        return { k: 'fn', name: x.v, args: args, p: x.p };
      }
      throw new SyntaxErr('Trecho inesperado na fórmula.', x.p);
    }
    const ast = cmp();
    if (k < toks.length) throw new SyntaxErr('Há algo sobrando na fórmula depois de uma expressão completa. Faltou um operador ou um ";"?', toks[k].p);
    return ast;
  }

  /* ---------------------------- Valores e coerção ---------------------------- */
  function Range(sheet, c1, r1, c2, r2, wb) { this.sheet = sheet; this.c1 = c1; this.r1 = r1; this.c2 = c2; this.r2 = r2; this.wb = wb; }
  Range.prototype.values = function () {
    const sh = this.wb.sheets[this.sheet];
    const r2 = Math.min(this.r2, sh.maxRow()), c2 = Math.min(this.c2, sh.maxCol());
    const out = [];
    for (let r = this.r1; r <= Math.max(r2, this.r1); r++) {
      const row = [];
      for (let c = this.c1; c <= Math.max(c2, this.c1); c++) row.push(sh.get(c, r));
      out.push(row);
    }
    return out;
  };
  const isRange = function (v) { return v instanceof Range; };
  const isArr = function (v) { return Array.isArray(v); };
  function toArr(v) { if (isRange(v)) return v.values(); if (isArr(v)) return v; return [[v]]; }
  function flat(v) { return toArr(v).reduce(function (a, r) { return a.concat(r); }, []); }
  /** Valor escalar (intervalo de uma célula vira o valor; matriz vira o 1º item). */
  function scalar(v) {
    if (isRange(v)) { const a = v.values(); return a.length === 1 && a[0].length === 1 ? a[0][0] : a; }
    return v;
  }
  function parseNumText(s) {
    const t = String(s).trim();
    if (/^-?\d+(?:[.,]\d+)?%?$/.test(t)) { let n = parseFloat(t.replace(',', '.')); if (t.endsWith('%')) n /= 100; return n; }
    if (/^-?\d{1,3}(\.\d{3})+(,\d+)?$/.test(t)) return parseFloat(t.replace(/\./g, '').replace(',', '.'));
    let m;
    if ((m = t.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/))) return serial(+m[3], +m[2], +m[1]);
    return null;
  }
  function num(v) {
    v = scalar(v);
    if (isArr(v)) v = v[0][0];
    if (isErr(v)) throw v;
    if (typeof v === 'number') return v;
    if (typeof v === 'boolean') return v ? 1 : 0;
    if (v === null || v === undefined || v === '') return 0;
    const n = parseNumText(v);
    if (n === null) throw E.value('O texto "' + v + '" não pode ser usado como número.');
    return n;
  }
  function fmtGeneral(n) {
    if (Number.isInteger(n)) return String(n);
    return String(Math.round(n * 1e10) / 1e10).replace('.', ',');
  }
  function str(v) {
    v = scalar(v);
    if (isArr(v)) v = v[0][0];
    if (isErr(v)) throw v;
    if (v === null || v === undefined) return '';
    if (typeof v === 'boolean') return v ? 'VERDADEIRO' : 'FALSO';
    if (typeof v === 'number') return fmtGeneral(v);
    return String(v);
  }
  function bool(v) {
    v = scalar(v);
    if (isArr(v)) v = v[0][0];
    if (isErr(v)) throw v;
    if (typeof v === 'boolean') return v;
    if (typeof v === 'number') return v !== 0;
    if (v === null || v === '') return false;
    const S = strip(String(v));
    if (S === 'VERDADEIRO' || S === 'TRUE') return true;
    if (S === 'FALSO' || S === 'FALSE') return false;
    throw E.value('O texto "' + v + '" não é um valor lógico.');
  }
  /** Comparação no estilo Excel: números < textos < lógicos; texto sem diferenciar maiúsculas. */
  function cmpVals(a, b) {
    if (isErr(a)) throw a; if (isErr(b)) throw b;
    if (a === null || a === undefined) a = typeof b === 'string' ? '' : (typeof b === 'boolean' ? false : 0);
    if (b === null || b === undefined) b = typeof a === 'string' ? '' : (typeof a === 'boolean' ? false : 0);
    const rank = function (x) { return typeof x === 'number' ? 0 : typeof x === 'string' ? 1 : 2; };
    if (rank(a) !== rank(b)) return rank(a) - rank(b);
    if (typeof a === 'string') { const x = a.toLowerCase(), y = b.toLowerCase(); return x < y ? -1 : x > y ? 1 : 0; }
    return a < b ? -1 : a > b ? 1 : 0;
  }

  /** Aplica uma função elemento a elemento (com "broadcast" de linha/coluna). */
  function broadcast(a, b, fn) {
    a = scalar(a); b = scalar(b);
    if (!isArr(a) && !isArr(b)) return fn(a, b);
    const A = toArr(a), B = toArr(b);
    const rows = Math.max(A.length, B.length), cols = Math.max(A[0].length, B[0].length);
    const out = [];
    for (let r = 0; r < rows; r++) {
      const row = [];
      for (let c = 0; c < cols; c++) {
        const x = A.length === 1 ? A[0] : A[r], y = B.length === 1 ? B[0] : B[r];
        if (!x || !y) { row.push(E.na()); continue; }
        const xv = x.length === 1 ? x[0] : x[c], yv = y.length === 1 ? y[0] : y[c];
        if (xv === undefined || yv === undefined) { row.push(E.na()); continue; }
        try { row.push(fn(xv, yv)); } catch (e) { if (isErr(e)) row.push(e); else throw e; }
      }
      out.push(row);
    }
    return out;
  }
  function map1(a, fn) {
    a = scalar(a);
    if (!isArr(a)) return fn(a);
    return a.map(function (r) { return r.map(function (x) { try { return fn(x); } catch (e) { if (isErr(e)) return e; throw e; } }); });
  }

  /* ------------------------------ Critérios ------------------------------ */
  function wildRe(p) {
    let s = '';
    for (let i = 0; i < p.length; i++) {
      const ch = p[i];
      if (ch === '~' && i + 1 < p.length) { s += p[++i].replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); continue; }
      if (ch === '*') s += '.*'; else if (ch === '?') s += '.'; else s += ch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    return new RegExp('^' + s + '$', 'i');
  }
  /** Converte um critério ("Sul", ">100", "<>Cancelado", 5) em teste. */
  function criterion(c) {
    c = scalar(c);
    if (isErr(c)) throw c;
    if (typeof c === 'number' || typeof c === 'boolean') return function (v) { return typeof v === typeof c ? v === c : (typeof c === 'number' && typeof v === 'string' && parseNumText(v) === c); };
    let s = c === null ? '' : String(c), op = '=';
    const m = s.match(/^(<=|>=|<>|=|<|>)/);
    if (m) { op = m[1]; s = s.slice(m[1].length); }
    const n = s !== '' ? parseNumText(s) : null;
    if (n !== null) {
      return function (v) {
        if (typeof v !== 'number') { if (op === '<>') return true; return false; }
        return op === '=' ? v === n : op === '<>' ? v !== n : op === '<' ? v < n : op === '>' ? v > n : op === '<=' ? v <= n : v >= n;
      };
    }
    if (op === '=' || op === '<>') {
      if (s === '') return function (v) { const empty = v === null || v === ''; return op === '=' ? empty : !empty; };
      const re = wildRe(s);
      return function (v) { const ok = typeof v === 'string' && re.test(v); return op === '=' ? ok : !ok; };
    }
    return function (v) {
      if (typeof v !== 'string') return false;
      const r = v.toLowerCase() < s.toLowerCase() ? -1 : v.toLowerCase() > s.toLowerCase() ? 1 : 0;
      return op === '<' ? r < 0 : op === '>' ? r > 0 : op === '<=' ? r <= 0 : r >= 0;
    };
  }
  /** Máscara de linhas que atendem a pares (intervalo, critério). Critério matricial gera várias máscaras. */
  function multiMask(pairs) {
    const ranges = pairs.map(function (p) { return flat(p[0]); });
    const n = ranges[0].length;
    if (ranges.some(function (r) { return r.length !== n; })) throw E.value('Os intervalos de critério precisam ter o mesmo tamanho.');
    const tests = pairs.map(function (p) { return criterion(p[1]); });
    const mask = [];
    for (let i = 0; i < n; i++) mask.push(tests.every(function (t, j) { return t(ranges[j][i]); }));
    return mask;
  }
  /** Executa fn para cada combinação quando algum critério é matriz (SOMASES com ÚNICO, por exemplo). */
  function withArrayCriteria(critArgs, fn) {
    const arrIdx = critArgs.findIndex(function (c) { c = scalar(c); return isArr(c); });
    if (arrIdx < 0) return fn(critArgs);
    const A = toArr(scalar(critArgs[arrIdx]));
    return A.map(function (row) { return row.map(function (x) { const cs = critArgs.slice(); cs[arrIdx] = x; try { return fn(cs); } catch (e) { if (isErr(e)) return e; throw e; } }); });
  }

  /* --------------------------- Estatística/ajuda --------------------------- */
  function numsOf(args, countText) {
    const out = [];
    args.forEach(function (a) {
      if (isRange(a) || isArr(scalar(a))) {
        flat(a).forEach(function (v) { if (isErr(v)) throw v; if (typeof v === 'number') out.push(v); });
      } else if (a !== undefined) {
        const v = scalar(a);
        if (v === null && !countText) return;
        out.push(num(v));
      }
    });
    return out;
  }
  const sum = function (a) { return a.reduce(function (s, x) { return s + x; }, 0); };
  function mean(a) { if (!a.length) throw E.div0(); return sum(a) / a.length; }
  function variance(a, sample) { if (a.length < (sample ? 2 : 1)) throw E.div0(); const m = mean(a); return sum(a.map(function (x) { return (x - m) * (x - m); })) / (a.length - (sample ? 1 : 0)); }
  function percentile(a, p) {
    if (!a.length) throw E.num(); if (p < 0 || p > 1) throw E.num();
    const s = a.slice().sort(function (x, y) { return x - y; });
    const h = (s.length - 1) * p, lo = Math.floor(h);
    return s[lo] + (h - lo) * ((s[lo + 1] !== undefined ? s[lo + 1] : s[lo]) - s[lo]);
  }
  function round(x, d) { const f = Math.pow(10, d); return Math.round(x * f + (x >= 0 ? 1e-9 : -1e-9)) / f; }

  /* ------------------------------ Formatação ------------------------------ */
  function thousands(s) { return s.replace(/\B(?=(\d{3})+(?!\d))/g, '.'); }
  /** TEXTO(): formatos comuns de número e data. */
  function textFormat(v, fmt) {
    const f = String(fmt);
    if (/[dma]|y/i.test(f.replace(/"[^"]*"/g, '')) && !/^[#0.,%R$\s]+$/.test(f)) {
      const d = fromSerial(num(v));
      return f.replace(/dddd|ddd|dd|d|mmmm|mmm|mm|m|aaaa|yyyy|aa|yy/gi, function (t) {
        const T = t.toLowerCase();
        if (T === 'dddd') return DIAS[d.wd];
        if (T === 'ddd') return DIAS[d.wd].slice(0, 3);
        if (T === 'dd') return String(d.d).padStart(2, '0');
        if (T === 'd') return String(d.d);
        if (T === 'mmmm') return MESES[d.m - 1];
        if (T === 'mmm') return MESES[d.m - 1].slice(0, 3);
        if (T === 'mm') return String(d.m).padStart(2, '0');
        if (T === 'm') return String(d.m);
        if (T === 'aaaa' || T === 'yyyy') return String(d.y);
        return String(d.y).slice(2);
      });
    }
    let n = num(v);
    const pct = f.indexOf('%') >= 0; if (pct) n *= 100;
    const m = f.match(/^([^#0]*)([#0.]*)(,(0+))?([^#0]*)$/);
    if (!m) return fmtGeneral(n);
    const dec = m[4] ? m[4].length : 0;
    const intPart = m[2] || '0';
    const useThousands = intPart.indexOf('.') >= 0;
    const minInt = (intPart.replace(/[#.]/g, '').length) || (intPart.indexOf('0') >= 0 ? 1 : 0);
    const neg = n < 0; n = Math.abs(n);
    let s = round(n, dec).toFixed(dec);
    let [ip, dp] = s.split('.');
    if (minInt > 1) ip = ip.padStart(minInt, '0');
    if (!minInt && ip === '0' && dec) ip = '';
    if (useThousands) ip = thousands(ip);
    return (neg ? '-' : '') + m[1] + ip + (dec ? ',' + dp : '') + m[5].replace(/\\/g, '');
  }

  /* ------------------------------- Funções ------------------------------- */
  const F = {};
  /** Registra uma função com nome pt-BR e aliases. lazy = recebe AST dos argumentos. */
  function def(names, fn, lazy) { names.split('|').forEach(function (n) { F[strip(n)] = { fn: fn, lazy: !!lazy, name: names.split('|')[0] }; }); }
  const opt = function (a, d) { return a === undefined || (a && a.empty) ? d : a; };

  // matemática
  def('SOMA|SUM', function () { return sum(numsOf([].slice.call(arguments))); });
  def('MÉDIA|AVERAGE', function () { return mean(numsOf([].slice.call(arguments))); });
  def('MÁXIMO|MAX', function () { const a = numsOf([].slice.call(arguments)); return a.length ? Math.max.apply(null, a) : 0; });
  def('MÍNIMO|MIN', function () { const a = numsOf([].slice.call(arguments)); return a.length ? Math.min.apply(null, a) : 0; });
  def('CONT.NÚM|COUNT', function () { let n = 0; [].slice.call(arguments).forEach(function (a) { flat(a).forEach(function (v) { if (typeof v === 'number') n++; }); }); return n; });
  def('CONT.VALORES|COUNTA', function () { let n = 0; [].slice.call(arguments).forEach(function (a) { flat(a).forEach(function (v) { if (v !== null && v !== '') n++; }); }); return n; });
  def('CONTAR.VAZIO|COUNTBLANK', function (a) { return flat(a).filter(function (v) { return v === null || v === ''; }).length; });
  def('ARRED|ROUND', function (x, d) { return map1(x, function (v) { return round(num(v), num(opt(d, 0))); }); });
  def('ARREDONDAR.PARA.CIMA|ROUNDUP', function (x, d) { const f = Math.pow(10, num(opt(d, 0))); return map1(x, function (v) { v = num(v); return Math.sign(v) * Math.ceil(Math.abs(v) * f - 1e-9) / f; }); });
  def('ARREDONDAR.PARA.BAIXO|ROUNDDOWN', function (x, d) { const f = Math.pow(10, num(opt(d, 0))); return map1(x, function (v) { v = num(v); return Math.sign(v) * Math.floor(Math.abs(v) * f + 1e-9) / f; }); });
  def('INT', function (x) { return map1(x, function (v) { return Math.floor(num(v)); }); });
  def('ABS', function (x) { return map1(x, function (v) { return Math.abs(num(v)); }); });
  def('MOD', function (a, b) { return broadcast(a, b, function (x, y) { x = num(x); y = num(y); if (y === 0) throw E.div0(); return x - y * Math.floor(x / y); }); });
  def('POTÊNCIA|POWER', function (a, b) { return broadcast(a, b, function (x, y) { return Math.pow(num(x), num(y)); }); });
  def('RAIZ|SQRT', function (x) { return map1(x, function (v) { v = num(v); if (v < 0) throw E.num(); return Math.sqrt(v); }); });
  def('SOMARPRODUTO|SUMPRODUCT', function () {
    const arrs = [].slice.call(arguments).map(function (a) { return flat(scalar(a)); });
    const n = arrs[0].length;
    if (arrs.some(function (a) { return a.length !== n; })) throw E.value('As matrizes de SOMARPRODUTO precisam ter o mesmo tamanho.');
    let s = 0;
    for (let i = 0; i < n; i++) { let p = 1; arrs.forEach(function (a) { const v = a[i]; if (isErr(v)) throw v; p *= typeof v === 'number' ? v : typeof v === 'boolean' ? (arrs.length === 1 ? 0 : (v ? 1 : 0)) : 0; }); s += p; }
    return s;
  });
  def('MAIOR|LARGE', function (a, k) { const s = numsOf([a]).sort(function (x, y) { return y - x; }); const i = num(k); if (i < 1 || i > s.length) throw E.num(); return s[i - 1]; });
  def('MENOR|SMALL', function (a, k) { const s = numsOf([a]).sort(function (x, y) { return x - y; }); const i = num(k); if (i < 1 || i > s.length) throw E.num(); return s[i - 1]; });
  def('ORDEM|ORDEM.EQ|RANK|RANK.EQ', function (x, ref, ord) {
    const a = numsOf([ref]); const asc = num(opt(ord, 0)) !== 0;
    return map1(x, function (v) { v = num(v); if (a.indexOf(v) < 0) throw E.na('O valor não está na lista do ranking.'); return 1 + a.filter(function (y) { return asc ? y < v : y > v; }).length; });
  });
  def('MED|MEDIAN', function () { return percentile(numsOf([].slice.call(arguments)), 0.5); });
  def('MODO|MODO.ÚNICO|MODE|MODE.SNGL', function () {
    const a = numsOf([].slice.call(arguments)); const c = {}; let best = null, bc = 1;
    a.forEach(function (v) { c[v] = (c[v] || 0) + 1; if (c[v] > bc) { bc = c[v]; best = v; } });
    if (best === null) throw E.na('Nenhum valor se repete.'); return best;
  });
  def('DESVPAD|DESVPAD.A|STDEV|STDEV.S', function () { return Math.sqrt(variance(numsOf([].slice.call(arguments)), true)); });
  def('DESVPADP|DESVPAD.P|STDEVP|STDEV.P', function () { return Math.sqrt(variance(numsOf([].slice.call(arguments)), false)); });
  def('VAR|VAR.A|VAR.S', function () { return variance(numsOf([].slice.call(arguments)), true); });
  def('VARP|VAR.P', function () { return variance(numsOf([].slice.call(arguments)), false); });
  def('PERCENTIL|PERCENTIL.INC|PERCENTILE|PERCENTILE.INC', function (a, p) { return percentile(numsOf([a]), num(p)); });
  def('QUARTIL|QUARTIL.INC|QUARTILE|QUARTILE.INC', function (a, q) { const k = num(q); if (k < 0 || k > 4) throw E.num(); return percentile(numsOf([a]), k / 4); });
  def('CORREL', function (a, b) {
    const x = flat(a), y = flat(b); if (x.length !== y.length) throw E.na();
    const px = [], py = []; x.forEach(function (v, i) { if (typeof v === 'number' && typeof y[i] === 'number') { px.push(v); py.push(y[i]); } });
    const mx = mean(px), my = mean(py); let sxy = 0, sxx = 0, syy = 0;
    px.forEach(function (v, i) { sxy += (v - mx) * (py[i] - my); sxx += (v - mx) * (v - mx); syy += (py[i] - my) * (py[i] - my); });
    if (!sxx || !syy) throw E.div0(); return sxy / Math.sqrt(sxx * syy);
  });

  // condicionais de agregação
  def('CONT.SE|COUNTIF', function (r, c) { return withArrayCriteria([c], function (cs) { return multiMask([[r, cs[0]]]).filter(Boolean).length; }); });
  def('CONT.SES|COUNTIFS', function () {
    const a = [].slice.call(arguments); const crit = a.filter(function (_, i) { return i % 2 === 1; });
    return withArrayCriteria(crit, function (cs) { return multiMask(cs.map(function (c, i) { return [a[i * 2], c]; })).filter(Boolean).length; });
  });
  function condAgg(valRange, pairsFn, agg) {
    const vals = flat(valRange);
    return function (cs) {
      const mask = multiMask(pairsFn(cs));
      const picked = []; mask.forEach(function (ok, i) { if (ok) { const v = vals[i]; if (isErr(v)) throw v; if (typeof v === 'number') picked.push(v); } });
      return agg(picked);
    };
  }
  const aggSum = sum, aggAvg = function (p) { if (!p.length) throw E.div0('Nenhuma linha atende ao critério.'); return mean(p); };
  const aggMax = function (p) { return p.length ? Math.max.apply(null, p) : 0; }, aggMin = function (p) { return p.length ? Math.min.apply(null, p) : 0; };
  def('SOMASE|SUMIF', function (r, c, s) { return withArrayCriteria([c], condAgg(opt(s, r), function (cs) { return [[r, cs[0]]]; }, aggSum)); });
  def('MÉDIASE|AVERAGEIF', function (r, c, s) { return withArrayCriteria([c], condAgg(opt(s, r), function (cs) { return [[r, cs[0]]]; }, aggAvg)); });
  function ifsAgg(agg) {
    return function () {
      const a = [].slice.call(arguments), target = a[0], rest = a.slice(1);
      const crit = rest.filter(function (_, i) { return i % 2 === 1; });
      return withArrayCriteria(crit, condAgg(target, function (cs) { return cs.map(function (c, i) { return [rest[i * 2], c]; }); }, agg));
    };
  }
  def('SOMASES|SUMIFS', ifsAgg(aggSum));
  def('MÉDIASES|AVERAGEIFS', ifsAgg(aggAvg));
  def('MÁXIMOSES|MAXIFS', ifsAgg(aggMax));
  def('MÍNIMOSES|MINIFS', ifsAgg(aggMin));

  // lógicas (algumas avaliam argumentos só quando precisam)
  def('SE|IF', function (args, ev) {
    const t = scalar(ev(args[0]));
    if (isArr(t)) {
      const a = ev(args[1] || { k: 'bool', v: true }), b = args[2] && args[2].k !== 'empty' ? ev(args[2]) : false;
      return broadcast(t, broadcast(a, b, function (x, y) { return [x, y]; }), function (tv, pair) { return bool(tv) ? pair[0] : pair[1]; });
    }
    if (bool(t)) return args[1] && args[1].k !== 'empty' ? ev(args[1]) : 0;
    return args[2] && args[2].k !== 'empty' ? ev(args[2]) : (args.length > 2 ? 0 : false);
  }, true);
  def('E|AND', function () { let r = true; [].slice.call(arguments).forEach(function (a) { flat(a).forEach(function (v) { if (v !== null) r = bool(v) && r; }); }); return r; });
  def('OU|OR', function () { let r = false; [].slice.call(arguments).forEach(function (a) { flat(a).forEach(function (v) { if (v !== null) r = bool(v) || r; }); }); return r; });
  def('NÃO|NOT', function (a) { return map1(a, function (v) { return !bool(v); }); });
  def('SEERRO|IFERROR', function (args, ev) {
    let v;
    try { v = scalar(ev(args[0])); } catch (e) { if (isErr(e)) return ev(args[1]); throw e; }
    if (isArr(v)) { const alt = ev(args[1]); return v.map(function (r) { return r.map(function (x) { return isErr(x) ? scalar(alt) : x; }); }); }
    return isErr(v) ? ev(args[1]) : v;
  }, true);
  def('SENÃODISP|IFNA', function (args, ev) {
    try { const v = scalar(ev(args[0])); return isErr(v) && v.code === '#N/D' ? ev(args[1]) : v; }
    catch (e) { if (isErr(e) && e.code === '#N/D') return ev(args[1]); throw e; }
  }, true);
  def('SES|IFS', function (args, ev) {
    for (let i = 0; i + 1 < args.length; i += 2) if (bool(ev(args[i]))) return ev(args[i + 1]);
    throw E.na('Nenhuma condição de SES foi verdadeira. Use VERDADEIRO como última condição para o "senão".');
  }, true);
  def('PARÂMETRO|SWITCH', function (args, ev) {
    const v = scalar(ev(args[0]));
    let i = 1;
    for (; i + 1 < args.length; i += 2) if (cmpVals(v, scalar(ev(args[i]))) === 0) return ev(args[i + 1]);
    if (i < args.length) return ev(args[i]);
    throw E.na('Nenhum valor de PARÂMETRO correspondeu.');
  }, true);
  def('ESCOLHER|CHOOSE', function (args, ev) { const i = num(ev(args[0])); if (i < 1 || i >= args.length) throw E.value('Índice fora da lista de ESCOLHER.'); return ev(args[i]); }, true);
  def('ÉERRO|ISERROR', function (args, ev) { try { const v = scalar(ev(args[0])); if (isArr(v)) return map1(v, function (x) { return isErr(x); }); return isErr(v); } catch (e) { if (isErr(e)) return true; throw e; } }, true);
  /** Funções de teste (É...) avaliam o argumento capturando erros. */
  function isTest(fn) {
    return function (args, ev) {
      let v;
      try { v = scalar(ev(args[0])); } catch (e) { if (isErr(e)) return false; throw e; }
      if (isArr(v)) return map1(v, function (x) { return isErr(x) ? false : fn(x); });
      return isErr(v) ? false : fn(v);
    };
  }
  def('ÉCÉL.VAZIA|ISBLANK', isTest(function (v) { return v === null; }), true);
  def('ÉNÚM|ISNUMBER', isTest(function (v) { return typeof v === 'number'; }), true);
  def('ÉTEXTO|ISTEXT', isTest(function (v) { return typeof v === 'string'; }), true);
  def('VERDADEIRO|TRUE', function () { return true; });
  def('FALSO|FALSE', function () { return false; });

  // pesquisa
  function matchIdx(val, list, mode, fromEnd) {
    val = scalar(val); if (isErr(val)) throw val;
    const n = list.length, idx = [];
    for (let i = 0; i < n; i++) idx.push(fromEnd ? n - 1 - i : i);
    if (mode === 0 || mode === 2) {
      const re = typeof val === 'string' && (mode === 2 || /[*?]/.test(val)) ? wildRe(val) : null;
      for (const i of idx) { const v = list[i]; if (re ? (typeof v === 'string' && re.test(v)) : (v !== null && cmpVals(v, val) === 0 && typeof v === typeof val)) return i; }
      for (const i of idx) { const v = list[i]; if (!re && typeof val === 'number' && typeof v === 'string' && parseNumText(v) === val) return i; }
      return -1;
    }
    let best = -1;
    for (let i = 0; i < n; i++) {
      const v = list[i]; if (v === null || typeof v !== typeof val) continue;
      const c = cmpVals(v, val);
      if (c === 0) return i;
      if (mode === -1 && c < 0 && (best < 0 || cmpVals(v, list[best]) > 0)) best = i;
      if (mode === 1 && c > 0 && (best < 0 || cmpVals(v, list[best]) < 0)) best = i;
    }
    return best;
  }
  /** Busca aproximada (PROCV/CORRESP tipo 1): maior valor <= procurado em lista ordenada. */
  function approxIdx(val, list, desc) {
    val = scalar(val); let best = -1;
    for (let i = 0; i < list.length; i++) {
      const v = list[i]; if (v === null || typeof v !== typeof val) continue;
      const c = cmpVals(v, val);
      if (desc ? c >= 0 : c <= 0) best = i; else break;
    }
    return best;
  }
  def('PROCV|VLOOKUP', function (v, tab, col, approx) {
    const T = toArr(tab), c = num(col);
    if (c < 1 || c > T[0].length) throw E.ref('O número da coluna (' + c + ') é maior que a quantidade de colunas da tabela (' + T[0].length + ').');
    const exact = !bool(opt(approx, true));
    const keys = T.map(function (r) { return r[0]; });
    return map1(v, function (x) {
      const i = exact ? matchIdx(x, keys, 0) : approxIdx(x, keys);
      if (i < 0) throw E.na('PROCV não encontrou "' + str(x) + '" na primeira coluna da tabela.');
      return T[i][c - 1];
    });
  });
  def('PROCH|HLOOKUP', function (v, tab, row, approx) {
    const T = toArr(tab), r = num(row);
    if (r < 1 || r > T.length) throw E.ref();
    const exact = !bool(opt(approx, true));
    const i = exact ? matchIdx(v, T[0], 0) : approxIdx(v, T[0]);
    if (i < 0) throw E.na('PROCH não encontrou o valor na primeira linha.');
    return T[r - 1][i];
  });
  def('PROCX|XLOOKUP', function (args, ev) {
    const val = ev(args[0]), look = toArr(ev(args[1])), ret = toArr(ev(args[2]));
    const nf = args[3] && args[3].k !== 'empty' ? args[3] : null;
    const mode = args[4] && args[4].k !== 'empty' ? num(ev(args[4])) : 0;
    const sm = args[5] && args[5].k !== 'empty' ? num(ev(args[5])) : 1;
    const vertical = look[0].length === 1;
    const list = vertical ? look.map(function (r) { return r[0]; }) : look[0];
    const pick = function (i) {
      if (vertical) { if (ret.length !== list.length) throw E.value('A matriz de retorno precisa ter o mesmo número de linhas da matriz de pesquisa.'); return ret[i].length === 1 ? ret[i][0] : [ret[i]]; }
      return ret.length === 1 ? ret[0][i] : ret.map(function (r) { return [r[i]]; });
    };
    const one = function (x) {
      const i = matchIdx(x, list, mode, sm === -1);
      if (i < 0) { if (nf) return scalar(ev(nf)); throw E.na('PROCX não encontrou "' + str(x) + '".'); }
      return pick(i);
    };
    const v = scalar(val);
    if (isArr(v)) return v.map(function (r) { return r.map(function (x) { try { const y = one(x); return isArr(y) ? y[0][0] : y; } catch (e) { if (isErr(e)) return e; throw e; } }); });
    return one(v);
  }, true);
  def('CORRESP|MATCH', function (v, arr, type) {
    const list = flat(arr), t = num(opt(type, 1));
    return map1(v, function (x) {
      const i = t === 0 ? matchIdx(x, list, 0) : approxIdx(x, list, t < 0);
      if (i < 0) throw E.na('CORRESP não encontrou "' + str(x) + '".');
      return i + 1;
    });
  });
  def('CORRESPX|XMATCH', function (v, arr, mode, sm) {
    const list = flat(arr);
    return map1(v, function (x) { const i = matchIdx(x, list, num(opt(mode, 0)), num(opt(sm, 1)) === -1); if (i < 0) throw E.na(); return i + 1; });
  });
  def('ÍNDICE|INDEX', function (arr, row, col) {
    const A = toArr(arr), R = A.length, Cn = A[0].length;
    const noCol = col === undefined || (col && col.empty);
    let r = num(opt(row, 0)), c = noCol ? null : num(col);
    if (noCol) { if (Cn === 1) c = 1; else if (R === 1) { c = r; r = 1; } else c = 0; }
    if (r < 0 || c < 0 || r > R || c > Cn) throw E.ref('Posição fora do intervalo do ÍNDICE.');
    if (r === 0) return A.map(function (x) { return [x[c - 1]]; });
    if (c === 0) return [A[r - 1]];
    return A[r - 1][c - 1];
  });
  def('LIN|ROW', function (args, ev, ctx) { if (!args.length) return ctx.row; const v = ev(args[0], true); if (isRange(v)) { if (v.r1 === v.r2) return v.r1; const out = []; for (let r = v.r1; r <= Math.min(v.r2, v.wb.sheets[v.sheet].maxRow()); r++) out.push([r]); return out; } throw E.value(); }, true);
  def('COL|COLUMN', function (args, ev, ctx) { if (!args.length) return ctx.col; const v = ev(args[0], true); if (isRange(v)) return v.c1; throw E.value(); }, true);
  def('LINS|ROWS', function (a) { return toArr(a).length; });
  def('COLS|COLUMNS', function (a) { return toArr(a)[0].length; });

  // texto
  def('CONCATENAR|CONCATENATE', function () { return [].slice.call(arguments).map(str).join(''); });
  def('CONCAT', function () { return [].slice.call(arguments).map(function (a) { return flat(a).map(str).join(''); }).join(''); });
  def('UNIRTEXTO|TEXTJOIN', function (d, ign, ...rest) {
    const sep = str(d), skip = bool(ign); const parts = [];
    rest.forEach(function (a) { flat(a).forEach(function (v) { const s = str(v); if (!(skip && s === '')) parts.push(s); }); });
    return parts.join(sep);
  });
  def('ESQUERDA|LEFT', function (t, n) { return map1(t, function (v) { return str(v).slice(0, num(opt(n, 1))); }); });
  def('DIREITA|RIGHT', function (t, n) { return map1(t, function (v) { const s = str(v), k = num(opt(n, 1)); return k ? s.slice(-k) : ''; }); });
  def('EXT.TEXTO|MID', function (t, s, n) { return map1(t, function (v) { const st = num(s); if (st < 1) throw E.value(); return str(v).substr(st - 1, num(n)); }); });
  def('NÚM.CARACT|LEN', function (t) { return map1(t, function (v) { return str(v).length; }); });
  def('MAIÚSCULA|UPPER', function (t) { return map1(t, function (v) { return str(v).toUpperCase(); }); });
  def('MINÚSCULA|LOWER', function (t) { return map1(t, function (v) { return str(v).toLowerCase(); }); });
  def('PRI.MAIÚSCULA|PROPER', function (t) { return map1(t, function (v) { return str(v).toLowerCase().replace(/(^|[^a-zà-ÿ])([a-zà-ÿ])/g, function (m, a, b) { return a + b.toUpperCase(); }); }); });
  def('ARRUMAR|TRIM', function (t) { return map1(t, function (v) { return str(v).replace(/ +/g, ' ').trim(); }); });
  def('LOCALIZAR|SEARCH', function (f, t, s) {
    return map1(t, function (v) { const st = num(opt(s, 1)); const re = wildRe('*'), x = str(v).toLowerCase(), y = str(f).toLowerCase(); void re; const i = x.indexOf(y, st - 1); if (i < 0) throw E.value('O texto procurado não foi encontrado.'); return i + 1; });
  });
  def('PROCURAR|FIND', function (f, t, s) { return map1(t, function (v) { const i = str(v).indexOf(str(f), num(opt(s, 1)) - 1); if (i < 0) throw E.value('O texto procurado não foi encontrado.'); return i + 1; }); });
  def('SUBSTITUIR|SUBSTITUTE', function (t, a, b, n) {
    return map1(t, function (v) {
      const s = str(v), x = str(a), y = str(b);
      if (!x) return s;
      if (n === undefined || (n && n.empty)) return s.split(x).join(y);
      let k = num(n), i = -1;
      while (k-- > 0) { i = s.indexOf(x, i + 1); if (i < 0) return s; }
      return s.slice(0, i) + y + s.slice(i + x.length);
    });
  });
  def('MUDAR|REPLACE', function (t, s, n, nv) { return map1(t, function (v) { const x = str(v), st = num(s) - 1; return x.slice(0, st) + str(nv) + x.slice(st + num(n)); }); });
  def('TEXTO|TEXT', function (v, f) { return map1(v, function (x) { return textFormat(x, str(f)); }); });
  def('VALOR|VALUE', function (t) { return map1(t, function (v) { if (typeof v === 'number') return v; const n = parseNumText(str(v)); if (n === null) throw E.value('"' + str(v) + '" não é um número.'); return n; }); });
  def('REPT', function (t, n) { return str(t).repeat(Math.max(0, num(n))); });
  def('EXATO|EXACT', function (a, b) { return broadcast(a, b, function (x, y) { return str(x) === str(y); }); });
  def('TEXTOANTES|TEXTBEFORE', function (t, d, n) {
    return map1(t, function (v) {
      const s = str(v), dl = str(d); let k = num(opt(n, 1)), i = -1;
      if (k > 0) { while (k-- > 0) { i = s.indexOf(dl, i + 1); if (i < 0) throw E.na('Delimitador não encontrado.'); } }
      else { i = s.length; while (k++ < 0) { i = s.lastIndexOf(dl, i - 1); if (i < 0) throw E.na('Delimitador não encontrado.'); } }
      return s.slice(0, i);
    });
  });
  def('TEXTODEPOIS|TEXTAFTER', function (t, d, n) {
    return map1(t, function (v) {
      const s = str(v), dl = str(d); let k = num(opt(n, 1)), i = -1;
      if (k > 0) { while (k-- > 0) { i = s.indexOf(dl, i + 1); if (i < 0) throw E.na('Delimitador não encontrado.'); } }
      else { i = s.length; while (k++ < 0) { i = s.lastIndexOf(dl, i - 1); if (i < 0) throw E.na('Delimitador não encontrado.'); } }
      return s.slice(i + dl.length);
    });
  });

  // datas
  def('HOJE|TODAY', function () { return TODAY; });
  def('DATA|DATE', function (y, m, d) {
    const Y = num(y), M = num(m), D = num(d);
    return Math.round((Date.UTC(Y, M - 1, D) - BASE) / 86400000);
  });
  def('ANO|YEAR', function (a) { return map1(a, function (v) { return fromSerial(num(v)).y; }); });
  def('MÊS|MONTH', function (a) { return map1(a, function (v) { return fromSerial(num(v)).m; }); });
  def('DIA|DAY', function (a) { return map1(a, function (v) { return fromSerial(num(v)).d; }); });
  def('DIA.DA.SEMANA|WEEKDAY', function (a, t) {
    const tp = num(opt(t, 1));
    return map1(a, function (v) { const w = fromSerial(num(v)).wd; return tp === 2 ? (w === 0 ? 7 : w) : tp === 3 ? (w === 0 ? 6 : w - 1) : w + 1; });
  });
  def('DATADIF|DATEDIF', function (s, e, u) {
    const a = fromSerial(num(s)), b = fromSerial(num(e)), unit = strip(str(u));
    if (num(s) > num(e)) throw E.num('A data inicial precisa ser menor que a final.');
    let months = (b.y - a.y) * 12 + (b.m - a.m); if (b.d < a.d) months--;
    if (unit === 'Y') return Math.floor(months / 12);
    if (unit === 'M') return months;
    if (unit === 'D') return num(e) - num(s);
    if (unit === 'YM') return months % 12;
    if (unit === 'MD') { let d = b.d - a.d; if (d < 0) { const prev = new Date(Date.UTC(b.y, b.m - 1, 0)).getUTCDate(); d += prev; } return d; }
    if (unit === 'YD') { let x = serial(b.y, a.m, a.d); if (x > num(e)) x = serial(b.y - 1, a.m, a.d); return num(e) - x; }
    throw E.num('Unidade inválida. Use "Y", "M", "D", "YM", "MD" ou "YD".');
  });
  function isWork(n, hol) { const w = fromSerial(n).wd; return w !== 0 && w !== 6 && hol.indexOf(n) < 0; }
  def('DIATRABALHOTOTAL|NETWORKDAYS', function (s, e, h) {
    const a = num(s), b = num(e), hol = h === undefined ? [] : numsOf([h]);
    let n = 0; const st = Math.min(a, b), en = Math.max(a, b);
    for (let d = st; d <= en; d++) if (isWork(d, hol)) n++;
    return a <= b ? n : -n;
  });
  def('DIATRABALHO|WORKDAY', function (s, k, h) {
    let d = num(s), n = num(k); const hol = h === undefined ? [] : numsOf([h]); const step = n >= 0 ? 1 : -1;
    while (n !== 0) { d += step; if (isWork(d, hol)) n -= step; }
    return d;
  });
  def('FIMMÊS|EOMONTH', function (s, m) { return map1(s, function (v) { const d = fromSerial(num(v)); return Math.round((Date.UTC(d.y, d.m + num(m), 0) - BASE) / 86400000); }); });
  def('DATAM|EDATE', function (s, m) {
    return map1(s, function (v) {
      const d = fromSerial(num(v)); const tm = d.m - 1 + num(m);
      const y = d.y + Math.floor(tm / 12), mm = ((tm % 12) + 12) % 12;
      const last = new Date(Date.UTC(y, mm + 1, 0)).getUTCDate();
      return serial(y, mm + 1, Math.min(d.d, last));
    });
  });
  def('NÚMSEMANA|WEEKNUM', function (s, t) {
    const tp = num(opt(t, 1));
    return map1(s, function (v) {
      const n = num(v), d = fromSerial(n), jan1 = serial(d.y, 1, 1), w1 = fromSerial(jan1).wd;
      const offset = tp === 2 ? (w1 + 6) % 7 : w1;
      return Math.floor((n - jan1 + offset) / 7) + 1;
    });
  });
  def('DIAS|DAYS', function (e, s) { return num(e) - num(s); });

  // matrizes dinâmicas
  def('FILTRO|FILTER', function (args, ev) {
    const A = toArr(ev(args[0])), inc = toArr(scalar(ev(args[1])));
    const byRow = inc.length === A.length;
    const keep = byRow ? inc.map(function (r) { return bool(r[0]); }) : inc[0].map(bool);
    let out;
    if (byRow) out = A.filter(function (_, i) { return keep[i]; });
    else out = A.map(function (r) { return r.filter(function (_, i) { return keep[i]; }); });
    if (!out.length || !out[0].length) {
      if (args[2] && args[2].k !== 'empty') return ev(args[2]);
      throw E.calc('FILTRO não encontrou nenhuma linha. Use o 3º argumento para definir o que mostrar quando ficar vazio.');
    }
    return out;
  }, true);
  function sortRows(A, keys) {
    return A.map(function (r, i) { return { r: r, i: i }; }).sort(function (x, y) {
      for (const k of keys) { const c = cmpVals(k.vals[x.i], k.vals[y.i]) * k.ord; if (c) return c; }
      return x.i - y.i;
    }).map(function (o) { return o.r; });
  }
  def('CLASSIFICAR|SORT', function (a, idx, ord) {
    const A = toArr(a), c = num(opt(idx, 1)), o = num(opt(ord, 1));
    if (c < 1 || c > A[0].length) throw E.value('Índice de classificação fora da matriz.');
    return sortRows(A, [{ vals: A.map(function (r) { return r[c - 1]; }), ord: o >= 0 ? 1 : -1 }]);
  });
  def('CLASSIFICARPOR|SORTBY', function (a, ...rest) {
    const A = toArr(a), keys = [];
    for (let i = 0; i < rest.length; i += 2) {
      const vals = flat(rest[i]); if (vals.length !== A.length) throw E.value('A matriz de classificação precisa ter o mesmo número de linhas.');
      keys.push({ vals: vals, ord: num(opt(rest[i + 1], 1)) >= 0 ? 1 : -1 });
    }
    return sortRows(A, keys);
  });
  def('ÚNICO|UNIQUE', function (a, byCol, once) {
    const A = toArr(a), only = bool(opt(once, false));
    const key = function (r) { return r.map(function (v) { return typeof v === 'string' ? 's:' + v.toLowerCase() : typeof v + ':' + v; }).join('\u0001'); };
    const count = {}; A.forEach(function (r) { const k = key(r); count[k] = (count[k] || 0) + 1; });
    const seen = {}; const out = [];
    A.forEach(function (r) { const k = key(r); if (seen[k]) return; seen[k] = 1; if (!only || count[k] === 1) out.push(r); });
    if (!out.length) throw E.calc();
    return out;
  });
  def('SEQUÊNCIA|SEQUENCE', function (r, c, s, st) {
    const R = num(r), C = num(opt(c, 1)), S = num(opt(s, 1)), P = num(opt(st, 1)); const out = [];
    for (let i = 0; i < R; i++) { const row = []; for (let j = 0; j < C; j++) row.push(S + (i * C + j) * P); out.push(row); }
    return out;
  });
  def('TRANSPOR|TRANSPOSE', function (a) { const A = toArr(a); return A[0].map(function (_, j) { return A.map(function (r) { return r[j]; }); }); });
  def('LET', function (args, ev, ctx) {
    if (args.length < 3 || args.length % 2 === 0) throw E.value('LET precisa de pares nome; valor e, no final, o cálculo.');
    const env = Object.create(ctx.env || null);
    const sub = Object.assign({}, ctx, { env: env });
    for (let i = 0; i + 1 < args.length; i += 2) {
      if (args[i].k !== 'name') throw E.value('Em LET, os nomes vêm sem aspas (ex.: LET(total; SOMA(A1:A5); total*2)).');
      env[strip(args[i].v)] = ev(args[i + 1], false, sub);
    }
    return ev(args[args.length - 1], false, sub);
  }, true);

  // financeiras
  def('PGTO|PMT', function (r, n, pv, fv, t) {
    const R = num(r), N = num(n), PV = num(pv), FV = num(opt(fv, 0)), T = num(opt(t, 0));
    if (R === 0) return -(PV + FV) / N;
    const q = Math.pow(1 + R, N);
    return -(R * (PV * q + FV)) / ((1 + R * T) * (q - 1));
  });
  def('VF|FV', function (r, n, pmt, pv, t) {
    const R = num(r), N = num(n), P = num(pmt), PV = num(opt(pv, 0)), T = num(opt(t, 0));
    if (R === 0) return -(PV + P * N);
    const q = Math.pow(1 + R, N);
    return -(PV * q + P * (1 + R * T) * (q - 1) / R);
  });
  def('VP|PV', function (r, n, pmt, fv, t) {
    const R = num(r), N = num(n), P = num(pmt), FV = num(opt(fv, 0)), T = num(opt(t, 0));
    if (R === 0) return -(FV + P * N);
    const q = Math.pow(1 + R, N);
    return -(FV + P * (1 + R * T) * (q - 1) / R) / q;
  });

  const FUNCTION_NAMES = Array.from(new Set(Object.values(F).map(function (f) { return f.name; }))).sort();

  /* ------------------------------ Avaliação ------------------------------ */
  function resolveSheet(name, ctx) {
    if (!name) return ctx.sheet;
    const want = strip(name);
    const found = Object.keys(ctx.wb.sheets).find(function (s) { return strip(s) === want; });
    if (!found) throw E.ref('A planilha "' + name + '" não existe.');
    return found;
  }
  function evalNode(n, ctx, keepRange) {
    switch (n.k) {
      case 'num': return n.v;
      case 'str': return n.v;
      case 'bool': return n.v;
      case 'empty': return { empty: true };
      case 'arr': return n.v;
      case 'name': {
        const key = strip(n.v);
        if (ctx.env && key in ctx.env) return ctx.env[key];
        throw E.name('O nome "' + n.v + '" não é uma função nem uma variável conhecida.');
      }
      case 'ref': {
        const v = n.v, dr = ctx.dr || 0;
        const sheet = resolveSheet(v.sheet, ctx);
        const r1 = v.ar1 ? v.r1 : v.r1 + dr, c1 = v.c1;
        if (r1 < 1) throw E.ref();
        if (v.c2 === undefined) {
          if (keepRange) return new Range(sheet, c1, r1, c1, r1, ctx.wb);
          return ctx.wb.sheets[sheet].get(c1, r1);
        }
        const r2 = v.colRange ? v.r2 : (v.ar2 ? v.r2 : v.r2 + dr);
        return new Range(sheet, Math.min(c1, v.c2), v.colRange ? 1 : Math.min(r1, r2), Math.max(c1, v.c2), v.colRange ? 1048576 : Math.max(r1, r2), ctx.wb);
      }
      case 'neg': return map1(evalNode(n.e, ctx), function (x) { return -num(x); });
      case 'pct': return map1(evalNode(n.e, ctx), function (x) { return num(x) / 100; });
      case 'bin': {
        const a = evalNode(n.l, ctx), b = evalNode(n.r, ctx);
        const op = n.op;
        return broadcast(a, b, function (x, y) {
          if (isErr(x)) throw x; if (isErr(y)) throw y;
          switch (op) {
            case '+': return num(x) + num(y);
            case '-': return num(x) - num(y);
            case '*': return num(x) * num(y);
            case '/': { const d = num(y); if (d === 0) throw E.div0(); return num(x) / d; }
            case '^': return Math.pow(num(x), num(y));
            case '&': return str(x) + str(y);
            case '=': return cmpVals(x, y) === 0;
            case '<>': return cmpVals(x, y) !== 0;
            case '<': return cmpVals(x, y) < 0;
            case '>': return cmpVals(x, y) > 0;
            case '<=': return cmpVals(x, y) <= 0;
            case '>=': return cmpVals(x, y) >= 0;
          }
        });
      }
      case 'fn': {
        const f = F[strip(n.name)];
        if (!f) throw E.name('A função ' + n.name.toUpperCase() + ' não existe.' + suggest(n.name));
        const ev = function (node, keep, sub) { return evalNode(node, sub || ctx, keep); };
        if (f.lazy) return f.fn(n.args, ev, ctx);
        const vals = n.args.map(function (a) { const v = evalNode(a, ctx, true); return v; });
        return f.fn.apply(null, vals);
      }
    }
    throw E.value();
  }
  function lev(a, b) {
    const d = Array.from({ length: a.length + 1 }, function (_, i) { return [i]; });
    for (let j = 1; j <= b.length; j++) d[0][j] = j;
    for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    return d[a.length][b.length];
  }
  function suggest(name) {
    const S = strip(name); let best = null, bd = 99;
    Object.keys(F).forEach(function (k) { const x = lev(S, k); if (x < bd) { bd = x; best = F[k].name; } });
    return bd <= 2 ? ' Você quis dizer ' + best + '?' : '';
  }

  /* ------------------------------- Pastas ------------------------------- */
  /**
   * Cria uma pasta de trabalho a partir dos dados.
   * data = { Nome: { cols: ['Cabeçalho', ...], rows: [[...], ...] } }
   */
  function workbook(data) {
    const wb = { sheets: {} };
    Object.keys(data).forEach(function (name) {
      const d = data[name];
      const grid = [d.cols.slice()].concat(d.rows.map(function (r) { return r.slice(); }));
      const over = {};
      wb.sheets[name] = {
        name: name, grid: grid, over: over, formats: d.formats || {},
        get: function (c, r) {
          const k = c + ':' + r;
          if (k in over) return over[k];
          const row = grid[r - 1]; if (!row) return null;
          const v = row[c - 1]; return v === undefined ? null : v;
        },
        set: function (c, r, v) { over[c + ':' + r] = v; },
        maxRow: function () { let m = grid.length; Object.keys(over).forEach(function (k) { m = Math.max(m, +k.split(':')[1]); }); return m; },
        maxCol: function () { let m = grid[0].length; Object.keys(over).forEach(function (k) { m = Math.max(m, +k.split(':')[0]); }); return m; },
      };
    });
    return wb;
  }
  function parseAddr(a) { const m = String(a).match(/^([A-Z]{1,3})(\d+)$/i); return { c: colNum(m[1]), r: +m[2] }; }

  /**
   * Avalia uma fórmula na célula `cell` da planilha `sheet`.
   * fillTo = última linha ao "arrastar para baixo".
   * Devolve { values: [[...]] (bloco de resultados), spill: bool } ou lança SyntaxErr.
   */
  function run(data, sheet, cell, formula, fillTo) {
    const f = String(formula || '').trim();
    if (!f) throw new SyntaxErr('Digite uma fórmula começando com =.', 0);
    if (f[0] !== '=') throw new SyntaxErr('Toda fórmula começa com o sinal de igual (=). Exemplo: =SOMA(F2:F31).', 0);
    const ast = parse(f.slice(1));
    const wb = workbook(data);
    const at = parseAddr(cell);
    const sh = wb.sheets[sheet];
    const last = fillTo || at.r;
    const out = [];
    let spill = false;
    for (let r = at.r; r <= last; r++) {
      let v;
      try { v = evalNode(ast, { wb: wb, sheet: sheet, row: r, col: at.c, dr: r - at.r }); }
      catch (e) { if (isErr(e)) v = e; else throw e; }
      v = scalar(v);
      if (v && v.empty) v = 0;
      if (isArr(v)) {
        if (v.length === 1 && v[0].length === 1) v = v[0][0];
        else {
          if (r === at.r && last === at.r) { spill = true; out.push.apply(out, v); break; }
          // fórmula matricial na coluna: se o bloco cobre toda a faixa, usa-o direto
          if (r === at.r && v.length === last - at.r + 1 && v[0].length === 1) { spill = true; v.forEach(function (row) { out.push([row[0]]); }); break; }
          v = v[0][0];
        }
      }
      if (v === null) v = 0;
      sh.set(at.c, r, v);
      out.push([v]);
    }
    return { values: out, spill: spill };
  }

  /** Funções usadas em uma fórmula (nomes canônicos pt-BR). */
  function functionsUsed(formula) {
    const used = [];
    try {
      const walk = function (n) { if (!n || typeof n !== 'object') return; if (n.k === 'fn') { const f = F[strip(n.name)]; used.push(f ? f.name : n.name.toUpperCase()); n.args.forEach(walk); } ['l', 'r', 'e'].forEach(function (k) { if (n[k]) walk(n[k]); }); };
      walk(parse(String(formula).replace(/^=/, '')));
    } catch (e) { /* ignora */ }
    return used;
  }

  /* ---------------------------- Exibição de valores ---------------------------- */
  function display(v, fmt) {
    if (isErr(v)) return v.code;
    if (v === null || v === undefined) return '';
    if (typeof v === 'boolean') return v ? 'VERDADEIRO' : 'FALSO';
    if (typeof v === 'number') {
      if (fmt === 'date') return textFormat(v, 'dd/mm/aaaa');
      if (fmt === 'money') return textFormat(v, 'R$ #.##0,00');
      if (fmt === 'pct') return textFormat(v, '0,0%');
      if (fmt === 'int') return textFormat(v, '#.##0');
      if (fmt === 'num') return textFormat(v, '#.##0,00');
      return Number.isInteger(v) ? String(v) : String(Math.round(v * 10000) / 10000).replace('.', ',');
    }
    return String(v);
  }
  /** Igualdade tolerante para correção. */
  function same(a, b) {
    if (isErr(a) || isErr(b)) return isErr(a) && isErr(b) && a.code === b.code;
    if ((a === null || a === '') && (b === null || b === '')) return true;
    if (typeof a === 'number' && typeof b === 'number') return Math.abs(a - b) <= 1e-6 * Math.max(1, Math.abs(b));
    if (typeof a === 'boolean' && typeof b === 'boolean') return a === b;
    if (typeof a === 'string' && typeof b === 'string') return a === b;
    return false;
  }

  const api = {
    run: run, parse: parse, tokenize: tokenize, workbook: workbook, display: display, same: same, functionsUsed: functionsUsed,
    serial: serial, fromSerial: fromSerial, colName: colName, colNum: colNum, textFormat: textFormat,
    FUNCTION_NAMES: FUNCTION_NAMES, isErr: isErr, XErr: XErr, SyntaxErr: SyntaxErr, TODAY: TODAY, FUNCS: F, strip: strip,
  };
  global.ExcelEngine = api;
})(typeof window !== 'undefined' ? window : globalThis);
