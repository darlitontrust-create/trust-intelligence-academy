/* =====================================================================
   certificate.js — Certificados da trilha (13 no total)
   ---------------------------------------------------------------------
   • Etapa (9): um por promoção dentro de cada nível — visual simples.
   • Nível (3): ao concluir cada nível — visual elaborado.
   • Final (1): ao concluir os 150 exercícios — visual completo (cargo final do tema).
   Cada certificado só é liberado após a prova (15 questões, mínimo 70%).
   Layout: cor do tema, medalha (Bronze/Prata/Ouro), símbolo do tema num
   hexágono com estrelas indicando o nível.
   Cada tipo tem um brasão próprio, desenhado em <canvas>:
     etapa → faixa lateral com hexágono do tema, estrelas da etapa e medalha
     nível → escudo com louros, estrelas e faixa
     final → escudo dourado com coroa, raios, louros e o logo
   Carga horária: exercícios × 20 min.
   Ações: Baixar PDF (jsPDF), Imprimir, Compartilhar. Dentro de um
   visualizador que bloqueia arquivos, mostra a imagem para salvar.
   ===================================================================== */
(function (global) {
  'use strict';
  const { esc, icon, toast, modal, copyText, framed, fmt } = global.UI;
  const G = global.Gamification;
  const BANK = global.ExerciseBank;

  const MIN_PER_EX = 20;
  const W = 1600, H = 1130;
  const F = {
    display: '"Instrument Serif", Georgia, serif',
    sans: 'Geist, "Segoe UI", system-ui, sans-serif',
    mono: '"Geist Mono", ui-monospace, monospace',
  };
  const LEVEL_NAMES = { 1: 'Iniciante', 2: 'Intermediário', 3: 'Avançado' };
  /** Paleta do certificado: sempre a cor do tema (a final soma dourado). */
  function tonesFor(tr) {
    const t = {};
    [1, 2, 3].forEach(function (lv) { t[lv] = { a: tr.color.a, b: tr.color.b, name: LEVEL_NAMES[lv] }; });
    t.final = { a: '#ffd27a', b: '#ff9d5c', name: G.FINAL.nome };
    return t;
  }
  /** Medalhas por nível: Iniciante = Bronze, Intermediário = Prata, Avançado e final = Ouro. */
  const MEDALS = {
    1: { name: 'Bronze', a: '#ffd2ae', b: '#cd7f45', c: '#6e3a17' },
    2: { name: 'Prata', a: '#ffffff', b: '#b9c0d4', c: '#596079' },
    3: { name: 'Ouro', a: '#fff3c4', b: '#f5c040', c: '#94600f' },
  };
  const PASS = 11, QUESTIONS = 15;
  const STAGES = [[1, 17], [18, 34], [35, 50]];   // faixas de exercícios de cada etapa
  
  const logoImg = new Image();
  logoImg.src = 'assets/logo-256.png';

  /* ------------------------------ Catálogo ------------------------------ */
  function hoursTxt(n) {
    const m = n * MIN_PER_EX, h = Math.floor(m / 60), r = m % 60;
    return r ? h + 'h' + String(r).padStart(2, '0') + 'min' : h + ' horas';
  }
  function promoDate(st, key) {
    const p = st.progress.promotions.find(function (x) { return x.key === key; });
    return p ? p.at : null;
  }
  /** Conteúdos (palavras-chave das aulas) de uma faixa de exercícios. */
  function topicsOf(list) {
    const out = [];
    list.forEach(function (e) {
      const kw = global.Lessons ? global.Lessons.forExercise(e).kw : e.t;
      if (out.indexOf(kw) < 0) out.push(kw);
    });
    return out;
  }
  /** Lista os 13 certificados com estado de liberação. */
  function lessonKeys(list) {
    const out = [];
    list.forEach(function (e) { const l = global.Lessons && global.Lessons.forExercise(e); if (l && out.indexOf(l.key) < 0) out.push(l.key); });
    return out;
  }
  /** Estado da prova e liberação (elegível + aprovado na prova). */
  function withExam(st, c) {
    const ex = (st.progress.exams || {})[c.id] || null;
    c.eligible = c.have >= c.need;
    c.exam = ex;
    c.passed = !!(ex && ex.passedAt);
    c.unlocked = c.eligible && c.passed;
    c.examScore = ex && ex.best != null ? ex.best : null;
    if (c.passed) c.date = ex.passedAt;
    return c;
  }
  function catalog(st) {
    const out = [];
    const tr = global.Tracks.active();
    const TONES = tonesFor(tr);
    [1, 2, 3].forEach(function (lv) {
      const list = BANK.EXERCISES.filter(function (e) { return e.level === lv; });
      const have = G.levelCount(st, lv);
      const promos = G.PROMOTIONS.filter(function (p) { return p.level === lv; });
      promos.forEach(function (p, i) {
        const range = STAGES[i];
        const exs = list.filter(function (e) { return e.pos >= range[0] && e.pos <= range[1]; });
        out.push({
          id: 'stage-' + lv + '-' + (i + 1), type: 'stage', level: lv, stage: i + 1, tone: TONES[lv], track: tr, medal: MEDALS[lv], lessons: lessonKeys(exs),
          title: p.nome, kicker: 'Certificado de Etapa', scope: 'Nível ' + TONES[lv].name + ' · Etapa ' + (i + 1) + ' de 3',
          exCount: exs.length, range: range, topics: topicsOf(exs), hours: hoursTxt(exs.length),
          xp: exs.reduce(function (s, e) { return s + (st.progress.solved[e.id] ? st.progress.solved[e.id].xp : 0); }, 0),
          role: p.nome, have: have, need: p.need, date: promoDate(st, p.key),
        });
        withExam(st, out[out.length - 1]);
      });
      const last = promos[promos.length - 1];
      out.push({
        id: 'level-' + lv, type: 'level', level: lv, tone: TONES[lv], track: tr, medal: MEDALS[lv], lessons: lessonKeys(list),
        title: 'Nível ' + TONES[lv].name, kicker: 'Certificado de Nível', scope: tr.nome + ' · Nível ' + lv + ' de 3',
        exCount: list.length, topics: topicsOf(list), hours: hoursTxt(list.length),
        xp: list.reduce(function (s, e) { return s + (st.progress.solved[e.id] ? st.progress.solved[e.id].xp : 0); }, 0),
        role: last.nome, have: have, need: 50, date: promoDate(st, last.key),
      });
      withExam(st, out[out.length - 1]);
    });
    const total = G.solvedList(st).length;
    out.push({
      id: 'final', type: 'final', level: 3, tone: TONES.final, track: tr, medal: MEDALS[3], lessons: lessonKeys(BANK.EXERCISES),
      title: 'Certificado de Conclusão em ' + tr.nome, kicker: 'Certificado Final', scope: tr.nome + ' · Trilha completa · 3 níveis',
      exCount: 150, topics: topicsOf(BANK.EXERCISES), hours: '50 horas', xp: st.progress.xp,
      role: G.FINAL.nome, have: total, need: 150, date: st.progress.completedAt,
    });
    withExam(st, out[out.length - 1]);
    return out;
  }
  /** Certificados liberados por uma promoção (usado nos avisos). */
  function forPromotion(key) {
    if (key === 'final') return ['final'];
    const m = key.match(/^p(\d)-(\d)$/);
    if (!m) return [];
    return ['stage-' + m[1] + '-' + m[2]].concat(m[2] === '3' ? ['level-' + m[1]] : []);
  }

  function personOf(st) {
    const full = (st.profile.nome + ' ' + st.profile.sobrenome).trim();
    return { full: full || 'Seu nome aqui', social: st.profile.apelido || '' };
  }
  function verificationCode(s) {
    let h = 0x811c9dc5;
    for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
    const hex = h.toString(16).toUpperCase().padStart(8, '0');
    return 'TSA-' + hex.slice(0, 4) + '-' + hex.slice(4);
  }
  function dateTxt(iso) { return new Date(iso || Date.now()).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }); }

  /* ---------------------------- Utilidades de desenho ---------------------------- */
  function rr(c, x, y, w, h, r) {
    c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r);
    c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath();
  }
  function lin(c, x0, y0, x1, y1, stops) {
    const g = c.createLinearGradient(x0, y0, x1, y1);
    stops.forEach(function (s) { g.addColorStop(s[0], s[1]); });
    return g;
  }
  function alpha(hex, a) {
    const n = parseInt(hex.slice(1), 16);
    return 'rgba(' + (n >> 16) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')';
  }
  function txt(c, s, x, y, font, fill, align, spacing, glowColor, blur) {
    c.save();
    c.font = font; c.fillStyle = fill; c.textAlign = align || 'left'; c.textBaseline = 'alphabetic';
    if ('letterSpacing' in c) c.letterSpacing = (spacing || 0) + 'px';
    if (glowColor) { c.shadowColor = glowColor; c.shadowBlur = blur || 18; }
    c.fillText(s, x, y);
    c.restore();
  }
  function fitFont(c, s, maxW, size, family, weight) {
    let f = size;
    c.save();
    while (f > 18) { c.font = (weight || '') + ' ' + f + 'px ' + family; if (c.measureText(s).width <= maxW) break; f -= 2; }
    c.restore();
    return (weight || '') + ' ' + f + 'px ' + family;
  }
  function wrap(c, s, x, y, maxW, lh, font, fill, align) {
    c.save(); c.font = font; c.fillStyle = fill; c.textAlign = align || 'left';
    const words = s.split(' '); let line = '';
    words.forEach(function (w) {
      const t = line ? line + ' ' + w : w;
      if (c.measureText(t).width > maxW && line) { c.fillText(line, x, y); line = w; y += lh; } else line = t;
    });
    if (line) c.fillText(line, x, y);
    c.restore();
    return y;
  }
  /** Gerador pseudoaleatório com semente (estrelas sempre no mesmo lugar). */
  function rng(seed) { let s = seed; return function () { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; }

  function background(c, tone, rich) {
    c.fillStyle = '#05060b'; c.fillRect(0, 0, W, H);
    const g1 = c.createRadialGradient(W * 0.12, H * 0.05, 0, W * 0.12, H * 0.05, W * 0.6);
    g1.addColorStop(0, alpha(tone.a, rich ? 0.3 : 0.2)); g1.addColorStop(1, 'rgba(0,0,0,0)');
    c.fillStyle = g1; c.fillRect(0, 0, W, H);
    const g2 = c.createRadialGradient(W * 0.95, H * 0.95, 0, W * 0.95, H * 0.95, W * 0.6);
    g2.addColorStop(0, alpha(tone.b, rich ? 0.28 : 0.16)); g2.addColorStop(1, 'rgba(0,0,0,0)');
    c.fillStyle = g2; c.fillRect(0, 0, W, H);
    // grade de "tabela" que some nas bordas
    c.save(); c.strokeStyle = 'rgba(150,165,255,0.05)'; c.lineWidth = 1;
    for (let x = 0; x <= W; x += 40) { c.beginPath(); c.moveTo(x + 0.5, 0); c.lineTo(x + 0.5, H); c.stroke(); }
    for (let y = 0; y <= H; y += 40) { c.beginPath(); c.moveTo(0, y + 0.5); c.lineTo(W, y + 0.5); c.stroke(); }
    c.restore();
  }
  function sparkles(c, n, seed, colors) {
    const r = rng(seed);
    for (let i = 0; i < n; i++) {
      const x = r() * W, y = r() * H, s = r() * 1.8 + 0.4;
      c.save(); c.globalAlpha = 0.25 + r() * 0.6; c.fillStyle = colors[i % colors.length];
      c.shadowColor = c.fillStyle; c.shadowBlur = 8;
      c.beginPath(); c.arc(x, y, s, 0, Math.PI * 2); c.fill(); c.restore();
    }
  }
  function glassPanel(c, x, y, w, h, r, strokeStyle) {
    c.save();
    rr(c, x, y, w, h, r);
    c.fillStyle = 'rgba(18,22,38,0.62)'; c.fill();
    c.strokeStyle = strokeStyle || 'rgba(150,165,255,0.2)'; c.lineWidth = 1.5; c.stroke();
    // reflexo superior do vidro
    c.clip();
    c.fillStyle = lin(c, 0, y, 0, y + h * 0.5, [[0, 'rgba(255,255,255,0.06)'], [1, 'rgba(255,255,255,0)']]);
    c.fillRect(x, y, w, h * 0.5);
    c.restore();
  }
  function neonFrame(c, inset, r, grad, width, glowColor, blur) {
    c.save(); rr(c, inset, inset, W - inset * 2, H - inset * 2, r);
    c.strokeStyle = grad; c.lineWidth = width; c.shadowColor = glowColor; c.shadowBlur = blur; c.stroke(); c.restore();
  }
  function corners(c, inset, len, color, width) {
    c.save(); c.strokeStyle = color; c.lineWidth = width; c.lineCap = 'round'; c.shadowColor = color; c.shadowBlur = 14;
    [[inset, inset, 1, 1], [W - inset, inset, -1, 1], [inset, H - inset, 1, -1], [W - inset, H - inset, -1, -1]].forEach(function (p) {
      c.beginPath(); c.moveTo(p[0], p[1] + len * p[3]); c.lineTo(p[0], p[1]); c.lineTo(p[0] + len * p[2], p[1]); c.stroke();
    });
    c.restore();
  }

  /* -------------------------------- Brasões -------------------------------- */
  function shieldPath(c, cx, cy, w, h) {
    const x0 = cx - w / 2, x1 = cx + w / 2, y0 = cy - h / 2, y1 = cy + h / 2;
    c.beginPath(); c.moveTo(x0, y0 + h * 0.08);
    c.quadraticCurveTo(cx - w * 0.25, y0 + h * 0.03, cx, y0);
    c.quadraticCurveTo(cx + w * 0.25, y0 + h * 0.03, x1, y0 + h * 0.08);
    c.lineTo(x1, cy + h * 0.04);
    c.bezierCurveTo(x1, cy + h * 0.3, cx + w * 0.24, y1 - h * 0.1, cx, y1);
    c.bezierCurveTo(cx - w * 0.24, y1 - h * 0.1, x0, cy + h * 0.3, x0, cy + h * 0.04);
    c.closePath();
  }
  function starPath(c, cx, cy, r) {
    c.beginPath();
    for (let i = 0; i < 10; i++) {
      const a = -Math.PI / 2 + i * Math.PI / 5, rad = i % 2 ? r * 0.45 : r;
      c.lineTo(cx + Math.cos(a) * rad, cy + Math.sin(a) * rad);
    }
    c.closePath();
  }
  /** Ramo de louros: haste em arco + folhas alongadas apontando para cima, alternadas. */
  function laurel(c, cx, cy, r, fill, leaves, size) {
    [-1, 1].forEach(function (side) {
      c.save();
      c.strokeStyle = fill; c.lineWidth = size * 0.1; c.lineCap = 'round';
      const a0 = Math.PI / 2 + side * -0.12, a1 = Math.PI / 2 + side * -1.7;   // de baixo até o alto
      c.beginPath(); c.arc(cx, cy, r, a0, a1, side > 0); c.stroke();
      for (let i = 0; i < leaves; i++) {
        const t = (i + 0.5) / leaves;
        const a = a0 + (a1 - a0) * t;
        const x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r;
        const grow = a + (side > 0 ? -Math.PI / 2 : Math.PI / 2);      // direção em que o ramo cresce
        const len = size * (1.05 - t * 0.35);
        [-1, 1].forEach(function (k) {
          c.save(); c.translate(x, y); c.rotate(grow + k * 0.62);
          c.beginPath();
          c.moveTo(0, 0);
          c.quadraticCurveTo(len * 0.45, -len * 0.32, len * 1.15, 0);
          c.quadraticCurveTo(len * 0.45, len * 0.32, 0, 0);
          c.fillStyle = fill; c.fill(); c.restore();
        });
      }
      // folha na ponta
      const xt = cx + Math.cos(a1) * r, yt = cy + Math.sin(a1) * r;
      c.save(); c.translate(xt, yt); c.rotate(a1 + (side > 0 ? -Math.PI / 2 : Math.PI / 2));
      c.beginPath(); c.moveTo(0, 0); c.quadraticCurveTo(size * 0.4, -size * 0.25, size, 0); c.quadraticCurveTo(size * 0.4, size * 0.25, 0, 0);
      c.fillStyle = fill; c.fill(); c.restore();
      c.restore();
    });
  }
  function ribbon(c, cx, cy, w, h, fill, label, font, textFill) {
    c.save();
    const tail = h * 0.9;
    // pontas
    [-1, 1].forEach(function (s) {
      c.beginPath();
      const x = cx + s * (w / 2 - tail * 0.2);
      c.moveTo(x, cy - h * 0.3); c.lineTo(x + s * tail * 1.1, cy - h * 0.3); c.lineTo(x + s * tail * 0.75, cy + h * 0.2);
      c.lineTo(x + s * tail * 1.1, cy + h * 0.7); c.lineTo(x, cy + h * 0.7); c.closePath();
      c.fillStyle = 'rgba(0,0,0,0.35)'; c.fill(); c.fillStyle = fill; c.globalAlpha = 0.75; c.fill(); c.globalAlpha = 1;
    });
    // faixa principal levemente curva
    c.beginPath();
    c.moveTo(cx - w / 2, cy - h / 2); c.quadraticCurveTo(cx, cy - h / 2 + h * 0.35, cx + w / 2, cy - h / 2);
    c.lineTo(cx + w / 2, cy + h / 2); c.quadraticCurveTo(cx, cy + h / 2 + h * 0.35, cx - w / 2, cy + h / 2); c.closePath();
    c.fillStyle = fill; c.shadowColor = 'rgba(0,0,0,0.5)'; c.shadowBlur = 12; c.fill();
    c.restore();
    txt(c, label, cx, cy + h * 0.22, font, textFill, 'center', 3);
  }
  function dbIcon(c, cx, cy, s, stroke) {
    c.save(); c.strokeStyle = stroke; c.lineWidth = s * 0.08; c.lineCap = 'round';
    const w = s * 0.62, h = s * 0.2, top = cy - s * 0.42, bot = cy + s * 0.42;
    c.beginPath(); c.ellipse(cx, top, w / 2, h / 2, 0, 0, Math.PI * 2); c.stroke();
    [0, 0.42, 0.84].forEach(function (k, i) {
      if (!i) return;
      c.beginPath(); c.ellipse(cx, top + s * k, w / 2, h / 2, 0, 0, Math.PI); c.stroke();
    });
    c.beginPath(); c.moveTo(cx - w / 2, top); c.lineTo(cx - w / 2, bot); c.moveTo(cx + w / 2, top); c.lineTo(cx + w / 2, bot); c.stroke();
    c.restore();
  }

  /** Símbolo de cada tema, desenhado na cor recebida. */
  function trackSymbol(c, kind, cx, cy, s, color) {
    if (kind === 'sql') return dbIcon(c, cx, cy, s, color);
    c.save(); c.strokeStyle = color; c.fillStyle = color; c.lineWidth = s * 0.075; c.lineCap = 'round'; c.lineJoin = 'round';
    if (kind === 'excel') {
      const w = s * 0.8, h = s * 0.68, x = cx - w / 2, y = cy - h / 2;
      c.save(); rr(c, x, y, w, h, s * 0.08); c.clip(); c.globalAlpha = 0.32; c.fillRect(x, y, w, h * 0.3); c.fillRect(x, y, w * 0.3, h); c.restore();
      rr(c, x, y, w, h, s * 0.08); c.stroke();
      c.lineWidth = s * 0.045; c.beginPath();
      c.moveTo(x, y + h * 0.3); c.lineTo(x + w, y + h * 0.3); c.moveTo(x, y + h * 0.65); c.lineTo(x + w, y + h * 0.65);
      c.moveTo(x + w * 0.3, y); c.lineTo(x + w * 0.3, y + h); c.moveTo(x + w * 0.65, y); c.lineTo(x + w * 0.65, y + h); c.stroke();
    } else if (kind === 'powerbi') {
      [0.38, 0.6, 0.82, 1].forEach(function (k, i) {
        const bw = s * 0.15, bh = s * 0.78 * k, x = cx - s * 0.36 + i * s * 0.2;
        rr(c, x, cy + s * 0.39 - bh, bw, bh, s * 0.04); c.globalAlpha = 0.55 + i * 0.15; c.fill();
      });
    } else if (kind === 'python') {
      c.font = '700 ' + Math.round(s * 0.7) + 'px ' + F.mono; c.textAlign = 'center'; c.textBaseline = 'middle';
      c.fillText('{ }', cx, cy + s * 0.02);
    } else if (kind === 'estatistica') {
      const w = s * 0.86, base = cy + s * 0.3, top = s * 0.62;
      c.beginPath();
      for (let i = 0; i <= 40; i++) { const t = i / 40, x = cx - w / 2 + w * t, z = (t - 0.5) * 5.2; c.lineTo(x, base - top * Math.exp(-z * z / 2)); }
      c.stroke();
      c.lineWidth = s * 0.05; c.beginPath(); c.moveTo(cx - w / 2, base); c.lineTo(cx + w / 2, base); c.stroke();
      c.setLineDash([s * 0.05, s * 0.06]); c.beginPath(); c.moveTo(cx, base); c.lineTo(cx, base - top); c.stroke();
    } else {
      const star4 = function (x, y, r) { c.beginPath(); c.moveTo(x, y - r); c.quadraticCurveTo(x + r * 0.16, y - r * 0.16, x + r, y); c.quadraticCurveTo(x + r * 0.16, y + r * 0.16, x, y + r); c.quadraticCurveTo(x - r * 0.16, y + r * 0.16, x - r, y); c.quadraticCurveTo(x - r * 0.16, y - r * 0.16, x, y - r); c.fill(); };
      star4(cx - s * 0.06, cy + s * 0.04, s * 0.38); star4(cx + s * 0.27, cy - s * 0.26, s * 0.14);
    }
    c.restore();
  }
  function hexPath(c, cx, cy, r) {
    c.beginPath();
    for (let i = 0; i < 6; i++) { const a = -Math.PI / 2 + i * Math.PI / 3; c.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r); }
    c.closePath();
  }
  /** Hexágono do tema: símbolo na cor do tema e estrelas de nível acima. */
  function hexBadge(c, cx, cy, r, tr, stars, starColor) {
    const g = lin(c, cx - r, cy - r, cx + r, cy + r, [[0, tr.color.a], [1, tr.color.b]]);
    const halo = c.createRadialGradient(cx, cy, 0, cx, cy, r * 1.6);
    halo.addColorStop(0, alpha(tr.color.a, 0.22)); halo.addColorStop(1, 'rgba(0,0,0,0)');
    c.fillStyle = halo; c.fillRect(cx - r * 1.6, cy - r * 1.6, r * 3.2, r * 3.2);
    c.save(); hexPath(c, cx, cy, r);
    const fill = c.createRadialGradient(cx, cy - r * 0.3, 0, cx, cy, r);
    fill.addColorStop(0, alpha(tr.color.b, 0.28)); fill.addColorStop(1, 'rgba(8,10,20,0.95)');
    c.fillStyle = fill; c.fill(); c.strokeStyle = g; c.lineWidth = r * 0.07; c.shadowColor = tr.color.a; c.shadowBlur = 24; c.stroke(); c.restore();
    c.save(); hexPath(c, cx, cy, r * 0.82); c.strokeStyle = alpha(tr.color.a, 0.4); c.lineWidth = 1.5; c.stroke(); c.restore();
    c.save(); c.shadowColor = tr.color.a; c.shadowBlur = 18; trackSymbol(c, tr.id, cx, cy, r * 0.95, tr.color.a); c.restore();
    for (let i = 0; i < stars; i++) {
      const x = cx + (i - (stars - 1) / 2) * r * 0.42;
      c.save(); starPath(c, x, cy - r - r * 0.3, r * 0.16); c.fillStyle = starColor || tr.color.a; c.shadowColor = starColor || tr.color.a; c.shadowBlur = 14; c.fill(); c.restore();
    }
  }
  /** Medalha geométrica (hexágono lapidado em Bronze, Prata ou Ouro) com fitas angulares na cor do tema. */
  function drawMedal(c, cx, cy, r, m, tr, label) {
    // fitas angulares
    [-1, 1].forEach(function (sd, i) {
      c.save(); c.beginPath();
      c.moveTo(cx + sd * r * 0.18, cy - r * 0.55); c.lineTo(cx + sd * r * 0.56, cy - r * 1.55);
      c.lineTo(cx + sd * r * 0.96, cy - r * 1.55); c.lineTo(cx + sd * r * 0.6, cy - r * 0.5); c.closePath();
      c.fillStyle = lin(c, cx, cy - r * 1.6, cx, cy - r * 0.5, [[0, i ? tr.color.b : tr.color.a], [1, alpha(i ? tr.color.a : tr.color.b, 0.75)]]);
      c.shadowColor = 'rgba(0,0,0,0.5)'; c.shadowBlur = 8; c.fill(); c.restore();
      c.save(); c.beginPath(); c.moveTo(cx + sd * r * 0.56, cy - r * 1.55); c.lineTo(cx + sd * r * 0.96, cy - r * 1.55);
      c.strokeStyle = alpha('#ffffff', 0.35); c.lineWidth = 2; c.stroke(); c.restore();
    });
    // halo
    const halo = c.createRadialGradient(cx, cy, 0, cx, cy, r * 1.7);
    halo.addColorStop(0, alpha(m.b, 0.28)); halo.addColorStop(1, 'rgba(0,0,0,0)');
    c.fillStyle = halo; c.fillRect(cx - r * 1.7, cy - r * 1.7, r * 3.4, r * 3.4);
    // corpo metálico
    c.save(); hexPath(c, cx, cy, r);
    c.fillStyle = lin(c, cx - r, cy - r, cx + r, cy + r, [[0, m.a], [0.45, m.b], [1, m.c]]);
    c.shadowColor = alpha(m.b, 0.85); c.shadowBlur = 28; c.fill(); c.restore();
    // facetas (lapidação): 6 triângulos alternando luz e sombra
    const ri = r * 0.8;
    for (let i = 0; i < 6; i++) {
      const a1 = -Math.PI / 2 + i * Math.PI / 3, a2 = a1 + Math.PI / 3;
      c.save(); c.beginPath(); c.moveTo(cx, cy);
      c.lineTo(cx + Math.cos(a1) * ri, cy + Math.sin(a1) * ri); c.lineTo(cx + Math.cos(a2) * ri, cy + Math.sin(a2) * ri); c.closePath();
      c.fillStyle = [alpha('#ffffff', 0.32), alpha('#ffffff', 0.12), 'rgba(0,0,0,0.12)', 'rgba(0,0,0,0.26)', 'rgba(0,0,0,0.14)', alpha('#ffffff', 0.18)][i];
      c.fill(); c.restore();
    }
    c.save(); hexPath(c, cx, cy, ri); c.strokeStyle = alpha(m.c, 0.75); c.lineWidth = r * 0.04; c.stroke(); c.restore();
    c.save(); hexPath(c, cx, cy, r); c.strokeStyle = lin(c, cx, cy - r, cx, cy + r, [[0, alpha('#ffffff', 0.8)], [1, alpha(m.c, 0.9)]]); c.lineWidth = r * 0.05; c.stroke(); c.restore();
    // núcleo com estrela
    c.save(); hexPath(c, cx, cy, r * 0.42); c.fillStyle = lin(c, cx, cy - r * 0.4, cx, cy + r * 0.4, [[0, m.c], [1, alpha(m.c, 0.75)]]); c.fill();
    c.strokeStyle = alpha(m.a, 0.9); c.lineWidth = r * 0.03; c.stroke(); c.restore();
    c.save(); starPath(c, cx, cy + r * 0.02, r * 0.26); c.fillStyle = lin(c, cx, cy - r * 0.26, cx, cy + r * 0.26, [[0, '#ffffff'], [1, m.a]]); c.shadowColor = m.a; c.shadowBlur = 10; c.fill(); c.restore();
    if (label !== false) {
      txt(c, 'MEDALHA', cx, cy + r + 30, '600 13px ' + F.mono, 'rgba(195,200,222,0.7)', 'center', 3);
      txt(c, m.name.toUpperCase(), cx, cy + r + 56, '700 20px ' + F.sans, m.b, 'center', 4, alpha(m.b, 0.5), 10);
    }
  }
  function themeLabel(c, cx, y, tr) {
    txt(c, 'TEMA', cx, y, '600 13px ' + F.mono, 'rgba(195,200,222,0.7)', 'center', 3);
    txt(c, tr.short.toUpperCase(), cx, y + 26, '700 20px ' + F.sans, tr.color.a, 'center', 4, alpha(tr.color.a, 0.5), 10);
  }
  function examTxt(cert) { return cert.examScore != null ? cert.examScore + '/' + QUESTIONS + ' (' + Math.round(cert.examScore / QUESTIONS * 100) + '%)' : '—'; }

  /** Brasão de nível: escudo com louros, estrelas e faixa. */
  function crestLevel(c, cx, cy, s, tone, level) {
    const halo = c.createRadialGradient(cx, cy, 0, cx, cy, s * 0.9);
    halo.addColorStop(0, alpha(tone.a, 0.28)); halo.addColorStop(1, 'rgba(0,0,0,0)');
    c.fillStyle = halo; c.fillRect(cx - s, cy - s, s * 2, s * 2);
    c.save(); c.shadowColor = tone.a; c.shadowBlur = 12;
    laurel(c, cx, cy + s * 0.02, s * 0.6, lin(c, cx - s, cy, cx + s, cy, [[0, tone.a], [1, tone.b]]), 8, s * 0.16);
    c.restore();
    const grad = lin(c, cx - s / 2, cy - s / 2, cx + s / 2, cy + s / 2, [[0, tone.a], [1, tone.b]]);
    c.save(); shieldPath(c, cx, cy, s * 0.78, s * 0.98);
    const fill = c.createRadialGradient(cx, cy - s * 0.2, 0, cx, cy, s * 0.6);
    fill.addColorStop(0, alpha(tone.b, 0.35)); fill.addColorStop(1, 'rgba(8,10,20,0.96)');
    c.fillStyle = fill; c.fill();
    c.strokeStyle = grad; c.lineWidth = s * 0.035; c.shadowColor = tone.b; c.shadowBlur = 30; c.stroke(); c.restore();
    c.save(); shieldPath(c, cx, cy, s * 0.64, s * 0.82); c.strokeStyle = alpha('#ffffff', 0.35); c.lineWidth = 1.5; c.stroke(); c.restore();
    trackSymbol(c, global.Tracks.activeId(), cx, cy - s * 0.08, s * 0.3, '#ffffff');
    txt(c, String(level), cx, cy + s * 0.26, Math.round(s * 0.2) + 'px ' + F.display, '#ffffff', 'center', 0, tone.a, 20);
    for (let i = 0; i < 3; i++) {   // nível concluído = 3 etapas
      const x = cx + (i - 1) * s * 0.13;
      c.save(); starPath(c, x, cy - s * 0.62, s * 0.05); c.fillStyle = tone.a; c.shadowColor = tone.a; c.shadowBlur = 14; c.fill(); c.restore();
    }
    ribbon(c, cx, cy + s * 0.56, s * 0.92, s * 0.16, grad, LEVEL_NAMES[level].toUpperCase(), '700 ' + Math.round(s * 0.06) + 'px ' + F.sans, '#0a0d18');
  }
  /** Brasão final: raios, louros dourados, coroa, escudo duplo e o logo. */
  function crestFinal(c, cx, cy, s, tr) {
    const gold = lin(c, cx - s / 2, cy - s / 2, cx + s / 2, cy + s / 2, [[0, '#fff1c2'], [0.45, '#ffd27a'], [1, '#e8954f']]);
    // raios
    c.save(); c.translate(cx, cy);
    for (let i = 0; i < 40; i++) {
      c.rotate(Math.PI * 2 / 40);
      c.beginPath(); c.moveTo(-s * 0.012, 0); c.lineTo(0, -s * (i % 2 ? 0.95 : 1.15)); c.lineTo(s * 0.012, 0); c.closePath();
      c.fillStyle = i % 4 === 0 ? 'rgba(164,107,255,0.22)' : 'rgba(255,210,122,0.16)'; c.fill();
    }
    c.restore();
    const halo = c.createRadialGradient(cx, cy, 0, cx, cy, s * 0.95);
    halo.addColorStop(0, 'rgba(255,210,122,0.35)'); halo.addColorStop(0.6, 'rgba(164,107,255,0.12)'); halo.addColorStop(1, 'rgba(0,0,0,0)');
    c.fillStyle = halo; c.fillRect(cx - s, cy - s, s * 2, s * 2);
    c.save(); c.shadowColor = '#ffd27a'; c.shadowBlur = 16;
    laurel(c, cx, cy + s * 0.02, s * 0.66, gold, 9, s * 0.17);
    c.restore();
    // escudo
    c.save(); shieldPath(c, cx, cy, s * 0.8, s); c.fillStyle = gold; c.shadowColor = '#ffd27a'; c.shadowBlur = 36; c.fill(); c.restore();
    c.save(); shieldPath(c, cx, cy, s * 0.7, s * 0.88);
    const inner = c.createRadialGradient(cx, cy - s * 0.15, 0, cx, cy, s * 0.55);
    inner.addColorStop(0, '#1e2147'); inner.addColorStop(1, '#070812'); c.fillStyle = inner; c.fill();
    c.strokeStyle = lin(c, cx - s / 2, cy, cx + s / 2, cy, [[0, tr.color.a], [0.5, tr.color.b], [1, tr.color.a]]);
    c.lineWidth = s * 0.018; c.shadowColor = tr.color.b; c.shadowBlur = 20; c.stroke(); c.restore();
    // logo
    const lr = s * 0.24;
    if (logoImg.complete && logoImg.naturalWidth) {
      c.save(); c.beginPath(); c.arc(cx, cy - s * 0.04, lr, 0, Math.PI * 2); c.clip();
      c.drawImage(logoImg, cx - lr, cy - s * 0.04 - lr, lr * 2, lr * 2); c.restore();
    } else txt(c, 'L', cx, cy + s * 0.08, Math.round(s * 0.3) + 'px ' + F.display, gold, 'center');
    // coroa
    const cw = s * 0.46, cyb = cy - s * 0.52, chh = s * 0.2;
    c.save(); c.beginPath();
    c.moveTo(cx - cw / 2, cyb);
    [[-0.5, -1], [-0.25, -0.55], [0, -1.15], [0.25, -0.55], [0.5, -1]].forEach(function (p, i) {
      if (i) c.lineTo(cx + cw * (p[0] - 0.125), cyb - chh * 0.45);
      c.lineTo(cx + cw * p[0], cyb + chh * p[1]);
    });
    c.lineTo(cx + cw / 2, cyb); c.closePath();
    c.fillStyle = gold; c.shadowColor = '#ffd27a'; c.shadowBlur = 20; c.fill(); c.restore();
    c.save(); rr(c, cx - cw / 2, cyb - chh * 0.05, cw, chh * 0.3, 4); c.fillStyle = gold; c.fill(); c.restore();
    [['#2fd8f0', -0.5, -1], ['#a46bff', 0, -1.15], ['#ff5ccf', 0.5, -1]].forEach(function (g) {
      c.save(); c.beginPath(); c.arc(cx + cw * g[1], cyb + chh * g[2], s * 0.028, 0, Math.PI * 2);
      c.fillStyle = g[0]; c.shadowColor = g[0]; c.shadowBlur = 16; c.fill(); c.restore();
    });
    [-0.22, 0, 0.22].forEach(function (k, i) {
      c.save(); c.beginPath(); c.arc(cx + cw * k, cyb + chh * 0.1, s * 0.016, 0, Math.PI * 2); c.fillStyle = ['#4d7cff', '#ff5ccf', '#2fd8f0'][i]; c.fill(); c.restore();
    });
    const fname = G.FINAL.nome.toUpperCase();
    ribbon(c, cx, cy + s * 0.6, s * 1.05, s * 0.17, gold, fname, fitFont(c, fname, s * 0.9, Math.round(s * 0.07), F.sans, '800'), '#2a1606');
  }

  /* ------------------------------ Certificados ------------------------------ */
  function stat(c, x, y, w, h, label, value, accent) {
    glassPanel(c, x, y, w, h, 18);
    txt(c, label.toUpperCase(), x + w / 2, y + 36, '600 14px ' + F.mono, 'rgba(195,200,222,0.75)', 'center', 2);
    txt(c, value, x + w / 2, y + h - 24, fitFont(c, value, w - 30, 28, F.sans, '650'), accent || '#ffffff', 'center');
  }
  function chips(c, list, cx, y, maxW, tone) {
    c.save(); c.font = '500 16px ' + F.mono;
    const items = list.map(function (t) { return { t: t, w: c.measureText(t).width + 28 }; });
    let rows = [[]], rw = [0];
    items.forEach(function (it) {
      const r = rows.length - 1;
      if (rw[r] + it.w + 10 > maxW && rows[r].length) { rows.push([]); rw.push(0); }
      rows[rows.length - 1].push(it); rw[rw.length - 1] += it.w + 10;
    });
    rows = rows.slice(0, 2);
    rows.forEach(function (row, ri) {
      let x = cx - (rw[ri] - 10) / 2;
      row.forEach(function (it) {
        rr(c, x, y + ri * 44, it.w, 34, 9);
        c.fillStyle = alpha(tone.a, 0.1); c.fill(); c.strokeStyle = alpha(tone.a, 0.38); c.lineWidth = 1; c.stroke();
        c.fillStyle = '#d7defc'; c.textAlign = 'center'; c.fillText(it.t, x + it.w / 2, y + ri * 44 + 23);
        x += it.w + 10;
      });
    });
    c.restore();
    return y + rows.length * 44;
  }
  function signature(c, x, y, name, role, color) {
    c.save(); c.strokeStyle = 'rgba(195,200,222,0.35)'; c.lineWidth = 1.5;
    c.beginPath(); c.moveTo(x - 170, y); c.lineTo(x + 170, y); c.stroke(); c.restore();
    txt(c, name, x, y - 14, '34px ' + F.display, color || '#ffffff', 'center');
    txt(c, role, x, y + 30, '16px ' + F.sans, 'rgba(195,200,222,0.7)', 'center');
  }
  function brandMark(c, x, y, size, align) {
    if (logoImg.complete && logoImg.naturalWidth) c.drawImage(logoImg, align === 'right' ? x - size : x, y, size, size);
    txt(c, 'TRUST INTELLIGENCE ACADEMY', align === 'right' ? x - size - 14 : x + size + 14, y + size / 2 + 6, '600 17px ' + F.sans, 'rgba(232,234,246,0.85)', align === 'right' ? 'right' : 'left', 3);
  }

  /** Linha de estrelas: preenchidas = etapas concluídas no nível (1, 2 ou 3). */
  function starRow(c, cx, y, r, filled, total, color) {
    for (let i = 0; i < total; i++) {
      const x = cx + (i - (total - 1) / 2) * r * 2.7;
      c.save(); starPath(c, x, y, r);
      if (i < filled) { c.fillStyle = color; c.shadowColor = color; c.shadowBlur = 16; c.fill(); }
      else { c.strokeStyle = alpha('#ffffff', 0.22); c.lineWidth = 2; c.stroke(); }
      c.restore();
    }
  }
  /** Faixa vertical da etapa: tema, estrelas da etapa, medalha e progresso no nível. */
  function stageBand(c, cert) {
    const t = cert.tone, tr = cert.track;
    const x0 = 112, y0 = 112, w = 436, h = 906, cx = x0 + w / 2;
    bandBox(c, x0, y0, w, h, t.a, t.b);

    txt(c, 'ETAPA ' + cert.stage + ' DE 3', cx, y0 + 60, '600 17px ' + F.mono, alpha(t.a, 0.95), 'center', 5);
    starRow(c, cx, y0 + 112, 24, cert.stage, 3, cert.medal.b);
    hexBadge(c, cx, y0 + 272, 104, tr, 0);
    themeLabel(c, cx, y0 + 272 + 104 + 32, tr);
    c.save(); c.fillStyle = lin(c, x0 + 40, 0, x0 + w - 40, 0, [[0, 'rgba(0,0,0,0)'], [0.5, alpha(t.a, 0.45)], [1, 'rgba(0,0,0,0)']]); c.fillRect(x0 + 40, y0 + 470, w - 80, 1.5); c.restore();
    drawMedal(c, cx, y0 + 586, 64, cert.medal, tr);
    // progresso dentro do nível
    txt(c, 'PROGRESSO NO NÍVEL ' + t.name.toUpperCase(), cx, y0 + 752, '600 13px ' + F.mono, 'rgba(195,200,222,0.7)', 'center', 2);
    const bw = 104, gap = 12, bx = cx - (bw * 3 + gap * 2) / 2;
    for (let i = 0; i < 3; i++) {
      const sx = bx + i * (bw + gap);
      c.save(); rr(c, sx, y0 + 772, bw, 10, 5);
      if (i < cert.stage) { c.fillStyle = lin(c, sx, 0, sx + bw, 0, [[0, t.a], [1, t.b]]); c.shadowColor = t.a; c.shadowBlur = 10; }
      else c.fillStyle = 'rgba(255,255,255,0.1)';
      c.fill(); c.restore();
      txt(c, 'Etapa ' + (i + 1), sx + bw / 2, y0 + 808, '500 14px ' + F.sans, i < cert.stage ? '#ffffff' : 'rgba(195,200,222,0.5)', 'center');
    }
    txt(c, 'XP na etapa: ' + fmt(cert.xp), cx, y0 + 860, '600 19px ' + F.sans, '#ffffff', 'center');
  }

  /** Fundo da faixa lateral (comum a etapa, nível e final). */
  function bandBox(c, x0, y0, w, h, ca, cb) {
    c.save();
    rr(c, x0, y0, w, h, 24);
    c.fillStyle = '#0d1427'; c.fill();
    c.fillStyle = lin(c, 0, y0, 0, y0 + h, [[0, alpha(ca, 0.17)], [0.55, alpha(cb, 0.07)], [1, alpha(ca, 0.13)]]); c.fill();
    c.strokeStyle = alpha(ca, 0.38); c.lineWidth = 1.5; c.shadowColor = alpha(ca, 0.5); c.shadowBlur = 18; c.stroke();
    c.clip(); c.shadowBlur = 0; c.strokeStyle = alpha(ca, 0.05); c.lineWidth = 1;
    for (let k = -h; k < w + h; k += 22) { c.beginPath(); c.moveTo(x0 + k, y0); c.lineTo(x0 + k - h, y0 + h); c.stroke(); }
    c.fillStyle = lin(c, 0, y0, 0, y0 + h, [[0, ca], [1, cb]]); c.fillRect(x0, y0, 6, h);
    c.restore();
  }
  /**
   * Faixa de fechamento: tema, medalha e a trilha de marcos cumpridos.
   * Nível → as 3 etapas (cargo de cada uma). Final → os 3 níveis (com a medalha de cada um).
   */
  function closingBand(c, cert, final) {
    const t = final ? { a: cert.track.color.a, b: cert.track.color.b, name: '' } : cert.tone, tr = cert.track;
    const x0 = 112, y0 = 112, w = 436, h = 906, cx = x0 + w / 2;
    bandBox(c, x0, y0, w, h, final ? '#ffd27a' : t.a, final ? tr.color.b : t.b);
    const accent = final ? '#ffd27a' : t.a;
    txt(c, final ? 'TRILHA COMPLETA' : 'NÍVEL ' + cert.tone.name.toUpperCase() + ' CONCLUÍDO', cx, y0 + 58, fitFont(c, final ? 'TRILHA COMPLETA' : 'NÍVEL ' + cert.tone.name.toUpperCase() + ' CONCLUÍDO', w - 60, 16, F.mono, '600'), accent, 'center', 4);
    starRow(c, cx, y0 + 104, 20, 3, 3, cert.medal.b);
    hexBadge(c, cx, y0 + 236, 86, tr, 0);
    themeLabel(c, cx, y0 + 236 + 86 + 30, tr);
    drawMedal(c, cx, y0 + 478, 54, cert.medal, tr, false);
    txt(c, 'MEDALHA ' + cert.medal.name.toUpperCase(), cx, y0 + 562, '700 17px ' + F.sans, cert.medal.b, 'center', 4, alpha(cert.medal.b, 0.5), 10);
    // marcos cumpridos
    c.save(); c.fillStyle = lin(c, x0 + 40, 0, x0 + w - 40, 0, [[0, 'rgba(0,0,0,0)'], [0.5, alpha(accent, 0.45)], [1, 'rgba(0,0,0,0)']]); c.fillRect(x0 + 40, y0 + 592, w - 80, 1.5); c.restore();
    txt(c, final ? 'NÍVEIS CONCLUÍDOS' : 'ETAPAS CUMPRIDAS', cx, y0 + 628, '600 13px ' + F.mono, 'rgba(195,200,222,0.75)', 'center', 3);
    const items = final
      ? [1, 2, 3].map(function (lv) { return { k: 'Nível ' + lv, n: LEVEL_NAMES[lv], m: MEDALS[lv] }; })
      : G.PROMOTIONS.filter(function (p) { return p.level === cert.level; }).map(function (p, i) { return { k: 'Etapa ' + (i + 1), n: p.nome }; });
    const nx = x0 + 70, top = y0 + 672, step = 78;
    c.save(); c.strokeStyle = lin(c, 0, top, 0, top + step * 2, [[0, t.a], [1, t.b]]); c.lineWidth = 3; c.shadowColor = t.a; c.shadowBlur = 8;
    c.beginPath(); c.moveTo(nx, top); c.lineTo(nx, top + step * 2); c.stroke(); c.restore();
    items.forEach(function (it, i) {
      const y = top + i * step;
      if (it.m) { drawMedal(c, nx, y + 4, 19, it.m, tr, false); }
      else {
        c.save(); hexPath(c, nx, y, 20); c.fillStyle = lin(c, nx - 20, y - 20, nx + 20, y + 20, [[0, t.a], [1, t.b]]); c.shadowColor = t.a; c.shadowBlur = 14; c.fill(); c.restore();
        c.save(); c.strokeStyle = '#06111a'; c.lineWidth = 3.4; c.lineCap = 'round'; c.lineJoin = 'round';
        c.beginPath(); c.moveTo(nx - 8, y + 1); c.lineTo(nx - 2, y + 7); c.lineTo(nx + 9, y - 6); c.stroke(); c.restore();
      }
      txt(c, it.k.toUpperCase() + (it.m ? ' · ' + it.m.name.toUpperCase() : ''), nx + 40, y - 6, '600 13px ' + F.mono, it.m ? it.m.b : alpha(t.a, 0.9), 'left', 2);
      txt(c, it.n, nx + 40, y + 20, fitFont(c, it.n, w - 130, 20, F.sans, '600'), '#ffffff', 'left');
    });
  }
  function leftChips(c, list, x, y, maxW, t, rows) {
    c.save(); c.font = '500 15px ' + F.mono; let cx = x, cy = y, row = 1;
    for (let i = 0; i < list.length; i++) {
      const k = list[i], w = c.measureText(k).width + 24;
      if (cx + w > x + maxW) { if (++row > rows) break; cx = x; cy += 40; }
      rr(c, cx, cy, w, 30, 8); c.fillStyle = alpha(t.a, 0.08); c.fill(); c.strokeStyle = alpha(t.a, 0.3); c.lineWidth = 1; c.stroke();
      c.fillStyle = '#d7defc'; c.textAlign = 'left'; c.fillText(k, cx + 12, cy + 20); cx += w + 8;
    }
    c.restore();
    return cy + 30;
  }

  /** Etapa — faixa lateral (tema, estrelas, medalha) e texto à direita. */
  function drawStage(c, cert, person) {
    const t = cert.tone;
    background(c, t, false);
    neonFrame(c, 34, 30, lin(c, 0, 0, W, H, [[0, t.a], [1, t.b]]), 2.5, t.a, 18);
    glassPanel(c, 70, 70, W - 140, H - 140, 26);
    stageBand(c, cert);
    const x = 600, maxW = W - x - 130;
    brandMark(c, x, 112, 44);
    txt(c, cert.kicker.toUpperCase(), x, 220, '600 18px ' + F.mono, t.a, 'left', 5);
    txt(c, cert.title, x, 300, fitFont(c, cert.title, maxW, 78, F.display), lin(c, x, 0, x + 700, 0, [[0, '#ffffff'], [1, t.a]]), 'left', 0, alpha(t.a, 0.5), 20);
    txt(c, cert.scope, x, 348, fitFont(c, cert.scope, maxW, 22, F.sans), 'rgba(195,200,222,0.85)', 'left');
    txt(c, 'Certificamos que', x, 425, '22px ' + F.sans, 'rgba(195,200,222,0.75)', 'left');
    txt(c, person.full, x, 497, fitFont(c, person.full, maxW, 64, F.display), '#ffffff', 'left');
    if (person.social) txt(c, 'Nome social: ' + person.social, x, 538, '19px ' + F.sans, 'rgba(195,200,222,0.7)', 'left');
    const y = wrap(c, 'concluiu os exercícios ' + cert.range[0] + ' a ' + cert.range[1] + ' do nível ' + t.name + ' na trilha ' + cert.track.nome + ', foi aprovado na prova da etapa e conquistou o cargo de ' + cert.role + '.', x, 600, maxW, 34, '22px ' + F.sans, 'rgba(232,234,246,0.9)', 'left');
    // conteúdos
    txt(c, 'CONTEÚDOS DESTA ETAPA', x, y + 60, '600 14px ' + F.mono, 'rgba(195,200,222,0.6)', 'left', 2);
    c.save(); c.font = '500 15px ' + F.mono; let cx = x, cy = y + 78;
    cert.topics.slice(0, 9).forEach(function (k) {
      const w = c.measureText(k).width + 24;
      if (cx + w > W - 130) { cx = x; cy += 40; }
      rr(c, cx, cy, w, 30, 8); c.fillStyle = alpha(t.a, 0.08); c.fill(); c.strokeStyle = alpha(t.a, 0.3); c.lineWidth = 1; c.stroke();
      c.fillStyle = '#d7defc'; c.textAlign = 'left'; c.fillText(k, cx + 12, cy + 20); cx += w + 8;
    });
    c.restore();
    // rodapé
    const items = [['Data', new Date(cert.date || Date.now()).toLocaleDateString('pt-BR')], ['Exercícios', String(cert.exCount)], ['Carga horária', cert.hours], ['Prova', examTxt(cert)], ['Verificação', cert.code]];
    const colW = maxW / 5;
    c.save(); c.strokeStyle = alpha(t.a, 0.25); c.beginPath(); c.moveTo(x, 880); c.lineTo(W - 130, 880); c.stroke(); c.restore();
    items.forEach(function (it, i) {
      const ix = x + colW * i;
      txt(c, it[0].toUpperCase(), ix, 925, '600 14px ' + F.mono, 'rgba(195,200,222,0.6)', 'left', 2);
      txt(c, it[1], ix, 960, fitFont(c, it[1], colW - 16, 22, i === 4 ? F.mono : F.sans, '600'), i === 4 || i === 3 ? t.a : '#ffffff', 'left');
    });
    txt(c, 'Coordenação Pedagógica · Trust Intelligence Academy', x, 1010, '16px ' + F.sans, 'rgba(195,200,222,0.6)', 'left', 1);
  }

  /** Nível — faixa de fechamento à esquerda; brasão com louros e conteúdo à direita. */
  function drawLevel(c, cert, person) {
    const t = cert.tone;
    background(c, t, true);
    sparkles(c, 70, 7 + cert.level, [t.a, t.b, '#ffffff']);
    neonFrame(c, 30, 32, lin(c, 0, 0, W, H, [[0, t.a], [0.5, t.b], [1, t.a]]), 4, t.b, 26);
    neonFrame(c, 46, 24, alpha(t.a, 0.35), 1.2, 'transparent', 0);
    corners(c, 62, 70, t.a, 3);
    closingBand(c, cert, false);
    const x = 600, maxW = W - x - 130;
    brandMark(c, x, 112, 44);
    crestLevel(c, W - 250, 262, 170, t, cert.level);
    txt(c, 'CERTIFICADO DE CONCLUSÃO', x, 222, '600 17px ' + F.mono, t.a, 'left', 5);
    txt(c, 'DE NÍVEL', x, 248, '600 17px ' + F.mono, t.a, 'left', 5);
    txt(c, 'Nível ' + t.name, x, 326, fitFont(c, 'Nível ' + t.name, maxW - 300, 80, F.display), lin(c, x, 0, x + 560, 0, [[0, '#ffffff'], [0.6, t.a], [1, t.b]]), 'left', 0, alpha(t.b, 0.5), 22);
    txt(c, cert.track.nome + ' · Nível ' + cert.level + ' de 3', x, 368, '21px ' + F.sans, 'rgba(195,200,222,0.85)', 'left');
    txt(c, 'Certificamos que', x, 440, '21px ' + F.sans, 'rgba(195,200,222,0.75)', 'left');
    txt(c, person.full, x, 510, fitFont(c, person.full, maxW, 64, F.display), '#ffffff', 'left');
    c.save(); c.fillStyle = lin(c, x, 0, x + 520, 0, [[0, t.a], [1, 'rgba(0,0,0,0)']]); c.fillRect(x, 530, 520, 2); c.restore();
    if (person.social) txt(c, 'Nome social: ' + person.social, x, 564, '18px ' + F.sans, 'rgba(195,200,222,0.7)', 'left');
    const y = wrap(c, 'concluiu os ' + cert.exCount + ' exercícios práticos do nível ' + t.name + ' da trilha ' + cert.track.nome + ', cumpriu as três etapas, foi aprovado na prova do nível e alcançou o cargo de ' + cert.role + '.', x, 612, maxW, 32, '21px ' + F.sans, 'rgba(232,234,246,0.9)', 'left');
    leftChips(c, cert.topics, x, y + 26, maxW, t, 2);
    const sw = (maxW - 4 * 12) / 5, sy = 818;
    [['Exercícios', String(cert.exCount)], ['Carga horária', cert.hours], ['XP no nível', fmt(cert.xp) + ' XP'], ['Prova', examTxt(cert)], ['Data', new Date(cert.date || Date.now()).toLocaleDateString('pt-BR')]].forEach(function (st, i) {
      stat(c, x + i * (sw + 12), sy, sw, 92, st[0], st[1], i === 1 || i === 3 ? t.a : '#ffffff');
    });
    signature(c, x + maxW * 0.25, 1002, 'Coordenação Pedagógica', 'Trust Intelligence Academy', '#ffffff');
    signature(c, x + maxW * 0.75, 1002, cert.role, 'Cargo conquistado', t.a);
    txt(c, cert.code, W - 96, 112, '500 15px ' + F.mono, alpha(t.a, 0.85), 'right', 1);
  }

  /** Final — faixa dos níveis concluídos; dourado + neon, brasão com coroa e raios. */
  function drawFinal(c, cert, person) {
    const t = cert.tone;
    c.fillStyle = '#04040a'; c.fillRect(0, 0, W, H);
    [[0.1, 0.0, '#a46bff', 0.3], [0.9, 0.05, '#2fd8f0', 0.22], [0.5, 1.05, '#ffd27a', 0.22], [0.0, 0.95, '#ff5ccf', 0.16]].forEach(function (g) {
      const r = c.createRadialGradient(W * g[0], H * g[1], 0, W * g[0], H * g[1], W * 0.6);
      r.addColorStop(0, alpha(g[2], g[3])); r.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = r; c.fillRect(0, 0, W, H);
    });
    c.save(); c.strokeStyle = 'rgba(255,210,122,0.045)';
    for (let gx = 0; gx <= W; gx += 40) { c.beginPath(); c.moveTo(gx + 0.5, 0); c.lineTo(gx + 0.5, H); c.stroke(); }
    for (let gy = 0; gy <= H; gy += 40) { c.beginPath(); c.moveTo(0, gy + 0.5); c.lineTo(W, gy + 0.5); c.stroke(); }
    c.restore();
    sparkles(c, 150, 42, ['#ffd27a', '#2fd8f0', '#a46bff', '#ffffff']);
    const holo = lin(c, 0, 0, W, H, [[0, '#ffd27a'], [0.25, '#2fd8f0'], [0.5, '#a46bff'], [0.75, '#ff5ccf'], [1, '#ffd27a']]);
    neonFrame(c, 24, 34, holo, 5, '#a46bff', 30);
    neonFrame(c, 40, 26, 'rgba(255,210,122,0.55)', 1.5, '#ffd27a', 8);
    neonFrame(c, 50, 20, 'rgba(255,210,122,0.25)', 1, 'transparent', 0);
    corners(c, 66, 90, '#ffd27a', 3);
    closingBand(c, cert, true);
    const x = 600, maxW = W - x - 130;
    brandMark(c, x, 112, 44);
    crestFinal(c, W - 255, 262, 160, cert.track);
    txt(c, cert.code, W - 100, 112, '500 15px ' + F.mono, 'rgba(255,210,122,0.85)', 'right', 1);
    const gold = lin(c, 0, 400, 0, 520, [[0, '#fff3cf'], [0.5, '#ffd27a'], [1, '#e8954f']]);
    txt(c, 'CERTIFICADO DE CONCLUSÃO', x, 222, '600 17px ' + F.mono, '#ffd27a', 'left', 5);
    txt(c, 'EM ' + cert.track.nome.toUpperCase(), x, 250, fitFont(c, 'EM ' + cert.track.nome.toUpperCase(), maxW - 330, 17, F.mono, '600'), '#ffd27a', 'left', 5);
    txt(c, G.FINAL.nome, x, 330, fitFont(c, G.FINAL.nome, maxW - 330, 76, F.display), lin(c, x, 0, x + 520, 0, [[0, '#ffffff'], [0.5, '#ffd27a'], [1, cert.track.color.a]]), 'left', 0, 'rgba(255,210,122,0.45)', 22);
    txt(c, 'Certificamos que', x, 430, '21px ' + F.sans, 'rgba(232,226,210,0.75)', 'left');
    txt(c, person.full, x, 510, fitFont(c, person.full, maxW, 80, F.display), gold, 'left', 0, 'rgba(255,210,122,0.45)', 24);
    c.save(); c.fillStyle = lin(c, x, 0, x + 620, 0, [[0, '#ffd27a'], [1, 'rgba(0,0,0,0)']]); c.fillRect(x, 534, 620, 2); c.restore();
    if (person.social) txt(c, 'Nome social escolhido na jornada: ' + person.social, x, 568, '18px ' + F.sans, 'rgba(232,226,210,0.75)', 'left');
    wrap(c, 'concluiu a trilha completa de ' + cert.track.nome + ', resolvendo os 150 exercícios dos níveis Iniciante, Intermediário e Avançado, ' + cert.track.summary + ', e foi aprovado na prova final.', x, 616, maxW, 32, '20px ' + F.sans, 'rgba(240,236,226,0.92)', 'left');
    const sw = (maxW - 4 * 12) / 5, sy = 760;
    [['Conclusão', new Date(cert.date || Date.now()).toLocaleDateString('pt-BR')], ['Exercícios', '150'], ['Prova final', examTxt(cert)], ['Promoção final', cert.role], ['XP total', fmt(cert.xp) + ' XP']].forEach(function (st, i) {
      stat(c, x + i * (sw + 12), sy, sw, 92, st[0], st[1], i === 3 || i === 2 ? '#ffd27a' : '#ffffff');
    });
    txt(c, 'Carga Horária Estimada: 50 horas', x + maxW / 2, 902, '600 24px ' + F.sans, lin(c, x + maxW / 2 - 220, 0, x + maxW / 2 + 220, 0, [[0, cert.track.color.a], [0.5, '#ffd27a'], [1, '#a46bff']]), 'center', 1, 'rgba(255,210,122,0.4)', 14);
    signature(c, x + maxW * 0.25, 1002, 'Coordenação Pedagógica', 'Trust Intelligence Academy', '#ffd27a');
    signature(c, x + maxW * 0.75, 1002, 'Trust Intelligence Academy', 'Academia de dados, BI e IA', '#ffd27a');
  }

  /** Desenha um certificado (escala opcional para miniaturas). */
  function draw(st, cert, scale) {
    scale = scale || 1;
    const cv = document.createElement('canvas'); cv.width = Math.round(W * scale); cv.height = Math.round(H * scale);
    const c = cv.getContext('2d'); c.scale(scale, scale);
    const person = personOf(st);
    cert.code = verificationCode(person.full + '|' + cert.id + '|' + (cert.date || ''));
    if (cert.type === 'stage') drawStage(c, cert, person);
    else if (cert.type === 'level') drawLevel(c, cert, person);
    else drawFinal(c, cert, person);
    if (!cert.unlocked) {
      c.save(); c.translate(W / 2, H / 2); c.rotate(-0.28);
      c.fillStyle = 'rgba(255,255,255,0.08)'; c.font = '800 200px ' + F.sans; c.textAlign = 'center'; c.fillText('PRÉVIA', 0, 70); c.restore();
    }
    return cv;
  }

  /* ------------------------------- Ações ------------------------------- */
  function loadScript(src) { return new Promise(function (res, rej) { const s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = rej; document.head.appendChild(s); }); }
  function blockedNotice(dataUrl, what) {
    modal('<h3>' + what + ' indisponível neste visualizador</h3>' +
      '<p class="muted">Este ambiente bloqueia downloads e a janela de impressão. Clique com o botão direito na imagem (ou toque e segure no celular) e escolha "Salvar imagem". Rodando o projeto localmente, os botões funcionam normalmente.</p>' +
      '<img class="cert-img" src="' + dataUrl + '" alt="Certificado">', { wide: true });
  }
  async function downloadPdf(st, cert) {
    const url = draw(st, cert).toDataURL('image/png');
    if (framed) return blockedNotice(url, 'Download');
    try {
      if (!global.jspdf) await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
      const pdf = new global.jspdf.jsPDF({ orientation: 'landscape', unit: 'px', format: [W, H], hotfixes: ['px_scaling'] });
      pdf.addImage(url, 'PNG', 0, 0, W, H);
      pdf.save('certificado-' + cert.id + '.pdf');
      toast('PDF gerado.', 'success');
    } catch (e) { blockedNotice(url, 'Download'); }
  }
  function print(st, cert) {
    const url = draw(st, cert).toDataURL('image/png');
    if (framed) return blockedNotice(url, 'Impressão');
    document.getElementById('print-area').innerHTML = '<img src="' + url + '" alt="Certificado">';
    document.body.classList.add('printing');
    setTimeout(function () { global.print(); document.body.classList.remove('printing'); }, 150);
  }
  function share(st, cert) {
    const text = 'Conquistei o ' + cert.kicker.toLowerCase() + ' "' + cert.title + '" na Trust Intelligence Academy: ' + cert.exCount + ' exercícios práticos, ' + cert.hours + ' de carga horária. Código ' + cert.code + '.';
    if (navigator.share && !framed) navigator.share({ title: cert.title, text: text }).catch(function () { copyText(text, 'Texto do certificado copiado.'); });
    else copyText(text, 'Texto do certificado copiado para compartilhar.');
  }

  /* ------------------------------- Tela ------------------------------- */
  let pendingOpen = null;   // certificado a abrir ao entrar na página
  function open(id) { pendingOpen = id; if (location.hash === '#certificado') global.dispatchEvent(new HashChangeEvent('hashchange')); else location.hash = 'certificado'; }

  function fontsReady() {
    const load = document.fonts && document.fonts.load
      ? Promise.all([document.fonts.load('64px "Instrument Serif"'), document.fonts.load('600 28px Geist'), document.fonts.load('600 17px "Geist Mono"')]).catch(function () {})
      : Promise.resolve();
    const img = new Promise(function (r) { if (logoImg.complete) r(); else { logoImg.onload = r; logoImg.onerror = r; } });
    return Promise.all([load, img]);
  }

  function examNote(cert) {
    const e = cert.exam;
    return e && e.attempts ? 'Tentativas: ' + e.attempts + ' · melhor nota ' + e.best + '/' + QUESTIONS : 'Nenhuma tentativa ainda';
  }
  function viewer(st, cert) {
    const name = cert.type === 'final' ? G.FINAL.nome : cert.title;
    let action;
    if (cert.unlocked) action = '<div class="cert-actions"><button class="btn btn-primary sm" data-c="pdf">' + icon('download') + 'Baixar PDF</button><button class="btn btn-ghost sm" data-c="print">' + icon('printer') + 'Imprimir</button><button class="btn btn-ghost sm" data-c="share">' + icon('share') + 'Compartilhar</button></div>';
    else if (cert.eligible) action = '<div class="exam-cta"><p>' + icon('target') + '<span><b>Prova liberada.</b> ' + QUESTIONS + ' questões sobre os conteúdos ' + (cert.type === 'stage' ? 'da etapa' : cert.type === 'level' ? 'do nível' : 'da trilha') + '. Nota mínima: ' + PASS + '/' + QUESTIONS + ' (70%).</span></p>' +
      '<p class="muted sm">' + examNote(cert) + '</p><button class="btn btn-primary" data-c="exam">' + icon('play') + (cert.exam && cert.exam.attempts ? 'Refazer prova' : 'Fazer prova') + '</button></div>';
    else action = '<p class="lock-note">' + icon('lock') + 'Faltam ' + (cert.need - cert.have) + ' exercício(s) para liberar a prova.</p>';
    const m = modal(
      '<div class="cv">' +
        '<div class="cv-img"><img class="cert-img" alt="' + esc(cert.title) + '"></div>' +
        '<div class="cv-side">' +
          '<span class="cert-kicker t-' + cert.type + '">' + esc(cert.kicker) + '</span>' +
          '<h3>' + esc(name) + '</h3><p class="muted">' + esc(cert.scope) + '</p>' +
          '<dl class="cert-dl">' +
            '<div><dt>Medalha</dt><dd><span class="medal-dot m-' + cert.medal.name.toLowerCase() + '"></span>' + cert.medal.name + '</dd></div>' +
            '<div><dt>Exercícios</dt><dd>' + cert.exCount + '</dd></div>' +
            '<div><dt>Carga horária</dt><dd>' + esc(cert.hours) + '</dd></div>' +
            '<div><dt>Cargo</dt><dd>' + esc(cert.role) + '</dd></div>' +
            '<div><dt>Prova</dt><dd>' + (cert.examScore != null ? cert.examScore + '/' + QUESTIONS + (cert.passed ? ' · aprovado' : '') : '—') + '</dd></div>' +
            '<div><dt>' + (cert.unlocked ? 'Data' : 'Progresso') + '</dt><dd>' + (cert.unlocked ? dateTxt(cert.date) : Math.min(cert.have, cert.need) + ' / ' + cert.need) + '</dd></div>' +
          '</dl>' + action +
        '</div>' +
      '</div>', { wide: true });
    const img = m.el.querySelector('.cert-img');
    fontsReady().then(function () { img.src = draw(st, cert).toDataURL('image/png'); });
    if (cert.unlocked) {
      m.el.querySelector('[data-c=pdf]').onclick = function () { downloadPdf(st, cert); };
      m.el.querySelector('[data-c=print]').onclick = function () { print(st, cert); };
      m.el.querySelector('[data-c=share]').onclick = function () { share(st, cert); };
    }
    const eb = m.el.querySelector('[data-c=exam]');
    if (eb) eb.onclick = function () { m.close(); global.Exams.start(cert.id); };
  }

  function card(cert) {
    const state = cert.unlocked ? 'on' : cert.eligible ? 'exam' : 'off';
    let sub;
    if (cert.unlocked) sub = '<span class="muted sm">Liberado em ' + dateTxt(cert.date) + ' · prova ' + cert.examScore + '/' + QUESTIONS + '</span>';
    else if (cert.eligible) sub = '<span class="exam-chip">' + icon('target') + (cert.exam && cert.exam.attempts ? 'Refazer prova · melhor ' + cert.exam.best + '/' + QUESTIONS : 'Prova disponível') + '</span>';
    else sub = '<span class="muted sm">' + cert.have + ' de ' + cert.need + ' exercícios</span><span class="mini-bar"><i style="width:' + Math.min(100, cert.have / cert.need * 100) + '%"></i></span>';
    return '<button class="cert-card glass t-' + cert.type + ' ' + state + '" data-cert="' + cert.id + '" style="--ca:' + cert.tone.a + ';--cb:' + cert.tone.b + '">' +
      '<span class="cert-thumb"><canvas width="1" height="1" aria-hidden="true"></canvas>' + (cert.unlocked ? '' : '<span class="cert-lock">' + icon(cert.eligible ? 'target' : 'lock') + '</span>') + '</span>' +
      '<span class="cert-meta"><span class="cert-kicker t-' + cert.type + '"><span class="medal-dot m-' + cert.medal.name.toLowerCase() + '"></span>' + esc(cert.kicker) + '</span>' +
      '<b>' + esc(cert.type === 'final' ? G.FINAL.nome : cert.title) + '</b>' + sub +
      '</span></button>';
  }

  function render(el, st) {
    const list = catalog(st);
    const tr = global.Tracks.active();
    const got = list.filter(function (c) { return c.unlocked; }).length;
    const pending = list.filter(function (c) { return c.eligible && !c.passed; }).length;
    const byLevel = function (lv) { return list.filter(function (c) { return c.level === lv && c.type !== 'final'; }); };
    const fin = list[list.length - 1];
    el.innerHTML =
      '<header class="page-h"><div><p class="eyebrow">Certificados · ' + esc(tr.nome) + '</p><h1>' + got + ' de ' + list.length + ' certificados liberados</h1>' +
      '<p class="muted">Etapas a cada promoção, um certificado por nível e o certificado final de ' + esc(G.FINAL.nome) + '. Cada um é liberado após uma prova de ' + QUESTIONS + ' questões com nota mínima de 70%. Medalhas: Bronze (Iniciante), Prata (Intermediário) e Ouro (Avançado e final).</p></div></header>' +
      (pending ? '<div class="exam-banner glass">' + icon('target') + '<span><b>' + pending + ' prova(s) aguardando você.</b> Faça a prova para liberar o certificado.</span></div>' : '') +
      '<section class="cert-final">' + card(fin) + '</section>' +
      [1, 2, 3].map(function (lv) {
        const items = byLevel(lv);
        return '<section class="cert-level glass" style="--ca:' + tr.color.a + ';--cb:' + tr.color.b + '"><header class="card-h"><h2><span class="medal-dot m-' + MEDALS[lv].name.toLowerCase() + '"></span>Nível ' + LEVEL_NAMES[lv] + ' · Medalha ' + MEDALS[lv].name + '</h2><span class="muted sm">' + items.filter(function (c) { return c.unlocked; }).length + '/4</span></header>' +
          '<div class="cert-grid">' + items.map(card).join('') + '</div></section>';
      }).join('');
    fontsReady().then(function () {
      el.querySelectorAll('[data-cert]').forEach(function (b) {
        const cert = list.find(function (c) { return c.id === b.dataset.cert; });
        const old = b.querySelector('canvas');
        const cv = draw(st, cert, cert.type === 'final' ? 0.6 : 0.34);
        cv.setAttribute('aria-hidden', 'true');
        old.replaceWith(cv);
      });
    });
    el.querySelectorAll('[data-cert]').forEach(function (b) {
      b.onclick = function () { viewer(st, list.find(function (c) { return c.id === b.dataset.cert; })); };
    });
    if (pendingOpen) {
      const c = list.find(function (x) { return x.id === pendingOpen; });
      pendingOpen = null;
      if (c) setTimeout(function () { viewer(st, c); }, 200);
    }
  }

  function find(st, id) { return catalog(st).find(function (c) { return c.id === id; }); }
  global.Certificate = { render: render, draw: draw, catalog: catalog, find: find, forPromotion: forPromotion, open: open, PASS: PASS, QUESTIONS: QUESTIONS, MEDALS: MEDALS };
})(window);
