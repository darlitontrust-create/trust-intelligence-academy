/* =====================================================================
   library.js — Biblioteca de Conteúdo (consulta às aulas a qualquer hora)
   ---------------------------------------------------------------------
   • #conteudo        → aulas do tema por nível e etapa, com busca, filtros
                        (todas, favoritas, não lidas) e marca de lidas.
   • #aula-<chave>    → a aula completa no carrossel, com teste de fixação
                        e os exercícios que usam o conteúdo.
   • #resumo-<n>-<e>  → resumo da etapa (ideia, passo a passo, pontos-chave
                        e cuidados de cada aula), pronto para imprimir/PDF.
   • #resumo-<n>      → resumo do nível: mapa das etapas, comparações,
                        fluxos, erros comuns e desafios das etapas.
   • #resumo-curso    → resumo do curso inteiro, nível a nível.
   • Visão geral      → progresso de leitura por tema e busca em todos.
   Estado: progress.library = { seen: { chave: data }, fav: { chave: true } }
   ===================================================================== */
(function (global) {
  'use strict';
  const { esc, icon, toast } = global.UI;
  const STAGES = [[1, 17], [18, 34], [35, 50]];
  const LV = { 1: 'Iniciante', 2: 'Intermediário', 3: 'Avançado' };
  const S = function () { return global.AppStorage; };
  function withTrack(id, fn) { const st = S().state, prev = st.currentTrack; st.currentTrack = id; try { return fn(); } finally { st.currentTrack = prev; } }
  function prog(id) { return withTrack(id, function () { const p = S().state.progress; p.library = p.library || { seen: {}, fav: {} }; p.library.seen = p.library.seen || {}; p.library.fav = p.library.fav || {}; return p; }); }
  const norm = function (s) { return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase(); };
  const plain = function (s) { return global.UI.plain ? global.UI.plain(String(s || '')) : String(s || ''); };

  /** Aulas do tema na ordem em que aparecem nos exercícios, agrupadas por nível e etapa. */
  const cache = {};
  function index(trackId) {
    if (cache[trackId]) return cache[trackId];
    const bank = global.Tracks.bankOf(trackId), pack = global.Lessons.PACKS[trackId];
    const byKey = {}, groups = [];
    [1, 2, 3].forEach(function (lv) {
      STAGES.forEach(function (rg, si) {
        const g = { lv: lv, stage: si + 1, range: rg, keys: [] };
        bank.EXERCISES.filter(function (e) { return e.level === lv && e.pos >= rg[0] && e.pos <= rg[1]; }).forEach(function (e) {
          const k = pack.MAP[e.t] || pack.fallback;
          if (!pack.LESSONS[k]) return;
          if (!byKey[k]) { byKey[k] = { key: k, les: pack.LESSONS[k], exs: [], group: g }; g.keys.push(k); }
          byKey[k].exs.push(e);
        });
        if (g.keys.length) groups.push(g);
      });
    });
    const order = groups.reduce(function (a, g) { return a.concat(g.keys); }, []);
    return (cache[trackId] = { byKey: byKey, groups: groups, order: order });
  }
  /** Aula lida: aberta na biblioteca ou concluída antes de um exercício. */
  function seen(trackId, key) {
    const p = prog(trackId);
    if (p.library.seen[key]) return true;
    const it = index(trackId).byKey[key];
    return !!(it && it.exs.some(function (e) { return p.lessonsSeen && p.lessonsSeen[e.id]; }));
  }
  function counts(trackId) {
    const ix = index(trackId);
    return { total: ix.order.length, seen: ix.order.filter(function (k) { return seen(trackId, k); }).length };
  }
  function hay(les) { return norm([les.titulo, les.kw, plain(les.ideia), les.sintaxe, (les.notas || []).map(plain).join(' '), (les.cuidados || []).map(plain).join(' ')].join(' ')); }
  function snippet(s, n) { s = plain(s); return s.length > n ? s.slice(0, n).replace(/\s+\S*$/, '') + '…' : s; }

  /* ------------------------------ Lista do tema ------------------------------ */
  let filter = 'all', query = '';
  function row(t, it) {
    const p = prog(t.id), les = it.les, read = seen(t.id, it.key), fav = !!p.library.fav[it.key];
    return '<li class="lib-item' + (read ? ' read' : '') + '" data-key="' + esc(it.key) + '">' +
      '<a class="lib-open" href="#aula-' + encodeURIComponent(it.key) + '"><span class="lib-kw">' + esc(les.kw) + '</span>' +
        '<span class="lib-txt"><b>' + esc(les.titulo) + '</b><small>' + esc(snippet(les.ideia, 130)) + '</small></span>' +
        '<span class="lib-meta">' + (read ? '<span class="lib-read">' + icon('check') + 'Lida</span>' : '<span class="lib-new">Não lida</span>') + '<span class="muted sm">' + it.exs.length + ' exercício' + (it.exs.length > 1 ? 's' : '') + '</span></span></a>' +
      '<button class="icon-btn sm lib-fav' + (fav ? ' on' : '') + '" data-fav="' + esc(it.key) + '" aria-pressed="' + fav + '" aria-label="' + (fav ? 'Remover dos favoritos' : 'Favoritar') + '">' + icon('star') + '</button></li>';
  }
  function list(view, t) {
    const ix = index(t.id), p = prog(t.id), q = norm(query.trim());
    const match = function (it) {
      if (filter === 'fav' && !p.library.fav[it.key]) return false;
      if (filter === 'unread' && seen(t.id, it.key)) return false;
      return !q || hay(it.les).indexOf(q) >= 0;
    };
    let html = '', any = false;
    [1, 2, 3].forEach(function (lv) {
      const gs = ix.groups.filter(function (g) { return g.lv === lv; });
      const blocks = gs.map(function (g) {
        const items = g.keys.map(function (k) { return ix.byKey[k]; }).filter(match);
        if (!items.length) return '';
        any = true;
        const read = g.keys.filter(function (k) { return seen(t.id, k); }).length;
        return '<section class="lib-stage"><header><div><span class="eyebrow">Etapa ' + g.stage + ' · exercícios ' + g.range[0] + ' a ' + g.range[1] + '</span><span class="muted sm">' + read + ' de ' + g.keys.length + ' aulas lidas</span></div>' +
          '<a class="btn btn-ghost sm" href="#resumo-' + lv + '-' + g.stage + '">' + icon('book') + 'Resumo da etapa</a></header><ul class="lib-list">' + items.map(function (it) { return row(t, it); }).join('') + '</ul></section>';
      }).join('');
      if (blocks) html += '<section class="lib-level glass"><header class="lib-level-h"><h2>' + icon('bars') + 'Nível ' + LV[lv] + '</h2>' +
        '<a class="btn btn-ghost sm" href="#resumo-' + lv + '">' + icon('book') + 'Resumo do nível</a></header>' + blocks + '</section>';
    });
    view.querySelector('#lib-results').innerHTML = any ? html : '<div class="empty-mini glass">' + icon('search') + (filter === 'fav' && !q ? 'Nenhuma aula favorita ainda. Toque na estrela para guardar uma aula.' : 'Nenhuma aula encontrada para essa busca.') + '</div>';
    bindItems(view, t);
  }
  function bindItems(view, t) {
    view.querySelectorAll('[data-fav]').forEach(function (b) {
      b.onclick = function () {
        const p = prog(t.id), k = b.dataset.fav;
        if (p.library.fav[k]) delete p.library.fav[k]; else p.library.fav[k] = true;
        S().save();
        const on = !!p.library.fav[k];
        b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); b.setAttribute('aria-label', on ? 'Remover dos favoritos' : 'Favoritar');
        toast(on ? 'Aula salva nos favoritos.' : 'Aula removida dos favoritos.', 'info', 1800);
        if (filter === 'fav') list(view, t);
      };
    });
  }
  function render(view) {
    const t = global.Tracks.active(), c = counts(t.id);
    view.innerHTML =
      '<section class="page-h stack"><p class="eyebrow">Conteúdo · ' + esc(t.nome) + '</p><h1>Biblioteca de conteúdo</h1>' +
      '<p class="muted">Consulte qualquer aula quando quiser, sem abrir um exercício. ' + c.seen + ' de ' + c.total + ' aulas lidas.</p>' +
      '<div class="lib-prog"><i style="width:' + (c.total ? c.seen / c.total * 100 : 0) + '%"></i></div></section>' +
      '<div class="lib-tools glass"><label class="lib-search">' + icon('search') + '<input type="search" id="lib-q" placeholder="Buscar aula, comando ou conceito (ex.: ' + esc(example(t.id)) + ')" value="' + esc(query) + '" autocomplete="off"></label>' +
        '<a class="btn btn-ghost sm lib-course-sum" href="#resumo-curso">' + icon('book') + 'Resumo do curso</a>' +
        '<div class="seg" role="tablist">' + [['all', 'Todas'], ['unread', 'Não lidas'], ['fav', 'Favoritas']].map(function (f) { return '<button role="tab" class="seg-b' + (filter === f[0] ? ' on' : '') + '" data-f="' + f[0] + '" aria-selected="' + (filter === f[0]) + '">' + f[1] + '</button>'; }).join('') + '</div></div>' +
      '<div id="lib-results"></div>';
    const qi = view.querySelector('#lib-q');
    let tm = null;
    qi.oninput = function () { clearTimeout(tm); tm = setTimeout(function () { query = qi.value; list(view, t); }, 150); };
    view.querySelectorAll('[data-f]').forEach(function (b) { b.onclick = function () { filter = b.dataset.f; view.querySelectorAll('[data-f]').forEach(function (x) { x.classList.toggle('on', x === b); x.setAttribute('aria-selected', x === b); }); list(view, t); }; });
    list(view, t);
  }
  function example(id) { return { sql: 'JOIN', excel: 'PROCV', powerbi: 'CALCULATE', python: 'groupby', gestao: 'Pareto', sixsigma: 'DMAIC', ingles: 'present perfect', estatistica: 'mediana', storytelling: 'título', powerquery: 'mesclar' }[id] || 'média'; }

  /* ------------------------------- Leitura ------------------------------- */
  function reader(view, key, setCleanup) {
    const t = global.Tracks.active(), ix = index(t.id), it = ix.byKey[key];
    if (!it) { location.hash = 'conteudo'; return; }
    const pos = ix.order.indexOf(key), prev = ix.order[pos - 1], next = ix.order[pos + 1], p = prog(t.id), fav = !!p.library.fav[key];
    view.innerHTML =
      '<nav class="lib-crumbs"><a href="#conteudo">' + icon('chevL') + 'Biblioteca</a><span class="muted sm">Nível ' + LV[it.group.lv] + ' · Etapa ' + it.group.stage + ' · aula ' + (pos + 1) + ' de ' + ix.order.length + '</span>' +
        '<span class="lib-crumb-r"><button class="btn btn-ghost sm" id="lib-sheet">' + icon('list') + '<span>Ficha-resumo</span></button>' +
        '<button class="btn btn-ghost sm lib-fav-b' + (fav ? ' on' : '') + '" data-fav="' + esc(key) + '" aria-pressed="' + fav + '">' + icon('star') + '<span>' + (fav ? 'Favorita' : 'Favoritar') + '</span></button></span></nav>' +
      '<div id="lib-host"></div>' +
      '<nav class="lib-pager">' + (prev ? '<a class="btn btn-ghost" href="#aula-' + encodeURIComponent(prev) + '">' + icon('chevL') + '<span><small>Anterior</small>' + esc(ix.byKey[prev].les.titulo) + '</span></a>' : '<span></span>') +
        (next ? '<a class="btn btn-ghost next" href="#aula-' + encodeURIComponent(next) + '"><span><small>Próxima</small>' + esc(ix.byKey[next].les.titulo) + '</span>' + icon('chevR') + '</a>' : '') + '</nav>';
    const mark = function () { if (!p.library.seen[key]) { p.library.seen[key] = new Date().toISOString(); S().save(); } };
    const cleanup = global.Lessons.mount(view.querySelector('#lib-host'), it.exs[0], {
      library: true, exercises: it.exs,
      onLast: mark,
      onStart: function () { mark(); toast('Aula concluída: <b>' + esc(it.les.titulo) + '</b>', 'success', 2200); location.hash = next ? 'aula-' + encodeURIComponent(next) : 'conteudo'; },
      onClose: function () { location.hash = 'conteudo'; },
    });
    setCleanup(cleanup);
    view.querySelector('#lib-sheet').onclick = function () { openSheet(t, it.les, it.exs[0]); };
    const fb = view.querySelector('[data-fav]');
    fb.onclick = function () {
      if (p.library.fav[key]) delete p.library.fav[key]; else p.library.fav[key] = true;
      S().save();
      const on = !!p.library.fav[key];
      fb.classList.toggle('on', on); fb.setAttribute('aria-pressed', on); fb.querySelector('span').textContent = on ? 'Favorita' : 'Favoritar';
    };
    setTimeout(function () { const l = view.querySelector('.lesson'); if (l) l.focus({ preventScroll: true }); }, 50);
  }

  /* ---------------------------- Ficha-resumo ---------------------------- */
  /** Uma tela com o essencial da aula: lado a lado (ou sintaxe), fluxo, objetivos e resumo. */
  function sheetHtml(t, les, ex) {
    const L = global.Lessons, pack = L.PACKS[t.id], px = L.plusOf(ex, les), R = global.UI.rich;
    const code = function (c) { return pack.codeHtml(global.CodeFormat && /^(sql|excel|powerbi|python)$/.test(t.id) ? global.CodeFormat.lesson(c, t.id) : c); };
    const isCode = /^(sql|excel|powerbi|python|powerquery)$/.test(t.id);
    const col = function (c, k) { return '<div class="ls-vs-c ' + k + '"><div class="ls-vs-h"><b>' + R(c.h) + '</b><span>' + R(c.d) + '</span></div>' + (c.c ? '<div class="ls-vs-b">' + (isCode ? '<pre class="code-block">' + code(c.c) + '</pre>' : '<p class="ls-vs-ex">' + R(c.c) + '</p>') + '</div>' : '') + '</div>'; };
    return '<article class="sheet"><header class="sheet-h"><h2 class="ls-title sm">' + L.twoTone(px.v ? px.v.t : les.titulo, px.v ? String(px.v.t).split(/\s+[×x]\s+/)[0] : les.kw) + '</h2><span class="tag">' + esc(t.short || t.nome) + ' · Ficha-resumo</span></header>' +
      (px.v ? '<div class="ls-vs">' + col(px.v.a, 'a') + col(px.v.b, 'b') + '</div>' : '<p class="sum-idea">' + R(les.ideia) + '</p><pre class="code-block">' + code(les.sintaxe) + '</pre>') +
      L.flowHtml(px.f) +
      (px.o && px.o.length ? '<div class="sheet-goals"><h3>Você deve saber</h3><ul>' + px.o.map(function (g) { return '<li>' + R(g) + '</li>'; }).join('') + '</ul></div>' : '') +
      '<div class="sheet-warn"><h3>Atenção</h3><ul>' + les.cuidados.slice(0, 2).map(function (c) { return '<li>' + R(c) + '</li>'; }).join('') + '</ul></div>' +
      L.resumoHtml((px.v && px.v.r) || px.r || les.notas[0]) + '</article>';
  }
  function openSheet(t, les, ex) {
    const m = global.UI.modal('<div class="sheet-wrap lesson">' + sheetHtml(t, les, ex) + '<div class="sheet-act"><button class="btn btn-primary sm" id="sheet-print">' + icon('printer') + 'Imprimir ou salvar PDF</button></div></div>', { wide: true });
    m.el.querySelector('#sheet-print').onclick = function () { printScreen(t, null, '<div class="sheet-wrap lesson glass">' + sheetHtml(t, les, ex) + '</div>'); };
  }

  /* ------------------------------- Resumo ------------------------------- */
  function summaryHtml(t, g, start) {
    const ix = index(t.id), pack = global.Lessons.PACKS[t.id], R = global.UI.rich;
    start = start || 0;
    return g.keys.map(function (k, n) {
      const les = ix.byKey[k].les;
      const px = global.Lessons.plusOf({ track: t.id }, les);
      return '<article class="sum-les"><h2><span>' + (start + n + 1) + '</span>' + esc(les.titulo) + '</h2>' +
        '<p class="sum-idea">' + R(les.ideia) + '</p>' + (px.r ? '<p class="sum-res"><b>Em resumo:</b> ' + R(px.r) + '</p>' : '') +
        '<div class="sum-cols"><div><h3>' + esc(pack.syntaxTitle || 'Como se escreve') + '</h3><pre class="code-block">' + pack.codeHtml(global.CodeFormat && /^(sql|excel|powerbi|python)$/.test(t.id) ? global.CodeFormat.lesson(les.sintaxe, t.id) : les.sintaxe) + '</pre></div>' +
        '<div><h3>Pontos-chave</h3><ul>' + les.notas.map(function (x) { return '<li>' + R(x) + '</li>'; }).join('') + '</ul>' +
        '<h3>Cuidados</h3><ul class="warn">' + les.cuidados.map(function (x) { return '<li>' + R(x) + '</li>'; }).join('') + '</ul></div></div></article>';
    }).join('');
  }
  /** Desafio da etapa: o último exercício da etapa, o que junta os conteúdos dela. */
  function stageChallenge(t, lv, g) {
    const bank = global.Tracks.bankOf(t.id), e = bank && bank.EXERCISES.find(function (x) { return x.level === lv && x.pos === g.range[1]; });
    if (!e) return '';
    const R = global.UI.rich;
    return '<section class="ls-mini stage-ch"><div class="ls-mini-h">' + icon('flag') + '<b>Desafio da etapa</b><span class="tag d-' + e.diff + '">' + esc(e.levelName) + ' ' + e.pos + '</span></div>' +
      '<h4>' + esc(e.n) + '</h4><p>' + R(e.s) + '</p><p class="ls-mini-g"><b>Missão</b> ' + R(e.g) + '</p>' +
      '<a class="btn btn-primary sm" href="#ex-' + e.id + '">' + icon('play') + 'Encarar o desafio</a></section>';
  }
  function summary(view, lv, stage) {
    const t = global.Tracks.active(), ix = index(t.id);
    const g = ix.groups.find(function (x) { return x.lv === lv && x.stage === stage; });
    if (!g) { location.hash = 'conteudo'; return; }
    const title = 'Resumo · Nível ' + LV[lv] + ' · Etapa ' + stage;
    view.innerHTML =
      '<nav class="lib-crumbs"><a href="#conteudo">' + icon('chevL') + 'Biblioteca</a><span class="muted sm">' + g.keys.length + ' aulas · exercícios ' + g.range[0] + ' a ' + g.range[1] + '</span>' +
        '<button class="btn btn-primary sm" id="sum-print">' + icon('printer') + 'Imprimir ou salvar PDF</button></nav>' +
      '<section class="page-h stack"><p class="eyebrow">' + esc(t.nome) + '</p><h1>' + esc(title) + '</h1><p class="muted">O essencial de cada aula da etapa, para revisar antes da prova do certificado ou dos desafios de skills.</p>' +
        '<div class="sum-nav"><a class="btn btn-ghost sm" href="#resumo-' + lv + '">' + icon('book') + 'Nível ' + LV[lv] + ' inteiro</a><a class="btn btn-ghost sm" href="#resumo-curso">Curso inteiro</a></div></section>' +
      stageChallenge(t, lv, g) +
      '<div class="sum-doc glass">' + summaryHtml(t, g) + '</div>';
    view.querySelector('#sum-print').onclick = function () { printScreen(t, title, '<div class="sum-doc glass">' + summaryHtml(t, g) + '</div>'); };
  }

  /* ---------------------- Resumo do nível e do curso ---------------------- */
  /** Junta os blocos extras (lado a lado, fluxo, erro) das aulas de um conjunto de etapas. */
  function extrasOf(t, groups) {
    const ix = index(t.id), out = { v: [], f: [], e: [] };
    groups.forEach(function (g) { g.keys.forEach(function (k) {
      const les = ix.byKey[k].les, px = global.Lessons.plusOf({ track: t.id }, les);
      if (px.v) out.v.push({ les: les, v: px.v });
      if (px.f) out.f.push({ les: les, f: px.f });
      if (px.e) out.e.push({ les: les, e: px.e });
    }); });
    return out;
  }
  function stageMap(t, g, compact) {
    const ix = index(t.id), R = global.UI.rich;
    return '<section class="sum-stage"><h3><span>Etapa ' + g.stage + '</span><small>exercícios ' + g.range[0] + ' a ' + g.range[1] + ' · ' + g.keys.length + ' aulas</small></h3>' +
      '<ol class="sum-mini' + (compact ? ' compact' : '') + '">' + g.keys.map(function (k) {
        const les = ix.byKey[k].les, px = global.Lessons.plusOf({ track: t.id }, les);
        return '<li><a href="#aula-' + encodeURIComponent(k) + '"><b>' + esc(les.titulo) + '</b></a><p>' + R(px.r || les.notas[0] || '') + '</p></li>';
      }).join('') + '</ol></section>';
  }
  function extrasHtml(t, x, opts) {
    const R = global.UI.rich, L = global.Lessons;
    let h = '';
    if (x.v.length) h += '<section class="sum-block"><h2>' + icon('grid') + 'Comparações-chave</h2><div class="sum-vs">' + x.v.map(function (o) {
      return '<div class="sum-vs-c"><b>' + L.twoTone(o.v.t, String(o.v.t).split(/\s+[×x]\s+/)[0]) + '</b><p>' + R(o.v.r || o.v.s || '') + '</p><small>' + esc(o.les.titulo) + '</small></div>'; }).join('') + '</div></section>';
    if (x.f.length) h += '<section class="sum-block"><h2>' + icon('nodes') + 'Fluxos e sequências</h2><div class="sum-flows">' + x.f.map(function (o) { return L.flowHtml(o.f); }).join('') + '</div></section>';
    if (x.e.length) h += '<section class="sum-block"><h2>' + icon('x') + 'Erros e equívocos comuns</h2><ul class="sum-errs">' + x.e.slice(0, opts && opts.maxErr || 99).map(function (o) {
      return '<li><b>' + esc(o.les.titulo) + '</b><span>' + R(o.e.c ? o.e.y : '“' + o.e.q + '” ' + o.e.y) + '</span></li>'; }).join('') + '</ul></section>';
    return h;
  }
  function challengesHtml(t, lv, gs) {
    const bank = global.Tracks.bankOf(t.id);
    const items = gs.map(function (g) { const e = bank.EXERCISES.find(function (x) { return x.level === lv && x.pos === g.range[1]; }); return e ? '<li><a href="#ex-' + e.id + '"><span class="tag d-' + e.diff + '">Etapa ' + g.stage + '</span>' + esc(e.n) + '</a></li>' : ''; }).join('');
    return items ? '<section class="sum-block"><h2>' + icon('flag') + 'Desafios das etapas</h2><ul class="sum-ch">' + items + '</ul></section>' : '';
  }
  /** Divisória de etapa dentro do resumo do nível/curso, no estilo do resumo da etapa. */
  function stageSep(t, g) {
    return '<header class="sum-sep"><span class="sum-sep-k">Etapa ' + g.stage + '</span><b>Exercícios ' + g.range[0] + ' a ' + g.range[1] + ' · ' + g.keys.length + ' aulas</b>' +
      '<a class="btn btn-quiet sm no-print" href="#resumo-' + g.lv + '-' + g.stage + '">Abrir etapa' + icon('chevR') + '</a></header>';
  }
  /** Aulas de várias etapas, numeradas em sequência, com divisórias por etapa (e por nível, no curso). */
  function lessonsHtml(t, gs, opts) {
    let n = 0, lastLv = 0, h = '';
    gs.forEach(function (g) {
      if (opts.levels && g.lv !== lastLv) {
        const nl = gs.filter(function (x) { return x.lv === g.lv; }).reduce(function (a, x) { return a + x.keys.length; }, 0);
        h += '<header class="sum-lvsep"><span>' + icon('bars') + 'Nível ' + LV[g.lv] + '</span><small>' + nl + ' aulas</small>' +
          '<a class="btn btn-ghost sm no-print" href="#resumo-' + g.lv + '">Resumo do nível' + icon('chevR') + '</a></header>';
        lastLv = g.lv;
      }
      h += stageSep(t, g) + summaryHtml(t, g, n);
      if (opts.challenges) h += stageChallenge(t, g.lv, g);
      n += g.keys.length;
    });
    return h;
  }
  function reviewHtml(t, gs, label, maxErr) {
    const x = extrasHtml(t, extrasOf(t, gs), { maxErr: maxErr });
    return x ? '<header class="sum-lvsep"><span>' + icon('grid') + 'Revisão ' + label + '</span><small>comparações, fluxos e erros comuns</small></header>' + x : '';
  }
  function levelSummaryHtml(t, lv, print) {
    const gs = index(t.id).groups.filter(function (g) { return g.lv === lv; });
    return lessonsHtml(t, gs, { challenges: !print }) + reviewHtml(t, gs, 'do nível');
  }
  function courseSummaryHtml(t) {
    const gs = index(t.id).groups, R = global.UI.rich;
    return (t.summary ? '<p class="sum-intro">Este curso vai ' + R(t.summary) + '.</p>' : '') + lessonsHtml(t, gs, { levels: true }) + reviewHtml(t, gs, 'do curso', 30);
  }
  /**
   * Impressão/PDF no mesmo visual da tela, no tema ativo (escuro ou claro):
   * copia o conteúdo para #print-area com as mesmas classes e liga as cores de fundo.
   */
  function printScreen(t, title, html) {
    const area = document.getElementById('print-area');
    area.className = 'screen';
    area.innerHTML = '<div class="ps">' +
      '<header class="ps-h"><span class="ps-brand"><img src="assets/logo-256.png" alt="" width="34" height="34"><b>Trust Intelligence Academy</b></span><span class="ps-track">' + esc(t.nome) + '</span></header>' +
      (title ? '<section class="page-h stack ps-title"><p class="eyebrow">' + esc(t.nome) + '</p><h1>' + esc(title) + '</h1></section>' : '') +
      html + '<footer class="ps-f">Trust Intelligence Academy · ' + esc(t.nome) + ' · gerado em ' + new Date().toLocaleDateString('pt-BR') + '</footer></div>';
    document.body.classList.add('printing', 'printing-screen');
    const done = function () { document.body.classList.remove('printing', 'printing-screen'); area.className = ''; area.innerHTML = ''; global.removeEventListener('afterprint', done); global.removeEventListener('hashchange', done); };
    const imgs = Array.prototype.slice.call(area.querySelectorAll('img'));
    Promise.all(imgs.map(function (im) { return im.complete ? 1 : new Promise(function (r) { im.onload = im.onerror = r; }); })).then(function () {
      setTimeout(function () { global.addEventListener('afterprint', done); global.addEventListener('hashchange', done); global.print(); }, 150);
    });
  }

  function bigSummary(view, kind, lv) {
    const t = global.Tracks.active(), ix = index(t.id);
    const gs = kind === 'curso' ? ix.groups : ix.groups.filter(function (g) { return g.lv === lv; });
    if (!gs.length) { location.hash = 'conteudo'; return; }
    const nLes = gs.reduce(function (a, g) { return a + g.keys.length; }, 0);
    const title = kind === 'curso' ? 'Resumo do curso' : 'Resumo · Nível ' + LV[lv];
    const html = kind === 'curso' ? courseSummaryHtml(t) : levelSummaryHtml(t, lv);
    const printHtml = kind === 'curso' ? html : levelSummaryHtml(t, lv, true);
    const other = kind === 'curso' ? [1, 2, 3].map(function (n) { return '<a class="btn btn-ghost sm" href="#resumo-' + n + '">Nível ' + LV[n] + '</a>'; }).join('')
      : '<a class="btn btn-ghost sm" href="#resumo-curso">' + icon('book') + 'Curso inteiro</a>' + gs.map(function (g) { return '<a class="btn btn-ghost sm" href="#resumo-' + lv + '-' + g.stage + '">Etapa ' + g.stage + '</a>'; }).join('');
    view.innerHTML =
      '<nav class="lib-crumbs"><a href="#conteudo">' + icon('chevL') + 'Biblioteca</a><span class="muted sm">' + nLes + ' aulas · ' + gs.length + ' etapas</span>' +
        '<button class="btn btn-primary sm" id="sum-print">' + icon('printer') + 'Imprimir ou salvar PDF</button></nav>' +
      '<section class="page-h stack"><p class="eyebrow">' + esc(t.nome) + '</p><h1>' + esc(title) + '</h1><p class="muted">' +
        (kind === 'curso' ? 'Todas as aulas do curso, numeradas e organizadas por nível e etapa, com a ideia, a sintaxe, os pontos-chave e os cuidados de cada uma. No fim, a revisão com comparações, fluxos e erros comuns.' : 'Todas as aulas do nível, numeradas e organizadas por etapa, com a ideia, a sintaxe, os pontos-chave, os cuidados e o desafio de cada etapa. No fim, a revisão com comparações, fluxos e erros comuns.') + '</p>' +
        '<div class="sum-nav">' + other + '</div></section>' +
      '<div class="sum-doc glass">' + html + '</div>';
    view.querySelector('#sum-print').onclick = function () { printScreen(t, title, '<div class="sum-doc glass">' + printHtml + '</div>'); };
  }
  function levelSummary(view, lv) { bigSummary(view, 'nivel', lv); }
  function courseSummary(view) { bigSummary(view, 'curso'); }

  /* ----------------------------- Visão geral ----------------------------- */
  function renderOverview(view, st, rerender) {
    const tracks = global.Tracks.TRACKS.filter(function (t) { return t.status === 'ativo'; });
    const all = tracks.map(function (t) { return { t: t, c: counts(t.id) }; });
    const tot = all.reduce(function (a, x) { return [a[0] + x.c.seen, a[1] + x.c.total]; }, [0, 0]);
    view.innerHTML =
      '<section class="page-h stack"><p class="eyebrow">Conteúdo · Visão geral</p><h1>' + tot[0] + ' de ' + tot[1] + ' aulas lidas</h1>' +
      '<p class="muted">A biblioteca de cada tema reúne todas as aulas para consulta, com busca, favoritos e resumos por etapa.</p></section>' +
      '<div class="lib-tools glass"><label class="lib-search">' + icon('search') + '<input type="search" id="lib-q" placeholder="Buscar em todos os temas (ex.: média, JOIN, PROCV)" autocomplete="off"></label></div>' +
      '<div id="lib-results"></div>' +
      '<div class="lib-tracks">' + all.map(function (x) {
        const pct = x.c.total ? Math.round(x.c.seen / x.c.total * 100) : 0;
        return '<a class="lib-track glass" href="#conteudo" data-track="' + x.t.id + '" style="--ta:' + x.t.color.a + ';--tb:' + x.t.color.b + '"><span class="hub-ic">' + icon(x.t.icon) + '</span>' +
          '<span class="lib-txt"><b>' + esc(x.t.nome) + '</b><small>' + x.c.seen + ' de ' + x.c.total + ' aulas lidas</small><span class="mini-bar"><i style="width:' + pct + '%"></i></span></span>' + icon('chevR') + '</a>';
      }).join('') + '</div>';
    const go = function (id, hash) { global.Overview.focus(id); location.hash = hash; if (hash === 'conteudo') global.dispatchEvent(new HashChangeEvent('hashchange')); };
    view.querySelectorAll('[data-track]').forEach(function (a) { a.onclick = function (e) { e.preventDefault(); go(a.dataset.track, 'conteudo'); }; });
    const qi = view.querySelector('#lib-q'), out = view.querySelector('#lib-results');
    let tm = null;
    qi.oninput = function () {
      clearTimeout(tm);
      tm = setTimeout(function () {
        const q = norm(qi.value.trim());
        if (q.length < 2) { out.innerHTML = ''; return; }
        const hits = [];
        tracks.forEach(function (t) { const ix = index(t.id); ix.order.forEach(function (k) { const les = ix.byKey[k].les; if (hay(les).indexOf(q) >= 0) hits.push({ t: t, it: ix.byKey[k], top: norm(les.titulo + ' ' + les.kw).indexOf(q) >= 0 ? 0 : 1 }); }); });
        hits.sort(function (a, b) { return a.top - b.top; });   // título e palavra-chave primeiro
        out.innerHTML = hits.length ? '<section class="lib-level glass"><h2>' + icon('search') + hits.length + ' aula(s) encontrada(s)</h2><ul class="lib-list">' + hits.slice(0, 40).map(function (h) {
          return '<li class="lib-item" style="--ta:' + h.t.color.a + ';--tb:' + h.t.color.b + '"><a class="lib-open" href="#aula-' + encodeURIComponent(h.it.key) + '" data-go-track="' + h.t.id + '" data-key="' + esc(h.it.key) + '"><span class="lib-kw">' + esc(h.it.les.kw) + '</span>' +
            '<span class="lib-txt"><b>' + esc(h.it.les.titulo) + '</b><small>' + esc(h.t.short) + ' · Nível ' + LV[h.it.group.lv] + ' · ' + esc(snippet(h.it.les.ideia, 90)) + '</small></span></a></li>';
        }).join('') + '</ul></section>' : '<div class="empty-mini glass">' + icon('search') + 'Nenhuma aula encontrada.</div>';
        out.querySelectorAll('[data-go-track]').forEach(function (a) { a.onclick = function (e) { e.preventDefault(); go(a.dataset.goTrack, 'aula-' + encodeURIComponent(a.dataset.key)); }; });
      }, 150);
    };
  }

  global.Library = { render: render, reader: reader, summary: summary, levelSummary: levelSummary, courseSummary: courseSummary, renderOverview: renderOverview, index: index, counts: counts, seen: seen };
})(window);
