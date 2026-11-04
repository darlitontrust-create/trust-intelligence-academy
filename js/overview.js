/* =====================================================================
   overview.js — Visão geral: a camada que consolida todas as trilhas
   ---------------------------------------------------------------------
   Quando nenhum tema está selecionado (settings.focus !== 'track'),
   Painel, Trilha, Conquistas, Ranking e Certificados mostram os
   resultados somados de todas as trilhas. Um seletor no topo dessas
   páginas alterna entre "Visão geral" e um tema específico.
   ===================================================================== */
(function (global) {
  'use strict';
  const { esc, fmt, fmtDate, icon } = global.UI;
  const G = global.Gamification;
  const PAGES = ['dashboard', 'trilha', 'conquistas', 'ranking', 'certificado'];

  function S() { return global.AppStorage; }
  function active() { return global.Tracks.TRACKS.filter(function (t) { return t.status === 'ativo'; }); }
  function isOverview(st) { return !st.settings || st.settings.focus !== 'track'; }
  /** Executa fn com a trilha `id` ativa e devolve o resultado (sem salvar). */
  function withTrack(id, fn) {
    const st = S().state, prev = st.currentTrack;
    st.currentTrack = id;
    try { return fn(); } finally { st.currentTrack = prev; }
  }
  /** Seleciona um tema (ou a visão geral) e salva. */
  function focus(id) {
    const st = S().state;
    if (id === 'all') st.settings.focus = 'all';
    else { st.settings.focus = 'track'; if (st.currentTrack !== id) S().setTrack(id); }
    S().saveNow();
  }
  /** Descobre a trilha de um exercício pelo id. */
  function trackOfExercise(id) {
    const t = active().find(function (tr) { return global.Tracks.bankOf(tr.id).EXERCISES.some(function (e) { return e.id === id; }); });
    return t ? t.id : null;
  }

  /* ------------------------------ Resumo ------------------------------ */
  function summary(st) {
    return active().map(function (t) {
      return withTrack(t.id, function () {
        const p = st.progress, BANK = global.Tracks.bankOf(t.id);
        const solved = G.solvedList(st).length, ach = G.ACHIEVEMENTS;
        const certs = global.Certificate.catalog(st);
        const next = BANK.EXERCISES.find(function (e) { return !p.solved[e.id]; }) || null;
        const last = p.history.length ? p.history.reduce(function (a, b) { return a.at > b.at ? a : b; }).at : null;
        return {
          t: t, solved: solved, total: BANK.EXERCISES.length, xp: p.xp, maxXp: G.MAX_XP,
          role: G.currentRole(st), next: G.nextRole(st), finalName: G.FINAL.nome,
          levels: BANK.LEVELS.map(function (l) { return { id: l.id, nome: l.nome, c: G.levelCount(st, l.id) }; }),
          achGot: ach.filter(function (a) { return p.achievements[a.key]; }), achAll: ach,
          certs: certs, certGot: certs.filter(function (c) { return c.unlocked; }), pending: certs.filter(function (c) { return c.eligible && !c.passed; }),
          medals: [1, 2, 3].map(function (lv) { return G.levelCount(st, lv) >= 50; }),
          nextEx: next, last: last, lessons: Object.keys(p.lessonsSeen || {}).length,
          history: p.history.map(function (h) { const e = BANK.EXERCISES.find(function (x) { return x.id === h.id; }); return { at: h.at, xp: h.xp, id: h.id, n: e ? e.n : h.id, t: t }; }),
        };
      });
    });
  }
  function totals(sum) {
    return sum.reduce(function (a, s) {
      a.solved += s.solved; a.total += s.total; a.xp += s.xp; a.maxXp += s.maxXp; a.lessons += s.lessons;
      a.ach += s.achGot.length; a.achAll += s.achAll.length; a.cert += s.certGot.length; a.certAll += s.certs.length;
      a.medals += s.medals.filter(Boolean).length; a.pending += s.pending.length; return a;
    }, { solved: 0, total: 0, xp: 0, maxXp: 0, lessons: 0, ach: 0, achAll: 0, cert: 0, certAll: 0, medals: 0, pending: 0 });
  }
  const dot = function (t) { return '<span class="ov-dot" style="--ta:' + t.color.a + ';--tb:' + t.color.b + '"></span>'; };
  const tv = function (t) { return ' style="--ta:' + t.color.a + ';--tb:' + t.color.b + '"'; };
  function bar(v, max, cls) { return '<div class="mini-bar ' + (cls || '') + '"><i style="width:' + (max ? Math.min(100, v / max * 100) : 0) + '%"></i></div>'; }
  function head(eyebrow, title, sub) { return '<header class="page-h"><div><p class="eyebrow">' + eyebrow + '</p><h1>' + title + '</h1>' + (sub ? '<p class="muted">' + sub + '</p>' : '') + '</div></header>'; }
  function kpi(label, value, sub, ic) { return '<div class="stat glass">' + icon(ic) + '<span class="stat-l">' + label + '</span><b class="stat-v">' + value + '</b><span class="stat-s">' + sub + '</span></div>'; }

  /* --------------------------- Seletor de escopo --------------------------- */
  function scopeBar(st, page) {
    const ov = isOverview(st);
    return '<nav class="scope-bar" aria-label="Escolher a visão">' +
      '<button class="scope-b' + (ov ? ' on' : '') + '" data-scope="all" aria-pressed="' + ov + '">' + icon('grid') + '<span>Visão geral</span></button>' +
      active().map(function (t) {
        const on = !ov && st.currentTrack === t.id;
        const n = withTrack(t.id, function () { return G.solvedList(st).length; });
        return '<button class="scope-b' + (on ? ' on' : '') + '" data-scope="' + t.id + '" aria-pressed="' + on + '"' + tv(t) + '>' + icon(t.icon) + '<span>' + esc(t.short) + '</span><small>' + n + '/' + t.total + '</small></button>';
      }).join('') + '</nav>';
  }
  function bindScope(view, page, rerender) {
    view.querySelectorAll('[data-scope]').forEach(function (b) {
      b.onclick = function () { focus(b.dataset.scope); rerender(); };
    });
  }
  /** Links que entram num tema: data-go="<trilha>|<hash>". */
  function bindGo(view, rerender) {
    view.querySelectorAll('[data-go]').forEach(function (a) {
      a.onclick = function (e) {
        e.preventDefault();
        const p = a.dataset.go.split('|');
        // prova: troca só a trilha ativa (a visão geral continua aberta por trás)
        if (p[1] === 'exam') { if (S().state.currentTrack !== p[0]) S().setTrack(p[0]); global.Exams.start(p[2]); return; }
        focus(p[0]);
        if (p[1] === 'cert') { global.Certificate.open(p[2]); return; }
        if (location.hash === '#' + p[1]) rerender(); else location.hash = p[1];
      };
    });
  }

  /* -------------------------------- Painel -------------------------------- */
  function dashboard(view, st) {
    const sum = summary(st), T = totals(sum);
    const pct = T.total ? T.solved / T.total : 0;
    const hist = [].concat.apply([], sum.map(function (s) { return s.history; })).sort(function (a, b) { return a.at < b.at ? 1 : -1; });
    const h = new Date().getHours(), hi = h < 5 ? 'Boa madrugada' : h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite';
    const started = sum.filter(function (s) { return s.solved; });
    const lastTrack = started.slice().sort(function (a, b) { return (a.last || '') < (b.last || '') ? 1 : -1; })[0];
    const pendings = [].concat.apply([], sum.map(function (s) { return s.pending.map(function (c) { return { s: s, c: c }; }); }));

    view.innerHTML = global.Profile.summaryHtml(st.profile) +
      '<section class="dash-hero glass ov-hero">' +
        '<div class="dash-hero-top"><div>' +
          '<p class="eyebrow">' + hi + ', ' + esc(st.profile.apelido || st.profile.nome) + ' · Visão geral</p>' +
          '<h1 class="role-title">Sua jornada na academia</h1>' +
          '<p class="muted">' + (started.length ? started.length + ' de ' + sum.length + ' trilhas em andamento · ' + T.medals + (T.medals === 1 ? ' medalha de nível' : ' medalhas de nível') : 'Escolha uma trilha para começar. Seus resultados de todas elas aparecem aqui.') + '</p>' +
        '</div>' +
        (lastTrack && lastTrack.nextEx ? '<a class="btn btn-primary" href="#ex-' + lastTrack.nextEx.id + '" data-go="' + lastTrack.t.id + '|ex-' + lastTrack.nextEx.id + '">' + icon('play') + 'Continuar ' + esc(lastTrack.t.short) + '</a>' : '<a class="btn btn-primary" href="#temas">' + icon('grid') + 'Escolher trilha</a>') +
        '</div>' +
        '<div class="giant">' +
          '<div class="giant-head"><span>Progresso na academia</span><b class="grad-num">' + Math.round(pct * 100) + '%</b></div>' +
          '<div class="giant-bar ov-stack" role="img" aria-label="' + T.solved + ' de ' + T.total + ' exercícios">' + sum.map(function (s) { return '<i style="--ta:' + s.t.color.a + ';--tb:' + s.t.color.b + ';width:' + (s.solved / T.total * 100) + '%" title="' + esc(s.t.nome) + ': ' + s.solved + '"></i>'; }).join('') + '</div>' +
          '<div class="ov-legend">' + sum.map(function (s) { return '<span>' + dot(s.t) + esc(s.t.short) + ' <b>' + s.solved + '</b>/' + s.total + '</span>'; }).join('') + '</div>' +
        '</div>' +
      '</section>' +
      (pendings.length ? '<section class="exam-banner glass">' + icon('target') + '<span><b>' + (pendings.length > 1 ? pendings.length + ' provas liberadas' : 'Prova liberada') + ':</b> ' + esc(pendings.slice(0, 3).map(function (x) { return x.s.t.short + ' · ' + (x.c.type === 'final' ? x.s.finalName : x.c.title); }).join(', ')) + (pendings.length > 3 ? '…' : '') + '</span>' +
        '<button class="btn btn-primary sm" data-go="' + pendings[0].s.t.id + '|exam|' + pendings[0].c.id + '">' + icon('play') + 'Fazer prova</button></section>' : '') +
      '<section class="stats">' +
        kpi('XP total', fmt(T.xp), 'de ' + fmt(T.maxXp) + ' XP possíveis', 'sparkle') +
        kpi('Exercícios', T.solved + '<small>/' + T.total + '</small>', (T.total - T.solved) + ' restantes', 'check') +
        kpi('Certificados', T.cert + '<small>/' + T.certAll + '</small>', T.pending ? T.pending + ' prova(s) liberada(s)' : 'Liberados com prova', 'award') +
        kpi('Conquistas', T.ach + '<small>/' + T.achAll + '</small>', T.lessons + ' aulas concluídas', 'trophy') +
      '</section>' +
      '<section class="ov-tracks">' + sum.map(function (s) {
        return '<article class="ov-track glass"' + tv(s.t) + '>' +
          '<header><span class="hub-ic">' + icon(s.t.icon) + '</span><div><b>' + esc(s.t.nome) + '</b><small>' + esc(s.role.nome) + '</small></div><span class="ov-pct">' + Math.round(s.solved / s.total * 100) + '%</span></header>' +
          bar(s.solved, s.total, 'lg') +
          '<ul class="ov-mini"><li><small>Exercícios</small><b>' + s.solved + '/' + s.total + '</b></li><li><small>XP</small><b>' + fmt(s.xp) + '</b></li><li><small>Certificados</small><b>' + s.certGot.length + '/' + s.certs.length + '</b></li><li><small>Medalhas</small><b class="ov-medals">' + s.medals.map(function (m, i) { return '<i class="md m-' + ['bronze', 'prata', 'ouro'][i] + (m ? ' got' : '') + '" title="Medalha ' + ['Bronze', 'Prata', 'Ouro'][i] + '"></i>'; }).join('') + '</b></li></ul>' +
          '<p class="muted sm">' + (s.next ? 'Próximo cargo: <b>' + esc(s.next.role.nome) + '</b> (faltam ' + s.next.remaining + ')' : 'Topo da carreira: ' + esc(s.finalName)) + (s.last ? ' · Último estudo em ' + fmtDate(s.last) : '') + '</p>' +
          '<div class="ov-acts">' + (s.nextEx ? '<a class="btn btn-primary sm" href="#ex-' + s.nextEx.id + '" data-go="' + s.t.id + '|ex-' + s.nextEx.id + '">' + icon('play') + (s.solved ? 'Continuar' : 'Começar') + '</a>' : '') +
          '<a class="btn btn-ghost sm" href="#dashboard" data-go="' + s.t.id + '|dashboard">Painel do tema' + icon('chevR') + '</a></div>' +
        '</article>';
      }).join('') + '</section>' +
      '<div class="ov-grid">' +
        '<section class="card glass"><header class="card-h"><h2>Evolução de XP (todas as trilhas)</h2><span class="muted sm">XP acumulado</span></header>' + global.Dashboard.evolutionChart({ progress: { history: hist } }) + '</section>' +
        '<section class="card glass"><header class="card-h"><h2>XP por trilha</h2></header><ul class="ov-xp">' + sum.map(function (s) {
          return '<li' + tv(s.t) + '><span>' + dot(s.t) + esc(s.t.short) + '</span>' + bar(s.xp, Math.max.apply(null, sum.map(function (x) { return x.xp; })) || 1, 'ov-col') + '<b>' + fmt(s.xp) + '</b></li>';
        }).join('') + '</ul>' +
        '<h3 class="card-k ov-sub">Atividade recente</h3>' +
        (hist.length ? '<ul class="ov-feed">' + hist.slice(0, 7).map(function (x) { return '<li' + tv(x.t) + '>' + dot(x.t) + '<span><b>' + esc(x.n) + '</b><small>' + esc(x.t.short) + ' · ' + fmtDate(x.at) + '</small></span><em>+' + x.xp + ' XP</em></li>'; }).join('') + '</ul>' : '<p class="muted sm">Os exercícios resolvidos em qualquer trilha aparecem aqui.</p>') +
        '</section>' +
      '</div>';
  }

  /* -------------------------------- Trilha -------------------------------- */
  function trail(view, st) {
    const sum = summary(st), T = totals(sum);
    view.innerHTML = head('Trilhas · Visão geral', T.solved + ' de ' + T.total + ' exercícios resolvidos', 'Seu avanço em cada nível de todas as trilhas. Entre num tema para ver os exercícios um a um.') +
      '<section class="ov-trails">' + sum.map(function (s) {
        return '<article class="card glass ov-trail"' + tv(s.t) + '>' +
          '<header class="card-h"><h2><span class="hub-ic sm">' + icon(s.t.icon) + '</span>' + esc(s.t.nome) + '</h2><span class="muted sm">' + s.solved + '/' + s.total + '</span></header>' +
          '<ul class="ov-levels">' + s.levels.map(function (l) {
            return '<li><span class="hl-n">' + l.id + '</span><span class="ov-lv"><b>' + esc(l.nome) + '</b>' + bar(l.c, 50) + '</span><span class="hl-c">' + l.c + '/50</span>' +
              '<i class="md m-' + ['bronze', 'prata', 'ouro'][l.id - 1] + (l.c >= 50 ? ' got' : '') + '" title="Medalha ' + ['Bronze', 'Prata', 'Ouro'][l.id - 1] + '"></i></li>';
          }).join('') + '</ul>' +
          '<p class="muted sm">' + (s.nextEx ? 'Próximo: <b>' + esc(s.nextEx.levelName) + ' ' + s.nextEx.pos + '/50 · ' + esc(s.nextEx.n) + '</b>' : 'Trilha concluída.') + '</p>' +
          '<div class="ov-acts">' + (s.nextEx ? '<a class="btn btn-primary sm" href="#ex-' + s.nextEx.id + '" data-go="' + s.t.id + '|ex-' + s.nextEx.id + '">' + icon('play') + (s.solved ? 'Continuar' : 'Começar') + '</a>' : '') +
          '<a class="btn btn-ghost sm" href="#trilha" data-go="' + s.t.id + '|trilha">Ver exercícios' + icon('chevR') + '</a></div>' +
        '</article>';
      }).join('') + '</section>';
  }

  /* ------------------------------ Conquistas ------------------------------ */
  function achievements(view, st) {
    const sum = summary(st), T = totals(sum);
    view.innerHTML = head('Conquistas · Visão geral', T.ach + ' de ' + T.achAll + ' conquistas desbloqueadas', T.medals + ' de ' + sum.length * 3 + ' medalhas de nível em todas as trilhas.') +
      '<section class="ov-medal-grid">' + sum.map(function (s) {
        return '<div class="glass ov-medal-card"' + tv(s.t) + '><span class="hub-ic sm">' + icon(s.t.icon) + '</span><b>' + esc(s.t.short) + '</b><span class="ov-medals lg">' + s.medals.map(function (m, i) { return '<i class="md m-' + ['bronze', 'prata', 'ouro'][i] + (m ? ' got' : '') + '" title="Medalha ' + ['Bronze', 'Prata', 'Ouro'][i] + (m ? '' : ' (bloqueada)') + '"></i>'; }).join('') + '</span>' +
          bar(s.achGot.length, s.achAll.length) + '<small class="muted">' + s.achGot.length + '/' + s.achAll.length + ' conquistas</small></div>';
      }).join('') + '</section>' +
      sum.map(function (s) {
        const p = withTrack(s.t.id, function () { return st.progress.achievements; });
        const got = s.achGot.slice().sort(function (a, b) { return p[a.key] < p[b.key] ? 1 : -1; });
        return '<section class="card glass ov-ach"' + tv(s.t) + '><header class="card-h"><h2><span class="hub-ic sm">' + icon(s.t.icon) + '</span>' + esc(s.t.nome) + '</h2>' +
          '<a class="btn btn-quiet sm" href="#conquistas" data-go="' + s.t.id + '|conquistas">Ver as ' + s.achAll.length + icon('chevR') + '</a></header>' +
          (got.length ? '<div class="ach-grid compact">' + got.map(function (x) { return '<div class="ach glass on"><div class="ach-ic">' + icon(x.icon) + '</div><div><b>' + esc(x.nome) + '</b><p>' + esc(x.desc) + '</p><span class="muted sm">Desbloqueada em ' + fmtDate(p[x.key]) + '</span></div></div>'; }).join('') + '</div>'
            : '<p class="muted sm">Nenhuma conquista ainda. A primeira vem com o primeiro exercício resolvido.</p>') +
          '</section>';
      }).join('');
  }

  /* -------------------------------- Ranking -------------------------------- */
  const REF = [['Marina Okada', 6420], ['Caio Bernardes', 5310], ['Lívia Antunes', 4480], ['Otávio Reis', 3650], ['Yasmin Prates', 2900], ['Gustavo Leal', 2240], ['Renata Sá', 1610], ['Pedro Galvão', 1120], ['Aline Cunha', 680], ['Tomás Viana', 350], ['Beatriz Moura', 140], ['Igor Matos', 40]];
  function ranking(view, st, rerender) {
    const sum = summary(st), T = totals(sum);
    const me = { nome: st.profile.apelido || st.profile.nome || 'Você', xp: T.xp, me: true };
    const C = global.Cloud, real = C && C.uid && C.board('__all');
    if (C && C.uid) {
      // liga geral primeiro (já traz o XP de cada trilha); depois as ligas de cada trilha
      const again = function () { if (location.hash === '#ranking' && isOverview(S().state)) rerender(); };
      const sig = function () { return JSON.stringify([C.board('__all'), sum.map(function (s) { return C.board(s.t.id); })]); }, before = sig();
      C.refreshBoard('__all').then(function () {
        if (sig() !== before) again();
        const mid = sig();
        Promise.all(sum.map(function (s) { return C.refreshBoard(s.t.id); })).then(function () { if (sig() !== mid) again(); });
      });
    }
    const others = real ? real.filter(function (r) { return r.uid !== C.uid; }).map(function (r) { return { nome: r.nome, xp: r.xp }; }) : REF.map(function (r) { return { nome: r[0], xp: r[1] }; });
    const board = others.concat([me]).sort(function (a, b) { return b.xp - a.xp || (a.me ? -1 : b.me ? 1 : 0); }).map(function (p, i) { return Object.assign(p, { pos: i + 1, tier: G.tierOf(Math.round(p.xp / Math.max(1, sum.length))) }); });
    const pos = board.find(function (b) { return b.me; }).pos;
    view.innerHTML = head('Ranking · Visão geral', 'Liga Trust geral', real ? 'Soma do XP de todas as trilhas entre os alunos da Trust Intelligence Academy.' : 'Soma do XP de todas as trilhas, comparada com jogadores de referência (perfis fictícios usados como parâmetro de ritmo). Entre com Google para disputar com alunos reais.') +
      '<div class="rank-grid">' +
        '<section class="card glass"><ol class="board">' + board.map(global.Dashboard.boardRow).join('') + '</ol></section>' +
        '<section class="card glass"><header class="card-h"><h2>Você na liga</h2></header>' +
          '<div class="tier-badge tone-gold">' + icon('trophy') + '<div><b>' + pos + 'º lugar geral</b><span>' + fmt(T.xp) + ' XP somando ' + sum.length + ' trilhas</span></div></div>' +
          '<h3 class="card-k ov-sub">Sua posição em cada trilha</h3>' +
          '<ul class="ov-pos">' + sum.map(function (s) {
            const b = withTrack(s.t.id, function () { return G.leaderboard(st); });
            const mine = b.find(function (x) { return x.me; });
            // conectado e a liga real ainda não chegou: não mostra a posição de referência
            const wait = C && C.uid && !C.board(s.t.id);
            return '<li' + tv(s.t) + '><span>' + dot(s.t) + esc(s.t.short) + '</span><small>' + fmt(s.xp) + ' XP · ' + esc(mine.tier.nome) + '</small>' +
              (wait ? '<b class="ov-wait" title="Carregando a liga">…</b>' : '<b>' + mine.pos + 'º<em>/' + b.length + '</em></b>') +
              '<a class="icon-btn sm" href="#ranking" data-go="' + s.t.id + '|ranking" aria-label="Ranking de ' + esc(s.t.nome) + '">' + icon('chevR') + '</a></li>';
          }).join('') + '</ul>' +
          '<p class="muted sm">XP por exercício: fácil 10 · média 20 · difícil 30. Total possível na academia: ' + fmt(T.maxXp) + ' XP.</p>' +
        '</section>' +
      '</div>';
  }

  /* ------------------------------ Certificados ------------------------------ */
  function certificates(view, st) {
    const sum = summary(st), T = totals(sum);
    view.innerHTML = head('Certificados · Visão geral', T.cert + ' de ' + T.certAll + ' certificados liberados', 'Cada trilha tem 13 certificados: 9 de etapa, 3 de nível e 1 final. Abra um tema para fazer as provas e baixar os certificados.') +
      (T.pending ? '<div class="exam-banner glass">' + icon('target') + '<span><b>' + T.pending + ' prova(s) aguardando você</b> em ' + sum.filter(function (s) { return s.pending.length; }).map(function (s) { return s.t.short; }).join(', ') + '.</span></div>' : '') +
      '<section class="ov-certs">' + sum.map(function (s) {
        const types = { stage: 0, level: 0, final: 0 }; s.certGot.forEach(function (c) { types[c.type]++; });
        const latest = s.certGot.slice().sort(function (a, b) { return (a.date || '') < (b.date || '') ? 1 : -1; }).slice(0, 4);
        return '<article class="card glass ov-cert"' + tv(s.t) + '>' +
          '<header class="card-h"><h2><span class="hub-ic sm">' + icon(s.t.icon) + '</span>' + esc(s.t.nome) + '</h2><span class="muted sm">' + s.certGot.length + '/' + s.certs.length + '</span></header>' +
          bar(s.certGot.length, s.certs.length) +
          '<ul class="ov-mini"><li><small>Etapas</small><b>' + types.stage + '/9</b></li><li><small>Níveis</small><b>' + types.level + '/3</b></li><li><small>Final</small><b>' + types.final + '/1</b></li><li><small>Medalhas</small><b class="ov-medals">' + s.medals.map(function (m, i) { return '<i class="md m-' + ['bronze', 'prata', 'ouro'][i] + (m ? ' got' : '') + '"></i>'; }).join('') + '</b></li></ul>' +
          (latest.length ? '<ul class="ov-cert-list">' + latest.map(function (c) { return '<li><a href="#certificado" data-go="' + s.t.id + '|cert|' + c.id + '">' + icon('award') + '<span><b>' + esc(c.type === 'final' ? s.finalName : c.title) + '</b><small>' + esc(c.kicker) + (c.date ? ' · ' + fmtDate(c.date) : '') + '</small></span>' + icon('chevR') + '</a></li>'; }).join('') + '</ul>'
            : '<p class="muted sm">' + (s.pending.length ? 'Prova liberada: ' + esc(s.pending[0].type === 'final' ? s.finalName : s.pending[0].title) + '.' : 'O primeiro certificado é liberado na 1ª promoção (17 exercícios do nível Iniciante).') + '</p>') +
          '<div class="ov-acts">' + (s.pending.length ? '<button class="btn btn-primary sm" data-go="' + s.t.id + '|exam|' + s.pending[0].id + '">' + icon('play') + 'Fazer prova</button>' : '') +
          '<a class="btn btn-ghost sm" href="#certificado" data-go="' + s.t.id + '|certificado">Ver os 13' + icon('chevR') + '</a></div>' +
        '</article>';
      }).join('') + '</section>';
  }

  const RENDER = { dashboard: dashboard, trilha: trail, conquistas: achievements, ranking: ranking, certificado: certificates };
  function render(view, page, rerender) {
    const st = S().state;
    RENDER[page](view, st, rerender);
    bindGo(view, rerender);
  }

  /** Totais para o topo e o card lateral na visão geral. */
  function chrome(st) {
    const sum = summary(st), T = totals(sum);
    return { sum: sum, T: T };
  }

  global.Overview = { PAGES: PAGES, isOverview: isOverview, render: render, scopeBar: scopeBar, bindScope: bindScope, focus: focus, trackOfExercise: trackOfExercise, chrome: chrome, withTrack: withTrack };
})(window);
