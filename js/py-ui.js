/* =====================================================================
   py-ui.js — Tela de prática da trilha de Python
   ---------------------------------------------------------------------
   • Editor Python com cores, sugestões, dica de argumentos e recuo.
   • Executa no Python de verdade (Pyodide, no navegador) com os dados
     da NexusMarket já carregados nas variáveis.
   • Correção: compara a saída do print() com a do gabarito, aponta a
     primeira linha diferente e traduz os erros do Python.
   ===================================================================== */
(function (global) {
  'use strict';
  const { esc, icon } = global.UI;
  const E = function () { return global.PyEngine; };
  const expCache = {};

  /** Saída esperada (executa o gabarito uma vez por sessão). */
  function expected(ex) {
    if (!expCache[ex.id]) expCache[ex.id] = E().run(ex.q, ex.pd).then(function (r) { if (r.err) delete expCache[ex.id]; return r; });
    return expCache[ex.id];
  }
  function norm(out) {
    return String(out || '').replace(/\r/g, '').split('\n').map(function (l) { return l.replace(/\s+$/, '').replace(/[ \t]+/g, ' '); }).join('\n').replace(/\n+$/, '');
  }
  const KRE = {
    'for': /\bfor\b/, 'while': /\bwhile\b/, 'if': /\bif\b/, 'elif': /\belif\b/, 'else': /\belse\b/, 'def': /\bdef\b/, 'return': /\breturn\b/,
    'lambda': /\blambda\b/, 'try': /\btry\s*:/, 'except': /\bexcept\b/, 'f-string': /\b[fF]["']/, 'compreensão': /[\[{(][^\n]*\bfor\b[^\n]*\bin\b/,
    'and': /\band\b/, 'or': /\bor\b/, 'not in': /\bnot\s+in\b/, 'in': /\bin\b/, 'print': /\bprint\s*\(/, 'set': /\bset\s*\(|\{[^:}\n]*\bfor\b[^:}\n]*\}/,
    '=': /^[ \t]*[A-Za-z_]\w*\s*=(?!=)/m, '+=': /\+=/, 'KeyError': /\bKeyError\b/, 'margins': /margins\s*=\s*True/, 'sep=': /\bsep\s*=/,
  };
  function hasK(code, k) {
    const clean = code.replace(/#[^\n]*/g, '');
    if (KRE[k]) return KRE[k].test(clean);
    if (/^\.?[A-Za-z_]\w*$/.test(k)) return new RegExp('\\b' + k.replace(/^\./, '') + '\\b').test(clean);
    return clean.indexOf(k) >= 0;
  }

  /** Corrige o código do aluno. */
  function grade(ex, code) {
    return Promise.all([E().run(code, ex.pd), expected(ex)]).then(function (rs) {
      const got = rs[0], exp = rs[1];
      if (got.err) { const x = E().explain(got.err); return { status: 'error', title: x.title, explain: x.explain, line: x.line, col: x.col, out: got.out }; }
      if (exp.err) return { status: 'error', title: 'Gabarito indisponível', explain: 'Não foi possível calcular a saída esperada agora. Tente de novo.', out: got.out };
      const a = norm(got.out), b = norm(exp.out);
      if (a !== b) {
        if (!a) return { status: 'wrong', title: 'Nada foi impresso', explain: 'Seu código rodou, mas não mostrou nada. Use print() para exibir o resultado pedido.', out: got.out };
        const la = a.split('\n'), lb = b.split('\n');
        let i = 0; while (i < la.length && i < lb.length && la[i] === lb[i]) i++;
        let explain;
        if (i >= lb.length) explain = 'A saída tem ' + (la.length - lb.length) + ' linha(s) a mais do que o esperado. Confira se algum print() está dentro do laço quando deveria estar fora.';
        else if (i >= la.length) explain = 'Faltam ' + (lb.length - la.length) + ' linha(s) na saída. A primeira que falta é: "' + lb[i] + '".';
        else explain = 'Na linha ' + (i + 1) + ' da saída, o esperado é "' + lb[i] + '", mas o seu código mostrou "' + la[i] + '".' + (la[i].toLowerCase() === lb[i].toLowerCase() ? ' Só muda maiúscula/minúscula.' : la[i].replace(/\s/g, '') === lb[i].replace(/\s/g, '') ? ' A diferença está nos espaços.' : '');
        return { status: 'wrong', title: 'Saída diferente da esperada', explain: explain + ' Compare com "Saída esperada" na Ajuda.', out: got.out, line: null, badLine: i };
      }
      const miss = (ex.k || []).filter(function (k) { return !hasK(code, k); });
      if (miss.length) return { status: 'wrong', title: 'Falta usar o recurso pedido', explain: 'A saída está certa, mas este exercício pede usar: ' + miss.join(', ') + '. O objetivo é praticar esse recurso.', out: got.out };
      return { status: 'correct', out: got.out };
    });
  }

  /* -------------------------- Dados disponíveis -------------------------- */
  function varsOf(ex) {
    const all = Object.keys(global.PyData.VARS);
    return all.filter(function (v) { return new RegExp('\\b' + v + '\\b').test(ex.q); });
  }
  function fmtCell(v) { return v === null || v === undefined ? '<span class="null">None</span>' : typeof v === 'number' ? '<span class="num">' + esc(v) + '</span>' : esc(v); }
  function preview(name) {
    const V = global.PyData.VARS[name];
    if (V.rows) {
      const cols = Object.keys(V.rows[0]);
      return '<p class="muted sm">' + esc(V.desc) + ' ' + (V.df ? 'DataFrame com ' + V.rows.length + ' linhas × ' + cols.length + ' colunas.' : 'len(' + name + ') = ' + V.rows.length + '. Cada item é um dicionário.') + '</p>' +
        '<div class="dt"><div class="dt-scroll"><table class="py-tbl"><thead><tr>' + (V.df ? '<th class="plain"></th>' : '') + cols.map(function (c) { return '<th class="plain">' + esc(c) + '</th>'; }).join('') + '</tr></thead><tbody>' +
        V.rows.slice(0, 5).map(function (r, i) { return '<tr>' + (V.df ? '<td class="muted">' + i + '</td>' : '') + cols.map(function (c) { return '<td>' + fmtCell(r[c]) + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div></div>' +
        (V.rows.length > 5 ? '<p class="muted sm">Mostrando 5 de ' + V.rows.length + '. Acesse um campo com ' + (V.df ? name + '["' + cols[0] + '"]' : name + '[0]["' + cols[0] + '"]') + '.</p>' : '');
    }
    if (V.list) return '<p class="muted sm">' + esc(V.desc) + '</p><pre class="code-block">' + esc(name + ' = [' + V.list.map(function (x) { return JSON.stringify(x); }).join(', ') + ']') + '</pre>';
    return '<p class="muted sm">' + esc(V.desc) + '</p><pre class="code-block">' + esc(V.text.split('\n').slice(0, 6).join('\n') + '\n…') + '</pre>';
  }

  /* -------------------------------- Tela -------------------------------- */
  function render(view, ex, ctx) {
    const st = ctx.st, S = ctx.S;
    const solved = st.progress.solved[ex.id];
    const xpVal = global.Gamification.XP[ex.diff];
    const vars = varsOf(ex);
    const starter = ex.start || '# Escreva seu código aqui\n';

    view.innerHTML = ctx.header +
      '<div class="ex-grid py">' +
        '<div class="ex-brief">' +
          '<section class="card glass"><h3 class="card-k">Cenário</h3><p class="story">' + esc(ex.s) + '</p>' +
            '<div class="goal">' + icon('target') + '<div><h3 class="card-k">Objetivo do código</h3><p>' + esc(ex.g) + '</p></div></div>' +
            '<div class="req">' + (ex.k || []).map(function (k) { return '<span class="kbd">' + esc(k) + '</span>'; }).join('') + '<span class="muted sm">recursos esperados</span></div>' +
            (vars.length ? '<p class="gq-look">' + icon('table') + '<span>Os dados já estão carregados: use ' + vars.map(function (v) { return '<b>' + esc(v) + '</b>'; }).join(', ') + ' (veja em <b>Dados disponíveis</b>).</span></p>' : '') +
          '</section>' +
          (vars.length ? '<section class="card glass py-data"><header class="card-h"><h3 class="card-k">Dados disponíveis</h3><span class="muted sm">' + (ex.pd ? 'pandas' : 'Python') + '</span></header>' +
            '<div class="tabs" role="tablist">' + vars.map(function (v, i) { return '<button role="tab" class="tab' + (i ? '' : ' on') + '" data-v="' + v + '">' + icon('table') + esc(v) + '</button>'; }).join('') + '</div><div id="py-var"></div></section>' : '') +
          '<section class="card glass hint-card"><header class="card-h"><h3 class="card-k">Ajuda</h3></header>' +
            '<div class="help-row"><button class="btn btn-ghost sm" id="b-hint">' + icon('bulb') + 'Ver dica</button><button class="btn btn-ghost sm" id="b-expected">' + icon('eye') + 'Saída esperada</button><button class="btn btn-ghost sm" id="b-solution">' + icon('code') + 'Gabarito</button></div>' +
            '<div id="help-out"></div>' +
            '<p class="muted sm xl-note">Python ' + (ex.pd ? '3.12 com pandas' : '3.12') + ' rodando no seu navegador. A correção compara a saída do print() com a esperada. Hoje = 30/06/2026.</p>' +
          '</section>' +
        '</div>' +
        '<div class="ex-work">' +
          '<section class="card glass editor-card py-editor">' +
            '<header class="editor-h"><span class="ed-title">' + icon('code') + 'codigo.py</span><span class="py-status" id="py-status"></span></header>' +
            '<div id="py-editor"></div><div id="py-sig" class="pbi-sig"></div>' +
            '<div class="editor-actions"><button class="btn btn-ghost" id="b-run">' + icon('play') + 'Executar</button><button class="btn btn-primary" id="b-submit">' + icon('send') + 'Enviar resposta</button><button class="btn btn-quiet" id="b-clear">' + icon('eraser') + 'Limpar</button>' +
            '<span class="muted sm hide-sm py-keys">Tab aceita a sugestão · Ctrl+Enter executa · Ctrl+Shift+Enter envia</span></div>' +
          '</section>' +
          '<section id="feedback" aria-live="polite"></section>' +
          '<section class="card glass result-card"><header class="card-h"><h3 class="card-k">Saída</h3><span class="muted sm" id="res-meta">Execute para ver o resultado do print()</span></header>' +
            '<pre class="py-out" id="py-out"><span class="muted">A saída do seu código aparece aqui.</span></pre></section>' +
        '</div>' +
      '</div>';

    // dados
    const varBox = view.querySelector('#py-var');
    if (varBox) {
      const paintVar = function (v) { varBox.innerHTML = preview(v); };
      view.querySelectorAll('[data-v]').forEach(function (b) { b.onclick = function () { view.querySelectorAll('[data-v]').forEach(function (x) { x.classList.toggle('on', x === b); }); paintVar(b.dataset.v); }; });
      paintVar(vars[0]);
    }

    // status do Python
    const status = view.querySelector('#py-status');
    const setStatus = function (s) {
      if (!status) return;
      const busy = s.phase === 'python' || s.phase === 'pandas';
      status.className = 'py-status ' + s.phase;
      status.innerHTML = (busy ? '<i class="spin"></i>' : s.phase === 'error' ? icon('x') : icon('check')) + '<span>' + esc(busy ? s.text : s.phase === 'error' ? 'Python indisponível' : (ex.pd ? 'Python + pandas prontos' : 'Python pronto')) + '</span>';
    };
    const offStatus = E().onStatus(setStatus);
    if (E().isReady(ex.pd)) setStatus({ phase: 'ready' });
    else { setStatus({ phase: ex.pd && E().isReady(false) ? 'pandas' : 'python', text: ex.pd && E().isReady(false) ? 'Carregando o pandas…' : 'Carregando o Python…' }); (ex.pd ? E().withPandas() : E().boot()).catch(function () { /* mostrado no status */ }); }

    // editor
    const fb = view.querySelector('#feedback'), out = view.querySelector('#py-out'), meta = view.querySelector('#res-meta');
    let draftTimer = null, busy = false;
    const editor = global.FormulaEditor.mount(view.querySelector('#py-editor'), {
      lang: 'python', multiline: true, rows: 11, ariaLabel: 'Editor Python', ctx: { pandas: ex.pd },
      placeholder: '# Escreva seu código aqui',
      value: st.progress.drafts[ex.id] || (solved ? ex.q : starter),
      sigHost: view.querySelector('#py-sig'),
      onChange: function (v) { clearTimeout(draftTimer); draftTimer = setTimeout(function () { st.progress.drafts[ex.id] = v; S.save(); }, 400); },
      onRun: function () { doRun(); }, onSubmit: function () { doSubmit(); },
    });
    ctx.setCleanup(function () { offStatus(); clearTimeout(draftTimer); st.progress.drafts[ex.id] = editor.get(); S.save(); });

    function lineOffset(src, line) { const ls = src.split('\n'); let p = 0; for (let i = 0; i < line - 1 && i < ls.length; i++) p += ls[i].length + 1; return p + 1; }
    function showOut(text, err, badLine) {
      if (!text && !err) { out.innerHTML = '<span class="muted">(nenhuma saída)</span>'; return; }
      const lines = String(text || '').replace(/\n$/, '').split('\n');
      out.innerHTML = (text ? lines.map(function (l, i) { return '<span class="' + (i === badLine ? 'bad' : '') + '">' + esc(l) + '</span>'; }).join('\n') : '') +
        (err ? (text ? '\n' : '') + '<span class="py-err">' + esc(err) + '</span>' : '');
    }
    function errorPanel(r, graded) {
      const tries = st.progress.attempts[ex.id] || 0;
      fb.innerHTML = '<div class="fb fb-err glass">' +
        '<div class="fb-h">' + icon('x') + '<div><b>❌ ' + (r.status === 'error' ? 'O código deu erro' : 'Resposta incorreta') + '</b><span>' + esc(r.title) + '</span></div>' +
        (r.line ? '<span class="pos-chip">Linha ' + r.line + '</span>' : '') + '</div>' +
        '<p class="fb-explain">' + esc(r.explain || '') + '</p>' +
        '<div class="fb-actions"><button class="btn btn-primary sm" data-a="retry">' + icon('refresh') + 'Tentar novamente</button>' +
        (r.line ? '<button class="btn btn-ghost sm" data-a="fix">' + icon('wrench') + 'Ir para a linha ' + r.line + '</button>' : '') + '<button class="btn btn-quiet sm" data-a="clear">' + icon('eraser') + 'Recomeçar</button></div>' +
        (graded && tries >= 2 && !st.progress.solved[ex.id] ? '<p class="fb-tip">' + icon('bulb') + (tries >= 3 ? 'Travou? A dica, a saída esperada e o gabarito estão em Ajuda (o gabarito vale metade do XP).' : 'Compare com a "Saída esperada" no painel Ajuda.') + '</p>' : '') +
        '</div>';
      fb.querySelector('[data-a=retry]').onclick = doSubmit;
      const fx = fb.querySelector('[data-a=fix]'); if (fx) fx.onclick = function () { const src = editor.get(); editor.select(lineOffset(src, r.line), Math.max(1, (src.split('\n')[r.line - 1] || '').length)); };
      fb.querySelector('[data-a=clear]').onclick = clear;
    }
    function setBusy(on, label) {
      busy = on;
      ['#b-run', '#b-submit'].forEach(function (s) { const b = view.querySelector(s); if (b) b.disabled = on; });
      if (on) { meta.textContent = label || 'Executando…'; out.classList.add('running'); } else out.classList.remove('running');
    }
    function doRun() {
      if (busy) return;
      setBusy(true, E().isReady(ex.pd) ? 'Executando…' : 'Carregando o Python e executando…');
      const t0 = performance.now();
      E().run(editor.get(), ex.pd).then(function (r) {
        setBusy(false);
        meta.textContent = 'Executado em ' + Math.max(1, Math.round(performance.now() - t0)) + ' ms';
        if (r.err) { const x = E().explain(r.err); showOut(r.out, x.title + (x.line ? ' (linha ' + x.line + ')' : '') + ': ' + x.explain); errorPanel(Object.assign({ status: 'error' }, x), false); }
        else { fb.innerHTML = ''; showOut(r.out); }
      });
    }
    function doSubmit() {
      if (busy) return;
      st.progress.attempts[ex.id] = (st.progress.attempts[ex.id] || 0) + 1;
      st.progress.drafts[ex.id] = editor.get();
      setBusy(true, 'Corrigindo…');
      grade(ex, editor.get()).then(function (r) {
        setBusy(false);
        meta.textContent = 'Saída do seu código';
        if (r.status === 'error') showOut(r.out, r.title + (r.line ? ' (linha ' + r.line + ')' : '') + ': ' + r.explain);
        else showOut(r.out, null, r.badLine);
        if (r.status !== 'correct') { st.progress.firstTryStreak = 0; S.save(); errorPanel(r, true); return; }
        ctx.onSolved(fb, '✅ Código correto', 'A saída é igual à esperada' + ((ex.k || []).length ? ' e usa ' + ex.k.join(', ') + '.' : '.'));
      });
    }
    function clear() { editor.set(starter); fb.innerHTML = ''; out.innerHTML = '<span class="muted">A saída do seu código aparece aqui.</span>'; editor.focus(); }
    view.querySelector('#b-run').onclick = doRun;
    view.querySelector('#b-submit').onclick = doSubmit;
    view.querySelector('#b-clear').onclick = clear;

    // ajuda
    const helpOut = view.querySelector('#help-out');
    view.querySelector('#b-hint').onclick = function () {
      const les = global.Lessons.forExercise(ex);
      helpOut.innerHTML = '<p class="help-txt">' + icon('bulb') + esc(ex.h || ('Revise a aula "' + les.titulo + '". ' + les.notas[0] + ((ex.k || []).length ? ' Recursos esperados: ' + ex.k.join(', ') + '.' : ''))) + '</p>';
    };
    view.querySelector('#b-expected').onclick = function () {
      helpOut.innerHTML = '<p class="muted sm">Calculando a saída esperada…</p>';
      expected(ex).then(function (r) { helpOut.innerHTML = r.err ? '<p class="muted sm">Não foi possível calcular agora. Tente de novo.</p>' : '<p class="muted sm">O seu código deve imprimir exatamente:</p><pre class="py-out">' + esc(r.out.replace(/\n$/, '')) + '</pre>'; });
    };
    view.querySelector('#b-solution').onclick = function () {
      const reveal = function () {
        st.progress.revealed[ex.id] = true; S.save();
        helpOut.innerHTML = '<pre class="code-block">' + global.PyLang.highlight(ex.q) + '</pre><button class="btn btn-ghost sm" id="b-copy">' + icon('copy') + 'Copiar para o editor</button>';
        helpOut.querySelector('#b-copy').onclick = function () { editor.set(ex.q); editor.focus(); };
      };
      if (st.progress.solved[ex.id] || st.progress.revealed[ex.id]) return reveal();
      helpOut.innerHTML = '<div class="confirm"><p>Ver o gabarito reduz o XP deste exercício para <b>' + Math.round(xpVal / 2) + ' XP</b>. Deseja continuar?</p>' +
        '<div class="help-row"><button class="btn btn-primary sm" id="b-yes">Mostrar gabarito</button><button class="btn btn-quiet sm" id="b-no">Cancelar</button></div></div>';
      helpOut.querySelector('#b-yes').onclick = reveal;
      helpOut.querySelector('#b-no').onclick = function () { helpOut.innerHTML = ''; };
    };
    if (solved) setTimeout(doRun, 50);
    setTimeout(function () { if (global.innerWidth > 900) editor.focus(); }, 60);
  }

  global.PyPractice = { render: render, grade: grade, expected: expected, norm: norm, hasK: hasK };
})(window);
