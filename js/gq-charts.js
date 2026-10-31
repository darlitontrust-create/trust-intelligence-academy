/* =====================================================================
   gq-charts.js — Gráficos e cálculos da trilha de Gestão da Qualidade
   ---------------------------------------------------------------------
   Tudo é calculado na hora a partir dos dados (Pareto acumulado,
   limites de controle, Cp/Cpk, OEE, NPR, lead time…) e desenhado em SVG.
   GQCharts.render(fig) → { html, speech, stats }
   Tipos: pareto, control, hist, scatter, ishikawa, cycle, chevrons,
          flow, vsm, matrix, normal, oee, bars, table, sipoc, cards.
   ===================================================================== */
(function (global) {
  'use strict';
  const esc = function (x) { return String(x == null ? '' : x).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  const FS = 1.18; // escala das fontes dos gráficos (legibilidade em colunas estreitas)
  const COL = { a: '#ff9a76', b: '#ff5e3a', line: '#7dd3fc', ok: '#4ade80', bad: '#f87171', warn: '#fbbf24', ink: '#e8ebf6', ink2: '#b6bdd6', ink3: '#7e86a6', grid: 'rgba(255,255,255,0.08)' };

  /* ------------------------------ Números ------------------------------ */
  function round(v, d) { const k = Math.pow(10, d == null ? 2 : d); return Math.round((v + Number.EPSILON) * k) / k; }
  function fmt(v, d) {
    if (v == null || isNaN(v)) return '—';
    if (d == null) return round(v, 2).toLocaleString('pt-BR', { maximumFractionDigits: 2 });
    return round(v, d).toLocaleString('pt-BR', { minimumFractionDigits: d, maximumFractionDigits: d });
  }
  function pct(v, d) { return fmt(v * 100, d == null ? 1 : d) + '%'; }
  function sum(a) { return a.reduce(function (s, x) { return s + x; }, 0); }
  function mean(a) { return sum(a) / a.length; }
  function sd(a) { const m = mean(a); return Math.sqrt(sum(a.map(function (x) { return (x - m) * (x - m); })) / (a.length - 1)); }
  function corr(p) {
    const xs = p.map(function (q) { return q[0]; }), ys = p.map(function (q) { return q[1]; }), mx = mean(xs), my = mean(ys);
    let sxy = 0, sxx = 0, syy = 0;
    p.forEach(function (q) { sxy += (q[0] - mx) * (q[1] - my); sxx += (q[0] - mx) * (q[0] - mx); syy += (q[1] - my) * (q[1] - my); });
    return { r: sxy / Math.sqrt(sxx * syy), b: sxy / sxx, a: my - (sxy / sxx) * mx };
  }

  /** Cálculos usados pelas aulas, pelos exercícios e pelos testes. */
  const calc = {
    pareto: function (items) {
      const s = items.slice().sort(function (x, y) { return y[1] - x[1]; });
      const total = sum(s.map(function (x) { return x[1]; }));
      let acc = 0;
      const rows = s.map(function (x) { acc += x[1]; return { label: x[0], v: x[1], share: x[1] / total, cum: acc / total }; });
      let vital = rows.findIndex(function (r) { return r.cum >= 0.8 - 1e-9; }) + 1;
      return { rows: rows, total: total, vital: vital };
    },
    /** Carta de valores individuais (I-MR): LC = média, limites = média ± 2,66 × MR̄. */
    imr: function (pts) {
      const m = mean(pts); const mr = []; for (let i = 1; i < pts.length; i++) mr.push(Math.abs(pts[i] - pts[i - 1]));
      const mrb = mean(mr);
      return { lc: m, lsc: m + 2.66 * mrb, lic: m - 2.66 * mrb, mrbar: mrb };
    },
    /** Regras de sinais: 1 ponto fora; 8 seguidos do mesmo lado; 6 seguidos subindo ou descendo. */
    signals: function (pts, lim) {
      const out = { beyond: [], run: [], trend: [] };
      pts.forEach(function (v, i) { if (v > lim.lsc || v < lim.lic) out.beyond.push(i); });
      let side = 0, n = 0;
      pts.forEach(function (v, i) {
        const s = v > lim.lc ? 1 : v < lim.lc ? -1 : 0;
        if (s && s === side) n++; else { side = s; n = s ? 1 : 0; }
        if (n >= 8) for (let k = i - n + 1; k <= i; k++) if (out.run.indexOf(k) < 0) out.run.push(k);
      });
      let dir = 0, m = 1;
      for (let i = 1; i < pts.length; i++) {
        const d = pts[i] > pts[i - 1] ? 1 : pts[i] < pts[i - 1] ? -1 : 0;
        if (d && d === dir) m++; else { dir = d; m = d ? 2 : 1; }
        if (m >= 6) for (let k = i - m + 1; k <= i; k++) if (out.trend.indexOf(k) < 0) out.trend.push(k);
      }
      return out;
    },
    cap: function (mu, s, lie, lse) {
      const cp = (lse - lie) / (6 * s), cpu = (lse - mu) / (3 * s), cpl = (mu - lie) / (3 * s);
      return { cp: cp, cpk: Math.min(cpu, cpl), cpu: cpu, cpl: cpl };
    },
    oee: function (o) {
      const run = o.planned - o.down;
      const A = run / o.planned, P = (o.ideal * o.produced) / run, Q = (o.produced - o.defects) / o.produced;
      return { A: A, P: P, Q: Q, oee: A * P * Q, run: run };
    },
    dpmo: function (def, units, opp) { return def / (units * opp) * 1e6; },
    /** Nível sigma de curto prazo (com deslocamento de 1,5σ) a partir do DPMO. */
    sigma: function (dpmo) { return invNorm(1 - dpmo / 1e6) + 1.5; },
    vsm: function (steps) {
      const va = sum(steps.map(function (s) { return s.ct; })), wait = sum(steps.map(function (s) { return s.wait || 0; }));
      return { va: va, wait: wait, lead: va + wait, pce: va / (va + wait) };
    },
    takt: function (avail, demand) { return avail / demand; },
  };
  /* Inversa da normal padrão (Acklam). */
  function invNorm(p) {
    const a = [-3.969683028665376e+01, 2.209460984245205e+02, -2.759285104469687e+02, 1.383577518672690e+02, -3.066479806614716e+01, 2.506628277459239e+00];
    const b = [-5.447609879822406e+01, 1.615858368580409e+02, -1.556989798598866e+02, 6.680131188771972e+01, -1.328068155288572e+01];
    const c = [-7.784894002430293e-03, -3.223964580411365e-01, -2.400758277161838e+00, -2.549732539343734e+00, 4.374664141464968e+00, 2.938163982698783e+00];
    const d = [7.784695709041462e-03, 3.224671290700398e-01, 2.445134137142996e+00, 3.754408661907416e+00];
    const pl = 0.02425; let q, r;
    if (p < pl) { q = Math.sqrt(-2 * Math.log(p)); return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1); }
    if (p <= 1 - pl) { q = p - 0.5; r = q * q; return (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1); }
    q = Math.sqrt(-2 * Math.log(1 - p)); return -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  }

  /* ------------------------------ SVG base ------------------------------ */
  function svg(w, h, body, label) { return '<svg class="gq-svg" viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="' + esc(label || 'Gráfico') + '" preserveAspectRatio="xMidYMid meet">' + body + '</svg>'; }
  function t(x, y, s, o) {
    o = o || {};
    return '<text x="' + x + '" y="' + y + '" fill="' + (o.c || COL.ink2) + '" font-size="' + ((o.s || 11) * FS).toFixed(1) + '"' + (o.a ? ' text-anchor="' + o.a + '"' : '') + (o.w ? ' font-weight="' + o.w + '"' : '') + (o.r ? ' transform="rotate(' + o.r + ' ' + x + ' ' + y + ')"' : '') + '>' + esc(s) + '</text>';
  }
  function wrap(s, max) {
    const words = String(s).split(' '), lines = ['']; words.forEach(function (w) { const l = lines[lines.length - 1]; if ((l + ' ' + w).trim().length > max && l) lines.push(w); else lines[lines.length - 1] = (l + ' ' + w).trim(); });
    return lines;
  }
  function tml(x, y, s, max, o) {
    o = o || {}; const lines = wrap(s, max), lh = (o.s || 11) * FS * 1.18;
    return '<text x="' + x + '" y="' + y + '" fill="' + (o.c || COL.ink2) + '" font-size="' + ((o.s || 11) * FS).toFixed(1) + '"' + (o.a ? ' text-anchor="' + o.a + '"' : '') + (o.w ? ' font-weight="' + o.w + '"' : '') + '>' +
      lines.map(function (l, i) { return '<tspan x="' + x + '" dy="' + (i ? lh : 0) + '">' + esc(l) + '</tspan>'; }).join('') + '</text>';
  }
  function ln(x1, y1, x2, y2, c, o) { o = o || {}; return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + c + '" stroke-width="' + (o.w || 1) + '"' + (o.dash ? ' stroke-dasharray="' + o.dash + '"' : '') + '/>'; }
  function niceStep(v) { const p = Math.pow(10, Math.floor(Math.log10(v))); const m = v / p; return [1, 2, 2.5, 5, 10].some(function (k) { return Math.abs(m - k) < 1e-9; }); }
  function nTicks(max) { return niceStep(max / 4) ? 4 : niceStep(max / 5) ? 5 : 4; }
  function decs(vals) { return Math.max.apply(null, vals.map(function (v) { const s = String(round(v, 2)); return s.indexOf('.') < 0 ? 0 : s.split('.')[1].length; })); }
  function niceMax(v) { const p = Math.pow(10, Math.floor(Math.log10(v || 1))); const m = v / p; return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 2.5 ? 2.5 : m <= 5 ? 5 : 10) * p; }
  function axisY(x, y0, y1, max, n, f) { let s = ''; for (let i = 0; i <= n; i++) { const v = max * i / n, y = y0 - (y0 - y1) * i / n; s += ln(x, y, x + 4, y, COL.grid) + t(x - 4, y + 4, f ? f(v) : fmt(v, v % 1 ? 1 : 0), { a: 'end', s: 10, c: COL.ink3 }); } return s; }
  function grid(x0, x1, y0, y1, n) { let s = ''; for (let i = 0; i <= n; i++) { const y = y0 - (y0 - y1) * i / n; s += ln(x0, y, x1, y, COL.grid); } return s; }

  /* ------------------------------- Gráficos ------------------------------- */
  const R = {};

  R.pareto = function (f) {
    const p = calc.pareto(f.items), W = 580, H = 300, L = 50, Rr = 62, T = 18, B = f.rot ? 92 : 62, n = p.rows.length;
    const x0 = L, x1 = W - Rr, y0 = H - B, y1 = T, bw = (x1 - x0) / n, withCum = f.cum !== false;
    // com a linha do acumulado, barras e linha usam a mesma escala: 0 a total (esq.) = 0 a 100% (dir.)
    const max = withCum ? p.total : niceMax(p.rows[0].v * 1.05);
    let s = withCum ? grid(x0, x1, y0, y1, 4) + axisY(x0, y0, y1, max, 2, function (v) { return fmt(v, 0); }) : grid(x0, x1, y0, y1, nTicks(max)) + axisY(x0, y0, y1, max, nTicks(max));
    if (withCum) for (let i = 0; i <= 4; i++) s += t(x1 + 4, y0 - (y0 - y1) * i / 4 + 4, (i * 25) + '%', { s: 9.5, c: COL.ink3 });
    p.rows.forEach(function (r, i) {
      const h = (y0 - y1) * r.v / max, x = x0 + i * bw + bw * 0.14, vital = withCum && i < p.vital;
      s += '<rect x="' + x + '" y="' + (y0 - h) + '" width="' + (bw * 0.72) + '" height="' + h + '" rx="3" fill="' + (vital ? COL.b : 'rgba(255,154,118,0.45)') + '"/>';
      s += withCum && h > 22 ? t(x + bw * 0.36, y0 - h + 15, fmt(r.v), { a: 'middle', s: 10.5, c: vital ? '#1a0b05' : COL.ink, w: 700 }) : t(x + bw * 0.36, y0 - h - 5, fmt(r.v), { a: 'middle', s: 10, c: COL.ink });
      s += f.rot ? t(x + bw * 0.36, y0 + 12, r.label, { a: 'end', s: 10, r: -35 }) : tml(x + bw * 0.36, y0 + 14, r.label, Math.max(8, Math.round(bw / 6.2)), { a: 'middle', s: 10 });
    });
    if (f.cum !== false) {
      s += ln(x0, y0 - (y0 - y1) * 0.8, x1, y0 - (y0 - y1) * 0.8, COL.warn, { dash: '4 4' }) + t(x1 + 30, y0 - (y0 - y1) * 0.8 + 4, '80%', { s: 10, c: COL.warn, w: 700 });
      const pts = p.rows.map(function (r, i) { return [x0 + i * bw + bw / 2, y0 - (y0 - y1) * r.cum]; });
      s += '<polyline fill="none" stroke="' + COL.line + '" stroke-width="2" points="' + pts.map(function (q) { return q.join(','); }).join(' ') + '"/>';
      pts.forEach(function (q, i) { s += '<circle cx="' + q[0] + '" cy="' + q[1] + '" r="3.2" fill="' + COL.line + '"/>' + (f.cumLabels === false ? '' : t(q[0] + (i ? 0 : 0), q[1] - 8, pct(p.rows[i].cum, 0), { a: 'middle', s: 9.5, c: COL.line, w: 600 })); });
    }
    return {
      html: svg(W, H, s, 'Diagrama de Pareto') + (f.cum !== false ? legend([[COL.b, 'Poucos vitais (até 80%)'], ['rgba(255,154,118,0.45)', 'Muitos triviais'], [COL.line, '% acumulado']]) : ''),
      speech: f.cum === false ? 'O gráfico mostra as categorias da maior para a menor.' : 'Calculado agora: ' + p.vital + ' de ' + n + ' categorias somam ' + pct(p.rows[p.vital - 1].cum) + ' do total de ' + fmt(p.total) + '.',
      stats: p,
    };
  };

  R.control = function (f) {
    const pts = f.pts, lim = f.lim || calc.imr(pts), sig = calc.signals(pts, lim), W = 580, H = 270, L = 46, Rr = 64, T = 16, B = 34;
    const lo = Math.min(lim.lic, Math.min.apply(null, pts)), hi = Math.max(lim.lsc, Math.max.apply(null, pts)), pad = (hi - lo) * 0.12;
    const vmin = lo - pad, vmax = hi + pad, x0 = L, x1 = W - Rr, y0 = H - B, y1 = T;
    const Y = function (v) { return y0 - (y0 - y1) * (v - vmin) / (vmax - vmin); }, X = function (i) { return x0 + (x1 - x0) * i / (pts.length - 1); };
    let s = '';
    [['LSC', lim.lsc, COL.bad, '5 4'], ['LC', lim.lc, COL.ok, ''], ['LIC', lim.lic, COL.bad, '5 4']].forEach(function (l) {
      s += ln(x0, Y(l[1]), x1, Y(l[1]), l[2], { dash: l[3], w: 1.3 }) + t(x1 + 5, Y(l[1]) + 4, l[0] + ' ' + fmt(l[1], f.d == null ? 1 : f.d), { s: 10, c: l[2] });
    });
    s += '<polyline fill="none" stroke="' + COL.line + '" stroke-width="1.6" points="' + pts.map(function (v, i) { return X(i) + ',' + Y(v); }).join(' ') + '"/>';
    const flag = f.mark === false ? [] : sig.beyond.concat(sig.run, sig.trend);
    pts.forEach(function (v, i) {
      const bad = flag.indexOf(i) >= 0;
      s += '<circle cx="' + X(i) + '" cy="' + Y(v) + '" r="' + (bad ? 4.6 : 3.2) + '" fill="' + (bad ? COL.bad : COL.line) + '"' + (bad ? ' stroke="#fff" stroke-width="1"' : '') + '/>';
      if (pts.length <= 31 && (i % (pts.length > 20 ? 2 : 1) === 0)) s += t(X(i), y0 + 16, f.labels ? f.labels[i] : String(i + 1), { a: 'middle', s: 9.5, c: COL.ink3 });
    });
    s += t(x0 - 6, Y(vmax) + 8, f.unit || '', { a: 'end', s: 10, c: COL.ink3 });
    const msg = sig.beyond.length ? sig.beyond.length + ' ponto(s) fora dos limites' : sig.run.length ? 'uma sequência de 8 pontos do mesmo lado da média' : sig.trend.length ? 'uma tendência de 6 pontos seguidos' : 'nenhum sinal de causa especial';
    return { html: svg(W, H, s, 'Carta de controle'), speech: 'Limites calculados agora: média ' + fmt(lim.lc, 1) + ', limite superior ' + fmt(lim.lsc, 1) + ' e inferior ' + fmt(lim.lic, 1) + '. A carta mostra ' + msg + '.', stats: { lim: lim, sig: sig } };
  };

  R.hist = function (f) {
    const v = f.values, lo = f.from != null ? f.from : Math.floor(Math.min.apply(null, v)), w = f.bin, nb = Math.ceil((Math.max.apply(null, v) - lo + 1e-9) / w) || 1;
    const bins = []; for (let i = 0; i < nb; i++) bins.push(0);
    v.forEach(function (x) { bins[Math.min(nb - 1, Math.floor((x - lo) / w))]++; });
    const W = 580, H = 260, L = 40, Rr = 18, T = 16, B = 44, x0 = L, x1 = W - Rr, y0 = H - B, y1 = T, max = niceMax(Math.max.apply(null, bins)), bw = (x1 - x0) / nb;
    const X = function (val) { return x0 + (val - lo) / (w * nb) * (x1 - x0); };
    let s = grid(x0, x1, y0, y1, nTicks(max)) + axisY(x0, y0, y1, max, nTicks(max));
    bins.forEach(function (c, i) { const h = (y0 - y1) * c / max; s += '<rect x="' + (x0 + i * bw + 1) + '" y="' + (y0 - h) + '" width="' + (bw - 2) + '" height="' + h + '" fill="rgba(255,154,118,0.75)"/>' + (c ? t(x0 + i * bw + bw / 2, y0 - h - 4, String(c), { a: 'middle', s: 10, c: COL.ink }) : ''); });
    for (let i = 0; i <= nb; i++) s += t(x0 + i * bw, y0 + 14, fmt(lo + i * w, w % 1 ? 1 : 0), { a: 'middle', s: 9.5, c: COL.ink3 });
    s += t((x0 + x1) / 2, H - 8, f.xlab || '', { a: 'middle', s: 10.5 });
    [['LIE', f.lie], ['LSE', f.lse]].forEach(function (l) { if (l[1] != null) s += ln(X(l[1]), y1, X(l[1]), y0, COL.bad, { dash: '5 4', w: 1.4 }) + t(X(l[1]), y1 + 10, l[0], { a: 'middle', s: 10, c: COL.bad }); });
    const m = mean(v); s += ln(X(m), y1 + 14, X(m), y0, COL.ok, { w: 1.4 });
    const out = v.filter(function (x) { return (f.lie != null && x < f.lie) || (f.lse != null && x > f.lse); }).length;
    return { html: svg(W, H, s, 'Histograma'), speech: 'Calculado agora: média de ' + fmt(m, 1) + (f.lie != null || f.lse != null ? ' e ' + out + ' de ' + v.length + ' valores fora da especificação.' : '; a maior barra concentra ' + Math.max.apply(null, bins) + ' valores.'), stats: { bins: bins, mean: m, sd: sd(v), out: out } };
  };

  R.scatter = function (f) {
    const p = f.pairs, W = 580, H = 270, L = 48, Rr = 18, T = 16, B = 42, c = corr(p);
    const xs = p.map(function (q) { return q[0]; }), ys = p.map(function (q) { return q[1]; });
    const xmin = Math.min.apply(null, xs), xmax = Math.max.apply(null, xs), ymax = niceMax(Math.max.apply(null, ys)), x0 = L, x1 = W - Rr, y0 = H - B, y1 = T;
    const X = function (v) { return x0 + (x1 - x0) * (v - xmin) / ((xmax - xmin) || 1); }, Y = function (v) { return y0 - (y0 - y1) * v / ymax; };
    let s = grid(x0, x1, y0, y1, nTicks(ymax)) + axisY(x0, y0, y1, ymax, nTicks(ymax));
    if (f.trend !== false) s += ln(X(xmin), Y(c.a + c.b * xmin), X(xmax), Y(c.a + c.b * xmax), COL.warn, { dash: '5 4', w: 1.4 });
    p.forEach(function (q) { s += '<circle cx="' + X(q[0]) + '" cy="' + Y(q[1]) + '" r="4" fill="' + COL.line + '" fill-opacity="0.85"/>'; });
    s += t(x0, y0 + 16, fmt(xmin), { a: 'middle', s: 10, c: COL.ink3 }) + t(x1, y0 + 16, fmt(xmax), { a: 'middle', s: 10, c: COL.ink3 });
    s += t((x0 + x1) / 2, H - 6, f.xlab || 'X', { a: 'middle', s: 10.5 }) + t(12, (y0 + y1) / 2, f.ylab || 'Y', { a: 'middle', s: 10.5, r: -90 });
    const forca = Math.abs(c.r) >= 0.7 ? 'forte' : Math.abs(c.r) >= 0.4 ? 'moderada' : 'fraca';
    return { html: svg(W, H, s, 'Diagrama de dispersão') + (f.showR === false ? '' : '<p class="gq-cap">Correlação r = <b>' + fmt(c.r, 2) + '</b> (' + forca + ', ' + (c.r >= 0 ? 'positiva' : 'negativa') + ')</p>'), speech: 'Calculado agora: correlação ' + forca + ' e ' + (c.r >= 0 ? 'positiva' : 'negativa') + ', r igual a ' + fmt(c.r, 2) + '.', stats: c };
  };

  R.ishikawa = function (f) {
    const cats = f.cats, keys = Object.keys(cats), W = 640, H = 300, sy = 150, hx = 500;
    let s = ln(30, sy, hx, sy, COL.ink2, { w: 2.4 }) + '<polygon points="' + hx + ',' + (sy - 7) + ' ' + (hx + 12) + ',' + sy + ' ' + hx + ',' + (sy + 7) + '" fill="' + COL.ink2 + '"/>';
    s += '<rect x="' + (hx + 14) + '" y="' + (sy - 34) + '" width="104" height="68" rx="10" fill="rgba(255,94,58,0.18)" stroke="' + COL.b + '"/>' + tml(hx + 66, sy - (wrap(f.effect, 14).length - 1) * 6.5 + 4, f.effect, 14, { a: 'middle', s: 11, c: COL.ink, w: 600 });
    const per = Math.ceil(keys.length / 2), gap = (hx - 110) / per;
    keys.forEach(function (k, i) {
      const top = i < per, j = top ? i : i - per, bx = 110 + j * gap + gap * 0.42, by = top ? 40 : 260;
      s += ln(bx, by, bx + 52, sy, COL.ink3, { w: 1.6 }) + t(bx, top ? by - 10 : by + 18, k, { a: 'middle', s: 11.5, c: COL.a, w: 700 });
      (cats[k] || []).slice(0, 3).forEach(function (c, n) {
        const fr = (n + 1) / 4, cx = bx + 52 * fr, cy = by + (sy - by) * fr;
        const nl = wrap(c, 15).length; s += ln(cx - 36, cy, cx, cy, COL.grid, { w: 1 }) + tml(cx - 38, cy + 3.5 - (nl - 1) * 5.5, c, 15, { a: 'end', s: 9, c: COL.ink2 });
      });
    });
    const n = sum(keys.map(function (k) { return (cats[k] || []).length; }));
    return { html: svg(W, H, s, 'Diagrama de Ishikawa'), speech: 'O diagrama organiza ' + n + ' causas possíveis em ' + keys.length + ' categorias, todas apontando para o efeito: ' + f.effect + '.', stats: { n: n } };
  };

  R.cycle = function (f) {
    const st = f.steps, n = st.length, W = 560, H = 290, cx = 140, cy = 145, r = 112, ri = 50;
    const cols = [COL.b, '#f59e0b', '#38bdf8', '#4ade80', '#a78bfa', '#f472b6'];
    let s = '';
    st.forEach(function (p, i) {
      const a0 = -Math.PI / 2 + i * 2 * Math.PI / n + 0.03, a1 = -Math.PI / 2 + (i + 1) * 2 * Math.PI / n - 0.03, am = (a0 + a1) / 2;
      const P = function (rr, a) { return (cx + rr * Math.cos(a)).toFixed(1) + ' ' + (cy + rr * Math.sin(a)).toFixed(1); };
      s += '<path d="M' + P(ri, a0) + ' L' + P(r, a0) + ' A' + r + ' ' + r + ' 0 0 1 ' + P(r, a1) + ' L' + P(ri, a1) + ' A' + ri + ' ' + ri + ' 0 0 0 ' + P(ri, a0) + 'Z" fill="' + cols[i % cols.length] + '" fill-opacity="0.82"/>';
      s += t(cx + (r + ri) / 2 * Math.cos(am), cy + (r + ri) / 2 * Math.sin(am) + 7, p.k, { a: 'middle', s: 20, c: '#0b0f1a', w: 800 });
      const ly = 30 + i * (230 / n) + 6;
      s += '<rect x="290" y="' + (ly - 12) + '" width="10" height="10" rx="2" fill="' + cols[i % cols.length] + '"/>' + t(308, ly - 3, p.t, { s: 12, c: COL.ink, w: 700 }) + tml(308, ly + 12, p.d, 40, { s: 10.5 });
    });
    s += t(cx, cy + 4, f.center || '', { a: 'middle', s: 11, c: COL.ink2, w: 700 });
    return { html: svg(W, H, s, f.center || 'Ciclo'), speech: 'O ciclo tem ' + n + ' etapas: ' + st.map(function (p) { return p.t; }).join(', ') + '.', stats: {} };
  };

  R.chevrons = function (f) {
    const st = f.steps, n = st.length, W = 600, H = 168, w = (W - 10) / n;
    const cols = [COL.b, '#f59e0b', '#38bdf8', '#4ade80', '#a78bfa', '#f472b6', '#fb7185', '#22d3ee'];
    let s = '';
    st.forEach(function (p, i) {
      const x = 5 + i * w, tip = 14;
      s += '<polygon points="' + x + ',10 ' + (x + w - tip) + ',10 ' + (x + w) + ',40 ' + (x + w - tip) + ',70 ' + x + ',70 ' + (x + (i ? tip : 0)) + ',40" fill="' + cols[i % cols.length] + '" fill-opacity="0.85"/>';
      s += t(x + w / 2 + (i ? 4 : -2), 46, p.k, { a: 'middle', s: n > 6 ? 12 : 15, c: '#0b0f1a', w: 800 });
      const alt = n > 6 && i % 2 === 1; if (alt) s += ln(x + w / 2, 72, x + w / 2, 104, COL.grid); s += tml(x + w / 2, alt ? 120 : 90, p.t, Math.max(9, Math.round(w / (n > 6 ? 5.2 : 6.6))), { a: 'middle', s: n > 6 ? 10 : 10.5, c: COL.ink, w: 600 });
    });
    return { html: svg(W, H, s, 'Etapas'), speech: 'São ' + n + ' etapas em sequência: ' + st.map(function (p) { return p.t; }).join(', ') + '.', stats: {} };
  };

  R.flow = function (f) {
    const st = f.steps, W = 420, rowH = 58, H = st.length * rowH + 10, cx = 170;
    let s = '';
    st.forEach(function (p, i) {
      const y = 8 + i * rowH, mid = y + 20;
      if (p.t === 'start' || p.t === 'end') s += '<rect x="' + (cx - 80) + '" y="' + y + '" width="160" height="40" rx="20" fill="rgba(74,222,128,0.16)" stroke="' + COL.ok + '"/>';
      else if (p.t === 'dec') s += '<polygon points="' + cx + ',' + (y - 4) + ' ' + (cx + 92) + ',' + mid + ' ' + cx + ',' + (y + 44) + ' ' + (cx - 92) + ',' + mid + '" fill="rgba(251,191,36,0.14)" stroke="' + COL.warn + '"/>';
      else s += '<rect x="' + (cx - 90) + '" y="' + y + '" width="180" height="40" rx="6" fill="rgba(125,211,252,0.12)" stroke="' + COL.line + '"/>';
      s += tml(cx, mid - (wrap(p.label, p.t === 'dec' ? 20 : 26).length - 1) * 6 + 4, p.label, p.t === 'dec' ? 20 : 26, { a: 'middle', s: 10.5, c: COL.ink });
      if (i < st.length - 1) s += ln(cx, y + (p.t === 'dec' ? 44 : 40), cx, y + rowH, COL.ink3, { w: 1.4 }) + '<polygon points="' + (cx - 4) + ',' + (y + rowH - 6) + ' ' + (cx + 4) + ',' + (y + rowH - 6) + ' ' + cx + ',' + (y + rowH) + '" fill="' + COL.ink3 + '"/>' + (p.t === 'dec' ? t(cx + 8, y + 54, 'Sim', { s: 9.5, c: COL.ok }) : '');
      if (p.t === 'dec' && p.no) s += ln(cx + 92, mid, cx + 130, mid, COL.bad, { w: 1.3 }) + t(cx + 100, mid - 6, 'Não', { s: 9.5, c: COL.bad }) + tml(cx + 136, mid + 4, p.no, 16, { s: 10, c: COL.bad });
    });
    return { html: '<div class="gq-flow">' + svg(W, H, s, 'Fluxograma') + '</div>', speech: 'O fluxograma tem ' + st.length + ' passos, com ' + st.filter(function (p) { return p.t === 'dec'; }).length + ' ponto(s) de decisão.', stats: {} };
  };

  R.vsm = function (f) {
    const st = f.steps, n = st.length, v = calc.vsm(st), W = 600, H = 210, w = (W - 20) / n, u = f.unit || 'min';
    let s = '';
    st.forEach(function (p, i) {
      const x = 10 + i * w;
      s += '<rect x="' + (x + 6) + '" y="10" width="' + (w - 12) + '" height="56" rx="6" fill="rgba(125,211,252,0.12)" stroke="' + COL.line + '"/>' + tml(x + w / 2, wrap(p.n, Math.round(w / 9)).length > 1 ? 33 : 43, p.n, Math.round(w / 9), { a: 'middle', s: 12, c: COL.ink, w: 600 });
      s += t(x + w / 2, 86, 'TC ' + fmt(p.ct) + ' ' + u, { a: 'middle', s: 11.5, c: COL.ink2 });
      if (i < n - 1) s += '<polygon points="' + (x + w - 4) + ',30 ' + (x + w + 4) + ',38 ' + (x + w - 4) + ',46" fill="' + COL.ink3 + '"/>';
      // escada da linha do tempo
      s += ln(x + 6, 130, x + w * 0.5, 130, COL.bad, { w: 2 }) + t(x + w * 0.27, 122, fmt(p.wait || 0) + ' ' + u, { a: 'middle', s: 11.5, c: COL.bad, w: 600 });
      s += ln(x + w * 0.5, 130, x + w * 0.5, 156, COL.ink3) + ln(x + w * 0.5, 156, x + w - 6, 156, COL.ok, { w: 2 }) + t(x + w * 0.75, 174, fmt(p.ct) + ' ' + u, { a: 'middle', s: 11.5, c: COL.ok, w: 600 });
      if (i < n - 1) s += ln(x + w - 6, 156, x + w + 6, 130, COL.ink3);
    });
    s += t(10, 202, 'Espera (sem valor)', { s: 11, c: COL.bad }) + t(190, 202, 'Processamento (valor)', { s: 11, c: COL.ok });
    return {
      html: svg(W, H, s, 'Mapa do fluxo de valor') + (f.totals === false ? '' : '<ul class="gq-kpis"><li><small>Lead time</small><b>' + fmt(v.lead) + ' ' + u + '</b></li><li><small>Tempo de valor</small><b>' + fmt(v.va) + ' ' + u + '</b></li><li><small>Eficiência (PCE)</small><b>' + pct(v.pce) + '</b></li></ul>'),
      speech: 'Calculado agora: lead time de ' + fmt(v.lead) + ' ' + u + ', dos quais só ' + fmt(v.va) + ' agregam valor, uma eficiência de ' + pct(v.pce) + '.', stats: v,
    };
  };

  R.matrix = function (f) {
    const isF = f.mode === 'fmea', heads = f.heads || (isF ? ['Modo de falha', 'S', 'O', 'D'] : ['Problema', 'G', 'U', 'T']);
    const rows = f.rows.map(function (r) { return { r: r, score: r[1] * r[2] * r[3] }; });
    const sorted = f.sort === false ? rows : rows.slice().sort(function (a, b) { return b.score - a.score; });
    const hide = f.score === false;
    const html = '<div class="dt"><div class="dt-scroll"><table class="gq-tbl"><thead><tr>' + heads.map(function (h) { return '<th class="plain">' + esc(h) + '</th>'; }).join('') + (hide ? '' : '<th class="plain res">' + (isF ? 'NPR' : 'G×U×T') + '</th>') + '</tr></thead><tbody>' +
      sorted.map(function (x, i) { return '<tr' + (!hide && i === 0 ? ' class="top"' : '') + '>' + x.r.map(function (v, j) { return '<td' + (j ? ' class="n"' : '') + '>' + esc(v) + '</td>'; }).join('') + (hide ? '' : '<td class="res n">' + x.score + '</td>') + '</tr>'; }).join('') + '</tbody></table></div></div>';
    return { html: html, speech: hide ? '' : 'Calculado agora: a maior prioridade é ' + sorted[0].r[0] + ', com pontuação ' + sorted[0].score + '.', stats: { sorted: sorted } };
  };

  R.normal = function (f) {
    const mu = f.mean, s0 = f.sd, c = calc.cap(mu, s0, f.lie, f.lse), W = 580, H = 250, x0 = 30, x1 = 550, y0 = 200, y1 = 30;
    const lo = Math.min(f.lie - (f.lse - f.lie) * 0.25, mu - 4 * s0), hi = Math.max(f.lse + (f.lse - f.lie) * 0.25, mu + 4 * s0);
    const X = function (v) { return x0 + (x1 - x0) * (v - lo) / (hi - lo); }, pdf = function (v) { return Math.exp(-0.5 * Math.pow((v - mu) / s0, 2)); };
    let curve = '', outL = '', outR = '';
    for (let i = 0; i <= 120; i++) { const v = lo + (hi - lo) * i / 120, y = y0 - (y0 - y1) * pdf(v); curve += (i ? 'L' : 'M') + X(v).toFixed(1) + ' ' + y.toFixed(1); }
    for (let i = 0; i <= 60; i++) { const v = lo + (f.lie - lo) * i / 60; outL += (i ? 'L' : 'M') + X(v).toFixed(1) + ' ' + (y0 - (y0 - y1) * pdf(v)).toFixed(1); }
    for (let i = 0; i <= 60; i++) { const v = f.lse + (hi - f.lse) * i / 60; outR += (i ? 'L' : 'M') + X(v).toFixed(1) + ' ' + (y0 - (y0 - y1) * pdf(v)).toFixed(1); }
    let s = '<path d="' + outL + 'L' + X(f.lie) + ' ' + y0 + 'L' + X(lo) + ' ' + y0 + 'Z" fill="rgba(248,113,113,0.35)"/><path d="M' + X(f.lse) + ' ' + y0 + outR.replace('M', 'L') + 'L' + X(hi) + ' ' + y0 + 'Z" fill="rgba(248,113,113,0.35)"/>';
    s += '<path d="' + curve + '" fill="rgba(255,154,118,0.14)" stroke="' + COL.a + '" stroke-width="2"/>' + ln(x0, y0, x1, y0, COL.ink3);
    [['LIE', f.lie, COL.bad], ['LSE', f.lse, COL.bad], ['Média', mu, COL.ok]].forEach(function (l) { s += ln(X(l[1]), y1 - 10, X(l[1]), y0, l[2], { dash: l[0] === 'Média' ? '' : '5 4', w: 1.4 }) + t(X(l[1]), y1 - 14, l[0] + ' ' + fmt(l[1], f.d == null ? 1 : f.d), { a: 'middle', s: 10, c: l[2] }); });
    if (f.alvo != null) s += ln(X(f.alvo), y0 - 8, X(f.alvo), y0 + 8, COL.ink) + t(X(f.alvo), y0 + 20, 'Alvo', { a: 'middle', s: 10, c: COL.ink2 });
    return { html: svg(W, H, s, 'Capabilidade do processo') + (f.show === false ? '' : '<ul class="gq-kpis"><li><small>Cp</small><b>' + fmt(c.cp, 2) + '</b></li><li><small>Cpk</small><b>' + fmt(c.cpk, 2) + '</b></li><li><small>Desvio padrão</small><b>' + fmt(s0, 2) + '</b></li></ul>'), speech: 'Calculado agora: Cp de ' + fmt(c.cp, 2) + ' e Cpk de ' + fmt(c.cpk, 2) + '.', stats: c };
  };

  R.oee = function (f) {
    const o = calc.oee(f), W = 580, H = 210, x0 = 130, x1 = 540;
    const rows = [['Disponibilidade', o.A, COL.line], ['Performance', o.P, COL.warn], ['Qualidade', o.Q, COL.ok], ['OEE', o.oee, COL.b]];
    let s = '';
    rows.forEach(function (r, i) {
      const y = 20 + i * 46, w = (x1 - x0) * Math.min(1, r[1]);
      s += t(x0 - 10, y + 18, r[0], { a: 'end', s: 12, c: i === 3 ? COL.ink : COL.ink2, w: i === 3 ? 700 : 500 }) + '<rect x="' + x0 + '" y="' + y + '" width="' + (x1 - x0) + '" height="26" rx="6" fill="rgba(255,255,255,0.05)"/>';
      s += '<rect x="' + x0 + '" y="' + y + '" width="' + w + '" height="26" rx="6" fill="' + r[2] + '" fill-opacity="0.8"/>' + (f.show === false && i === 3 ? t(x0 + 10, y + 18, '?', { s: 12, c: '#0b0f1a', w: 800 }) : t(x0 + w - 8, y + 18, pct(r[1]), { a: 'end', s: 12, c: '#0b0f1a', w: 800 }));
    });
    return { html: svg(W, H, s, 'OEE'), speech: 'Calculado agora: disponibilidade de ' + pct(o.A) + ', performance de ' + pct(o.P) + ' e qualidade de ' + pct(o.Q) + '. O OEE é o produto dos três: ' + pct(o.oee) + '.', stats: o };
  };

  R.bars = function (f) {
    const L = f.labels, S = f.series, W = 580, H = 260, Lm = 44, Rr = 14, T = 16, B = 50, x0 = Lm, x1 = W - Rr, y0 = H - B, y1 = T;
    const max = niceMax(Math.max.apply(null, S.map(function (s) { return Math.max.apply(null, s.values); })));
    const cols = [COL.b, COL.line, COL.ok, COL.warn, '#a78bfa'], gw = (x1 - x0) / L.length, bw = gw * 0.78 / S.length;
    let s = grid(x0, x1, y0, y1, nTicks(max)) + axisY(x0, y0, y1, max, nTicks(max));
    L.forEach(function (l, i) {
      S.forEach(function (se, j) { const v = se.values[i], dd = decs(se.values), h = (y0 - y1) * v / max, x = x0 + i * gw + gw * 0.11 + j * bw; s += '<rect x="' + x + '" y="' + (y0 - h) + '" width="' + (bw - 2) + '" height="' + h + '" rx="2" fill="' + cols[j % cols.length] + '" fill-opacity="0.85"/>' + (v ? t(x + bw / 2 - 1, y0 - h - 4, fmt(v, dd), { a: 'middle', s: 9.5, c: COL.ink }) : ''); });
      s += tml(x0 + i * gw + gw / 2, y0 + 14, l, Math.max(8, Math.round(gw / 6.2)), { a: 'middle', s: 10 });
    });
    return { html: svg(W, H, s, f.title || 'Gráfico de barras') + (S.length > 1 ? legend(S.map(function (se, j) { return [cols[j % cols.length], se.name]; })) : ''), speech: f.speech || '', stats: {} };
  };

  R.table = function (f) {
    const html = '<div class="dt"><div class="dt-scroll"><table class="gq-tbl"><thead><tr>' + f.cols.map(function (h) { return '<th class="plain">' + esc(h) + '</th>'; }).join('') + '</tr></thead><tbody>' +
      f.rows.map(function (r, i) { return '<tr' + (f.hl && f.hl.indexOf(i) >= 0 ? ' class="top"' : '') + (f.tot && i === f.rows.length - 1 ? ' class="tot"' : '') + '>' + r.map(function (v) { return '<td' + (typeof v === 'number' ? ' class="n"' : '') + '>' + esc(typeof v === 'number' ? fmt(v) : v) + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div></div>' + (f.note ? '<p class="gq-cap">' + esc(f.note) + '</p>' : '');
    return { html: html, speech: f.speech || '', stats: {} };
  };

  R.sipoc = function (f) {
    const K = ['Fornecedor', 'Entrada', 'Processo', 'Saída', 'Cliente'], L = ['S', 'I', 'P', 'O', 'C'];
    const html = '<div class="gq-sipoc">' + K.map(function (k, i) { return '<div class="gq-sc' + (i === 2 ? ' mid' : '') + '"><b>' + L[i] + '</b><small>' + k + '</small><ul>' + (f[L[i]] || []).map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul></div>'; }).join('') + '</div>';
    return { html: html, speech: 'O SIPOC mostra o processo ' + (f.P || []).join(', ') + ', de quem fornece a quem recebe.', stats: {} };
  };

  R.cards = function (f) {
    const html = '<div class="gq-cards">' + f.items.map(function (it) { return '<div class="gq-card"><b>' + esc(it[0]) + '</b><p>' + esc(it[1]) + '</p></div>'; }).join('') + '</div>';
    return { html: html, speech: f.speech || '', stats: {} };
  };

  function legend(items) { return '<ul class="gq-leg">' + items.map(function (i) { return '<li><i style="background:' + i[0] + '"></i>' + esc(i[1]) + '</li>'; }).join('') + '</ul>'; }

  function render(fig) {
    if (!fig) return { html: '', speech: '', stats: {} };
    const fn = R[fig.type];
    if (!fn) return { html: '<p class="muted">Figura desconhecida.</p>', speech: '', stats: {} };
    const out = fn(fig);
    out.html = '<figure class="gq-fig">' + (fig.title ? '<figcaption>' + esc(fig.title) + '</figcaption>' : '') + out.html + '</figure>';
    return out;
  }

  /** Realce para os blocos de "como se aplica" e cálculos. */
  function highlight(code) {
    return String(code).split('\n').map(function (line) {
      const m = line.match(/^(\s*)(#.*)$/);
      if (m) return m[1] + '<span class="fe-comment">' + esc(m[2]) + '</span>';
      const head = line.match(/^(\s*)([^→:=]{1,26}?)(\s*)(→|:|=)(?!=)(.*)$/);
      const body = function (s) {
        return esc(s).replace(/(&quot;[^&]*&quot;)|(\b\d+(?:[.,]\d+)*%?)|([×÷+−\-*/≥≤<>]|→)/g, function (all, q, n, op) {
          if (q) return '<span class="fe-str">' + q + '</span>';
          if (n) return '<span class="fe-num">' + n + '</span>';
          return '<span class="fe-op">' + op + '</span>';
        });
      };
      if (head) return head[1] + '<span class="fe-fn">' + esc(head[2]) + '</span>' + head[3] + '<span class="fe-op">' + esc(head[4]) + '</span>' + body(head[5]);
      return body(line);
    }).join('\n');
  }

  global.GQCharts = { render: render, calc: calc, fmt: fmt, pct: pct, round: round, mean: mean, sd: sd, corr: corr, highlight: highlight, invNorm: invNorm };
})(typeof window !== 'undefined' ? window : globalThis);
