/* =====================================================================
   dax-ui.js — Tela de prática da trilha de Power BI (DAX)
   ---------------------------------------------------------------------
   • Editor DAX com cores, sugestões (funções, tabelas, colunas e
     medidas) e dica de argumentos.
   • Resultado num visual de matriz (linhas + Total), cartão, coluna
     calculada ou tabela calculada.
   • Modelo de dados navegável: tabelas, relacionamentos e medidas.
   • Correção linha a linha contra o gabarito, com explicação.
   ===================================================================== */
(function (global) {
  'use strict';
  const { esc, icon } = global.UI;
  const X = global.DaxEngine, D = global.DaxData;

  const expCache = {};
  function expected(ex) {
    if (expCache[ex.id]) return expCache[ex.id];
    const c = X.compile(ex.q);
    return (expCache[ex.id] = evaluate(ex, c));
  }
  /** Avalia uma expressão já compilada conforme o tipo do exercício. */
  function evaluate(ex, c) {
    if (ex.kind === 'measure') return { kind: 'measure', r: X.visual(ex.v, c.ast, c.name), name: c.name };
    if (ex.kind === 'column') return { kind: 'column', vals: X.column(ex.table, c.ast), name: c.name };
    return { kind: 'table', t: X.tableExpr(c.ast), name: c.name };
  }
  function lc(src, pos) { return X.lineCol(src, pos == null ? 0 : pos); }

  /** Corrige a resposta. */
  function grade(ex, src) {
    let c;
    try { c = X.compile(src); }
    catch (e) { if (e instanceof X.DaxError) { const p = lc(src, e.pos); return { status: 'syntax', title: 'Erro de sintaxe', explain: e.msg, line: p.line, col: p.col, pos: e.pos }; } throw e; }
    let got;
    try { got = evaluate(ex, c); }
    catch (e) { if (e instanceof X.DaxError) { const p = lc(src, e.pos != null ? e.pos + 0 : 0); return { status: 'error', title: 'Erro ao calcular', explain: e.msg, line: e.pos != null ? p.line : null, col: e.pos != null ? p.col : null, pos: e.pos }; } throw e; }
    const exp = expected(ex);
    const fmt = ex.fmt;
    if (ex.kind === 'measure') {
      const errRow = got.r.groups.find(function (g) { return g.err; }) || (got.r.total.err ? { label: 'Total', err: got.r.total.err } : null);
      if (errRow) { const p = errRow.err.pos != null ? lc(src, errRow.err.pos) : null; return { status: 'error', result: got, title: 'Erro ao calcular' + (ex.v.rows ? ' na linha ' + X.display(errRow.label) : ''), explain: errRow.err.msg, line: p && p.line, col: p && p.col, pos: errRow.err.pos }; }
      const bad = [];
      exp.r.groups.forEach(function (g, i) { if (!X.same(got.r.groups[i].v, g.v)) bad.push({ label: X.display(g.label, exp.r.rowsType), u: got.r.groups[i].v, e: g.v }); });
      const totalBad = !X.same(got.r.total.v, exp.r.total.v);
      if (bad.length || totalBad) {
        const first = bad[0] || { label: 'Total', u: got.r.total.v, e: exp.r.total.v };
        let explain = (ex.v.rows ? 'Na linha ' + first.label + ' o' : 'O') + ' esperado é ' + (X.display(first.e, fmt) || '(vazio)') + ', mas a sua medida retornou ' + (X.display(first.u, fmt) || '(vazio)') + '.';
        const uv = got.r.groups.map(function (g) { return g.v; });
        if (got.r.groups.length > 1 && uv.every(function (v) { return X.same(v, uv[0]); }) && uv[0] !== null && bad.length > 1) explain += ' Todas as linhas deram o mesmo valor. Confira quais filtros a fórmula remove (ALL, REMOVEFILTERS) ou substitui (filtros do CALCULATE): eles precisam combinar com o que o visual mostra nas linhas.';
        else if (uv.every(function (v) { return v === null; }) && got.r.total.v === null) explain += ' A medida ficou vazia em todas as linhas: confira os filtros e os nomes de colunas e medidas.';
        else if (!bad.length && totalBad) explain += ' As linhas estão certas, mas o total não: lembre que o total é recalculado (não é a soma das linhas).';
        else if (bad.length > 1) explain += ' Ao todo, ' + bad.length + ' linha(s)' + (totalBad ? ' e o total' : '') + ' estão diferentes.';
        return { status: 'wrong', result: got, bad: bad.map(function (b) { return b.label; }).concat(totalBad ? ['Total'] : []), title: 'Resultado diferente do esperado', explain: explain };
      }
    } else if (ex.kind === 'column') {
      let bi = -1, n = 0;
      exp.vals.forEach(function (v, i) { if (!X.same(got.vals[i], v)) { n++; if (bi < 0) bi = i; } });
      if (n) {
        const T = D.TABLES[ex.table];
        return { status: 'wrong', result: got, badRows: n, title: 'Valores diferentes do esperado', explain: 'Na linha ' + (bi + 1) + ' de ' + ex.table + ' (' + T.cols[0] + ' ' + T.rows[bi][0] + ') o esperado é ' + (X.display(exp.vals[bi], ex.fmt) || '(vazio)') + ', mas a coluna retornou ' + (X.display(got.vals[bi], ex.fmt) || '(vazio)') + '. Ao todo, ' + n + ' linha(s) diferentes.' };
      }
    } else {
      const key = function (r) { return r.map(function (v) { return typeof v === 'number' ? Math.round(v * 1e6) / 1e6 : v; }).join('\u0001'); };
      const a = got.t.rows.map(key).sort(), b = exp.t.rows.map(key).sort();
      if (got.t.cols.length !== exp.t.cols.length) return { status: 'wrong', result: got, title: 'Colunas diferentes', explain: 'A tabela esperada tem ' + exp.t.cols.length + ' coluna(s) (' + exp.t.cols.join(', ') + '); a sua tem ' + got.t.cols.length + ' (' + got.t.cols.join(', ') + ').' };
      if (a.length !== b.length || a.some(function (x, i) { return x !== b[i]; })) return { status: 'wrong', result: got, title: 'Linhas diferentes', explain: 'A tabela esperada tem ' + b.length + ' linha(s); a sua tem ' + a.length + (a.length === b.length ? ', mas com valores diferentes.' : '.') };
    }
    const used = X.functionsUsed(c.ast);
    const missing = (ex.k || []).filter(function (k) { return used.indexOf(k) < 0; });
    if (missing.length) return { status: 'wrong', result: got, title: 'Faltou usar o que o exercício pede', explain: 'O resultado está certo, mas este exercício pede ' + missing.join(', ') + '. Reescreva usando ' + (missing.length > 1 ? 'esses recursos.' : 'esse recurso.') };
    return { status: 'correct', result: got };
  }

  /* ----------------------------- Visual ----------------------------- */
  function visualHtml(ex, res, bad) {
    if (!res) return '<div class="empty-mini">' + icon('bars') + 'Clique em Calcular para ver o resultado no visual.</div>';
    const name = res.name || (ex.kind === 'measure' ? 'Medida' : ex.kind === 'column' ? 'Nova coluna' : 'Tabela');
    const badSet = new Set(bad || []);
    if (res.kind === 'measure') {
      const r = res.r;
      if (!ex.v.rows) return '<div class="pbi-card"><small>' + esc(name) + '</small><b class="' + (badSet.has('Total') ? 'no' : '') + '">' + (esc(X.display(r.total.v, ex.fmt)) || '<span class="muted">(vazio)</span>') + '</b></div>';
      const rows = r.groups.filter(function (g) { return g.v !== null || g.err; });
      const hidden = r.groups.length - rows.length;
      return '<div class="dt"><div class="dt-scroll pbi-scroll"><table class="pbi-matrix"><thead><tr><th>' + esc(r.rowsLabel) + '</th><th class="num">' + esc(name) + '</th></tr></thead><tbody>' +
        rows.map(function (g) { const lbl = X.display(g.label, r.rowsType); return '<tr class="' + (badSet.has(lbl) ? 'no' : '') + '"><td>' + esc(lbl) + '</td><td class="num">' + (g.err ? '<span class="err">Erro</span>' : esc(X.display(g.v, ex.fmt))) + '</td></tr>'; }).join('') +
        '<tr class="tot' + (badSet.has('Total') ? ' no' : '') + '"><td>Total</td><td class="num">' + esc(X.display(r.total.v, ex.fmt)) + '</td></tr></tbody></table></div></div>' +
        (hidden ? '<p class="muted sm">' + hidden + ' linha(s) vazia(s) ocultas, como no Power BI.</p>' : '');
    }
    if (res.kind === 'column') {
      const T = D.TABLES[ex.table], cols = ex.show || T.cols.slice(0, 4), ci = cols.map(function (c) { return T.cols.indexOf(c); });
      return '<div class="dt"><div class="dt-scroll pbi-scroll"><table class="pbi-matrix"><thead><tr>' + cols.map(function (c) { return '<th>' + esc(c) + '</th>'; }).join('') + '<th class="new">' + esc(name) + '</th></tr></thead><tbody>' +
        T.rows.slice(0, 40).map(function (row, i) { return '<tr>' + ci.map(function (k, j) { return '<td>' + esc(X.display(row[k], (T.types || {})[cols[j]])) + '</td>'; }).join('') + '<td class="new">' + esc(X.display(res.vals[i], ex.fmt)) + '</td></tr>'; }).join('') +
        '</tbody></table></div></div><p class="muted sm">' + T.rows.length + ' linhas em ' + esc(ex.table) + (T.rows.length > 40 ? ' · mostrando as 40 primeiras' : '') + '.</p>';
    }
    const t = res.t, f = ex.fmts || [];
    return '<div class="dt"><div class="dt-scroll pbi-scroll"><table class="pbi-matrix"><thead><tr>' + t.cols.map(function (c) { return '<th>' + esc(c) + '</th>'; }).join('') + '</tr></thead><tbody>' +
      t.rows.slice(0, 40).map(function (r) { return '<tr>' + r.map(function (v, i) { return '<td>' + esc(X.display(v, f[i])) + '</td>'; }).join('') + '</tr>'; }).join('') +
      '</tbody></table></div></div><p class="muted sm">' + t.rows.length + ' linha(s).</p>';
  }

  /* --------------------------- Modelo de dados --------------------------- */
  function modelHtml(ex) {
    const names = Object.keys(D.TABLES);
    const first = ex.kind === 'column' ? ex.table : 'fVendas';
    return '<div class="tabs" role="tablist">' + names.map(function (t) { return '<button role="tab" class="tab' + (t === first ? ' on' : '') + '" data-mt="' + t + '">' + icon('table') + t + '</button>'; }).join('') +
      '<button role="tab" class="tab" data-mt="__rel">' + icon('share') + 'Relacionamentos</button><button role="tab" class="tab" data-mt="__ms">' + icon('sparkle') + 'Medidas</button></div>' +
      '<div id="pbi-model"></div>';
  }
  function modelPane(name) {
    if (name === '__rel') {
      return '<ul class="pbi-rels">' + D.RELATIONSHIPS.map(function (r) {
        return '<li class="' + (r.active ? '' : 'off') + '"><code>' + esc(r.to + '[' + r.toCol + ']') + '</code><span class="card">1 → N</span><code>' + esc(r.from + '[' + r.fromCol + ']') + '</code>' + (r.active ? '' : '<em>inativa</em>') + '</li>';
      }).join('') + '</ul><p class="muted sm">Os filtros fluem da dimensão (lado 1) para a fato (lado N). dCalendario está marcada como tabela de datas.</p>';
    }
    if (name === '__ms') {
      return '<ul class="pbi-measures">' + D.MEASURES.map(function (m) { return '<li><b>[' + esc(m.name) + ']</b><code>' + global.DaxLang.highlight(m.expr) + '</code><span class="muted sm">' + esc(m.desc) + '</span></li>'; }).join('') + '</ul>' +
        '<p class="muted sm">Estas medidas já existem no modelo e podem ser usadas nas suas fórmulas.</p>';
    }
    const T = D.TABLES[name], types = T.types || {};
    const tlabel = { date: 'data', money: 'moeda', pct: '%' };
    return '<p class="pbi-cols">' + T.cols.map(function (c) { return '<span class="chip-col">' + esc(c) + (types[c] ? '<small>' + tlabel[types[c]] + '</small>' : '') + '</span>'; }).join('') + '</p>' +
      '<div class="dt"><div class="dt-scroll pbi-scroll sm"><table class="pbi-mini"><thead><tr>' + T.cols.map(function (c) { return '<th class="plain">' + esc(c) + '</th>'; }).join('') + '</tr></thead><tbody>' +
      T.rows.slice(0, 6).map(function (r) { return '<tr>' + r.map(function (v, i) { return '<td>' + esc(X.display(v, types[T.cols[i]])) + '</td>'; }).join('') + '</tr>'; }).join('') +
      '</tbody></table></div></div><p class="muted sm">' + T.rows.length + ' linhas · tabela ' + esc(T.kind) + '.</p>';
  }

  /* -------------------------------- Tela -------------------------------- */
  function render(view, ex, ctx) {
    const st = ctx.st, S = ctx.S;
    const solved = st.progress.solved[ex.id];
    const xpVal = global.Gamification.XP[ex.diff];
    const kindLabel = ex.kind === 'measure' ? 'Nova medida' : ex.kind === 'column' ? 'Nova coluna em ' + ex.table : 'Nova tabela calculada';
    const filt = ex.kind === 'measure' && ex.v.filters ? Object.keys(ex.v.filters).map(function (k) { return k + ' = ' + ex.v.filters[k]; }).join(', ') : '';
    const facts = ex.kind === 'measure'
      ? '<li>' + icon('bars') + (ex.v.rows ? 'Matriz com <b>' + esc(ex.v.rows) + '</b> nas linhas' : 'Visual de <b>cartão</b>') + '</li>' + (filt ? '<li>' + icon('target') + 'Filtro da página: <b>' + esc(filt) + '</b></li>' : '')
      : ex.kind === 'column' ? '<li>' + icon('table') + 'Coluna calculada em <b>' + esc(ex.table) + '</b> (contexto de linha)</li>' : '<li>' + icon('table') + 'Tabela calculada (comparada linha a linha)</li>';

    view.innerHTML = ctx.header +
      '<div class="ex-grid pbi">' +
        '<div class="ex-brief">' +
          '<section class="card glass"><h3 class="card-k">Cenário</h3><p class="story">' + esc(ex.s) + '</p>' +
            '<div class="goal">' + icon('target') + '<div><h3 class="card-k">Objetivo da ' + (ex.kind === 'measure' ? 'medida' : ex.kind === 'column' ? 'coluna' : 'tabela') + '</h3><p>' + esc(ex.g) + '</p></div></div>' +
            '<div class="req">' + (ex.k || []).map(function (k) { return '<span class="kbd">' + esc(k) + '</span>'; }).join('') + '<span class="muted sm">' + ((ex.k || []).length ? 'funções esperadas' : 'use medidas e operadores') + '</span></div>' +
            '<ul class="xl-facts pbi-facts">' + facts + '</ul>' +
          '</section>' +
          '<section class="card glass"><header class="card-h"><h3 class="card-k">Modelo de dados</h3></header>' + modelHtml(ex) + '</section>' +
          '<section class="card glass hint-card"><header class="card-h"><h3 class="card-k">Ajuda</h3></header>' +
            '<div class="help-row"><button class="btn btn-ghost sm" id="b-hint">' + icon('bulb') + 'Ver dica</button><button class="btn btn-ghost sm" id="b-expected">' + icon('eye') + 'Resultado esperado</button><button class="btn btn-ghost sm" id="b-solution">' + icon('code') + 'Gabarito</button></div>' +
            '<div id="help-out"></div>' +
            '<p class="muted sm xl-note">Separadores: vírgula (padrão do Power BI) ou ponto e vírgula. Comece com <b>Nome = expressão</b>. HOJE = 30/06/2026.</p>' +
          '</section>' +
        '</div>' +
        '<div class="ex-work">' +
          '<section class="card glass editor-card pbi-editor">' +
            '<header class="editor-h"><span class="ed-title">' + icon('code') + esc(kindLabel) + '</span><span class="muted sm hide-sm">Tab aceita a sugestão · Ctrl+Enter calcula · Ctrl+Shift+Enter envia</span></header>' +
            '<div id="dax-editor"></div><div id="dax-sig" class="pbi-sig"></div>' +
            '<div class="editor-actions"><button class="btn btn-ghost" id="b-run">' + icon('play') + 'Calcular</button><button class="btn btn-primary" id="b-submit">' + icon('send') + 'Enviar resposta</button><button class="btn btn-quiet" id="b-clear">' + icon('eraser') + 'Limpar</button></div>' +
          '</section>' +
          '<section id="feedback" aria-live="polite"></section>' +
          '<section class="card glass result-card"><header class="card-h"><h3 class="card-k">' + (ex.kind === 'measure' ? (ex.v.rows ? 'Visual de matriz' : 'Cartão') : ex.kind === 'column' ? 'Tabela ' + esc(ex.table) : 'Tabela calculada') + '</h3><span class="muted sm" id="res-meta">' + esc(filt ? 'Filtro: ' + filt : '') + '</span></header>' +
            '<div id="pbi-out">' + visualHtml(ex, null) + '</div></section>' +
        '</div>' +
      '</div>';

    // modelo
    const pane = view.querySelector('#pbi-model');
    const paintModel = function (n) { pane.innerHTML = modelPane(n); };
    view.querySelectorAll('[data-mt]').forEach(function (b) { b.onclick = function () { view.querySelectorAll('[data-mt]').forEach(function (x) { x.classList.toggle('on', x === b); }); paintModel(b.dataset.mt); }; });
    paintModel(ex.kind === 'column' ? ex.table : 'fVendas');

    // editor
    const fb = view.querySelector('#feedback'), out = view.querySelector('#pbi-out');
    let draftTimer = null;
    const editor = global.FormulaEditor.mount(view.querySelector('#dax-editor'), {
      lang: 'dax', multiline: true, rows: 7, ariaLabel: 'Editor DAX',
      placeholder: ex.kind === 'measure' ? 'Nome da medida = expressão DAX' : ex.kind === 'column' ? 'Nome da coluna = expressão (contexto de linha)' : 'Nome da tabela = expressão de tabela',
      value: st.progress.drafts[ex.id] || (solved ? global.DaxLang.pretty(ex.q) : ''),
      sigHost: view.querySelector('#dax-sig'), ctx: {},
      onChange: function (v) { clearTimeout(draftTimer); draftTimer = setTimeout(function () { st.progress.drafts[ex.id] = v; S.save(); }, 400); },
      onRun: function () { doRun(); }, onSubmit: function () { doSubmit(); },
    });
    ctx.setCleanup(function () { clearTimeout(draftTimer); st.progress.drafts[ex.id] = editor.get(); S.save(); });

    function errorPanel(r, graded) {
      const tries = st.progress.attempts[ex.id] || 0;
      fb.innerHTML = '<div class="fb fb-err glass">' +
        '<div class="fb-h">' + icon('x') + '<div><b>❌ ' + (ex.kind === 'measure' ? 'Medida incorreta' : ex.kind === 'column' ? 'Coluna incorreta' : 'Tabela incorreta') + '</b><span>' + esc(r.title) + '</span></div>' +
        (r.line ? '<span class="pos-chip">Linha ' + r.line + ', coluna ' + r.col + '</span>' : '') + '</div>' +
        '<p class="fb-explain">' + esc(r.explain || '') + '</p>' +
        '<div class="fb-actions"><button class="btn btn-primary sm" data-a="retry">' + icon('refresh') + 'Tentar novamente</button>' +
        '<button class="btn btn-ghost sm" data-a="fix">' + icon('wrench') + 'Corrigir código</button><button class="btn btn-quiet sm" data-a="clear">' + icon('eraser') + 'Limpar editor</button></div>' +
        (graded && tries >= 2 && !st.progress.solved[ex.id] ? '<p class="fb-tip">' + icon('bulb') + (tries >= 3 ? 'Travou? A dica e o gabarito estão em Ajuda (o gabarito vale metade do XP).' : 'Experimente a dica no painel Ajuda.') + '</p>' : '') +
        '</div>';
      fb.querySelector('[data-a=retry]').onclick = doSubmit;
      fb.querySelector('[data-a=fix]').onclick = function () { if (r.pos != null) editor.select(r.pos + 1); else editor.focus(); };
      fb.querySelector('[data-a=clear]').onclick = clear;
    }
    function show(res, bad) { out.innerHTML = visualHtml(ex, res, bad); }
    function doRun() {
      const src = editor.get();
      let c; try { c = X.compile(src); } catch (e) { if (e instanceof X.DaxError) { const p = lc(src, e.pos); errorPanel({ title: 'Erro de sintaxe', explain: e.msg, line: p.line, col: p.col, pos: e.pos }, false); return; } throw e; }
      try {
        const res = evaluate(ex, c);
        const errRow = res.kind === 'measure' && (res.r.groups.find(function (g) { return g.err; }) || (res.r.total.err ? { label: 'Total', err: res.r.total.err } : null));
        if (errRow) { const p = errRow.err.pos != null ? lc(src, errRow.err.pos) : null; errorPanel({ title: 'Erro ao calcular', explain: errRow.err.msg, line: p && p.line, col: p && p.col, pos: errRow.err.pos }, false); show(res); return; }
        fb.innerHTML = ''; show(res);
      } catch (e) { if (e instanceof X.DaxError) { const p = e.pos != null ? lc(src, e.pos) : null; errorPanel({ title: 'Erro ao calcular', explain: e.msg, line: p && p.line, col: p && p.col, pos: e.pos }, false); return; } throw e; }
    }
    function doSubmit() {
      st.progress.attempts[ex.id] = (st.progress.attempts[ex.id] || 0) + 1;
      st.progress.drafts[ex.id] = editor.get();
      const r = grade(ex, editor.get());
      if (r.result) show(r.result, r.bad);
      if (r.status !== 'correct') { st.progress.firstTryStreak = 0; S.save(); errorPanel(r, true); return; }
      ctx.onSolved(fb, '✅ ' + (ex.kind === 'measure' ? 'Medida correta' : ex.kind === 'column' ? 'Coluna correta' : 'Tabela correta'), ex.kind === 'measure' ? 'Mesmo resultado do gabarito em todas as linhas e no total.' : 'Mesmo resultado do gabarito em todas as linhas.');
    }
    function clear() { editor.set(''); fb.innerHTML = ''; show(null); editor.focus(); }
    view.querySelector('#b-run').onclick = doRun;
    view.querySelector('#b-submit').onclick = doSubmit;
    view.querySelector('#b-clear').onclick = clear;

    // ajuda
    const helpOut = view.querySelector('#help-out');
    view.querySelector('#b-hint').onclick = function () {
      helpOut.innerHTML = '<p class="help-txt">' + icon('bulb') + esc(ex.h || ('Este exercício pede ' + ((ex.k || []).join(', ') || 'medidas e operadores') + '. Monte por partes e use Calcular para conferir no visual.')) + '</p>';
    };
    view.querySelector('#b-expected').onclick = function () {
      helpOut.innerHTML = '<p class="muted sm">Resultado que a sua ' + (ex.kind === 'measure' ? 'medida' : ex.kind === 'column' ? 'coluna' : 'tabela') + ' deve produzir:</p>' + visualHtml(ex, expected(ex));
    };
    view.querySelector('#b-solution').onclick = function () {
      const reveal = function () {
        st.progress.revealed[ex.id] = true; S.save();
        helpOut.innerHTML = '<pre class="code-block">' + global.DaxLang.highlight(global.DaxLang.pretty(ex.q)) + '</pre><button class="btn btn-ghost sm" id="b-copy">' + icon('copy') + 'Copiar para o editor</button>';
        helpOut.querySelector('#b-copy').onclick = function () { editor.set(global.DaxLang.pretty(ex.q)); editor.focus(); };
      };
      if (st.progress.solved[ex.id] || st.progress.revealed[ex.id]) return reveal();
      helpOut.innerHTML = '<div class="confirm"><p>Ver o gabarito reduz o XP deste exercício para <b>' + Math.round(xpVal / 2) + ' XP</b>. Deseja continuar?</p>' +
        '<div class="help-row"><button class="btn btn-primary sm" id="b-yes">Mostrar gabarito</button><button class="btn btn-quiet sm" id="b-no">Cancelar</button></div></div>';
      helpOut.querySelector('#b-yes').onclick = reveal;
      helpOut.querySelector('#b-no').onclick = function () { helpOut.innerHTML = ''; };
    };
    if (solved) setTimeout(doRun, 30);
    setTimeout(function () { editor.focus(); }, 60);
  }

  global.DaxPractice = { render: render, grade: grade, visualHtml: visualHtml };
})(window);
