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

  /* ------------------------------ Brasões ------------------------------ */
  // Um brasão por patente, cada vez mais ornamentado: escudo e numeral romano;
  // depois borda dupla, louros, estrelas, asas, coroa e, na última, ouro.
  const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
  let uid = 0;
  function crest(i, opts) {
    opts = opts || {};
    const id = 'cr' + (++uid), gold = i === 6, locked = !!opts.locked;
    const c = locked ? ['#5d6382', '#3a3f58', '#262a3d'] : gold ? ['#fff1c2', '#f5c040', '#a8650f'] : ['#e4d4ff', '#a46bff', '#5b3fd6'];
    const ink = locked ? '#8e94b0' : gold ? '#3a2405' : '#ffffff', acc = locked ? '#6b7192' : gold ? '#ffe39a' : '#d9c6ff';
    let s = '<defs><linearGradient id="' + id + 'g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + c[0] + '"/><stop offset=".55" stop-color="' + c[1] + '"/><stop offset="1" stop-color="' + c[2] + '"/></linearGradient>' +
      '<linearGradient id="' + id + 'h" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".45"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>';
    // asas (Mestre em diante)
    if (i >= 4) [1, -1].forEach(function (d) {
      const t = d < 0 ? ' transform="translate(120 0) scale(-1 1)"' : '';
      s += '<g' + t + ' fill="' + acc + '" opacity="' + (locked ? '.5' : '.9') + '"><path d="M30 50 C14 46 6 36 4 26 C14 32 22 34 30 36 Z"/><path d="M30 60 C12 58 4 50 2 40 C13 46 22 48 30 48 Z"/><path d="M31 70 C15 70 7 63 5 55 C15 60 23 61 31 60 Z"/></g>';
    });
    // louros (Analista em diante)
    if (i >= 2) [1, -1].forEach(function (d) {
      const t = d < 0 ? ' transform="translate(120 0) scale(-1 1)"' : '';
      let leaves = '';
      for (let k = 0; k < 5; k++) { const a = 200 + k * 22, r = 41, cx = 60 + r * Math.cos(a * Math.PI / 180), cy = 66 + r * Math.sin(a * Math.PI / 180) * -1;
        leaves += '<ellipse cx="' + cx.toFixed(1) + '" cy="' + cy.toFixed(1) + '" rx="3.4" ry="7" transform="rotate(' + (a - 270 + 30) + ' ' + cx.toFixed(1) + ' ' + cy.toFixed(1) + ')"/>'; }
      s += '<g' + t + ' fill="' + acc + '" opacity="' + (locked ? '.45' : '.85') + '">' + leaves + '</g>';
    });
    // escudo
    s += '<path d="M60 16 L92 26 V58 C92 80 78 94 60 104 C42 94 28 80 28 58 V26 Z" fill="url(#' + id + 'g)" stroke="' + (locked ? '#4a5070' : 'rgba(255,255,255,.55)') + '" stroke-width="2"/>';
    s += '<path d="M60 16 L92 26 V58 C92 80 78 94 60 104 C42 94 28 80 28 58 V26 Z" fill="url(#' + id + 'h)"/>';
    // borda interna (Explorador em diante)
    if (i >= 1) s += '<path d="M60 23 L86 31 V58 C86 76 75 88 60 97 C45 88 34 76 34 58 V31 Z" fill="none" stroke="' + ink + '" stroke-opacity=".45" stroke-width="1.4"/>';
    // estrelas (Especialista em diante)
    const star = function (x, y, r) { let p = ''; for (let k = 0; k < 10; k++) { const a = -Math.PI / 2 + k * Math.PI / 5, rr = k % 2 ? r * 0.45 : r; p += (k ? 'L' : 'M') + (x + rr * Math.cos(a)).toFixed(1) + ' ' + (y + rr * Math.sin(a)).toFixed(1); } return '<path d="' + p + 'Z"/>'; };
    if (i >= 3) { const n = Math.min(3, i - 2), xs = n === 1 ? [60] : n === 2 ? [53, 67] : [47, 60, 73]; s += '<g fill="' + ink + '" opacity=".9">' + xs.map(function (x) { return star(x, 42, 4.6); }).join('') + '</g>'; }
    // numeral
    s += '<text x="60" y="' + (i >= 3 ? 76 : 70) + '" text-anchor="middle" font-family="Instrument Serif, Georgia, serif" font-size="' + (i >= 3 ? 26 : 30) + '" fill="' + ink + '">' + ROMAN[i] + '</text>';
    // coroa (Grão-Mestre em diante)
    if (i >= 5) s += '<path d="M44 14 L48 2 L54 10 L60 0 L66 10 L72 2 L76 14 Z" fill="' + acc + '" stroke="' + (locked ? '#4a5070' : 'rgba(255,255,255,.6)') + '" stroke-width="1"/>';
    const size = opts.size || 48;
    return '<svg class="crest' + (locked ? ' locked' : '') + '" viewBox="0 -4 120 112" width="' + size + '" height="' + size + '" role="img" aria-label="Brasão ' + RANKS[i].nome + (locked ? ' (bloqueado)' : '') + '">' + s + '</svg>';
  }

  global.Overall = { crest: crest, LEVELS: LEVELS, RANKS: RANKS, MAX: MAX, rankOf: rankOf, totalXp: totalXp, info: info, of: of, check: check, merge: merge };
})(typeof window !== 'undefined' ? window : globalThis);
