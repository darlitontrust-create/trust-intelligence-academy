/* =====================================================================
   gq-ui.js — Tela de prática da trilha de Gestão da Qualidade
   ---------------------------------------------------------------------
   Casos práticos com correção automática e explicação:
     choice (uma resposta) · multi (todas as corretas) · order (ordenar)
     classify (classificar) · calc (cálculo com dados reais)
   Os dados e gráficos do caso vêm do GQCharts. O rascunho da resposta
   fica salvo no progresso, como nas outras trilhas.
   ===================================================================== */
(function (global) {
  'use strict';
  const { esc, icon } = global.UI;
  const LET = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

  /* ------------------------- Embaralhamento fixo ------------------------- */
  function seed(str) { let h = 2166136261; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function rng(s) { return function () { s |= 0; s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function shuffled(n, key) {
    const a = []; for (let i = 0; i < n; i++) a.push(i);
    const R = rng(seed(key));
    for (let i = n - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); const t = a[i]; a[i] = a[j]; a[j] = t; }
    if (n > 1 && a.every(function (v, i) { return v === i; })) a.push(a.shift());
    return a;
  }

  /* ------------------------------ Números ------------------------------ */
  function parseNum(s) {
    let t = String(s == null ? '' : s).trim().replace(/\s|R\$|%/g, '');
    if (!t) return NaN;
    if (t.indexOf(',') >= 0) t = t.replace(/\./g, '').replace(',', '.');
    else if (/^\d{1,3}(\.\d{3})+$/.test(t)) t = t.replace(/\./g, '');
    return Number(t);
  }
  function tolOf(ex) { return ex.tol != null ? ex.tol + 1e-9 : ex.dec != null ? Math.pow(10, -ex.dec) + 1e-9 : Math.max(0.01, Math.abs(ex.a) * 0.005); }
  function fmtAns(ex) { return (ex.unit === 'R$' ? 'R$ ' : '') + global.GQCharts.fmt(ex.a, ex.dec == null ? 2 : ex.dec) + (ex.unit && ex.unit !== 'R$' ? (ex.unit === '%' ? '%' : ' ' + ex.unit) : ''); }

  /* ------------------------------ Estado ------------------------------ */
  function blank(ex) {
    if (ex.kind === 'choice') return { sel: null };
    if (ex.kind === 'multi') return { sel: [] };
    if (ex.kind === 'order') return { ord: shuffled(ex.items.length, ex.id + ':o') };
    if (ex.kind === 'classify') return { cat: {} };
    return { v: '' };
  }
  function solution(ex) {
    if (ex.kind === 'choice') return { sel: 0 };
    if (ex.kind === 'multi') return { sel: ex.ok.slice() };
    if (ex.kind === 'order') return { ord: ex.items.map(function (_, i) { return i; }) };
    if (ex.kind === 'classify') { const c = {}; ex.items.forEach(function (it, i) { c[i] = it[1]; }); return { cat: c }; }
    return { v: global.GQCharts.fmt(ex.a, ex.dec == null ? 2 : ex.dec).replace(/\./g, '') };
  }
  function load(ex, raw) {
    try { const s = JSON.parse(raw); if (s && typeof s === 'object') { if (ex.kind === 'order' && (!s.ord || s.ord.length !== ex.items.length)) return blank(ex); return s; } } catch (e) { /* rascunho antigo ou vazio */ }
    return blank(ex);
  }

  /* ------------------------------ Correção ------------------------------ */
  function grade(ex, s) {
    if (ex.kind === 'choice') {
      if (s.sel == null) return { status: 'empty', explain: 'Escolha uma das alternativas.' };
      if (s.sel === 0) return { status: 'correct' };
      const why = ex.w && ex.w[s.sel - 1];
      return { status: 'wrong', title: 'Não é a melhor resposta', explain: why ? why + ' Releia o cenário e tente de novo.' : 'Essa alternativa não resolve o que a missão pede. Releia o cenário: qual opção atende ao objetivo com base no conceito da aula?' };
    }
    if (ex.kind === 'multi') {
      if (!s.sel.length) return { status: 'empty', explain: 'Marque pelo menos uma alternativa.' };
      const hit = s.sel.filter(function (i) { return ex.ok.indexOf(i) >= 0; }).length, extra = s.sel.length - hit, miss = ex.ok.length - hit;
      if (!extra && !miss) return { status: 'correct' };
      const parts = [];
      if (miss) parts.push('faltou marcar ' + miss + (miss === 1 ? ' alternativa correta' : ' alternativas corretas'));
      if (extra) parts.push(extra + (extra === 1 ? ' alternativa marcada não deveria estar' : ' alternativas marcadas não deveriam estar'));
      return { status: 'wrong', title: 'Quase: ' + hit + ' de ' + ex.ok.length + ' corretas marcadas', explain: 'Atenção: ' + parts.join(' e ') + '. Revise cada alternativa separadamente.' };
    }
    if (ex.kind === 'order') {
      const good = s.ord.map(function (v, i) { return v === i; });
      const n = good.filter(Boolean).length;
      if (n === ex.items.length) return { status: 'correct', good: good };
      const first = good.indexOf(false);
      return { status: 'wrong', good: good, title: n + ' de ' + ex.items.length + ' itens na posição certa', explain: 'A primeira posição fora do lugar é a ' + (first + 1) + 'ª. Os itens em verde já estão corretos; reorganize os demais.' };
    }
    if (ex.kind === 'classify') {
      const left = ex.items.filter(function (_, i) { return s.cat[i] == null; }).length;
      if (left) return { status: 'empty', explain: 'Classifique todos os itens antes de verificar (faltam ' + left + ').' };
      const bad = ex.items.map(function (it, i) { return s.cat[i] !== it[1]; });
      const nb = bad.filter(Boolean).length;
      if (!nb) return { status: 'correct', bad: bad };
      return { status: 'wrong', bad: bad, title: (ex.items.length - nb) + ' de ' + ex.items.length + ' itens classificados corretamente', explain: 'Os itens marcados em vermelho estão na categoria errada. Releia a definição de cada categoria na aula.' };
    }
    const u = parseNum(s.v);
    if (isNaN(u)) return { status: 'empty', explain: 'Digite um número. Use vírgula ou ponto para as casas decimais.' };
    const tol = tolOf(ex);
    if (Math.abs(u - ex.a) <= tol) return { status: 'correct' };
    if (ex.unit === '%' && Math.abs(u * 100 - ex.a) <= tol) return { status: 'correct' };
    const near = Math.abs(u - ex.a) <= Math.max(5 * tol, Math.abs(ex.a) * 0.004);
    let explain = near ? 'Está muito perto. Confira o arredondamento e o número de casas decimais pedido.' : 'O resultado esperado é diferente. Confira quais dados entram na fórmula e a ordem das operações.';
    if (!near && ex.unit === '%' && Math.abs(u - ex.a / 100) < 1e-6) explain = 'O valor está como fração; informe em porcentagem.';
    return { status: 'wrong', title: near ? 'Quase lá' : 'Valor diferente do esperado', explain: explain };
  }

  /** Nome do material de apoio do caso, para o aviso da missão. */
  function lookLabel(d) {
    const nome = { table: 'a tabela', matrix: 'a tabela', pareto: 'o gráfico de Pareto', control: 'a carta de controle', hist: 'o histograma', scatter: 'o diagrama de dispersão', vsm: 'o mapa do fluxo de valor', oee: 'o gráfico de OEE', normal: 'a curva de capabilidade', bars: 'o gráfico', flow: 'o fluxograma' }[d.type] || 'os dados';
    return nome + (d.title ? ' “' + esc(d.title) + '”' : '');
  }

  /* -------------------------------- Tela -------------------------------- */
  function render(view, ex, ctx) {
    const st = ctx.st, S = ctx.S, G = global.Gamification;
    const solvedRec = st.progress.solved[ex.id];
    const xpVal = G.XP[ex.diff];
    const pack = global.Lessons.packOf(ex);
    const tags = pack.tags(ex);
    let state = solvedRec ? solution(ex) : load(ex, st.progress.drafts[ex.id]);
    const optOrder = (ex.kind === 'choice' || ex.kind === 'multi') ? shuffled(ex.opts.length, ex.id + ':c') : null;
    const useSelect = ex.kind === 'classify' && ex.cats.length > 6;
    let marks = null; // resultado da última correção (para colorir)

    const fig = ex.d ? global.GQCharts.render(ex.d) : null;
    const kindHelp = { choice: 'Escolha uma alternativa', multi: 'Marque todas as alternativas corretas', order: 'Use as setas para ordenar', classify: 'Escolha a categoria de cada item', calc: 'Digite o resultado' }[ex.kind];

    view.innerHTML = ctx.header +
      '<div class="ex-grid gq">' +
        '<div class="ex-brief">' +
          '<section class="card glass"><h3 class="card-k">Cenário</h3><p class="story">' + esc(ex.s) + '</p>' +
            '<div class="goal">' + icon('target') + '<div><h3 class="card-k">Sua missão</h3><p>' + esc(ex.g) + '</p></div></div>' +
            (fig ? '<p class="gq-look">' + icon(ex.d.type === 'table' || ex.d.type === 'matrix' ? 'table' : 'bars') + '<span>Para responder, consulte ' + lookLabel(ex.d) + ' em <b>Dados do caso</b>, logo abaixo.</span></p>' : '') +
            '<ul class="xl-facts">' + tags.map(function (t) { return '<li>' + icon(t.icon) + esc(t.label) + '</li>'; }).join('') + '</ul>' +
          '</section>' +
          (fig ? '<section class="card glass gq-data"><header class="card-h"><h3 class="card-k">Dados do caso</h3><span class="muted sm">NexusMarket</span></header>' + fig.html + '</section>' : '') +
          '<section class="card glass hint-card"><header class="card-h"><h3 class="card-k">Ajuda</h3></header>' +
            '<div class="help-row"><button class="btn btn-ghost sm" id="b-hint">' + icon('bulb') + 'Ver dica</button><button class="btn btn-ghost sm" id="b-solution">' + icon('eye') + 'Gabarito</button></div>' +
            '<div id="help-out"></div>' +
          '</section>' +
        '</div>' +
        '<div class="ex-work">' +
          '<section class="card glass gq-answer">' +
            '<header class="editor-h"><span class="ed-title">' + icon('check') + 'Sua resposta</span><span class="muted sm hide-sm">' + esc(kindHelp) + '</span></header>' +
            '<div id="gq-input" class="gq-input"></div>' +
            '<div class="editor-actions"><button class="btn btn-primary" id="b-submit">' + icon('send') + 'Verificar resposta</button><button class="btn btn-quiet" id="b-clear">' + icon('eraser') + 'Limpar</button></div>' +
          '</section>' +
          '<section id="feedback" aria-live="polite"></section>' +
          '<section id="gq-why"></section>' +
        '</div>' +
      '</div>';

    const host = view.querySelector('#gq-input'), fb = view.querySelector('#feedback'), why = view.querySelector('#gq-why');
    let draftTimer = null;
    function save() { clearTimeout(draftTimer); draftTimer = setTimeout(function () { st.progress.drafts[ex.id] = JSON.stringify(state); S.save(); }, 300); }
    ctx.setCleanup(function () { if (global.Calculator) global.Calculator.close(); clearTimeout(draftTimer); st.progress.drafts[ex.id] = JSON.stringify(state); S.save(); });
    function changed() { marks = null; save(); paint(); }

    /* ---- Desenho da resposta ---- */
    function paint() {
      if (ex.kind === 'choice' || ex.kind === 'multi') {
        const multi = ex.kind === 'multi';
        host.innerHTML = '<div class="gq-opts" role="' + (multi ? 'group' : 'radiogroup') + '" aria-label="Alternativas">' + optOrder.map(function (oi, k) {
          const on = multi ? state.sel.indexOf(oi) >= 0 : state.sel === oi;
          return '<button type="button" class="gq-opt' + (on ? ' on' : '') + (multi ? ' multi' : '') + '" role="' + (multi ? 'checkbox' : 'radio') + '" aria-checked="' + on + '" data-o="' + oi + '">' +
            '<span class="gq-let">' + (multi ? (on ? icon('check') : '') : LET[k]) + '</span><span>' + esc(ex.opts[oi]) + '</span></button>';
        }).join('') + '</div>';
        host.querySelectorAll('.gq-opt').forEach(function (b) {
          b.onclick = function () {
            const oi = +b.dataset.o;
            if (multi) { const i = state.sel.indexOf(oi); if (i >= 0) state.sel.splice(i, 1); else state.sel.push(oi); }
            else state.sel = oi;
            changed();
            const nb = host.querySelector('[data-o="' + oi + '"]'); if (nb) nb.focus();
          };
        });
      } else if (ex.kind === 'order') {
        host.innerHTML = '<ol class="gq-order">' + state.ord.map(function (oi, pos) {
          const ok = marks && marks.good ? (marks.good[pos] ? ' good' : ' bad') : '';
          return '<li class="gq-oi' + ok + '" data-p="' + pos + '" tabindex="0" aria-label="Posição ' + (pos + 1) + ': ' + esc(ex.items[oi]) + '. Use Alt + seta para mover.">' +
            '<span class="gq-n">' + (pos + 1) + '</span><span class="gq-ot">' + esc(ex.items[oi]) + '</span>' +
            '<span class="gq-mv"><button type="button" class="icon-btn sm" data-mv="-1" aria-label="Subir"' + (pos ? '' : ' disabled') + '>' + icon('chevR', 'up') + '</button>' +
            '<button type="button" class="icon-btn sm" data-mv="1" aria-label="Descer"' + (pos < state.ord.length - 1 ? '' : ' disabled') + '>' + icon('chevR', 'down') + '</button></span></li>';
        }).join('') + '</ol>';
        const move = function (pos, d) {
          const np = pos + d; if (np < 0 || np >= state.ord.length) return;
          const t = state.ord[pos]; state.ord[pos] = state.ord[np]; state.ord[np] = t;
          changed();
          const li = host.querySelector('[data-p="' + np + '"]'); if (li) li.focus();
        };
        host.querySelectorAll('.gq-oi').forEach(function (li) {
          const pos = +li.dataset.p;
          li.querySelectorAll('[data-mv]').forEach(function (b) { b.onclick = function (e) { e.stopPropagation(); move(pos, +b.dataset.mv); }; });
          li.onkeydown = function (e) { if (e.altKey && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) { e.preventDefault(); move(pos, e.key === 'ArrowUp' ? -1 : 1); } };
        });
      } else if (ex.kind === 'classify') {
        host.innerHTML = '<ul class="gq-cls">' + ex.items.map(function (it, i) {
          const cur = state.cat[i];
          const mk = marks && marks.bad ? (marks.bad[i] ? ' bad' : ' good') : '';
          const ctl = useSelect
            ? '<select class="gq-sel" data-i="' + i + '" aria-label="Categoria de: ' + esc(it[0]) + '"><option value="">Escolha…</option>' + ex.cats.map(function (c, k) { return '<option value="' + k + '"' + (cur === k ? ' selected' : '') + '>' + esc(c) + '</option>'; }).join('') + '</select>'
            : '<div class="gq-chips" role="radiogroup" aria-label="Categoria de: ' + esc(it[0]) + '">' + ex.cats.map(function (c, k) { return '<button type="button" class="gq-chip' + (cur === k ? ' on' : '') + '" role="radio" aria-checked="' + (cur === k) + '" data-i="' + i + '" data-k="' + k + '">' + esc(c) + '</button>'; }).join('') + '</div>';
          return '<li class="gq-ci' + mk + '"><span class="gq-ct">' + esc(it[0]) + '</span>' + ctl + '</li>';
        }).join('') + '</ul>';
        host.querySelectorAll('.gq-chip').forEach(function (b) { b.onclick = function () { state.cat[+b.dataset.i] = +b.dataset.k; changed(); const nb = host.querySelector('.gq-chip[data-i="' + b.dataset.i + '"][data-k="' + b.dataset.k + '"]'); if (nb) nb.focus(); }; });
        host.querySelectorAll('.gq-sel').forEach(function (s) { s.onchange = function () { if (s.value === '') delete state.cat[+s.dataset.i]; else state.cat[+s.dataset.i] = +s.value; changed(); }; });
      } else {
        host.innerHTML = '<div class="gq-calc-row"><label class="gq-calc"><span class="sr-only">Resultado</span>' + (ex.unit === 'R$' ? '<span class="gq-u pre">R$</span>' : '') +
          '<input id="gq-num" type="text" inputmode="decimal" autocomplete="off" spellcheck="false" placeholder="Digite o resultado" value="' + esc(state.v) + '">' +
          (ex.unit && ex.unit !== 'R$' ? '<span class="gq-u">' + esc(ex.unit) + '</span>' : '') + '</label>' +
          '<button type="button" class="btn btn-ghost" data-calc-open aria-expanded="false">' + icon('grid') + 'Calculadora</button></div>' +
          '<p class="muted sm">' + (ex.dec != null ? (ex.dec === 0 ? 'Resultado inteiro. ' : 'Use ' + ex.dec + (ex.dec === 1 ? ' casa decimal' : ' casas decimais') + '. ') : '') + 'Vírgula ou ponto como separador decimal.</p>';
        const inp = host.querySelector('#gq-num');
        inp.oninput = function () { state.v = inp.value; marks = null; save(); };
        inp.onkeydown = function (e) { if (e.key === 'Enter') { e.preventDefault(); doSubmit(); } };
        const cb = host.querySelector('[data-calc-open]');
        cb.onclick = function () {
          cb.setAttribute('aria-expanded', 'true');
          global.Calculator.open({ title: 'Calculadora · ' + ex.n, onUse: function (v) { inp.value = v; state.v = v; marks = null; save(); inp.focus(); } });
        };
      }
    }

    function explainHtml(title) {
      return '<div class="card glass gq-why-card"><h3 class="card-k">' + icon('bulb') + esc(title) + '</h3>' +
        (ex.kind === 'calc' ? '<p class="gq-ans">Resposta: <b>' + esc(fmtAns(ex)) + '</b></p>' : '') + '<p>' + esc(ex.x) + '</p></div>';
    }

    function errorPanel(r) {
      const tries = st.progress.attempts[ex.id] || 0;
      if (r.status === 'empty') { fb.innerHTML = '<div class="fb fb-warn glass"><div class="fb-h">' + icon('bulb') + '<div><b>Resposta incompleta</b><span>' + esc(r.explain) + '</span></div></div></div>'; return; }
      fb.innerHTML = '<div class="fb fb-err glass">' +
        '<div class="fb-h">' + icon('x') + '<div><b>❌ Resposta incorreta</b><span>' + esc(r.title || '') + '</span></div></div>' +
        '<p class="fb-explain">' + esc(r.explain) + '</p>' +
        '<div class="fb-actions"><button class="btn btn-primary sm" data-a="retry">' + icon('refresh') + 'Tentar novamente</button><button class="btn btn-quiet sm" data-a="clear">' + icon('eraser') + 'Limpar resposta</button></div>' +
        (tries >= 2 && !st.progress.solved[ex.id] ? '<p class="fb-tip">' + icon('bulb') + (tries >= 3 ? 'Travou? A dica e o gabarito estão em Ajuda (o gabarito vale metade do XP).' : 'Experimente a dica no painel Ajuda.') + '</p>' : '') +
        '</div>';
      fb.querySelector('[data-a=retry]').onclick = function () { fb.innerHTML = ''; const f = host.querySelector('button, input, select, [tabindex]'); if (f) f.focus(); };
      fb.querySelector('[data-a=clear]').onclick = clear;
    }

    function doSubmit() {
      const r = grade(ex, state);
      if (r.status === 'empty') { errorPanel(r); return; }
      st.progress.attempts[ex.id] = (st.progress.attempts[ex.id] || 0) + 1;
      st.progress.drafts[ex.id] = JSON.stringify(state);
      marks = r; paint();
      if (r.status !== 'correct') { st.progress.firstTryStreak = 0; S.save(); why.innerHTML = ''; errorPanel(r); return; }
      ctx.onSolved(fb, '✅ Resposta correta', { choice: 'Você escolheu a melhor alternativa para o caso.', multi: 'Todas as alternativas corretas, nenhuma a mais.', order: 'Todos os itens na ordem certa.', classify: 'Todos os itens na categoria certa.', calc: 'O resultado bate com o cálculo feito nos dados.' }[ex.kind]);
      why.innerHTML = explainHtml('Por que esta é a resposta');
    }
    function clear() { state = blank(ex); marks = null; fb.innerHTML = ''; why.innerHTML = ''; save(); paint(); }
    view.querySelector('#b-submit').onclick = doSubmit;
    view.querySelector('#b-clear').onclick = clear;
    view.addEventListener('keydown', function (e) { if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); doSubmit(); } });

    /* ---- Ajuda ---- */
    const helpOut = view.querySelector('#help-out');
    view.querySelector('#b-hint').onclick = function () {
      const les = global.Lessons.forExercise(ex);
      helpOut.innerHTML = '<p class="help-txt">' + icon('bulb') + esc(ex.h || ('Revise a aula "' + les.titulo + '": ' + les.notas[0])) + '</p>';
    };
    view.querySelector('#b-solution').onclick = function () {
      const reveal = function () {
        st.progress.revealed[ex.id] = true; S.save();
        let ans = '';
        if (ex.kind === 'choice') ans = '<p class="gq-ans">' + icon('check') + esc(ex.opts[0]) + '</p>';
        else if (ex.kind === 'multi') ans = '<ul class="gq-anslist">' + ex.ok.map(function (i) { return '<li>' + icon('check') + esc(ex.opts[i]) + '</li>'; }).join('') + '</ul>';
        else if (ex.kind === 'order') ans = '<ol class="gq-anslist num">' + ex.items.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ol>';
        else if (ex.kind === 'classify') ans = '<ul class="gq-anslist">' + ex.items.map(function (it) { return '<li><span>' + esc(it[0]) + '</span><b>' + esc(ex.cats[it[1]]) + '</b></li>'; }).join('') + '</ul>';
        else ans = '<p class="gq-ans">Resposta: <b>' + esc(fmtAns(ex)) + '</b></p>';
        helpOut.innerHTML = ans + '<p class="muted sm">' + esc(ex.x) + '</p><button class="btn btn-ghost sm" id="b-fill">' + icon('copy') + 'Preencher a resposta</button>';
        helpOut.querySelector('#b-fill').onclick = function () { state = solution(ex); marks = null; save(); paint(); };
      };
      if (st.progress.solved[ex.id] || st.progress.revealed[ex.id]) return reveal();
      helpOut.innerHTML = '<div class="confirm"><p>Ver o gabarito reduz o XP deste exercício para <b>' + Math.round(xpVal / 2) + ' XP</b>. Deseja continuar?</p>' +
        '<div class="help-row"><button class="btn btn-primary sm" id="b-yes">Mostrar gabarito</button><button class="btn btn-quiet sm" id="b-no">Cancelar</button></div></div>';
      helpOut.querySelector('#b-yes').onclick = reveal;
      helpOut.querySelector('#b-no').onclick = function () { helpOut.innerHTML = ''; };
    };

    paint();
    if (solvedRec) why.innerHTML = explainHtml('Por que esta é a resposta');
    setTimeout(function () { const f = host.querySelector('input, .gq-opt, .gq-oi, .gq-chip, select'); if (f && global.innerWidth > 900) f.focus({ preventScroll: true }); }, 60);
  }

  global.GQPractice = { render: render, grade: grade, solution: solution, blank: blank, parseNum: parseNum };
})(window);
