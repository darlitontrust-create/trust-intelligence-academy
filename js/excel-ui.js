/* =====================================================================
   excel-ui.js — Tela de prática da trilha de Excel
   ---------------------------------------------------------------------
   • Planilha com cabeçalho de colunas (A, B, C…) e números de linha.
   • Barra de fórmulas com caixa de nome (célula de destino).
   • Executar: calcula e mostra o resultado na planilha.
   • Enviar: compara célula a célula com o gabarito e confere as
     funções obrigatórias. Erros de sintaxe mostram a posição.
   ===================================================================== */
(function (global) {
  'use strict';
  const { esc, icon } = global.UI;
  const X = global.ExcelEngine, D = global.ExcelData;

  const ERR_HELP = {
    '#NOME?': 'O Excel não reconheceu um nome. Confira a grafia da função, se um texto ficou sem aspas ou se o nome da planilha está certo.',
    '#DIV/0!': 'Houve uma divisão por zero ou por uma célula vazia.',
    '#N/D': 'O valor procurado não foi encontrado. Confira o valor de busca, o intervalo e o tipo de correspondência.',
    '#VALOR!': 'Um argumento tem o tipo errado, por exemplo um texto onde era esperado um número.',
    '#REF!': 'A fórmula aponta para uma célula ou coluna que não existe no intervalo.',
    '#NÚM!': 'O cálculo gerou um número inválido (por exemplo, datas invertidas em DATADIF).',
    '#CALC!': 'A matriz ficou vazia. Em FILTRO, use o 3º argumento para tratar esse caso.',
    '#DESPEJAR!': 'O resultado precisa de espaço livre para se espalhar.',
  };

  /** Planilhas usadas por um exercício: a principal e as citadas no gabarito. */
  function sheetsOf(ex) {
    const out = [ex.sh];
    Object.keys(D).forEach(function (name) {
      if (name !== ex.sh && (ex.q.indexOf(name + '!') >= 0 || ex.q.indexOf("'" + name + "'!") >= 0)) out.push(name);
    });
    return out;
  }
  function addr(ex) { const m = ex.c.match(/^([A-Z]+)(\d+)$/); return { col: X.colNum(m[1]), row: +m[2], letter: m[1] }; }

  function evaluate(formula, ex) {
    try { return { ok: true, r: X.run(D, ex.sh, ex.c, formula, ex.fill) }; }
    catch (e) {
      if (e instanceof X.SyntaxErr || (e && e.msg)) {
        const f = String(formula || '').trim();
        const col = !f || f[0] !== '=' ? 1 : (e.pos || 0) + 2;
        return { ok: false, syntax: true, msg: e.msg, col: col };
      }
      return { ok: false, msg: 'Não foi possível calcular esta fórmula.' };
    }
  }
  let expCache = {};
  function expected(ex) { if (!expCache[ex.id]) expCache[ex.id] = X.run(D, ex.sh, ex.c, ex.q, ex.fill); return expCache[ex.id]; }

  /** Corrige a fórmula do aluno. */
  function grade(ex, formula) {
    const got = evaluate(formula, ex);
    if (!got.ok) return { status: 'syntax', title: 'Erro de sintaxe', explain: got.msg, col: got.col };
    const exp = expected(ex).values, val = got.r.values;
    const a = addr(ex);
    if (val.length !== exp.length || (val[0] || []).length !== (exp[0] || []).length) {
      return { status: 'wrong', result: got.r, title: 'Tamanho do resultado diferente',
        explain: 'O resultado esperado ocupa ' + exp.length + ' linha(s) e ' + exp[0].length + ' coluna(s); o seu ocupa ' + val.length + ' linha(s) e ' + (val[0] || []).length + ' coluna(s). Confira os intervalos usados.' };
    }
    let bad = null, badCount = 0;
    for (let i = 0; i < exp.length; i++) for (let j = 0; j < exp[i].length; j++) {
      if (!X.same(val[i][j], exp[i][j])) { badCount++; if (!bad) bad = { i: i, j: j }; }
    }
    if (bad) {
      const v = val[bad.i][bad.j], e = exp[bad.i][bad.j];
      const cell = X.colName(a.col + bad.j) + (a.row + bad.i);
      const fmtOf = (ex.sf && ex.sf[bad.j]) || ex.fmt;
      let explain = 'Na célula ' + cell + ' o esperado é ' + (X.display(e, fmtOf) || '(vazio)') + ', mas a sua fórmula retornou ' + (X.display(v, fmtOf) || '(vazio)') + '.';
      if (X.isErr(v) && ERR_HELP[v.code]) explain += ' ' + ERR_HELP[v.code];
      else if (ex.fill && bad.i > 0) explain += ' A primeira linha está certa, mas as de baixo não: verifique se alguma referência precisava ser travada com $ (ou deixar de ser).';
      if (badCount > 1) explain += ' Ao todo, ' + badCount + ' célula(s) estão diferentes.';
      return { status: 'wrong', result: got.r, title: X.isErr(v) ? 'A fórmula retornou ' + v.code : 'Resultado diferente do esperado', explain: explain, cell: cell };
    }
    const used = X.functionsUsed(formula);
    const missing = (ex.k || []).filter(function (k) { return !used.some(function (u) { return u === k || u.indexOf(k + '.') === 0; }); });
    if (missing.length) {
      return { status: 'wrong', result: got.r, title: 'Faltou usar a função pedida',
        explain: 'O resultado está certo, mas este exercício pede o uso de ' + missing.join(', ') + '. Reescreva a fórmula usando ' + (missing.length > 1 ? 'essas funções' : 'essa função') + '.' };
    }
    return { status: 'correct', result: got.r };
  }

  /** Desenha a grade de uma planilha, com o resultado opcional na célula de destino. */
  function grid(ex, sheetName, result, status) {
    const sh = D[sheetName], fmts = sh.formats || {};
    const isTarget = sheetName === ex.sh;
    const a = addr(ex);
    const vals = isTarget && result ? result.values : null;
    const resW = vals ? (vals[0] || []).length : 1;
    const lastCol = Math.max(sh.cols.length, isTarget ? a.col + resW - 1 : 0);
    const lastRow = Math.max(sh.rows.length + 1, isTarget ? a.row + (vals ? vals.length : 1) - 1 : 0);
    let h = '<div class="xl-grid-wrap"><table class="xl-grid"><thead><tr><th class="xl-corner"></th>';
    for (let c = 1; c <= lastCol; c++) h += '<th class="' + (isTarget && c >= a.col && c < a.col + resW ? 'xl-hcol-on' : '') + '">' + X.colName(c) + '</th>';
    h += '</tr></thead><tbody>';
    for (let r = 1; r <= lastRow; r++) {
      h += '<tr><th class="xl-rn">' + r + '</th>';
      for (let c = 1; c <= lastCol; c++) {
        let cls = '', txt = '';
        const inRes = isTarget && c >= a.col && c < a.col + resW && r >= a.row && (vals ? r < a.row + vals.length : r === a.row);
        if (r === 1) {
          txt = c <= sh.cols.length ? sh.cols[c - 1] : (isTarget && c === a.col && ex.hdr ? ex.hdr : '');
          cls = 'xl-head' + (isTarget && c === a.col && c > sh.cols.length ? ' xl-head-new' : '');
        } else if (inRes) {
          cls = 'xl-res' + (status ? ' ' + status : '') + (r === a.row && c === a.col ? ' xl-active' : '');
          if (vals) { const v = vals[r - a.row][c - a.col]; txt = X.display(v, (ex.sf && ex.sf[c - a.col]) || ex.fmt); if (X.isErr(v)) cls += ' xl-err'; }
        } else if (c <= sh.cols.length && sh.rows[r - 2]) {
          const v = sh.rows[r - 2][c - 1];
          txt = X.display(v, fmts[X.colName(c)]);
          if (typeof v === 'number') cls = 'xl-num';
        }
        h += '<td class="' + cls + '">' + esc(txt) + '</td>';
      }
      h += '</tr>';
    }
    return h + '</tbody></table></div>';
  }

  function highlight(f) { return global.ExcelLessons ? global.ExcelLessons.highlightFormula(f) : esc(f); }

  /**
   * Monta a tela de prática.
   * ctx: { st, S, header, onSolved(fb), lessonBtn(), defaultHint }
   */
  function render(view, ex, ctx) {
    const st = ctx.st, S = ctx.S;
    const solved = st.progress.solved[ex.id];
    const xpVal = global.Gamification.XP[ex.diff];
    const sheets = sheetsOf(ex);
    const a = addr(ex);
    const range = ex.fill ? ex.c + ' até ' + a.letter + ex.fill : ex.c;

    view.innerHTML = ctx.header +
      '<div class="ex-grid xl">' +
        '<div class="ex-brief">' +
          '<section class="card glass"><h3 class="card-k">Cenário</h3><p class="story">' + esc(ex.s) + '</p>' +
            '<div class="goal">' + icon('target') + '<div><h3 class="card-k">Objetivo da fórmula</h3><p>' + esc(ex.g) + '</p></div></div>' +
            '<div class="req">' + (ex.k || []).map(function (k) { return '<span class="kbd">' + esc(k) + '</span>'; }).join('') + '<span class="muted sm">' + ((ex.k || []).length ? 'funções esperadas' : 'use operadores e referências') + '</span></div>' +
            '<ul class="xl-facts"><li>' + icon('table') + 'Planilha <b>' + esc(ex.sh) + '</b></li><li>' + icon('code') + 'Digite em <b>' + esc(ex.c) + '</b></li>' +
              (ex.fill ? '<li>' + icon('chevR') + 'Arrastada até <b>' + esc(a.letter + ex.fill) + '</b></li>' : '<li>' + icon('chevR') + (ex.sf || /FILTRO|CLASSIFICAR|ÚNICO|SEQUÊNCIA/i.test(ex.q) ? 'Matriz dinâmica' : 'Célula única') + '</li>') + '</ul>' +
          '</section>' +
          '<section class="card glass hint-card">' +
            '<header class="card-h"><h3 class="card-k">Ajuda</h3></header>' +
            '<div class="help-row"><button class="btn btn-ghost sm" id="b-hint">' + icon('bulb') + 'Ver dica</button><button class="btn btn-ghost sm" id="b-expected">' + icon('eye') + 'Resultado esperado</button><button class="btn btn-ghost sm" id="b-solution">' + icon('code') + 'Gabarito</button></div>' +
            '<div id="help-out"></div>' +
            '<p class="muted sm xl-note">Excel em português: argumentos separados por <b>;</b> e decimais com <b>,</b>. Nomes em inglês também são aceitos. HOJE() = 30/06/2026.</p>' +
          '</section>' +
        '</div>' +
        '<div class="ex-work">' +
          '<section class="card glass xl-card">' +
            '<div class="xl-bar"><span class="xl-name">' + esc(ex.c) + '</span><span class="xl-fx">fx</span>' +
              '<div id="xl-input" class="xl-input-host"></div></div>' +
            '<div id="xl-sig" class="xl-sig"></div>' +
            '<div id="xl-pos" class="xl-pos" aria-hidden="true"></div>' +
            '<div class="editor-actions">' +
              '<button class="btn btn-ghost" id="b-run">' + icon('play') + 'Calcular</button>' +
              '<button class="btn btn-primary" id="b-submit">' + icon('send') + 'Enviar resposta</button>' +
              '<button class="btn btn-quiet" id="b-clear">' + icon('eraser') + 'Limpar</button>' +
              '<span class="muted sm hide-sm">Enter calcula · Ctrl+Enter envia · Tab aceita a sugestão</span>' +
            '</div>' +
          '</section>' +
          '<section id="feedback" aria-live="polite"></section>' +
          '<section class="card glass result-card">' +
            '<header class="card-h"><div class="tabs" role="tablist">' + sheets.map(function (s, i) { return '<button role="tab" class="tab' + (i ? '' : ' on') + '" data-s="' + esc(s) + '">' + icon('table') + esc(s) + '</button>'; }).join('') + '</div>' +
            '<span class="muted sm" id="res-meta">Resultado em ' + esc(range) + '</span></header>' +
            '<div id="xl-sheet"></div>' +
          '</section>' +
        '</div>' +
      '</div>';

    let draftTimer = null;
    const input = global.FormulaEditor.mount(view.querySelector('#xl-input'), {
      lang: 'excel', ariaLabel: 'Barra de fórmulas', placeholder: '=SOMA(G2:G31)',
      value: st.progress.drafts[ex.id] || (solved ? ex.q : '='),
      ctx: { sheets: Object.keys(D) }, sigHost: view.querySelector('#xl-sig'),
      onChange: function (v) {
        posBox.innerHTML = ''; input.el.classList.remove('bad');
        clearTimeout(draftTimer); draftTimer = setTimeout(function () { st.progress.drafts[ex.id] = v; S.save(); }, 400);
      },
      onRun: function () { doRun(); }, onSubmit: function () { doSubmit(); },
    });
    const fb = view.querySelector('#feedback');
    const posBox = view.querySelector('#xl-pos');
    const sheetBox = view.querySelector('#xl-sheet');
    let curSheet = ex.sh, lastResult = null, lastStatus = '';

    function paint() { sheetBox.innerHTML = grid(ex, curSheet, curSheet === ex.sh ? lastResult : null, lastStatus); }
    view.querySelectorAll('[data-s]').forEach(function (b) {
      b.onclick = function () { view.querySelectorAll('[data-s]').forEach(function (x) { x.classList.toggle('on', x === b); }); curSheet = b.dataset.s; paint(); };
    });
    function showSheet(name) { const b = view.querySelector('[data-s="' + name + '"]'); if (b) b.click(); else { curSheet = name; paint(); } }
    paint();

    ctx.setCleanup(function () { clearTimeout(draftTimer); st.progress.drafts[ex.id] = input.get(); S.save(); });

    function markPos(col) {
      const f = input.get();
      posBox.innerHTML = '<code>' + esc(f.slice(0, col - 1)) + '<mark>' + esc(f.charAt(col - 1) || ' ') + '</mark>' + esc(f.slice(col)) + '</code>';
      input.el.classList.add('bad');
    }
    function errorPanel(r, graded) {
      const tries = st.progress.attempts[ex.id] || 0;
      fb.innerHTML = '<div class="fb fb-err glass">' +
        '<div class="fb-h">' + icon('x') + '<div><b>❌ Fórmula incorreta</b><span>' + esc(r.title) + '</span></div>' +
        (r.col ? '<span class="pos-chip">Posição ' + r.col + '</span>' : r.cell ? '<span class="pos-chip">Célula ' + esc(r.cell) + '</span>' : '') + '</div>' +
        '<p class="fb-explain">' + esc(r.explain || '') + '</p>' +
        '<div class="fb-actions"><button class="btn btn-primary sm" data-a="retry">' + icon('refresh') + 'Tentar novamente</button>' +
        '<button class="btn btn-ghost sm" data-a="fix">' + icon('wrench') + 'Corrigir fórmula</button>' +
        '<button class="btn btn-quiet sm" data-a="clear">' + icon('eraser') + 'Limpar</button></div>' +
        (graded && tries >= 2 && !st.progress.solved[ex.id] ? '<p class="fb-tip">' + icon('bulb') + (tries >= 3 ? 'Travou? A dica e o gabarito estão em Ajuda (o gabarito vale metade do XP).' : 'Experimente a dica no painel Ajuda.') + '</p>' : '') +
        '</div>';
      if (r.col) markPos(r.col);
      fb.querySelector('[data-a=retry]').onclick = doSubmit;
      fb.querySelector('[data-a=fix]').onclick = function () { if (r.col) input.select(r.col); else input.focus(); };
      fb.querySelector('[data-a=clear]').onclick = clear;
    }
    function doRun() {
      const g = evaluate(input.get(), ex);
      if (!g.ok) { errorPanel({ title: 'Erro de sintaxe', explain: g.msg, col: g.col }, false); return; }
      fb.innerHTML = ''; lastResult = g.r; lastStatus = ''; showSheet(ex.sh); paint();
      view.querySelector('#res-meta').textContent = 'Calculado em ' + range + (g.r.spill ? ' · matriz de ' + g.r.values.length + ' linha(s)' : '');
    }
    function doSubmit() {
      st.progress.attempts[ex.id] = (st.progress.attempts[ex.id] || 0) + 1;
      st.progress.drafts[ex.id] = input.get();
      const r = grade(ex, input.get());
      if (r.result) { lastResult = r.result; lastStatus = r.status === 'correct' ? 'ok' : 'no'; showSheet(ex.sh); paint(); }
      if (r.status !== 'correct') { st.progress.firstTryStreak = 0; S.save(); if (global.Sfx) global.Sfx.answer('no'); errorPanel(r, true); return; }
      ctx.onSolved(fb, '✅ Fórmula correta', 'Resultado igual ao esperado em todas as células.');
    }
    function clear() { input.set('='); fb.innerHTML = ''; posBox.innerHTML = ''; input.el.classList.remove('bad'); lastResult = null; lastStatus = ''; paint(); input.focus(); }
    view.querySelector('#b-run').onclick = doRun;
    view.querySelector('#b-submit').onclick = doSubmit;
    view.querySelector('#b-clear').onclick = clear;

    const helpOut = view.querySelector('#help-out');
    view.querySelector('#b-hint').onclick = function () {
      const k = (ex.k || []).join(', ');
      helpOut.innerHTML = '<p class="help-txt">' + icon('bulb') + esc(ex.h || (k ? 'Este exercício pede ' + k + '. Monte a fórmula aos poucos e use Calcular para conferir o resultado na planilha.' : 'Use referências às células da linha 2 e operadores. Clique em Calcular para conferir.')) + '</p>';
    };
    view.querySelector('#b-expected').onclick = function () {
      const vals = expected(ex).values;
      helpOut.innerHTML = '<p class="muted sm">Valores que sua fórmula deve produzir em ' + esc(range) + ':</p>' +
        '<div class="dt"><div class="dt-scroll"><table class="xl-mini"><tbody>' + vals.slice(0, 8).map(function (row, i) {
          return '<tr><td class="rn">' + (a.row + i) + '</td>' + row.map(function (v, j) { return '<td>' + esc(X.display(v, (ex.sf && ex.sf[j]) || ex.fmt)) + '</td>'; }).join('') + '</tr>';
        }).join('') + '</tbody></table></div></div>' + (vals.length > 8 ? '<p class="muted sm">… e mais ' + (vals.length - 8) + ' linha(s).</p>' : '');
    };
    view.querySelector('#b-solution').onclick = function () {
      const show = function () {
        st.progress.revealed[ex.id] = true; S.save();
        helpOut.innerHTML = '<pre class="code-block">' + highlight(ex.q) + '</pre><button class="btn btn-ghost sm" id="b-copy">' + icon('copy') + 'Copiar para a barra de fórmulas</button>';
        helpOut.querySelector('#b-copy').onclick = function () { input.set(ex.q); input.focus(); };
      };
      if (st.progress.solved[ex.id] || st.progress.revealed[ex.id]) return show();
      helpOut.innerHTML = '<div class="confirm"><p>Ver o gabarito reduz o XP deste exercício para <b>' + Math.round(xpVal / 2) + ' XP</b>. Deseja continuar?</p>' +
        '<div class="help-row"><button class="btn btn-primary sm" id="b-yes">Mostrar gabarito</button><button class="btn btn-quiet sm" id="b-no">Cancelar</button></div></div>';
      helpOut.querySelector('#b-yes').onclick = show;
      helpOut.querySelector('#b-no').onclick = function () { helpOut.innerHTML = ''; };
    };
    if (solved) setTimeout(doRun, 30);
    setTimeout(function () { input.focus(); }, 60);
  }

  global.ExcelPractice = { render: render, grade: grade, grid: grid, sheetsOf: sheetsOf };
})(window);
