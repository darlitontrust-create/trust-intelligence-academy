/* =====================================================================
   calculator.js — Calculadora da plataforma
   ---------------------------------------------------------------------
   Painel flutuante (no celular, uma gaveta inferior) para os exercícios
   de cálculo. Aceita teclado, vírgula decimal, parênteses e %.
   "Usar resultado" envia o valor para o campo da resposta.
   Calculator.open({ onUse(valorTexto), title })
   ===================================================================== */
(function (global) {
  'use strict';
  const { esc, icon } = global.UI;
  let panel = null, expr = '', last = null, opts = {}, keyH = null;

  /* ---------------------- Avaliação segura (sem eval) ---------------------- */
  function tokenize(s) {
    const out = []; let i = 0;
    s = s.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-').replace(/\s+/g, '');
    while (i < s.length) {
      const c = s[i];
      if (/[0-9.,]/.test(c)) { let n = ''; while (i < s.length && /[0-9.,]/.test(s[i])) n += s[i++]; out.push({ t: 'n', v: Number(n.replace(/\./g, '').replace(',', '.')) }); if (isNaN(out[out.length - 1].v)) throw new Error('Número inválido'); continue; }
      if ('+-*/()%^'.indexOf(c) >= 0) { out.push({ t: c }); i++; continue; }
      throw new Error('Caractere inválido');
    }
    return out;
  }
  // gramática: expr = termo (('+'|'-') termo)* ; termo = pot (('*'|'/') pot)* ; pot = unário ('^' pot)? ; unário = '-' unário | prim '%'?
  function evaluate(s) {
    const tk = tokenize(s); let p = 0;
    const peek = function () { return tk[p]; }, eat = function (t) { if (tk[p] && tk[p].t === t) { p++; return true; } return false; };
    function prim() {
      const k = tk[p];
      if (!k) throw new Error('Expressão incompleta');
      if (k.t === 'n') { p++; return k.v; }
      if (eat('(')) { const v = add(); if (!eat(')')) throw new Error('Feche o parêntese'); return v; }
      throw new Error('Expressão incompleta');
    }
    function unary() { if (eat('-')) return -unary(); if (eat('+')) return unary(); let v = prim(); while (eat('%')) v = v / 100; return v; }
    function pow() { const b = unary(); if (eat('^')) return Math.pow(b, pow()); return b; }
    function mul() { let v = pow(); for (;;) { if (eat('*')) v *= pow(); else if (eat('/')) { const d = pow(); if (d === 0) throw new Error('Divisão por zero'); v /= d; } else if (peek() && (peek().t === '(' || peek().t === 'n')) v *= pow(); else return v; } }
    function add() { let v = mul(); for (;;) { if (eat('+')) v += mul(); else if (eat('-')) v -= mul(); else return v; } }
    const v = add();
    if (p < tk.length) throw new Error('Expressão inválida');
    if (!isFinite(v)) throw new Error('Resultado inválido');
    return v;
  }
  function fmt(v) { const r = Math.round(v * 1e10) / 1e10; return r.toLocaleString('pt-BR', { maximumFractionDigits: 10, useGrouping: false }); }

  /* -------------------------------- Painel -------------------------------- */
  const KEYS = [['C', 'clear'], ['(', '('], [')', ')'], ['÷', '÷'], ['7'], ['8'], ['9'], ['×', '×'], ['4'], ['5'], ['6'], ['−', '−'], ['1'], ['2'], ['3'], ['+', '+'], ['%', '%'], ['0'], [',', ','], ['=', 'eq']];
  function paint(err) {
    if (!panel) return;
    let preview = '';
    if (!err && expr) { try { preview = '= ' + fmt(evaluate(expr)); } catch (e) { preview = ''; } }
    panel.querySelector('.calc-expr').textContent = expr || '0';
    panel.querySelector('.calc-prev').textContent = err || preview || (last != null ? 'Último resultado: ' + fmt(last) : ' ');
    panel.querySelector('.calc-prev').classList.toggle('err', !!err);
    const use = panel.querySelector('[data-use]'); if (use) use.disabled = valueNow() == null;
  }
  function valueNow() { if (expr) { try { return evaluate(expr); } catch (e) { return null; } } return last; }
  function press(k) {
    if (k === 'clear') { expr = ''; last = null; return paint(); }
    if (k === 'back') { expr = expr.slice(0, -1); return paint(); }
    if (k === 'eq') {
      if (!expr) return paint();
      try { last = evaluate(expr); expr = fmt(last); paint(); } catch (e) { paint(e.message); }
      return;
    }
    expr += k; paint();
  }
  function close() {
    if (!panel) return;
    if (keyH) document.removeEventListener('keydown', keyH, true);
    keyH = null; panel.classList.add('out'); const p = panel; panel = null; setTimeout(function () { p.remove(); }, 180);
    const b = document.querySelector('[data-calc-open]'); if (b) { b.setAttribute('aria-expanded', 'false'); b.focus(); }
  }
  function open(o) {
    opts = o || {};
    if (panel) { panel.querySelector('.calc-expr').focus(); return; }
    panel = document.createElement('div');
    panel.className = 'calc glass'; panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-label', 'Calculadora');
    panel.innerHTML = '<header class="calc-h"><span>' + icon('code') + esc(opts.title || 'Calculadora') + '</span><button class="icon-btn sm" data-close aria-label="Fechar calculadora">' + icon('x') + '</button></header>' +
      '<div class="calc-screen"><div class="calc-row"><div class="calc-expr" tabindex="0" aria-live="polite">0</div><button type="button" class="calc-bs" data-k="back" aria-label="Apagar o último caractere" title="Apagar (Backspace)">' + icon('backspace') + '</button></div><div class="calc-prev"> </div></div>' +
      '<div class="calc-keys">' + KEYS.map(function (k) { const v = k[1] || k[0]; const cls = v === 'eq' ? ' eq' : /[÷×−+%()]/.test(v) ? ' op' : v === 'clear' ? ' fn' : ''; return '<button type="button" class="ck' + cls + '" data-k="' + v + '">' + k[0] + '</button>'; }).join('') + '</div>' +
      '<div class="calc-foot">' + (opts.onUse ? '<button type="button" class="btn btn-primary sm" data-use>' + icon('check') + 'Usar resultado</button>' : '') + '</div>' +
      '<p class="calc-tip muted sm">Teclado: números, + − * / ( ) %, Enter calcula, Esc fecha.</p>';
    document.body.appendChild(panel);
    panel.querySelectorAll('[data-k]').forEach(function (b) { b.onclick = function () { press(b.dataset.k); }; });
    panel.querySelector('[data-close]').onclick = close;
    const use = panel.querySelector('[data-use]');
    if (use) use.onclick = function () { const v = valueNow(); if (v == null) return; opts.onUse(fmt(Math.round(v * 1e6) / 1e6)); close(); };
    keyH = function (e) {
      if (!panel || e.ctrlKey || e.metaKey || e.altKey) return;
      const tgt = e.target;
      if (tgt && tgt.matches && tgt.matches('input, textarea, select') && !panel.contains(tgt)) return; // não atrapalha o campo da resposta
      const map = { '*': '×', '/': '÷', '-': '−', '.': ',', 'x': '×' };
      if (/^[0-9+()%,^]$/.test(e.key) || map[e.key]) { e.preventDefault(); press(map[e.key] || e.key); }
      else if (e.key === 'Enter' || e.key === '=') { if (tgt && tgt.closest && tgt.closest('button') && panel.contains(tgt)) return; e.preventDefault(); press('eq'); }
      else if (e.key === 'Backspace') { e.preventDefault(); press('back'); }
      else if (e.key === 'Escape') { e.preventDefault(); close(); }
      else if (e.key === 'Delete') { e.preventDefault(); press('clear'); }
    };
    document.addEventListener('keydown', keyH, true);
    paint();
    requestAnimationFrame(function () { if (panel) { panel.classList.add('in'); panel.querySelector('.calc-expr').focus(); } });
  }

  global.Calculator = { open: open, close: close, evaluate: evaluate, isOpen: function () { return !!panel; } };
})(window);
