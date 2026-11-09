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
  const THEMES = { gestao: { a: '#ff9a76', b: '#ff5e3a', rgb: '255,154,118', rgb2: '255,94,58' }, sixsigma: { a: '#5eead4', b: '#14b8a6', rgb: '94,234,212', rgb2: '20,184,166' }, estatistica: { a: '#a5b4fc', b: '#6366f1', rgb: '165,180,252', rgb2: '99,102,241' }, storytelling: { a: '#fdba74', b: '#f97316', rgb: '253,186,116', rgb2: '249,115,22' }, powerquery: { a: '#7dd3fc', b: '#0284c7', rgb: '125,211,252', rgb2: '2,132,199' } };
  const COL = { a: '#ff9a76', b: '#ff5e3a', rgb: '255,154,118', rgb2: '255,94,58', line: '#7dd3fc', ok: '#4ade80', bad: '#f87171', warn: '#fbbf24', ink: '#e8ebf6', ink2: '#b6bdd6', ink3: '#7e86a6', grid: 'rgba(255,255,255,0.08)' };

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

  /* --------------------- Estatística (Lean Six Sigma) --------------------- */
  function erf(x) { const s = x < 0 ? -1 : 1; x = Math.abs(x); const t1 = 1 / (1 + 0.3275911 * x); const y = 1 - (((((1.061405429 * t1 - 1.453152027) * t1) + 1.421413741) * t1 - 0.284496736) * t1 + 0.254829592) * t1 * Math.exp(-x * x); return s * y; }
  function normCdf(z) { return 0.5 * (1 + erf(z / Math.SQRT2)); }
  function gammaln(x) { const c = [76.18009172947146, -86.50532032941677, 24.01409824083091, -1.231739572450155, 0.1208650973866179e-2, -0.5395239384953e-5]; let y = x, tmp = x + 5.5; tmp -= (x + 0.5) * Math.log(tmp); let ser = 1.000000000190015; for (let j = 0; j < 6; j++) ser += c[j] / ++y; return -tmp + Math.log(2.5066282746310005 * ser / x); }
  function betacf(a, b, x) { let qab = a + b, qap = a + 1, qam = a - 1, c = 1, d = 1 - qab * x / qap; if (Math.abs(d) < 1e-30) d = 1e-30; d = 1 / d; let h = d; for (let m = 1; m <= 200; m++) { const m2 = 2 * m; let aa = m * (b - m) * x / ((qam + m2) * (a + m2)); d = 1 + aa * d; if (Math.abs(d) < 1e-30) d = 1e-30; c = 1 + aa / c; if (Math.abs(c) < 1e-30) c = 1e-30; d = 1 / d; h *= d * c; aa = -(a + m) * (qab + m) * x / ((a + m2) * (qap + m2)); d = 1 + aa * d; if (Math.abs(d) < 1e-30) d = 1e-30; c = 1 + aa / c; if (Math.abs(c) < 1e-30) c = 1e-30; d = 1 / d; const del = d * c; h *= del; if (Math.abs(del - 1) < 3e-12) break; } return h; }
  function betainc(x, a, b) { if (x <= 0) return 0; if (x >= 1) return 1; const bt = Math.exp(gammaln(a + b) - gammaln(a) - gammaln(b) + a * Math.log(x) + b * Math.log(1 - x)); return x < (a + 1) / (a + b + 2) ? bt * betacf(a, b, x) / a : 1 - bt * betacf(b, a, 1 - x) / b; }
  function gammaincQ(a, x) { // Q(a,x) = 1 - P(a,x)
    if (x <= 0) return 1;
    if (x < a + 1) { let sum = 1 / a, del = sum, ap = a; for (let n = 0; n < 300; n++) { ap++; del *= x / ap; sum += del; if (Math.abs(del) < Math.abs(sum) * 1e-14) break; } return 1 - sum * Math.exp(-x + a * Math.log(x) - gammaln(a)); }
    let b = x + 1 - a, c = 1e30, d = 1 / b, h = d; for (let i = 1; i < 300; i++) { const an = -i * (i - a); b += 2; d = an * d + b; if (Math.abs(d) < 1e-30) d = 1e-30; c = b + an / c; if (Math.abs(c) < 1e-30) c = 1e-30; d = 1 / d; const del = d * c; h *= del; if (Math.abs(del - 1) < 1e-14) break; } return Math.exp(-x + a * Math.log(x) - gammaln(a)) * h;
  }
  /** Valor-p bicaudal do t de Student. */
  function tP(t, df) { return betainc(df / (df + t * t), df / 2, 0.5); }
  /** Valor-p da cauda superior do F. */
  function fP(F, d1, d2) { return betainc(d2 / (d2 + d1 * F), d2 / 2, d1 / 2); }
  function chiP(x, df) { return gammaincQ(df / 2, x / 2); }
  /** t crítico bicaudal (por bissecção). */
  function tInv(alpha, df) { let lo = 0, hi = 50; for (let i = 0; i < 80; i++) { const m = (lo + hi) / 2; if (tP(m, df) > alpha) lo = m; else hi = m; } return (lo + hi) / 2; }
  function quant(sorted, q) { const pos = (sorted.length - 1) * q, b = Math.floor(pos), r = pos - b; return sorted[b + 1] !== undefined ? sorted[b] + r * (sorted[b + 1] - sorted[b]) : sorted[b]; }
  function solve(A, y) { // eliminação de Gauss
    const n = A.length, M = A.map(function (r, i) { return r.concat([y[i]]); });
    for (let c = 0; c < n; c++) { let p = c; for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r; const tmp = M[c]; M[c] = M[p]; M[p] = tmp; for (let r = 0; r < n; r++) { if (r === c) continue; const f = M[r][c] / M[c][c]; for (let k = c; k <= n; k++) M[r][k] -= f * M[c][k]; } }
    return M.map(function (r, i) { return r[n] / r[i]; });
  }
  const A2 = { 2: 1.880, 3: 1.023, 4: 0.729, 5: 0.577, 6: 0.483 }, D4 = { 2: 3.267, 3: 2.574, 4: 2.282, 5: 2.114, 6: 2.004 };
  Object.assign(calc, {
    describe: function (v) { const so = v.slice().sort(function (a, b) { return a - b; }); return { n: v.length, mean: mean(v), median: quant(so, 0.5), sd: sd(v), min: so[0], max: so[so.length - 1], q1: quant(so, 0.25), q3: quant(so, 0.75), range: so[so.length - 1] - so[0] }; },
    t1: function (v, mu0) { const n = v.length, t = (mean(v) - mu0) / (sd(v) / Math.sqrt(n)); return { t: t, df: n - 1, p: tP(Math.abs(t), n - 1), mean: mean(v) }; },
    t2: function (a, b) { const va = sd(a) * sd(a) / a.length, vb = sd(b) * sd(b) / b.length, t = (mean(a) - mean(b)) / Math.sqrt(va + vb), df = Math.pow(va + vb, 2) / (va * va / (a.length - 1) + vb * vb / (b.length - 1)); return { t: t, df: df, p: tP(Math.abs(t), df), diff: mean(a) - mean(b), ma: mean(a), mb: mean(b) }; },
    tpaired: function (a, b) { const d = a.map(function (x, i) { return x - b[i]; }); const r = calc.t1(d, 0); r.diff = mean(d); return r; },
    prop2: function (x1, n1, x2, n2) { const p1 = x1 / n1, p2 = x2 / n2, pp = (x1 + x2) / (n1 + n2), z = (p1 - p2) / Math.sqrt(pp * (1 - pp) * (1 / n1 + 1 / n2)); return { z: z, p: 2 * (1 - normCdf(Math.abs(z))), p1: p1, p2: p2 }; },
    anova: function (groups) {
      const all = [].concat.apply([], groups), gm = mean(all), k = groups.length, N = all.length;
      const ssb = sum(groups.map(function (g) { return g.length * Math.pow(mean(g) - gm, 2); })), ssw = sum(groups.map(function (g) { const m = mean(g); return sum(g.map(function (x) { return (x - m) * (x - m); })); }));
      const dfb = k - 1, dfw = N - k, msb = ssb / dfb, msw = ssw / dfw, F = msb / msw;
      return { ssb: ssb, ssw: ssw, sst: ssb + ssw, dfb: dfb, dfw: dfw, msb: msb, msw: msw, F: F, p: fP(F, dfb, dfw), means: groups.map(mean) };
    },
    regress: function (pairs) { const c = corr(pairs), n = pairs.length, t = c.r * Math.sqrt((n - 2) / (1 - c.r * c.r)); return { a: c.a, b: c.b, r: c.r, r2: c.r * c.r, n: n, t: t, p: tP(Math.abs(t), n - 2) }; },
    mreg: function (X, y) {
      const n = y.length, k = X[0].length, Z = X.map(function (r) { return [1].concat(r); }), p = k + 1;
      const XtX = [], Xty = []; for (let i = 0; i < p; i++) { XtX.push([]); Xty.push(sum(Z.map(function (r, j) { return r[i] * y[j]; }))); for (let j = 0; j < p; j++) XtX[i].push(sum(Z.map(function (r) { return r[i] * r[j]; }))); }
      const b = solve(XtX, Xty), my = mean(y), fit = Z.map(function (r) { return sum(r.map(function (v, i) { return v * b[i]; })); });
      const sse = sum(y.map(function (v, i) { return Math.pow(v - fit[i], 2); })), sst = sum(y.map(function (v) { return Math.pow(v - my, 2); }));
      const r2 = 1 - sse / sst; return { b: b, r2: r2, r2adj: 1 - (1 - r2) * (n - 1) / (n - p) };
    },
    chi2: function (tab) {
      const rs = tab.map(function (r) { return sum(r); }), cs = tab[0].map(function (_, j) { return sum(tab.map(function (r) { return r[j]; })); }), N = sum(rs);
      let x = 0; tab.forEach(function (r, i) { r.forEach(function (o, j) { const e = rs[i] * cs[j] / N; x += (o - e) * (o - e) / e; }); });
      const df = (tab.length - 1) * (tab[0].length - 1); return { chi2: x, df: df, p: chiP(x, df) };
    },
    nMean: function (sigma, E, conf) { const z = invNorm(1 - (1 - (conf || 0.95)) / 2); return Math.ceil(Math.pow(z * sigma / E, 2)); },
    nProp: function (p, E, conf) { const z = invNorm(1 - (1 - (conf || 0.95)) / 2); return Math.ceil(z * z * p * (1 - p) / (E * E)); },
    ciMean: function (v, conf) { const n = v.length, tc = tInv(1 - (conf || 0.95), n - 1), h = tc * sd(v) / Math.sqrt(n); return { lo: mean(v) - h, hi: mean(v) + h, half: h }; },
    pchart: function (defs, n) { const pb = sum(defs) / (n * defs.length), s = Math.sqrt(pb * (1 - pb) / n); return { lc: pb, lsc: pb + 3 * s, lic: Math.max(0, pb - 3 * s) }; },
    xbarr: function (subs) { const k = subs[0].length, xb = subs.map(mean), rs = subs.map(function (g) { return Math.max.apply(null, g) - Math.min.apply(null, g); }), xbb = mean(xb), rb = mean(rs); return { means: xb, ranges: rs, lc: xbb, lsc: xbb + A2[k] * rb, lic: xbb - A2[k] * rb, rbar: rb, rUcl: D4[k] * rb }; },
    effects: function (runs, k) { // runs: [x1, x2, …, y] com níveis −1/+1
      const out = []; for (let i = 0; i < k; i++) { const hi = runs.filter(function (r) { return r[i] > 0; }).map(function (r) { return r[k]; }), lo = runs.filter(function (r) { return r[i] < 0; }).map(function (r) { return r[k]; }); out.push(mean(hi) - mean(lo)); }
      const ab = runs.map(function (r) { return [r[0] * r[1], r[k]]; }), hi = ab.filter(function (r) { return r[0] > 0; }).map(function (r) { return r[1]; }), lo = ab.filter(function (r) { return r[0] < 0; }).map(function (r) { return r[1]; });
      return { main: out, ab: mean(hi) - mean(lo) };
    },
    ppm: function (mu, s, lie, lse) { let p = 0; if (lie != null) p += normCdf((lie - mu) / s); if (lse != null) p += 1 - normCdf((lse - mu) / s); return p * 1e6; },
    rty: function (yields) { return yields.reduce(function (a, b) { return a * b; }, 1); },
  });
  /* ------------------------ Estatística Aplicada ------------------------ */
  function comb(n, k) { let c = 1; for (let i = 1; i <= k; i++) c = c * (n - k + i) / i; return c; }
  Object.assign(calc, {
    comb: comb,
    binom: function (n, k, p) { return comb(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k); },
    binomCdf: function (n, k, p) { let s = 0; for (let i = 0; i <= k; i++) s += calc.binom(n, i, p); return s; },
    poisson: function (l, k) { let f = 1; for (let i = 2; i <= k; i++) f *= i; return Math.exp(-l) * Math.pow(l, k) / f; },
    poissonCdf: function (l, k) { let s = 0; for (let i = 0; i <= k; i++) s += calc.poisson(l, i); return s; },
    normBetween: function (mu, s, lo, hi) { return (hi == null ? 1 : normCdf((hi - mu) / s)) - (lo == null ? 0 : normCdf((lo - mu) / s)); },
    ciProp: function (x, n, conf) { const p = x / n, z = invNorm(1 - (1 - (conf || 0.95)) / 2), h = z * Math.sqrt(p * (1 - p) / n); return { p: p, lo: p - h, hi: p + h, half: h }; },
    ciZ: function (m, sig, n, conf) { const z = invNorm(1 - (1 - (conf || 0.95)) / 2), h = z * sig / Math.sqrt(n); return { lo: m - h, hi: m + h, half: h }; },
    wmean: function (v, w) { return sum(v.map(function (x, i) { return x * w[i]; })) / sum(w); },
    cv: function (v) { return sd(v) / mean(v); },
    sdp: function (v) { const m = mean(v); return Math.sqrt(sum(v.map(function (x) { return (x - m) * (x - m); })) / v.length); },
    mode: function (v) { const c = {}; v.forEach(function (x) { c[x] = (c[x] || 0) + 1; }); let best = null; Object.keys(c).forEach(function (k) { if (best == null || c[k] > c[best]) best = k; }); return +best; },
    movAvg: function (v, k) { const out = []; for (let i = k - 1; i < v.length; i++) out.push(mean(v.slice(i - k + 1, i + 1))); return out; },
    growth: function (a, b) { return (b - a) / a; },
    expect: function (vals, probs) { return sum(vals.map(function (x, i) { return x * probs[i]; })); },
    iqrFences: function (v) { const d = calc.describe(v), iqr = d.q3 - d.q1; return { q1: d.q1, q3: d.q3, iqr: iqr, lo: d.q1 - 1.5 * iqr, hi: d.q3 + 1.5 * iqr }; },
  });
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
      s += '<rect x="' + x + '" y="' + (y0 - h) + '" width="' + (bw * 0.72) + '" height="' + h + '" rx="3" fill="' + (vital ? COL.b : 'rgba(' + COL.rgb + ',0.45)') + '"/>';
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
      html: svg(W, H, s, 'Diagrama de Pareto') + (f.cum !== false ? legend([[COL.b, 'Poucos vitais (até 80%)'], ['rgba(' + COL.rgb + ',0.45)', 'Muitos triviais'], [COL.line, '% acumulado']]) : ''),
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
    bins.forEach(function (c, i) { const h = (y0 - y1) * c / max; s += '<rect x="' + (x0 + i * bw + 1) + '" y="' + (y0 - h) + '" width="' + (bw - 2) + '" height="' + h + '" fill="rgba(' + COL.rgb + ',0.75)"/>' + (c ? t(x0 + i * bw + bw / 2, y0 - h - 4, String(c), { a: 'middle', s: 10, c: COL.ink }) : ''); });
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
    return { html: svg(W, H, s, 'Diagrama de dispersão') + (f.showR === false ? '' : f.eq ? '<p class="gq-cap">Reta: <b>y = ' + fmt(c.a, 2) + (c.b >= 0 ? ' + ' : ' − ') + fmt(Math.abs(c.b), 3) + '·x</b> · R² = <b>' + fmt(c.r * c.r, 2) + '</b></p>' : '<p class="gq-cap">Correlação r = <b>' + fmt(c.r, 2) + '</b> (' + forca + ', ' + (c.r >= 0 ? 'positiva' : 'negativa') + ')</p>'), speech: 'Calculado agora: correlação ' + forca + ' e ' + (c.r >= 0 ? 'positiva' : 'negativa') + ', r igual a ' + fmt(c.r, 2) + '.', stats: c };
  };

  R.ishikawa = function (f) {
    const cats = f.cats, keys = Object.keys(cats), W = 640, H = 300, sy = 150, hx = 500;
    let s = ln(30, sy, hx, sy, COL.ink2, { w: 2.4 }) + '<polygon points="' + hx + ',' + (sy - 7) + ' ' + (hx + 12) + ',' + sy + ' ' + hx + ',' + (sy + 7) + '" fill="' + COL.ink2 + '"/>';
    s += '<rect x="' + (hx + 14) + '" y="' + (sy - 34) + '" width="104" height="68" rx="10" fill="rgba(' + COL.rgb2 + ',0.18)" stroke="' + COL.b + '"/>' + tml(hx + 66, sy - (wrap(f.effect, 14).length - 1) * 6.5 + 4, f.effect, 14, { a: 'middle', s: 11, c: COL.ink, w: 600 });
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
    s += '<path d="' + curve + '" fill="rgba(' + COL.rgb + ',0.14)" stroke="' + COL.a + '" stroke-width="2"/>' + ln(x0, y0, x1, y0, COL.ink3);
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
      S.forEach(function (se, j) { const v = se.values[i], dd = decs(se.values), h = (y0 - y1) * v / max, x = x0 + i * gw + gw * 0.11 + j * bw, fc = f.hl != null && S.length === 1 ? ([].concat(f.hl).indexOf(i) >= 0 ? COL.b : GRAY) : cols[j % cols.length]; s += '<rect x="' + x + '" y="' + (y0 - h) + '" width="' + (bw - 2) + '" height="' + h + '" rx="2" fill="' + fc + '" fill-opacity="0.85"/>' + (v ? t(x + bw / 2 - 1, y0 - h - 4, fmt(v, dd), { a: 'middle', s: 9.5, c: COL.ink }) : ''); });
      s += tml(x0 + i * gw + gw / 2, y0 + 14, l, Math.max(8, Math.round(gw / 6.2)), { a: 'middle', s: 10 });
    });
    return { html: svg(W, H, s, f.title || 'Gráfico de barras') + (S.length > 1 ? legend(S.map(function (se, j) { return [cols[j % cols.length], se.name]; })) : ''), speech: f.speech || '', stats: {} };
  };

  const GRAY = '#596079';
  /** Barras horizontais (ordenáveis), com destaque opcional: f.labels, f.values, f.hl, f.sort, f.unit, f.d. */
  R.hbars = function (f) {
    let rows = f.labels.map(function (l, i) { return { l: l, v: f.values[i], i: i }; });
    if (f.sort) rows.sort(function (a, b) { return b.v - a.v; });
    const n = rows.length, rowH = 30, W = 580, Lm = 150, Rr = 70, T = 8, H = T + n * rowH + 6, max = Math.max.apply(null, rows.map(function (r) { return r.v; })) || 1;
    const hl = f.hl == null ? null : [].concat(f.hl), u = f.unit || '', d = f.d == null ? decs(f.values) : f.d;
    let s = '';
    rows.forEach(function (r, k) {
      const y = T + k * rowH, w = (W - Lm - Rr) * r.v / max, on = !hl || hl.indexOf(r.i) >= 0;
      s += t(Lm - 8, y + rowH / 2 + 4, r.l, { a: 'end', s: 10.5, c: on ? COL.ink : COL.ink3, w: hl && on ? 700 : null });
      s += '<rect x="' + Lm + '" y="' + (y + 5) + '" width="' + Math.max(1, w).toFixed(1) + '" height="' + (rowH - 10) + '" rx="3" fill="' + (on ? COL.b : GRAY) + '" fill-opacity="' + (on ? 0.9 : 0.7) + '"/>';
      s += t(Lm + w + 6, y + rowH / 2 + 4, (u === 'R$' ? 'R$ ' : '') + fmt(r.v, d) + (u && u !== 'R$' ? u : ''), { s: 10, c: on ? COL.ink : COL.ink3, w: hl && on ? 700 : null });
    });
    return { html: svg(W, H, s, f.title || 'Barras horizontais'), speech: f.speech || '', stats: {} };
  };
  /** Pizza ou rosca: f.labels, f.values, f.donut, f.hl. */
  R.pie = function (f) {
    const tot = sum(f.values), W = 300, H = 220, cx = 110, cy = 110, R0 = 92, Ri = f.donut ? 52 : 0;
    const cols = [COL.b, COL.line, COL.ok, COL.warn, '#a78bfa', '#f472b6', '#94a3b8', '#fb7185'];
    const hl = f.hl == null ? null : [].concat(f.hl);
    let a0 = -Math.PI / 2, s = '';
    f.values.forEach(function (v, i) {
      const a1 = a0 + v / tot * Math.PI * 2, big = a1 - a0 > Math.PI ? 1 : 0, c = hl ? (hl.indexOf(i) >= 0 ? COL.b : GRAY) : cols[i % cols.length];
      const P = function (r, a) { return (cx + r * Math.cos(a)).toFixed(1) + ' ' + (cy + r * Math.sin(a)).toFixed(1); };
      s += '<path d="M' + P(R0, a0) + 'A' + R0 + ' ' + R0 + ' 0 ' + big + ' 1 ' + P(R0, a1) + (Ri ? 'L' + P(Ri, a1) + 'A' + Ri + ' ' + Ri + ' 0 ' + big + ' 0 ' + P(Ri, a0) : 'L' + cx + ' ' + cy) + 'Z" fill="' + c + '" fill-opacity="0.9" stroke="#0b0e17" stroke-width="1.5"/>';
      a0 = a1;
    });
    if (f.center) s += t(cx, cy + 6, f.center, { a: 'middle', s: 15, c: COL.ink, w: 700 });
    const leg = '<ul class="gq-leg">' + f.labels.map(function (l, i) { return '<li><i style="background:' + (hl ? (hl.indexOf(i) >= 0 ? COL.b : GRAY) : cols[i % cols.length]) + '"></i>' + esc(l) + ' · ' + fmt(f.values[i] / tot * 100, 0) + '%</li>'; }).join('') + '</ul>';
    return { html: '<div class="gq-pie">' + svg(W, H, s, f.title || 'Gráfico de pizza') + leg + '</div>', speech: f.speech || '', stats: {} };
  };
  /** Bloco de código (linguagem M do Power Query). */
  R.code = function (f) {
    return { html: '<pre class="code-block gq-code">' + highlightM(f.code) + '</pre>', speech: f.speech || '', stats: {} };
  };
  /** Painel "Etapas aplicadas" do Power Query: f.items, f.sel (etapa selecionada). */
  R.steps = function (f) {
    const html = '<div class="pq-steps"><div class="pq-steps-h">' + esc(f.head || 'Etapas aplicadas') + '</div><ol>' + f.items.map(function (it, i) { return '<li' + (f.sel === i ? ' class="on"' : '') + '><i></i><span>' + esc(it) + '</span></li>'; }).join('') + '</ol></div>';
    return { html: html, speech: f.speech || ('A consulta tem ' + f.items.length + ' etapas aplicadas.'), stats: {} };
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


  R.box = function (f) {
    const G = f.groups, W = 580, H = 260, L = 50, Rr = 18, T = 16, B = 40, x0 = L, x1 = W - Rr, y0 = H - B, y1 = T;
    const all = [].concat.apply([], G.map(function (g) { return g.v; })), lo0 = Math.min.apply(null, all), hi0 = Math.max.apply(null, all), pad = (hi0 - lo0) * 0.1 || 1, vmin = lo0 - pad, vmax = hi0 + pad;
    const Y = function (v) { return y0 - (y0 - y1) * (v - vmin) / (vmax - vmin); }, gw = (x1 - x0) / G.length;
    let s = ''; for (let i = 0; i <= 4; i++) { const v = vmin + (vmax - vmin) * i / 4; s += ln(x0, Y(v), x1, Y(v), COL.grid) + t(x0 - 4, Y(v) + 4, fmt(v, f.d == null ? 1 : f.d), { a: 'end', s: 10, c: COL.ink3 }); }
    const ds = G.map(function (g, i) {
      const d = calc.describe(g.v), cx = x0 + gw * i + gw / 2, bw = Math.min(70, gw * 0.45), iqr = d.q3 - d.q1, wlo = Math.min.apply(null, g.v.filter(function (x) { return x >= d.q1 - 1.5 * iqr; })), whi = Math.max.apply(null, g.v.filter(function (x) { return x <= d.q3 + 1.5 * iqr; }));
      s += ln(cx, Y(whi), cx, Y(d.q3), COL.ink2) + ln(cx, Y(d.q1), cx, Y(wlo), COL.ink2) + ln(cx - bw / 4, Y(whi), cx + bw / 4, Y(whi), COL.ink2) + ln(cx - bw / 4, Y(wlo), cx + bw / 4, Y(wlo), COL.ink2);
      s += '<rect x="' + (cx - bw / 2) + '" y="' + Y(d.q3) + '" width="' + bw + '" height="' + Math.max(1, Y(d.q1) - Y(d.q3)) + '" rx="4" fill="rgba(' + COL.rgb + ',0.28)" stroke="' + COL.a + '"/>' + ln(cx - bw / 2, Y(d.median), cx + bw / 2, Y(d.median), COL.b, { w: 2.4 });
      g.v.filter(function (x) { return x < wlo || x > whi; }).forEach(function (x) { s += '<circle cx="' + cx + '" cy="' + Y(x) + '" r="3.4" fill="none" stroke="' + COL.bad + '" stroke-width="1.4"/>'; });
      s += t(cx, y0 + 16, g.n, { a: 'middle', s: 10.5, c: COL.ink }) + t(cx + bw / 2 + 4, Y(d.median) + 4, fmt(d.median, f.d == null ? 1 : f.d), { s: 9.5, c: COL.ink2 });
      return d;
    });
    if (f.lse != null) s += ln(x0, Y(f.lse), x1, Y(f.lse), COL.bad, { dash: '5 4', w: 1.3 }) + t(x1, Y(f.lse) - 4, 'LSE ' + fmt(f.lse), { a: 'end', s: 10, c: COL.bad });
    s += t(x0 - 6, T - 4 + 8, f.unit || '', { a: 'end', s: 10, c: COL.ink3 });
    const best = ds.reduce(function (m, d, i) { return d.median < ds[m].median ? i : m; }, 0);
    return { html: svg(W, H, s, 'Boxplot'), speech: 'Calculado agora: medianas de ' + ds.map(function (d, i) { return G[i].n + ' ' + fmt(d.median, 1); }).join(', ') + '.', stats: { d: ds, best: best } };
  };

  R.effects = function (f) {
    const runs = f.runs, k = f.factors.length, e = calc.effects(runs, k), W = 580, H = 240, T = 22, B = 40, y0 = H - B, y1 = T;
    const ys = runs.map(function (r) { return r[k]; }), panels = f.mode === 'inter' ? 1 : k;
    let lo = Infinity, hi = -Infinity; const lines = [];
    if (f.mode === 'inter') {
      [-1, 1].forEach(function (bv) { const pts = [-1, 1].map(function (av) { return mean(runs.filter(function (r) { return r[0] === av && r[1] === bv; }).map(function (r) { return r[k]; })); }); lines.push({ pts: pts, name: f.factors[1] + (bv > 0 ? ' alto' : ' baixo') }); pts.forEach(function (v) { lo = Math.min(lo, v); hi = Math.max(hi, v); }); });
    } else for (let i = 0; i < k; i++) { const pts = [-1, 1].map(function (lv) { return mean(runs.filter(function (r) { return r[i] === lv; }).map(function (r) { return r[k]; })); }); lines.push({ pts: pts, name: f.factors[i] }); pts.forEach(function (v) { lo = Math.min(lo, v); hi = Math.max(hi, v); }); }
    const pad = (hi - lo) * 0.2 || 1, vmin = lo - pad, vmax = hi + pad, Y = function (v) { return y0 - (y0 - y1) * (v - vmin) / (vmax - vmin); };
    const pw = (W - 60) / panels; let s = '';
    for (let i = 0; i <= 3; i++) { const v = vmin + (vmax - vmin) * i / 3; s += ln(50, Y(v), W - 10, Y(v), COL.grid) + t(46, Y(v) + 4, fmt(v, 1), { a: 'end', s: 10, c: COL.ink3 }); }
    const cols = [COL.b, COL.line, COL.warn, COL.ok];
    lines.forEach(function (l, i) {
      const px = f.mode === 'inter' ? 50 : 50 + pw * i, xa = px + pw * 0.2, xb = px + pw * 0.8, c = f.mode === 'inter' ? cols[i] : COL.b;
      s += ln(xa, Y(l.pts[0]), xb, Y(l.pts[1]), c, { w: 2.4 }) + '<circle cx="' + xa + '" cy="' + Y(l.pts[0]) + '" r="4" fill="' + c + '"/><circle cx="' + xb + '" cy="' + Y(l.pts[1]) + '" r="4" fill="' + c + '"/>';
      if (f.mode !== 'inter') s += t(xa, y0 + 15, '−', { a: 'middle', s: 12, c: COL.ink3 }) + t(xb, y0 + 15, '+', { a: 'middle', s: 12, c: COL.ink3 }) + t((xa + xb) / 2, y0 + 30, l.name, { a: 'middle', s: 10.5, c: COL.ink, w: 600 }) + t((xa + xb) / 2, Math.min(Y(l.pts[0]), Y(l.pts[1])) - 8, 'efeito ' + fmt(e.main[i], 1), { a: 'middle', s: 10, c: COL.ink2 });
      else s += t(xb + 6, Y(l.pts[1]) + 4, l.name, { s: 10, c: c, w: 600 });
    });
    if (f.mode === 'inter') s += t(50 + pw * 0.2, y0 + 15, f.factors[0] + ' −', { a: 'middle', s: 10.5, c: COL.ink3 }) + t(50 + pw * 0.8, y0 + 15, f.factors[0] + ' +', { a: 'middle', s: 10.5, c: COL.ink3 });
    const sp = f.mode === 'inter' ? 'Calculado agora: o efeito da interação ' + f.factors[0] + ' com ' + f.factors[1] + ' é ' + fmt(e.ab, 1) + '; linhas que se cruzam ou se afastam indicam interação.' : 'Calculado agora: efeitos principais de ' + f.factors.map(function (n, i) { return n + ' ' + fmt(e.main[i], 1); }).join(', ') + '.';
    return { html: svg(W, H, s, f.mode === 'inter' ? 'Gráfico de interação' : 'Gráfico de efeitos principais'), speech: sp, stats: e };
  };

  R.pchart = function (f) {
    const lim = calc.pchart(f.defs, f.n), pts = f.defs.map(function (d) { return d / f.n * 100; });
    const out = R.control({ pts: pts, lim: { lc: lim.lc * 100, lsc: lim.lsc * 100, lic: lim.lic * 100 }, labels: f.labels, unit: '%', d: 2 });
    out.speech = 'Calculado agora: proporção média de ' + fmt(lim.lc * 100, 2) + '%, com limite superior de ' + fmt(lim.lsc * 100, 2) + '%. ' + out.speech.split('. ').slice(1).join('. ');
    out.stats.p = lim; return out;
  };

  R.xbar = function (f) {
    const x = calc.xbarr(f.subgroups), out = R.control({ pts: x.means, lim: { lc: x.lc, lsc: x.lsc, lic: x.lic }, labels: f.labels, unit: f.unit, d: f.d == null ? 2 : f.d });
    out.stats.xbarr = x; return out;
  };
  /** Série temporal: f.values, f.labels; opcionais f.ma (janela da média móvel), f.trend (reta), f.fc (previsões), f.unit. */
  R.line = function (f) {
    const v = f.values, n = v.length, fc = f.fc || [], all = v.concat(fc), W = 580, H = 260, L = 46, Rr = 14, T = 16, B = 46, x0 = L, x1 = W - Rr, y0 = H - B, y1 = T;
    const lo0 = Math.min.apply(null, all), hi0 = Math.max.apply(null, all), pad = (hi0 - lo0) * 0.12 || 1, lo = f.zero ? 0 : Math.max(0, Math.floor((lo0 - pad) / 10) * 10), hi = hi0 + pad;
    const X = function (i) { return x0 + (x1 - x0) * i / Math.max(1, all.length - 1); }, Y = function (y) { return y0 - (y0 - y1) * (y - lo) / (hi - lo); };
    let s = '';
    for (let i = 0; i <= 4; i++) { const yv = lo + (hi - lo) * i / 4, yy = Y(yv); s += ln(x0, yy, x1, yy, COL.grid) + t(x0 - 6, yy + 4, fmt(yv, 0), { a: 'end', s: 9.5, c: COL.ink3 }); }
    let d = ''; v.forEach(function (y, i) { d += (i ? 'L' : 'M') + X(i).toFixed(1) + ' ' + Y(y).toFixed(1); });
    s += '<path d="' + d + 'L' + X(n - 1).toFixed(1) + ' ' + y0 + 'L' + x0 + ' ' + y0 + 'Z" fill="rgba(' + COL.rgb + ',0.10)"/><path d="' + d + '" fill="none" stroke="' + COL.a + '" stroke-width="2.2"/>';
    v.forEach(function (y, i) { s += '<circle cx="' + X(i) + '" cy="' + Y(y) + '" r="2.8" fill="' + COL.a + '"/>'; });
    if (f.ma) { const m = calc.movAvg(v, f.ma); let dm = ''; m.forEach(function (y, i) { dm += (i ? 'L' : 'M') + X(i + f.ma - 1).toFixed(1) + ' ' + Y(y).toFixed(1); }); s += '<path d="' + dm + '" fill="none" stroke="' + COL.warn + '" stroke-width="2" stroke-dasharray="6 4"/>'; }
    if (f.trend) { const c = corr(v.map(function (y, i) { return [i, y]; })); s += ln(X(0), Y(c.a), X(all.length - 1), Y(c.a + c.b * (all.length - 1)), COL.ok, { dash: '5 4', w: 1.4 }); }
    if (fc.length) { let df = 'M' + X(n - 1).toFixed(1) + ' ' + Y(v[n - 1]).toFixed(1); fc.forEach(function (y, i) { df += 'L' + X(n + i).toFixed(1) + ' ' + Y(y).toFixed(1); }); s += '<path d="' + df + '" fill="none" stroke="' + COL.line + '" stroke-width="2" stroke-dasharray="3 4"/>'; fc.forEach(function (y, i) { s += '<circle cx="' + X(n + i) + '" cy="' + Y(y) + '" r="3.2" fill="none" stroke="' + COL.line + '" stroke-width="1.6"/>'; }); }
    const labs = f.labels || [], every = Math.ceil(all.length / 12);
    labs.forEach(function (l, i) { if ((i % every === 0 && labs.length - 1 - i >= every / 2 + 0.5) || i === labs.length - 1) s += t(X(i), y0 + 15, l, { a: 'middle', s: 9.5, c: COL.ink3 }); });
    const leg = [[COL.a, f.name || 'Valores']].concat(f.ma ? [[COL.warn, 'Média móvel de ' + f.ma]] : [], f.trend ? [[COL.ok, 'Tendência']] : [], fc.length ? [[COL.line, 'Previsão']] : []);
    return { html: svg(W, H, s, f.title || 'Série temporal') + (leg.length > 1 ? legend(leg) : ''), speech: f.speech || ('A série vai de ' + fmt(v[0], 0) + ' a ' + fmt(v[n - 1], 0) + (f.unit ? ' ' + f.unit : '') + '.'), stats: {} };
  };
  /** Curva normal com a área entre lo e hi destacada: f.mean, f.sd, f.lo, f.hi, f.unit, f.d. */
  R.bell = function (f) {
    const mu = f.mean, s0 = f.sd, W = 580, H = 240, x0 = 24, x1 = 556, y0 = 190, y1 = 28, lo = mu - 4 * s0, hi = mu + 4 * s0;
    const X = function (v) { return x0 + (x1 - x0) * (v - lo) / (hi - lo); }, pdf = function (v) { return Math.exp(-0.5 * Math.pow((v - mu) / s0, 2)); }, Y = function (v) { return y0 - (y0 - y1) * pdf(v); };
    const a = f.lo == null ? lo : Math.max(lo, f.lo), b = f.hi == null ? hi : Math.min(hi, f.hi);
    let curve = '', area = 'M' + X(a).toFixed(1) + ' ' + y0;
    for (let i = 0; i <= 140; i++) { const v = lo + (hi - lo) * i / 140; curve += (i ? 'L' : 'M') + X(v).toFixed(1) + ' ' + Y(v).toFixed(1); }
    for (let i = 0; i <= 80; i++) { const v = a + (b - a) * i / 80; area += 'L' + X(v).toFixed(1) + ' ' + Y(v).toFixed(1); }
    area += 'L' + X(b).toFixed(1) + ' ' + y0 + 'Z';
    const P = calc.normBetween(mu, s0, f.lo, f.hi), dd = f.d == null ? 0 : f.d;
    let s = '<path d="' + area + '" fill="rgba(' + COL.rgb + ',0.45)"/><path d="' + curve + '" fill="none" stroke="' + COL.a + '" stroke-width="2"/>' + ln(x0, y0, x1, y0, COL.ink3);
    [-3, -2, -1, 0, 1, 2, 3].forEach(function (k) { const v = mu + k * s0; s += ln(X(v), y0, X(v), y0 + 4, COL.ink3) + t(X(v), y0 + 16, fmt(v, dd), { a: 'middle', s: 9.5, c: k ? COL.ink3 : COL.ink }) + (f.z ? t(X(v), y0 + 30, (k > 0 ? '+' : '') + k + 'σ', { a: 'middle', s: 9, c: COL.ink3 }) : ''); });
    [['lo', f.lo], ['hi', f.hi]].forEach(function (l) { if (l[1] != null) s += ln(X(l[1]), y1 - 6, X(l[1]), y0, COL.warn, { dash: '5 4', w: 1.4 }) + t(X(l[1]), y1 - 10, fmt(l[1], dd) + (f.unit ? ' ' + f.unit : ''), { a: 'middle', s: 10, c: COL.warn }); });
    return { html: svg(W, H + (f.z ? 12 : 0), s, 'Curva normal') + (f.show === false ? '' : '<p class="gq-cap">Área destacada: <b>' + pct(P, 1) + '</b> dos casos</p>'), speech: f.show === false ? 'A área destacada é a probabilidade procurada.' : 'Calculado agora: a área destacada corresponde a ' + pct(P, 1) + ' dos casos.', stats: { p: P } };
  };

  function legend(items) { return '<ul class="gq-leg">' + items.map(function (i) { return '<li><i style="background:' + i[0] + '"></i>' + esc(i[1]) + '</li>'; }).join('') + '</ul>'; }

  /** Paleta da trilha atual (Gestão: coral · Lean Six Sigma: verde-água). */
  function theme(id) { const th = THEMES[id] || THEMES.gestao; COL.a = th.a; COL.b = th.b; COL.rgb = th.rgb; COL.rgb2 = th.rgb2; }
  function render(fig) {
    if (!fig) return { html: '', speech: '', stats: {} };
    theme(fig.theme || (global.Tracks && global.Tracks.activeId ? global.Tracks.activeId() : 'gestao'));
    const fn = R[fig.type];
    if (!fn) return { html: '<p class="muted">Figura desconhecida.</p>', speech: '', stats: {} };
    const out = fn(fig);
    out.html = '<figure class="gq-fig">' + (fig.title ? '<figcaption>' + esc(fig.title) + '</figcaption>' : '') + out.html + '</figure>';
    return out;
  }

  /** Realce da linguagem M (Power Query). */
  function highlightM(code) {
    const KW = /^(let|in|each|if|then|else|and|or|not|true|false|null|type|as|try|otherwise|meta)$/;
    return String(code).split('\n').map(function (line) {
      const ci = line.indexOf('//');
      const body = ci >= 0 && (line.slice(0, ci).split('"').length % 2 === 1) ? line.slice(0, ci) : line, com = body === line ? '' : line.slice(ci);
      const out = body.replace(/("(?:[^"]|"")*")|(#"(?:[^"]|"")*")|([A-Z][A-Za-z0-9]*\.[A-Za-z0-9.]+)|(\b\d+(?:[.,]\d+)?\b)|([A-Za-z_][A-Za-z0-9_]*)|([^"A-Za-z0-9_]+)/g, function (all, str, ident, fn, num, word, other) {
        if (str) return '<span class="fe-str">' + esc(str) + '</span>';
        if (ident) return '<span class="fe-ref">' + esc(ident) + '</span>';
        if (fn) return '<span class="fe-fn">' + esc(fn) + '</span>';
        if (num) return '<span class="fe-num">' + esc(num) + '</span>';
        if (word) return KW.test(word) ? '<span class="fe-kw">' + esc(word) + '</span>' : esc(word);
        return esc(other);
      });
      return out + (com ? '<span class="fe-comment">' + esc(com) + '</span>' : '');
    }).join('\n');
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

  global.GQCharts = { render: render, calc: calc, normCdf: normCdf, tP: tP, fP: fP, chiP: chiP, tInv: tInv, fmt: fmt, pct: pct, round: round, mean: mean, sd: sd, corr: corr, highlight: highlight, highlightM: highlightM, invNorm: invNorm };
})(typeof window !== 'undefined' ? window : globalThis);
