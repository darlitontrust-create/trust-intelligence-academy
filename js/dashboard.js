/* =====================================================================
   dashboard.js — Painel de evolução do aluno
   ---------------------------------------------------------------------
   Mostra cargo, XP, nível, progresso geral (barra gigante), plano de
   carreira, gráfico de evolução de XP, medalhas, conquistas, ranking e
   histórico de promoções.
   ===================================================================== */
(function (global) {
  'use strict';
  const { esc, fmt, fmtDate, icon } = global.UI;
  const G = global.Gamification;
  const BANK = global.ExerciseBank;

  /** Primeiro exercício ainda não resolvido (para o botão "Continuar"). */
  function nextExercise(st) {
    return BANK.EXERCISES.find(function (e) { return !st.progress.solved[e.id]; }) || null;
  }
  function currentLevel(st) {
    const n = nextExercise(st);
    return n ? BANK.LEVELS[n.level - 1] : { id: 3, nome: 'Avançado (concluído)' };
  }
  function greeting() {
    const h = new Date().getHours();
    return h < 5 ? 'Boa madrugada' : h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite';
  }

  /* ----------------------- Gráfico de evolução (SVG) ----------------------- */
  function evolutionChart(st) {
    const hist = st.progress.history.slice().sort(function (a, b) { return a.at < b.at ? -1 : 1; });
    if (!hist.length) {
      return '<div class="chart-empty">' + icon('bars') + '<p>Sua curva de XP aparece aqui depois do primeiro exercício resolvido.</p></div>';
    }
    // agrega por dia
    const byDay = {};
    hist.forEach(function (h) { const t = new Date(h.at); const d = t.getFullYear() + '-' + String(t.getMonth() + 1).padStart(2, '0') + '-' + String(t.getDate()).padStart(2, '0'); byDay[d] = (byDay[d] || 0) + h.xp; });
    const days = Object.keys(byDay).sort();
    let acc = 0;
    let pts = days.map(function (d) { acc += byDay[d]; return { d: d, v: acc }; });
    if (pts.length === 1) {
      const prev = new Date(pts[0].d + 'T12:00:00'); prev.setDate(prev.getDate() - 1);
      pts.unshift({ d: prev.getFullYear() + '-' + String(prev.getMonth() + 1).padStart(2, '0') + '-' + String(prev.getDate()).padStart(2, '0'), v: 0 });
    }
    const W = 640, H = 230, L = 46, R = 16, T = 16, B = 34;
    const maxV = pts[pts.length - 1].v;
    const step = maxV <= 100 ? 25 : maxV <= 300 ? 50 : maxV <= 800 ? 200 : maxV <= 1600 ? 400 : 500;
    const top = Math.max(step, Math.ceil(maxV / step) * step);
    const x = function (i) { return L + (i / (pts.length - 1)) * (W - L - R); };
    const y = function (v) { return T + (1 - v / top) * (H - T - B); };
    const line = pts.map(function (p, i) { return (i ? 'L' : 'M') + x(i).toFixed(1) + ' ' + y(p.v).toFixed(1); }).join(' ');
    const area = line + ' L' + x(pts.length - 1).toFixed(1) + ' ' + y(0) + ' L' + x(0) + ' ' + y(0) + ' Z';
    let grid = '';
    for (let v = 0; v <= top; v += step) {
      grid += '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + y(v) + '" y2="' + y(v) + '" class="grid"/>' +
        '<text x="' + (L - 8) + '" y="' + (y(v) + 4) + '" text-anchor="end" class="axis">' + fmt(v) + '</text>';
    }
    const lbl = function (d) { const [yy, mm, dd] = d.split('-'); return dd + '/' + mm; };
    const xl = '<text x="' + x(0) + '" y="' + (H - 10) + '" class="axis" text-anchor="start">' + lbl(pts[0].d) + '</text>' +
      '<text x="' + x(pts.length - 1) + '" y="' + (H - 10) + '" class="axis" text-anchor="end">' + lbl(pts[pts.length - 1].d) + '</text>';
    const last = pts[pts.length - 1];
    const dots = pts.map(function (p, i) { return '<circle cx="' + x(i) + '" cy="' + y(p.v) + '" r="2.5" class="dot"><title>' + lbl(p.d) + ': ' + fmt(p.v) + ' XP</title></circle>'; }).join('');
    return '<svg class="chart" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="XP acumulado ao longo do tempo">' +
      '<defs><linearGradient id="gArea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--blue)" stop-opacity=".38"/><stop offset="1" stop-color="var(--blue)" stop-opacity="0"/></linearGradient>' +
      '<linearGradient id="gLine" x1="0" x2="1"><stop offset="0" stop-color="var(--cyan)"/><stop offset="1" stop-color="var(--violet)"/></linearGradient></defs>' +
      grid + '<path d="' + area + '" fill="url(#gArea)"/><path d="' + line + '" fill="none" stroke="url(#gLine)" stroke-width="2.5" stroke-linejoin="round"/>' + dots +
      '<circle cx="' + x(pts.length - 1) + '" cy="' + y(last.v) + '" r="6" class="dot-end"/>' +
      '<text x="' + Math.min(x(pts.length - 1), W - R - 4) + '" y="' + Math.max(y(last.v) - 12, 12) + '" text-anchor="end" class="end-lbl">' + fmt(last.v) + ' XP</text>' +
      xl + '</svg>';
  }

  /* ------------------------------- Render ------------------------------- */
  function render(el, st) {
    const p = st.progress;
    const solved = G.solvedList(st).length;
    const pct = solved / 150;
    const role = G.currentRole(st);
    const next = G.nextRole(st);
    const lvl = currentLevel(st);
    const tier = G.tierOf(p.xp);
    const nx = nextExercise(st);
    const earnedKeys = G.earnedPromotions(st).map(function (r) { return r.key; });
    const board = G.leaderboard(st);
    const meIdx = board.findIndex(function (b) { return b.me; });
    const slice = board.slice(Math.max(0, Math.min(meIdx - 2, board.length - 5)), Math.max(5, Math.min(meIdx + 3, board.length)));
    const achUnlocked = G.ACHIEVEMENTS.filter(function (a) { return p.achievements[a.key]; });
    const tr = global.Tracks.active();
    const pendingExams = global.Certificate.catalog(st).filter(function (c) { return c.eligible && !c.passed; });
    const firstAch = G.ACHIEVEMENTS[0];

    const levelBars = BANK.LEVELS.map(function (l) {
      const c = G.levelCount(st, l.id);
      return '<div class="lvl-row"><span>' + l.nome + '</span><div class="mini-bar"><i style="width:' + (c / 50 * 100) + '%"></i></div><b>' + c + '/50</b></div>';
    }).join('');

    el.innerHTML = global.Profile.summaryHtml(st.profile) +
      '<section class="dash-hero glass">' +
        '<div class="dash-hero-top">' +
          '<div>' +
            '<p class="eyebrow">' + greeting() + ', ' + esc(st.profile.apelido || st.profile.nome) + ' · ' + esc(tr.nome) + '</p>' +
            '<h1 class="role-title">' + esc(role.nome) + '</h1>' +
            '<p class="muted">' + esc(role.desc) + ' · Nível atual: <b>' + esc(lvl.nome) + '</b></p>' +
          '</div>' +
          (nx ? '<a class="btn btn-primary" href="#ex-' + nx.id + '">' + icon('play') + 'Continuar · ' + nx.levelName + ' ' + nx.pos + '/50</a>'
              : '<a class="btn btn-primary" href="#certificado">' + icon('award') + 'Ver certificado</a>') +
        '</div>' +
        '<div class="giant">' +
          '<div class="giant-head"><span>Progresso da trilha</span><b class="grad-num">' + Math.round(pct * 100) + '%</b></div>' +
          '<div class="giant-bar" role="progressbar" aria-valuenow="' + solved + '" aria-valuemin="0" aria-valuemax="150"><i style="width:' + (pct * 100) + '%"></i>' +
            '<span class="tick" style="left:33.333%"></span><span class="tick" style="left:66.666%"></span></div>' +
          '<div class="giant-legend"><span>Iniciante</span><span>Intermediário</span><span>Avançado</span></div>' +
        '</div>' +
      '</section>' +
      (pendingExams.length ? '<section class="exam-banner glass">' + icon('target') + '<span><b>' + (pendingExams.length > 1 ? pendingExams.length + ' provas liberadas' : 'Prova liberada') + ':</b> ' + esc(pendingExams.map(function (c) { return c.type === 'final' ? G.FINAL.nome : c.title; }).join(', ')) + '. Acerte 70% para liberar o certificado.</span>' +
        '<button class="btn btn-primary sm" id="dash-exam" data-cert="' + pendingExams[0].id + '">' + icon('play') + 'Fazer prova</button></section>' : '') +

      '<section class="stats">' +
        stat('XP total', fmt(p.xp), 'de ' + fmt(G.MAX_XP) + ' XP', 'sparkle') +
        stat('Nível atual', esc(lvl.nome.split(' ')[0]), 'Faixa ' + tier.nome, 'map') +
        stat('Exercícios', solved + '<small>/150</small>', (150 - solved) + ' restantes', 'check') +
        stat('Concluído', Math.round(pct * 1000) / 10 + '%', 'Carga estimada ' + Math.round(solved * 20 / 60) + 'h de 50h', 'clock') +
      '</section>' +

      '<div class="dash-grid">' +
        '<section class="card glass span2">' +
          '<header class="card-h"><h2>Evolução de XP</h2><span class="muted sm">acumulado por dia</span></header>' +
          evolutionChart(st) +
          '<div class="lvl-rows">' + levelBars + '</div>' +
        '</section>' +

        '<section class="card glass">' +
          '<header class="card-h"><h2>Próxima promoção</h2></header>' +
          (next ? '<div class="next-promo"><span class="role-chip">' + icon('award') + esc(next.role.nome) + '</span>' +
            '<div class="mini-bar lg"><i style="width:' + (next.pct * 100) + '%"></i></div>' +
            '<p class="muted">Faltam <b>' + next.remaining + '</b> exercício(s) ' + (next.role.final ? 'para concluir a trilha' : 'do nível ' + BANK.LEVELS[next.role.level - 1].nome) + '.</p></div>'
            : '<p class="muted">Você alcançou o topo da carreira: ' + esc(G.FINAL.nome) + '!</p>') +
          '<ol class="career">' + G.ALL_ROLES.map(function (r) {
            const got = earnedKeys.indexOf(r.key) >= 0, cur = r.key === role.key;
            return '<li class="' + (got ? 'got' : '') + (cur ? ' cur' : '') + (r.final ? ' final' : '') + '"><i></i><span>' + esc(r.nome) + '</span></li>';
          }).join('') + '</ol>' +
        '</section>' +

        '<section class="card glass">' +
          '<header class="card-h"><h2>Ranking</h2><a class="link" href="#ranking">Ver liga</a></header>' +
          '<div class="tier-badge tone-' + tier.tone + '">' + icon('shield') + '<div><b>' + tier.nome + '</b><span>' + board[meIdx].pos + 'º lugar na liga</span></div></div>' +
          '<ol class="board mini">' + slice.map(boardRow).join('') + '</ol>' +
        '</section>' +

        '<section class="card glass">' +
          '<header class="card-h"><h2>Medalhas</h2></header>' +
          '<div class="medals">' + G.MEDALS.map(function (m) {
            const got = G.levelCount(st, m.level) >= 50;
            return '<div class="medal ' + (got ? 'got tone-' + m.tone : 'locked') + '">' + icon(got ? 'medal' : 'lock') + '<b>' + m.nome + '</b><span>' + m.desc + '</span></div>';
          }).join('') + '</div>' +
        '</section>' +

        '<section class="card glass">' +
          '<header class="card-h"><h2>Conquistas</h2><a class="link" href="#conquistas">' + achUnlocked.length + '/' + G.ACHIEVEMENTS.length + '</a></header>' +
          (achUnlocked.length ? '<ul class="ach-list">' + achUnlocked.slice(-4).reverse().map(function (a) {
            return '<li>' + icon(a.icon) + '<div><b>' + esc(a.nome) + '</b><span>' + fmtDate(p.achievements[a.key]) + '</span></div></li>';
          }).join('') + '</ul>' : '<p class="muted">Resolva o primeiro exercício para desbloquear "' + esc(firstAch ? firstAch.nome : 'a primeira conquista') + '".</p>') +
        '</section>' +

        '<section class="card glass span2">' +
          '<header class="card-h"><h2>Histórico de promoções</h2></header>' +
          (p.promotions.length ? '<ul class="promo-hist">' + p.promotions.slice().reverse().map(function (h) {
            const r = G.ALL_ROLES.find(function (x) { return x.key === h.key; });
            return '<li><span class="role-chip' + (r.final ? ' legend' : '') + '">' + icon('award') + esc(r.nome) + '</span><span class="muted">' + fmtDate(h.at) + '</span></li>';
          }).join('') + '</ul>' : '<p class="muted">Sua primeira promoção, ' + esc(G.PROMOTIONS[0].nome) + ', chega com 17 exercícios do nível Iniciante.</p>') +
        '</section>' +
        (global.Related && global.Tracks.active().related ? '<section class="card glass span2 related-card"><header class="card-h"><h2>Cursos relacionados</h2></header>' + global.Related.html(global.Tracks.active(), true) + '</section>' : '') +
      '</div>';
    if (global.Related) global.Related.bind(el);
    const eb = el.querySelector('#dash-exam');
    if (eb) eb.onclick = function () { global.Exams.start(eb.dataset.cert); };
  }

  function stat(label, value, sub, ic) {
    return '<div class="stat glass">' + icon(ic) + '<span class="stat-l">' + label + '</span><b class="stat-v">' + value + '</b><span class="stat-s">' + sub + '</span></div>';
  }
  function boardRow(b) {
    return '<li class="' + (b.me ? 'me' : '') + (b.pos <= 3 ? ' top' + b.pos : '') + '"><span class="pos">' + b.pos + '</span><span class="nm">' + esc(b.nome) + (b.me ? ' <em>você</em>' : '') + '</span><span class="tier-dot tone-' + b.tier.tone + '" title="' + b.tier.nome + '"></span><b>' + fmt(b.xp) + '</b></li>';
  }

  global.Dashboard = { render: render, nextExercise: nextExercise, boardRow: boardRow, evolutionChart: evolutionChart };
})(window);
