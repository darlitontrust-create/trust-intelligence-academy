/* =====================================================================
   code-format.js — Quebra e recuo de código para leitura em caixas estreitas
   ---------------------------------------------------------------------
   Usado no slide "Exemplo resolvido" (como o exercício anterior foi
   resolvido), para a resposta caber na caixa sem barra de rolagem.
     CodeFormat.sql(src)            → uma cláusula por linha, subconsultas
                                      recuadas, listas longas quebradas
     CodeFormat.formula(src, sep)   → Excel/DAX: argumentos de funções
                                      longas um por linha, recuados
     CodeFormat.python(src)         → linhas longas quebradas dentro de
                                      parênteses, colchetes e chaves
     CodeFormat.forTrack(src, id)   → escolhe pelo tema
   Textos entre aspas nunca são alterados.
   ===================================================================== */
(function (global) {
  'use strict';
  const MAX = 46;   // caracteres por linha que cabem na caixa sem rolagem
  const sp = function (n) { return new Array(n + 1).join(' '); };

  /* ------------------------- Aspas protegidas ------------------------- */
  function mask(src, quotes) {
    const saved = [];
    let out = '', i = 0;
    while (i < src.length) {
      const c = src[i];
      if (quotes.indexOf(c) >= 0) {
        let j = i + 1;
        while (j < src.length) { if (src[j] === '\\') { j += 2; continue; } if (src[j] === c) { if (src[j + 1] === c && c !== '`') { j += 2; continue; } break; } j++; }
        const lit = src.slice(i, j + 1), id = String(saved.length); saved.push(lit);
        out += '\u0001' + id + new Array(Math.max(0, lit.length - id.length - 2) + 1).join('\u0003') + '\u0002'; i = j + 1;
      } else { out += c; i++; }
    }
    return { text: out, restore: function (s) { return s.replace(/\u0001(\d+)\u0003*\u0002/g, function (_, n) { return saved[+n]; }); } };
  }
  /** Divide no separador só no nível 0 de parênteses/colchetes/chaves. */
  function splitTop(s, seps) {
    const out = []; let depth = 0, cur = '';
    for (let i = 0; i < s.length; i++) {
      const c = s[i];
      if ('([{'.indexOf(c) >= 0) depth++;
      else if (')]}'.indexOf(c) >= 0) depth--;
      if (!depth && seps.indexOf(c) >= 0) { out.push(cur); cur = ''; continue; }
      cur += c;
    }
    out.push(cur);
    return out;
  }
  function matchClose(s, open) {
    let depth = 0;
    for (let i = open; i < s.length; i++) { if ('([{'.indexOf(s[i]) >= 0) depth++; else if (')]}'.indexOf(s[i]) >= 0) { depth--; if (!depth) return i; } }
    return -1;
  }

  /* ------------------------------- Fórmulas ------------------------------- */
  /** Quebra uma expressão longa: abre o grupo ( [ { de nível 0 mais útil e põe
      um argumento por linha, recuado; repete dentro de cada argumento. */
  function call(expr, indent, sep, max, step, inside, first) {
    step = step || 2;
    expr = expr.trim();
    if (expr.length + indent + (first || 0) <= max) return expr;
    // operadores no nível 0: quebra antes deles
    const parts = []; let depth = 0, last = 0;
    for (let i = 1; i < expr.length - 1; i++) {
      const c = expr[i];
      if ('([{'.indexOf(c) >= 0) depth++; else if (')]}'.indexOf(c) >= 0) depth--;
      else if (!depth && expr[i - 1] === ' ' && (/^(&&|\|\|)$/.test(expr.substr(i, 2)) && expr[i + 2] === ' ')) { parts.push(expr.slice(last, i).trim()); last = i; i++; }
      else if (!depth && ((/[&+\-*/]/.test(c) && expr[i - 1] === ' ' && expr[i + 1] === ' ') || (c === '&' && step === 2 && expr[i + 1] !== '&' && expr[i - 1] !== '&'))) { parts.push(expr.slice(last, i).trim()); last = i; }
    }
    if (parts.length && step === 2) {
      parts.push(expr.slice(last).trim());
      return parts.map(function (p, k) { return (k ? sp(indent + step) : '') + call(p, indent + step, sep, max, step); }).join('\n');
    }
    // grupos de nível 0
    const groups = [];
    for (let i = 0; i < expr.length; i++) {
      if ('([{'.indexOf(expr[i]) < 0) continue;
      const close = matchClose(expr, i);
      if (close < 0) break;
      const inner = expr.slice(i + 1, close);
      groups.push({ o: i, c: close, args: splitTop(inner, [sep]).filter(function (x, k, all) { return x.trim() !== '' || k < all.length - 1 || all.length === 1; }), len: inner.length });
      i = close;
    }
    // prefere o grupo com mais argumentos; empate → o maior
    let g = null;
    groups.forEach(function (x) { if (x.len < 18 && x.args.length < 3) return; if (!g || x.len > g.len) g = x; });
    if (g) {
      const head = expr.slice(0, g.o + 1), tail = expr.slice(g.c), inner = sp(indent + step);
      // SES/IFS/SWITCH/PARÂMETRO: condição e resultado na mesma linha
      const fn = (expr.slice(0, g.o).match(/([A-Za-zÀ-ÿ_.]+)$/) || ['', ''])[1].toUpperCase();
      let args = g.args.map(function (x) { return x.trim(); });
      if (/^(SES|IFS|SWITCH|PARÂMETRO|PARAMETRO)$/.test(fn) && args.length > 3) {
        const lead = /^(SES|IFS)$/.test(fn) ? [] : [args[0]], rest = /^(SES|IFS)$/.test(fn) ? args : args.slice(1), pairs = [];
        for (let k = 0; k < rest.length; k += 2) pairs.push(k + 1 < rest.length ? rest[k] + sep + ' ' + rest[k + 1] : rest[k]);
        args = lead.concat(pairs);
      }
      const body = args.length > 1
        ? args.map(function (a) { return inner + call(a, indent + step, sep, max, step, true); }).join(sep + '\n')
        : inner + call(args[0], indent + step, sep, max, step, true);
      const after = tail.slice(1), rest = after.trim() ? (/^\s/.test(after) ? ' ' : '') + call(after, indent, sep, max, step) : '';
      return head + '\n' + body + '\n' + sp(indent) + expr[g.c] + rest;
    }
    // Python, dentro de ( [ {: cadeia de métodos longa → um .método() por linha
    if (step === 4 && inside) {
      const links = []; let d = 0, from = 0;
      for (let i = 1; i < expr.length; i++) {
        const c = expr[i];
        if ('([{'.indexOf(c) >= 0) d++; else if (')]}'.indexOf(c) >= 0) d--;
        else if (!d && c === '.' && /[)\]]/.test(expr[i - 1]) && /[A-Za-z_]/.test(expr[i + 1] || '')) { links.push(expr.slice(from, i)); from = i; }
      }
      if (links.length) { links.push(expr.slice(from)); return links.map(function (l, k) { return (k ? sp(indent) : '') + l; }).join('\n'); }
      const comp = []; d = 0; from = 0;
      for (let i = 1; i < expr.length; i++) {
        const c = expr[i];
        if ('([{'.indexOf(c) >= 0) d++; else if (')]}'.indexOf(c) >= 0) d--;
        else if (!d && c === ' ' && /^ (for|if|else) /.test(expr.substr(i, 6))) { comp.push(expr.slice(from, i).trim()); from = i + 1; }
      }
      if (comp.length) { comp.push(expr.slice(from).trim()); return comp.map(function (l, k) { return (k ? sp(indent) : '') + l; }).join('\n'); }
    }
    return expr;
  }
  function formula(src, sep, max) {
    const m = mask(String(src), ['"']);
    return m.restore(formulaCore(m.text, sep, max));
  }
  function formulaCore(text, sep, max) {
    max = max || MAX;
    const lines = text.split('\n').map(function (line) {
      const lead = (line.match(/^\s*/) || [''])[0].length, body = line.trim();
      if (!body || body.length + lead <= max) return line;
      // "Nome = expressão" (DAX) ou "VAR x = expressão": a expressão vai para a mesma linha, quebrada dentro
      const eq = body.match(/^((?:VAR\s+)?[\w\s\[\]'.]*?=\s*|=\s*|RETURN\s+)(.*)$/);
      if (eq && eq[2]) return sp(lead) + eq[1] + call(eq[2], lead, sep, max, 2, false, eq[1].length);
      return sp(lead) + call(body, lead, sep, max);
    });
    return lines.join('\n');
  }

  /* --------------------------------- SQL --------------------------------- */
  const CLAUSES = ['SELECT', 'FROM', 'WHERE', 'GROUP BY', 'HAVING', 'ORDER BY', 'LIMIT', 'OFFSET', 'UNION ALL', 'UNION', 'EXCEPT', 'INTERSECT',
    'LEFT OUTER JOIN', 'RIGHT OUTER JOIN', 'FULL OUTER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'FULL JOIN', 'CROSS JOIN', 'JOIN',
    'WINDOW', 'VALUES', 'SET', 'RETURNING', 'ON CONFLICT', 'WHEN MATCHED', 'WHEN NOT MATCHED', 'USING'];
  function tokens(s) {
    const out = []; const re = /\s+|\u0001\d+\u0003*\u0002|--[^\n]*|[A-Za-z_][\w.]*|\d+(?:\.\d+)?|<>|<=|>=|!=|\|\||./g; let m;
    while ((m = re.exec(s))) if (!/^\s+$/.test(m[0])) out.push(m[0]);
    return out;
  }
  function clauseAt(tk, i) {
    for (let k = 0; k < CLAUSES.length; k++) {
      const words = CLAUSES[k].split(' ');
      let ok = true;
      for (let w = 0; w < words.length; w++) if (!tk[i + w] || tk[i + w].toUpperCase() !== words[w]) { ok = false; break; }
      if (ok) return words.length;
    }
    return 0;
  }
  function joinTokens(arr) {
    let s = '';
    arr.forEach(function (t, i) {
      const prev = arr[i - 1];
      const noSpace = !i || t === ',' || t === ')' || t === '.' || prev === '(' || prev === '.' || (t === '(' && /[\w\]]$/.test(prev || '') && !/^(IN|AS|AND|OR|ON|NOT|EXISTS|FROM|JOIN|VALUES|THEN|ELSE|WHEN|OVER|USING)$/i.test(prev));
      s += (noSpace ? '' : ' ') + t;
    });
    return s;
  }
  function sqlStmt(src, max) {
    const tk = tokens(src);
    const lines = [];   // { ind, toks }
    let cur = { ind: 0, toks: [] };
    const stack = [];   // tipo de cada parêntese aberto: 'q' (subconsulta) ou 'e' (expressão)
    let base = 0;
    const push = function (ind) { if (cur.toks.length) lines.push(cur); cur = { ind: ind, toks: [] }; };
    for (let i = 0; i < tk.length; i++) {
      const t = tk[i], up = t.toUpperCase();
      const inExpr = stack.length && stack[stack.length - 1] === 'e';
      if (t === '(') {
        const isQ = /^(SELECT|WITH)$/i.test(tk[i + 1] || '');
        const dl = isQ && /^(SELECT|WHERE|HAVING|SET|ON|AND|OR)$/i.test(cur.toks[0] || '') ? 4 : 2;
        stack.push(isQ ? dl : 'e');
        cur.toks.push(t);
        if (isQ) { base += dl; push(base); }
        continue;
      }
      if (t === ')') {
        const kind = stack.pop();
        if (kind !== 'e' && kind != null) { base -= kind; push(base + kind - 2); }
        cur.toks.push(t);
        continue;
      }
      const n = inExpr ? 0 : clauseAt(tk, i);
      if (n && (cur.toks.length || lines.length)) {
        push(base);
        for (let w = 0; w < n; w++) cur.toks.push(tk[i + w].toUpperCase());
        i += n - 1;
        continue;
      }
      if (!inExpr && /^(AND|OR)$/.test(up) && cur.toks.length && /^(WHERE|HAVING|ON|AND|OR|JOIN)$/i.test(cur.toks[0]) === false && /\bJOIN$/i.test(cur.toks.slice(0, 3).join(' ')) === false) {
        // AND/OR de WHERE/HAVING: decidido na segunda passada (quebra se a linha ficar longa)
      }
      cur.toks.push(t);
    }
    push(0);
    // segunda passada: linhas longas → quebra em vírgulas (listas) ou AND/OR (condições)
    const out = [];
    lines.forEach(function (ln) {
      const text = joinTokens(ln.toks);
      if (text.length + ln.ind <= max) { out.push(sp(ln.ind) + text); return; }
      const head = ln.toks[0] ? ln.toks[0].toUpperCase() : '';
      const kw = (text.match(/^(SELECT(?: DISTINCT)?|GROUP BY|ORDER BY|VALUES|SET|PARTITION BY)\s+/i) || [])[0];
      if (kw) {
        const items = splitTop(text.slice(kw.length), [',']);
        if (items.length > 1) {
          out.push(sp(ln.ind) + kw.trim());
          items.forEach(function (it, k) { out.push(sp(ln.ind + 2) + formulaCore(it.trim(), ',', max - ln.ind - 2).replace(/\n/g, '\n' + sp(ln.ind + 2)) + (k < items.length - 1 ? ',' : '')); });
          return;
        }
      }
      if (/^(WHERE|HAVING|ON|.*JOIN)$/i.test(head) || /JOIN\b/i.test(text.slice(0, 22))) {
        // quebra antes de AND/OR no nível 0
        const pieces = []; let depth = 0, last = 0;
        const re = /\(|\)|\bAND\b|\bOR\b|\bON\b/gi; let m;
        while ((m = re.exec(text))) {
          if (m[0] === '(') depth++; else if (m[0] === ')') depth--;
          else if (!depth && m.index > 0 && (m[0].toUpperCase() !== 'ON' || /JOIN/i.test(text.slice(0, m.index)))) { pieces.push(text.slice(last, m.index).trim()); last = m.index; }
        }
        pieces.push(text.slice(last).trim());
        if (pieces.length > 1) { pieces.forEach(function (p, k) { out.push(sp(ln.ind + (k ? 2 : 0)) + p); }); return; }
      }
      out.push(sp(ln.ind) + formulaCore(text, ',', max - ln.ind).replace(/\n/g, '\n' + sp(ln.ind)));
    });
    return caseLines(out.join('\n').split('\n'), max).join('\n');
  }
  /** CASE longo: um WHEN/ELSE por linha. */
  function caseLines(lines, max) {
    const res = [];
    lines.forEach(function (line) {
      if (line.length <= max || !/\bCASE\b/.test(line) || !/\bEND\b/.test(line)) { res.push(line); return; }
      const ind = sp((line.match(/^\s*/) || [''])[0].length);
      line.replace(/\s+(?=(?:WHEN|ELSE)\b)/g, '\n' + ind + '  ').replace(/\s+(?=END\b)/g, '\n' + ind).split('\n').forEach(function (l) { res.push(l); });
    });
    return res;
  }
  function stmts(text, max) {
    return splitTop(text, [';']).map(function (s) { return s.trim(); }).filter(Boolean).map(function (s) { return sqlStmt(s, max); });
  }
  function sql(src, max) {
    max = max || MAX;
    const m = mask(String(src), ["'", '"']);
    let text = m.text, out = [];
    // CREATE TRIGGER … BEGIN corpo; END; → corpo recuado entre BEGIN e END
    const re = /CREATE\s+TRIGGER\b([\s\S]*?)\bBEGIN\b([\s\S]*?)\bEND\s*;?/i;
    let t;
    while ((t = re.exec(text))) {
      out = out.concat(stmts(text.slice(0, t.index), max).map(function (x) { return x + ';'; }));
      const head = ('CREATE TRIGGER' + t[1]).replace(/\s+/g, ' ').trim().replace(/\s+(?=(?:BEFORE|AFTER|INSTEAD OF|ON|FOR EACH ROW|WHEN)\b)/g, '\n  ');
      out.push(head + '\nBEGIN\n' + stmts(t[2], max - 2).map(function (x) { return '  ' + x.replace(/\n/g, '\n  ') + ';'; }).join('\n') + '\nEND;');
      text = text.slice(t.index + t[0].length);
    }
    const rest = stmts(text, max);
    out = out.concat(rest.map(function (x, k) { return x + (k < rest.length - 1 || /;\s*$/.test(text) ? ';' : ''); }));
    return m.restore(out.join('\n'));
  }

  /* -------------------------------- Python -------------------------------- */
  /** Python aceita quebra de linha dentro de ( [ { — quebra só ali. */
  function python(src, max) {
    max = max || MAX;
    const m = mask(String(src), ["'", '"']);
    const lines = m.text.split('\n').map(function (line) {
      if (line.length <= max || /^\s*#/.test(line)) return line;
      const lead = (line.match(/^\s*/) || [''])[0].length;
      const body = line.trim(), colon = /:$/.test(body) ? ':' : '';
      const core = colon ? body.slice(0, -1) : body;
      const eq = core.match(/^([\w\[\]"'.\u0001\u0002\d, ]+?\s*[+\-*/]?=\s*)(.+)$/);
      const pre = eq && !/==/.test(eq[1] + eq[2].slice(0, 1)) ? eq[1] : '';
      const out = call(core.slice(pre.length), lead + pre.length > lead + 20 ? lead : lead, ',', max, 4);
      if (out.indexOf('\n') < 0) return line;
      return sp(lead) + pre + out.replace(/\n/g, '\n' + (pre && false ? '' : '')) + colon;
    });
    return m.restore(lines.join('\n'));
  }

  function forTrack(src, track) {
    try {
      if (!track || track === 'sql') return sql(src);
      if (track === 'excel') return formula(src, ';');
      if (track === 'powerbi') return formula(src, ',');
      if (track === 'python') return python(src);
    } catch (e) { /* em caso de dúvida, mantém o original */ }
    return src;
  }

  global.CodeFormat = { sql: sql, formula: formula, python: python, forTrack: forTrack, MAX: MAX };
})(typeof window !== 'undefined' ? window : globalThis);
