/* =====================================================================
   achievements.js — XP, promoções, conquistas e ranking (por trilha)
   ---------------------------------------------------------------------
   • XP por dificuldade: fácil 10 · média 20 · difícil 30
     (metade do XP se o gabarito tiver sido revelado antes de acertar).
   • Cada trilha tem sua carreira: 3 promoções por nível (aos 17, 34 e 50
     exercícios do nível) + promoção final aos 150.
   • Conquistas comuns + conquistas próprias de cada trilha.
   • Tudo é resolvido para a trilha atual (Tracks.activeId()).
   ===================================================================== */
(function (global) {
  'use strict';

  const XP = { facil: 10, media: 20, dificil: 30 };
  const DIFF_LABEL = { facil: 'Fácil', media: 'Média', dificil: 'Difícil' };

  /* ------------------------------- Carreiras ------------------------------- */
  function career(names, descs, start, finalName, finalDesc) {
    const promos = names.map(function (n, i) {
      return { key: 'p' + (Math.floor(i / 3) + 1) + '-' + (i % 3 + 1), level: Math.floor(i / 3) + 1, need: [17, 34, 50][i % 3], nome: n, desc: descs[i] };
    });
    const fin = { key: 'final', level: 4, need: 150, nome: finalName, desc: finalDesc, final: true };
    return { START_ROLE: start, PROMOTIONS: promos, FINAL: fin, ALL_ROLES: promos.concat([fin]) };
  }
  const CAREERS = {
    sql: career(
      ['Explorador de Dados', 'Analista Aprendiz', 'Operador SQL', 'Especialista em Consultas', 'Arquiteto de Relatórios', 'Analista de Dados Pleno', 'Engenheiro SQL', 'Mestre das Consultas', 'Arquiteto de Dados'],
      ['Domina SELECT, filtros e ordenação.', 'Resume dados com agregações e GROUP BY.', 'Concluiu o nível Iniciante com subconsultas.',
        'Cruza tabelas com todos os tipos de JOIN.', 'Monta relatórios com CASE, CTEs e views.', 'Concluiu o nível Intermediário.',
        'Usa window functions com fluência.', 'Automatiza com triggers, procedures e MERGE.', 'Concluiu o nível Avançado.'],
      { key: 'trainee', nome: 'Trainee de Dados', desc: 'Primeiros passos na NexusMarket.' },
      'Lenda SQL', 'Concluiu os 150 exercícios da trilha de SQL.'),
    excel: career(
      ['Explorador de Planilhas', 'Analista de Fórmulas', 'Operador de Planilhas', 'Especialista em Funções', 'Construtor de Relatórios', 'Analista de Planilhas Pleno', 'Engenheiro de Planilhas', 'Mestre das Fórmulas', 'Arquiteto de Modelos'],
      ['Domina operações, referências e funções básicas.', 'Trabalha com SE, CONT.SE e funções de texto.', 'Concluiu o nível Iniciante com datas e SOMASE.',
        'Cruza planilhas com PROCV, PROCX e ÍNDICE + CORRESP.', 'Monta relatórios com SOMASES, SES e TEXTO.', 'Concluiu o nível Intermediário.',
        'Usa matrizes dinâmicas: FILTRO, CLASSIFICAR e ÚNICO.', 'Domina LET, SOMARPRODUTO e estatística.', 'Concluiu o nível Avançado.'],
      { key: 'trainee', nome: 'Assistente de Planilhas', desc: 'Primeiros passos nas planilhas da NexusMarket.' },
      'Lenda do Excel', 'Concluiu os 150 exercícios da trilha de Excel.'),
  };
  function C() { return CAREERS[global.Tracks.activeId()] || CAREERS.sql; }

  /* ------------------------------ Conquistas ------------------------------ */
  const isTopic = function (ex, list) { return list.some(function (t) { return ex.t.toUpperCase().indexOf(t) >= 0; }); };
  const solvedList = function (st) {
    return global.ExerciseBank.EXERCISES.filter(function (e) { return st.progress.solved[e.id]; });
  };
  const levelCount = function (st, lv) { return solvedList(st).filter(function (e) { return e.level === lv; }).length; };
  const has = function (topics) { return function (st) { return solvedList(st).some(function (e) { return isTopic(e, topics); }); }; };

  const COMMON = [
    { key: 'streak-5', nome: 'Precisão Cirúrgica', desc: 'Acerte 5 exercícios seguidos na primeira tentativa.', icon: 'target', test: function (st) { return st.progress.firstTryStreak >= 5; } },
    { key: 'scholar', nome: 'Estudioso', desc: 'Conclua 20 conteúdos em slides antes dos exercícios.', icon: 'book', test: function (st) { return Object.keys(st.progress.lessonsSeen || {}).length >= 20; } },
    { key: 'exam-ace', nome: 'Gabaritou', desc: 'Tire 100% em uma prova de certificado.', icon: 'award', test: function (st) { return Object.values(st.progress.exams || {}).some(function (x) { return x.best === 15; }); } },
    { key: 'ex-10', nome: 'Aquecimento', desc: 'Conclua 10 exercícios.', icon: 'star', test: function (st) { return solvedList(st).length >= 10; } },
    { key: 'ex-50', nome: '50 Exercícios Concluídos', desc: 'Meio caminho andado em volume.', icon: 'medal', test: function (st) { return solvedList(st).length >= 50; } },
    { key: 'ex-100', nome: '100 Exercícios Concluídos', desc: 'Dois terços da trilha.', icon: 'medal', test: function (st) { return solvedList(st).length >= 100; } },
    { key: 'xp-1000', nome: 'Mil Pontos', desc: 'Alcance 1.000 XP.', icon: 'sparkle', test: function (st) { return st.progress.xp >= 1000; } },
    { key: 'self-taught', nome: 'Autodidata', desc: 'Resolva 25 exercícios sem revelar o gabarito.', icon: 'bulb', test: function (st) { return solvedList(st).filter(function (e) { return !st.progress.solved[e.id].usedSolution; }).length >= 25; } },
    { key: 'night-owl', nome: 'Coruja', desc: 'Resolva um exercício depois das 22h.', icon: 'moon', test: function (st, ctx) { return !!(ctx && ctx.justSolved && new Date().getHours() >= 22); } },
  ];
  const SPECIFIC = {
    sql: [
      { key: 'first-select', nome: 'Primeiro SELECT', desc: 'Resolva seu primeiro exercício.', icon: 'play', test: function (st) { return solvedList(st).length >= 1; } },
      { key: 'first-join', nome: 'Primeira JOIN', desc: 'Resolva um exercício de JOIN.', icon: 'share', test: has(['JOIN']) },
      { key: 'first-cte', nome: 'Primeira CTE', desc: 'Resolva um exercício com WITH.', icon: 'code', test: has(['CTE']) },
      { key: 'first-window', nome: 'Janela Aberta', desc: 'Resolva sua primeira window function.', icon: 'bars', test: has(['ROW_NUMBER', 'RANK', 'OVER', 'LAG', 'LEAD', 'NTILE', 'FIRST_VALUE', 'CUME_DIST', 'MÉDIA MÓVEL']) },
      { key: 'first-trigger', nome: 'Gatilho Disparado', desc: 'Crie seu primeiro trigger.', icon: 'flame', test: has(['TRIGGER']) },
      { key: 'sql-master', nome: 'SQL Master', desc: 'Conclua os 150 exercícios.', icon: 'trophy', test: function (st) { return solvedList(st).length >= 150; } },
    ],
    excel: [
      { key: 'first-formula', nome: 'Primeira Fórmula', desc: 'Resolva seu primeiro exercício de Excel.', icon: 'play', test: function (st) { return solvedList(st).length >= 1; } },
      { key: 'first-if', nome: 'Tomador de Decisão', desc: 'Resolva um exercício com SE.', icon: 'share', test: function (st) { return solvedList(st).some(function (e) { return /^SES?\b|^SE\s|^SE$/.test(e.t.toUpperCase()); }); } },
      { key: 'first-lookup', nome: 'Primeiro PROCV', desc: 'Busque dados em outra planilha.', icon: 'search', test: has(['PROCV', 'PROCX', 'ÍNDICE']) },
      { key: 'first-dynamic', nome: 'Matriz Dinâmica', desc: 'Resolva um exercício com FILTRO, CLASSIFICAR ou ÚNICO.', icon: 'bars', test: has(['FILTRO', 'CLASSIFICAR', 'ÚNICO', 'SEQUÊNCIA']) },
      { key: 'first-let', nome: 'Fórmula Elegante', desc: 'Use LET para organizar um cálculo.', icon: 'flame', test: has(['LET']) },
      { key: 'excel-master', nome: 'Excel Master', desc: 'Conclua os 150 exercícios.', icon: 'trophy', test: function (st) { return solvedList(st).length >= 150; } },
    ],
  };
  function achievements() { return (SPECIFIC[global.Tracks.activeId()] || SPECIFIC.sql).slice(0, 1).concat(COMMON, (SPECIFIC[global.Tracks.activeId()] || SPECIFIC.sql).slice(1)); }

  /** Medalhas de conclusão de nível. */
  const MEDALS = [
    { level: 1, nome: 'Medalha Bronze', desc: 'Nível Iniciante completo', tone: 'bronze' },
    { level: 2, nome: 'Medalha Prata', desc: 'Nível Intermediário completo', tone: 'silver' },
    { level: 3, nome: 'Medalha Ouro', desc: 'Nível Avançado completo', tone: 'gold' },
  ];

  /* ------------------------- Promoções: cálculo ------------------------- */
  function earnedPromotions(st) {
    const total = solvedList(st).length;
    return C().ALL_ROLES.filter(function (p) { return p.final ? total >= 150 : levelCount(st, p.level) >= p.need; });
  }
  function currentRole(st) {
    const e = earnedPromotions(st);
    return e.length ? e[e.length - 1] : C().START_ROLE;
  }
  function nextRole(st) {
    const earned = earnedPromotions(st).map(function (p) { return p.key; });
    const next = C().ALL_ROLES.find(function (p) { return earned.indexOf(p.key) < 0; });
    if (!next) return null;
    const have = next.final ? solvedList(st).length : levelCount(st, next.level);
    const prevNeed = next.final ? 0 : (C().PROMOTIONS.filter(function (p) { return p.level === next.level && p.need < next.need; }).pop() || { need: 0 }).need;
    return { role: next, have: have, need: next.need, remaining: next.need - have, pct: Math.max(0, Math.min(1, (have - prevNeed) / (next.need - prevNeed))) };
  }

  /** Avalia novas promoções e conquistas após uma mudança de estado. */
  function evaluate(st, ctx) {
    const now = new Date().toISOString();
    const got = st.progress.promotions.map(function (p) { return p.key; });
    const newPromotions = earnedPromotions(st).filter(function (p) { return got.indexOf(p.key) < 0; });
    newPromotions.forEach(function (p) { st.progress.promotions.push({ key: p.key, at: now }); });
    const newAchievements = achievements().filter(function (a) { return !st.progress.achievements[a.key] && a.test(st, ctx); });
    newAchievements.forEach(function (a) { st.progress.achievements[a.key] = now; });
    if (solvedList(st).length >= 150 && !st.progress.completedAt) st.progress.completedAt = now;
    return { newPromotions: newPromotions, newAchievements: newAchievements };
  }

  /* --------------------------------- Ranking --------------------------------- */
  const TIERS = [
    { min: 0, nome: 'Bronze', tone: 'bronze' }, { min: 300, nome: 'Prata', tone: 'silver' }, { min: 900, nome: 'Ouro', tone: 'gold' },
    { min: 1700, nome: 'Platina', tone: 'platinum' }, { min: 2500, nome: 'Diamante', tone: 'diamond' }, { min: 3000, nome: 'Lenda', tone: 'legend' },
  ];
  function tierOf(xp) { return TIERS.filter(function (t) { return xp >= t.min; }).pop(); }
  const LEAGUE = [
    ['Marina Okada', 2870], ['Caio Bernardes', 2440], ['Lívia Antunes', 2010], ['Otávio Reis', 1690], ['Yasmin Prates', 1360],
    ['Gustavo Leal', 1080], ['Renata Sá', 820], ['Pedro Galvão', 590], ['Aline Cunha', 360], ['Tomás Viana', 210], ['Beatriz Moura', 90], ['Igor Matos', 30],
  ];
  function leaderboard(st) {
    const me = { nome: st.profile.apelido || st.profile.nome || 'Você', xp: st.progress.xp, me: true };
    const C = global.Cloud, real = C && C.uid && C.board(st.currentTrack);
    if (real) {   // liga real: alunos da plataforma (Firebase)
      return real.filter(function (r) { return r.uid !== C.uid; }).map(function (r) { return { nome: r.nome, xp: r.xp }; }).concat([me])
        .sort(function (a, b) { return b.xp - a.xp || (a.me ? -1 : b.me ? 1 : 0); })
        .map(function (p, i) { return Object.assign(p, { pos: i + 1, tier: tierOf(p.xp) }); });
    }
    return LEAGUE.map(function (p) { return { nome: p[0], xp: p[1] }; }).concat([me])
      .sort(function (a, b) { return b.xp - a.xp || (a.me ? -1 : b.me ? 1 : 0); })
      .map(function (p, i) { return Object.assign(p, { pos: i + 1, tier: tierOf(p.xp) }); });
  }

  global.Gamification = {
    XP: XP, DIFF_LABEL: DIFF_LABEL, MEDALS: MEDALS, TIERS: TIERS, CAREERS: CAREERS,
    get START_ROLE() { return C().START_ROLE; },
    get PROMOTIONS() { return C().PROMOTIONS; },
    get FINAL() { return C().FINAL; },
    get ALL_ROLES() { return C().ALL_ROLES; },
    get ACHIEVEMENTS() { return achievements(); },
    get MAX_XP() { return global.ExerciseBank.EXERCISES.reduce(function (s, e) { return s + XP[e.diff]; }, 0); },
    solvedList: solvedList, levelCount: levelCount, earnedPromotions: earnedPromotions, currentRole: currentRole, nextRole: nextRole, evaluate: evaluate, tierOf: tierOf, leaderboard: leaderboard,
  };
})(window);
