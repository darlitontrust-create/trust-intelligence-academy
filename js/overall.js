/* =====================================================================
   overall.js — Nível geral da academia (soma do XP de todas as trilhas)
   ---------------------------------------------------------------------
   30 níveis, com XP crescente a cada nível, agrupados em 7 patentes.
   A cada nível alcançado o aluno recebe uma promoção geral (modal no
   app.js); a mudança de patente ganha destaque maior.
   Estado: state.overall = { seen: último nível comemorado, history: { nível: data } }
   ===================================================================== */
(function (global) {
  'use strict';
  const MAX = 30;
  /** XP mínimo de cada nível: 150 × (nível − 1)^1,5, arredondado de 50 em 50. */
  const LEVELS = [];
  for (let L = 1; L <= MAX; L++) LEVELS.push({ level: L, min: Math.round(150 * Math.pow(L - 1, 1.5) / 50) * 50 });

  const RANKS = [
    { from: 1, nome: 'Iniciante da Academia', desc: 'Os primeiros passos em dados, BI e análise.', icon: 'play' },
    { from: 5, nome: 'Explorador de Dados', desc: 'Já transita por mais de uma trilha com confiança.', icon: 'map' },
    { from: 10, nome: 'Analista em Formação', desc: 'Domina os fundamentos e resolve casos de verdade.', icon: 'bars' },
    { from: 15, nome: 'Especialista Multidisciplinar', desc: 'Conecta SQL, planilhas, BI, estatística e gestão.', icon: 'target' },
    { from: 20, nome: 'Mestre da Academia', desc: 'Referência para os colegas em várias trilhas.', icon: 'medal' },
    { from: 25, nome: 'Grão-Mestre', desc: 'Poucos chegam aqui: domínio amplo e profundo.', icon: 'star' },
    { from: 30, nome: 'Lenda da Trust Academy', desc: 'O nível máximo da academia.', icon: 'trophy' },
  ];
  function rankOf(level) { return RANKS.filter(function (r) { return level >= r.from; }).pop(); }

  /** XP somado de todas as trilhas ativas. */
  function totalXp(st) {
    return global.Tracks.TRACKS.filter(function (t) { return t.status === 'ativo'; })
      .reduce(function (s, t) { return s + (((st.tracks || {})[t.id] || {}).xp || 0); }, 0);
  }
  /** Nível, patente e progresso até o próximo nível. */
  function info(xp) {
    const cur = LEVELS.filter(function (l) { return xp >= l.min; }).pop();
    const next = LEVELS[cur.level] || null;
    const rank = rankOf(cur.level), nextRank = RANKS.find(function (r) { return r.from > cur.level; }) || null;
    return {
      xp: xp, level: cur.level, min: cur.min, next: next, rank: rank, nextRank: nextRank, max: cur.level === MAX,
      pct: next ? (xp - cur.min) / (next.min - cur.min) : 1, remaining: next ? next.min - xp : 0,
    };
  }
  function of(st) { return info(totalXp(st)); }

  /**
   * Compara o nível atual com o último comemorado. Na primeira vez, só registra
   * o nível (sem comemorar o passado). Devolve os níveis novos, em ordem.
   */
  function check(st) {
    const cur = of(st).level;
    if (!st.overall || typeof st.overall.seen !== 'number') { st.overall = { seen: cur, history: (st.overall && st.overall.history) || {} }; return []; }
    if (!st.overall.history) st.overall.history = {};
    const out = [], now = new Date().toISOString();
    for (let L = st.overall.seen + 1; L <= cur; L++) { out.push(L); if (!st.overall.history[L]) st.overall.history[L] = now; }
    if (cur > st.overall.seen) st.overall.seen = cur;
    return out;
  }
  /** Une o estado de dois aparelhos (maior nível visto, datas mais antigas). */
  function merge(a, b) {
    a = a || {}; b = b || {};
    const h = Object.assign({}, b.history || {});
    Object.keys(a.history || {}).forEach(function (k) { if (!h[k] || String(a.history[k]) < String(h[k])) h[k] = a.history[k]; });
    const seen = Math.max(typeof a.seen === 'number' ? a.seen : 0, typeof b.seen === 'number' ? b.seen : 0);
    return typeof a.seen !== 'number' && typeof b.seen !== 'number' ? undefined : { seen: seen, history: h };
  }

  global.Overall = { LEVELS: LEVELS, RANKS: RANKS, MAX: MAX, rankOf: rankOf, totalXp: totalXp, info: info, of: of, check: check, merge: merge };
})(typeof window !== 'undefined' ? window : globalThis);
