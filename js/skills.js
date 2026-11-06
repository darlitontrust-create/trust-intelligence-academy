/* =====================================================================
   skills.js — Desafios de Skills (avaliação direta, sem conteúdo)
   ---------------------------------------------------------------------
   Cada tema tem 3 desafios, liberados em sequência:
     Iniciante     → 15 questões · 30 min · reprovou: espera 1 dia
     Intermediário → 20 questões · 45 min · reprovou: espera 3 dias
     Avançado      → 30 questões · 60 min · reprovou: espera 7 dias
   • Aprovação com 70% de acerto; o nível seguinte só libera depois de
     conquistar o anterior.
   • Questões sorteadas das aulas do nível (e dos estudos de caso de
     múltipla escolha, nas trilhas que os têm). Sem resposta durante a
     prova: o resultado e a revisão aparecem no fim.
   • Tempo esgotado encerra o desafio; sair ou fechar a página no meio
     conta como tentativa não aprovada.
   Estado: progress.skills[nível] = { passedAt, best, lockUntil, running, history }
   ===================================================================== */
(function (global) {
  'use strict';
  const { esc, icon, toast, confetti } = global.UI;
  const LEVELS = [
    { lv: 1, nome: 'Iniciante', n: 15, min: 30, wait: 1 },
    { lv: 2, nome: 'Intermediário', n: 20, min: 45, wait: 3 },
    { lv: 3, nome: 'Avançado', n: 30, min: 60, wait: 7 },
  ];
  LEVELS.forEach(function (l) { l.pass = Math.ceil(l.n * 0.7); });
  const LETTERS = ['A', 'B', 'C', 'D'];
  const DAY = 864e5;
  const S = function () { return global.AppStorage; };

  function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); const t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function withTrack(id, fn) { const st = S().state, prev = st.currentTrack; st.currentTrack = id; try { return fn(); } finally { st.currentTrack = prev; } }
  function prog(id) { return withTrack(id, function () { return S().state.progress; }); }
  function rec(id, lv) { const p = prog(id); p.skills = p.skills || {}; return p.skills[lv] || (p.skills[lv] = { best: 0, history: [] }); }

  /* ----------------------------- Questões ----------------------------- */
  function pool(trackId, lv) {
    const bank = global.Tracks.bankOf(trackId), pack = global.Lessons.PACKS[trackId];
    const exs = bank.EXERCISES.filter(function (e) { return e.level === lv; });
    const keys = [];
    exs.forEach(function (e) { const k = pack.MAP[e.t] || pack.fallback; if (keys.indexOf(k) < 0) keys.push(k); });
    const buckets = keys.map(function (k) {
      const les = pack.LESSONS[k];
      return (les && les.quiz || []).map(function (q) { return { q: q[0], ok: q[1], bad: [q[2], q[3], q[4]], exp: q[5], topic: les.titulo }; });
    });
    // estudos de caso de múltipla escolha (Gestão, Lean Six Sigma, Estatística), sem gráfico
    if (/^(gestao|sixsigma|estatistica)$/.test(trackId)) {
      buckets.push(exs.filter(function (e) { return e.kind === 'choice' && !e.d && e.opts && e.opts.length === 4; })
        .map(function (e) { return { q: e.s + ' ' + e.g, ok: e.opts[0], bad: e.opts.slice(1), exp: e.x, topic: e.t }; }));
    }
    return buckets.filter(function (b) { return b.length; });
  }
  /** Sorteio em rodízio entre as aulas, sem repetir enunciado. */
  function build(trackId, cfg) {
    const buckets = shuffle(pool(trackId, cfg.lv)).map(shuffle), out = [], seen = {};
    while (out.length < cfg.n && buckets.some(function (b) { return b.length; })) {
      for (let i = 0; i < buckets.length && out.length < cfg.n; i++) {
        const q = buckets[i].pop();
        if (q && !seen[q.q]) { seen[q.q] = 1; out.push(q); }
      }
    }
    return shuffle(out).map(function (q) {
      const opts = shuffle([{ t: q.ok, ok: true }].concat(q.bad.map(function (t) { return { t: t }; })));
      return { q: q.q, opts: opts, exp: q.exp, topic: q.topic, correct: opts.findIndex(function (o) { return o.ok; }), answer: null };
    });
  }

  /* ------------------------------ Situação ------------------------------ */
  let active = null;   // { trackId, lv } do desafio aberto nesta aba
  /** Tentativa iniciada que ficou para trás (página fechada no meio): conta como não aprovada. */
  function settle(trackId) {
    let changed = false;
    LEVELS.forEach(function (c) {
      const r = (prog(trackId).skills || {})[c.lv];
      if (!r || !r.running || (active && active.trackId === trackId && active.lv === c.lv)) return;
      const at = r.running.startedAt;
      r.history = (r.history || []).concat([{ at: at, score: 0, n: c.n, pass: false, abandoned: true }]).slice(-30);
      r.lockUntil = new Date(Date.parse(at) + c.wait * DAY).toISOString();
      delete r.running; changed = true;
    });
    if (changed) S().saveNow();
  }
  function status(trackId, lv) {
    const c = LEVELS[lv - 1], r = (prog(trackId).skills || {})[lv] || {};
    const prevOk = lv === 1 || !!((prog(trackId).skills || {})[lv - 1] || {}).passedAt;
    const now = Date.now(), lock = r.lockUntil ? Date.parse(r.lockUntil) : 0;
    const s = { cfg: c, rec: r, passed: !!r.passedAt, attempts: (r.history || []).length, best: r.best || 0 };
    s.state = s.passed ? 'done' : !prevOk ? 'locked' : lock > now ? 'wait' : 'open';
    s.waitMs = Math.max(0, lock - now);
    return s;
  }
  function waitText(ms) {
    const d = Math.floor(ms / DAY), h = Math.floor(ms % DAY / 36e5), m = Math.ceil(ms % 36e5 / 6e4);
    return d ? d + ' dia' + (d > 1 ? 's' : '') + (h ? ' e ' + h + ' h' : '') : h ? h + ' h' + (m && m < 60 ? ' ' + m + ' min' : '') : Math.max(1, m) + ' min';
  }
  function fmtDate(iso) { try { return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }); } catch (e) { return ''; } }

  /* ------------------------------ Selo visual ------------------------------ */
  let uid = 0;
  function seal(track, lv, opts) {
    opts = opts || {};
    const id = 'sk' + (++uid), off = opts.state === 'locked' || opts.state === 'wait' || opts.state === 'open';
    const a = off ? '#4a5070' : track.color.a, b = off ? '#262a3d' : track.color.b;
    const ink = off ? '#8e94b0' : '#0b0e17', size = opts.size || 64;
    let stars = '';
    const xs = lv === 1 ? [60] : lv === 2 ? [51, 69] : [44, 60, 76];
    xs.forEach(function (x) { let p = ''; for (let k = 0; k < 10; k++) { const an = -Math.PI / 2 + k * Math.PI / 5, rr = k % 2 ? 2.6 : 6; p += (k ? 'L' : 'M') + (x + rr * Math.cos(an)).toFixed(1) + ' ' + (86 + rr * Math.sin(an)).toFixed(1); } stars += '<path d="' + p + 'Z"/>'; });
    return '<svg class="sk-seal' + (off ? ' off' : '') + '" viewBox="0 0 120 120" width="' + size + '" height="' + size + '" aria-hidden="true">' +
      '<defs><linearGradient id="' + id + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + a + '"/><stop offset="1" stop-color="' + b + '"/></linearGradient></defs>' +
      '<path d="M60 6 L106 32 V88 L60 114 L14 88 V32 Z" fill="url(#' + id + ')" stroke="' + (off ? '#5d6382' : 'rgba(255,255,255,.55)') + '" stroke-width="2.5"/>' +
      '<path d="M60 16 L97 37 V83 L60 104 L23 83 V37 Z" fill="none" stroke="' + ink + '" stroke-opacity=".35" stroke-width="1.5"/>' +
      '<g fill="' + ink + '" opacity=".9">' + stars + '</g>' +
      '<text x="60" y="66" text-anchor="middle" font-family="Instrument Serif, Georgia, serif" font-size="30" fill="' + ink + '">' + ['I', 'II', 'III'][lv - 1] + '</text>' +
      (opts.state === 'locked' ? '<g transform="translate(86 10)"><circle r="13" cx="0" cy="0" fill="#11141f" stroke="#5d6382"/><path d="M-5 -1 h10 v8 h-10z M-3 -1 v-3 a3 3 0 0 1 6 0 v3" fill="none" stroke="#8e94b0" stroke-width="2"/></g>' : '') +
      '</svg>';
  }

  /* --------------------------------- Prova --------------------------------- */
  let overlay = null, keyHandler = null, timer = null;
  function close(refresh) {
    if (keyHandler) document.removeEventListener('keydown', keyHandler); keyHandler = null;
    clearInterval(timer); timer = null;
    if (overlay) { overlay.classList.add('out'); const o = overlay; setTimeout(function () { o.remove(); }, 220); }
    overlay = null; active = null;
    document.body.classList.remove('exam-open');
    if (refresh !== false && location.hash === '#desafios') global.dispatchEvent(new HashChangeEvent('hashchange'));
  }
  function shell(t, c, inner, right) {
    return '<div class="exam glass sk-exam">' +
      '<header class="exam-h"><div><span class="eyebrow">Desafio de Skills · ' + esc(t.nome) + '</span><b>' + esc(c.nome) + '</b></div>' +
      (right || '') + '<button class="icon-btn" data-x aria-label="Sair do desafio">' + icon('x') + '</button></header>' + inner + '</div>';
  }
  function open(trackId, lv) {
    const t = global.Tracks.get(trackId);
    settle(trackId);
    const s = status(trackId, lv);
    if (s.state === 'locked') { toast('Conquiste o desafio ' + LEVELS[lv - 2].nome + ' para liberar este.', 'warn'); return; }
    if (s.state === 'wait') { toast('Nova tentativa disponível em ' + waitText(s.waitMs) + '.', 'warn'); return; }
    close(false);
    overlay = document.createElement('div');
    overlay.className = 'exam-overlay';
    overlay.setAttribute('role', 'dialog'); overlay.setAttribute('aria-modal', 'true'); overlay.setAttribute('aria-label', 'Desafio de Skills');
    overlay.style.setProperty('--ta', t.color.a); overlay.style.setProperty('--tb', t.color.b);
    document.body.appendChild(overlay);
    document.body.classList.add('exam-open');
    intro(t, s);
  }
  function intro(t, s) {
    const c = s.cfg;
    overlay.innerHTML = shell(t, c,
      '<div class="exam-intro">' + seal(t, c.lv, { size: 96 }) +
        '<h2>Desafio ' + esc(c.nome) + ' de ' + esc(t.short) + '</h2>' +
        '<p class="muted">Avaliação direta, sem conteúdo: as questões são sorteadas do nível ' + esc(c.nome) + ' da trilha. Você só vê o resultado no fim.</p>' +
        '<ul class="exam-rules"><li><b>' + c.n + '</b><span>questões</span></li><li><b>' + c.min + ' min</b><span>de tempo</span></li><li><b>' + c.pass + '</b><span>acertos para conquistar (70%)</span></li></ul>' +
        '<p class="sk-warn">' + icon('lock') + '<span>Se não atingir 70%, a próxima tentativa fica disponível em <b>' + c.wait + ' dia' + (c.wait > 1 ? 's' : '') + '</b>. Sair no meio ou deixar o tempo acabar conta como tentativa.</span></p>' +
        (s.attempts ? '<p class="muted sm">Tentativas anteriores: ' + s.attempts + ' · melhor nota ' + s.best + '/' + c.n + '</p>' : '') +
        '<button class="btn btn-primary lg" data-go>' + icon('play') + 'Começar desafio</button>' +
      '</div>');
    overlay.querySelector('[data-x]').onclick = function () { close(); };
    overlay.querySelector('[data-go]').onclick = function () { run(t, c, build(t.id, c)); };
    setTimeout(function () { const b = overlay && overlay.querySelector('[data-go]'); if (b) b.focus(); }, 50);
  }
  function run(t, c, qs) {
    const r = rec(t.id, c.lv), start = Date.now(), ends = start + c.min * 6e4;
    r.running = { startedAt: new Date(start).toISOString(), endsAt: new Date(ends).toISOString() };
    active = { trackId: t.id, lv: c.lv };
    S().saveNow();
    let i = 0, done = false, shown = -1;
    const clock = function () {
      const left = Math.max(0, ends - Date.now()), m = Math.floor(left / 6e4), sec = Math.floor(left % 6e4 / 1000);
      return { left: left, txt: m + ':' + String(sec).padStart(2, '0') };
    };
    function paint() {
      const q = qs[i], ck = clock(), answered = qs.filter(function (x) { return x.answer != null; }).length;
      overlay.innerHTML = shell(t, c,
        '<div class="exam-body">' +
          '<div class="exam-prog"><span>Questão <b>' + (i + 1) + '</b> de ' + qs.length + '</span><span class="muted sm">' + answered + ' respondida(s)</span></div>' +
          '<ol class="exam-dots">' + qs.map(function (x, k) { return '<li class="' + (k === i ? 'cur' : x.answer != null ? 'ans' : '') + '"></li>'; }).join('') + '</ol>' +
          '<h2 class="exam-q">' + global.UI.rich(q.q) + '</h2>' +
          '<div class="exam-opts" role="group">' + q.opts.map(function (o, k) {
            return '<button class="exam-opt' + (q.pick === k ? ' picked' : '') + '" data-o="' + k + '" aria-pressed="' + (q.pick === k) + '"><span class="eo-l">' + LETTERS[k] + '</span><span>' + global.UI.rich(o.t) + '</span></button>';
          }).join('') + '</div>' +
          '<div class="exam-next"><span class="muted sm hide-sm">' + (q.pick == null ? 'Escolha uma alternativa' : 'A resposta só é registrada ao confirmar') + '</span><button class="btn btn-primary" data-confirm' + (q.pick == null ? ' disabled' : '') + '>' + (i < qs.length - 1 ? 'Confirmar e avançar' + icon('chevR') : icon('check') + 'Finalizar desafio') + '</button></div>' +
        '</div>',
        '<span class="sk-timer' + (ck.left < 3e5 ? ' low' : '') + '" role="timer" aria-label="Tempo restante">' + icon('clock') + '<b>' + ck.txt + '</b></span>');
      const fresh = shown !== i; shown = i;
      if (fresh) { const b = overlay.querySelector('.exam-body'); if (b) b.classList.add('swap'); }
      overlay.classList.add('steady');
      overlay.querySelector('[data-x]').onclick = quit;
      overlay.querySelectorAll('[data-o]').forEach(function (b) { b.onclick = function () { qs[i].pick = +b.dataset.o; paint(); }; });
      overlay.querySelector('[data-confirm]').onclick = confirm;
      const f = overlay.querySelector(q.pick != null ? '[data-confirm]' : '[data-o]'); if (f) f.focus();
    }
    function confirm() {
      const q = qs[i]; if (q.pick == null || done) return;
      q.answer = q.pick;
      if (i < qs.length - 1) { i++; paint(); } else end(false);
    }
    function quit() {
      if (overlay.querySelector('.exam-confirm')) return;
      overlay.querySelector('.exam').insertAdjacentHTML('beforeend', '<div class="exam-confirm"><p>Sair agora encerra o desafio como <b>não conquistado</b>, e a próxima tentativa só fica disponível em ' + c.wait + ' dia' + (c.wait > 1 ? 's' : '') + '. Deseja sair?</p><div class="help-row"><button class="btn btn-danger sm" data-yes>Encerrar desafio</button><button class="btn btn-ghost sm" data-no>Continuar</button></div></div>');
      overlay.querySelector('[data-yes]').onclick = function () { end(true, true); };
      overlay.querySelector('[data-no]').onclick = function () { overlay.querySelector('.exam-confirm').remove(); };
    }
    function end(timeout, abandoned) {
      if (done) return; done = true;
      clearInterval(timer); timer = null;
      if (keyHandler) { document.removeEventListener('keydown', keyHandler); keyHandler = null; }
      finish(t, c, qs, timeout, abandoned);
    }
    timer = setInterval(function () {
      if (!overlay) return;
      const ck = clock(), el = overlay.querySelector('.sk-timer');
      if (el) { el.querySelector('b').textContent = ck.txt; el.classList.toggle('low', ck.left < 3e5); }
      if (ck.left <= 0) end(true);
    }, 500);
    keyHandler = function (e) {
      if (!overlay || done) return;
      if (e.key === 'Escape') { quit(); return; }
      const k = '1234'.indexOf(e.key) >= 0 ? +e.key - 1 : 'abcd'.indexOf(e.key.toLowerCase());
      if (k >= 0 && e.key.length === 1 && !overlay.querySelector('.exam-confirm')) { e.preventDefault(); qs[i].pick = k; paint(); }
      else if (e.key === 'Enter' && qs[i].pick != null && !overlay.querySelector('.exam-confirm')) { e.preventDefault(); confirm(); }
    };
    document.addEventListener('keydown', keyHandler);
    paint();
  }
  function finish(t, c, qs, timeout, abandoned) {
    const st = S().state, r = rec(t.id, c.lv), now = new Date();
    const score = qs.filter(function (q) { return q.answer === q.correct; }).length;
    const pass = !abandoned && score >= c.pass, first = pass && !r.passedAt;
    delete r.running;
    r.history = (r.history || []).concat([{ at: now.toISOString(), score: score, n: c.n, pass: pass, timeout: !!timeout || undefined, abandoned: !!abandoned || undefined }]).slice(-30);
    r.best = Math.max(r.best || 0, score);
    if (pass && !r.passedAt) r.passedAt = now.toISOString();
    if (!pass) r.lockUntil = new Date(now.getTime() + c.wait * DAY).toISOString();
    const got = withTrack(t.id, function () { return global.Gamification.evaluate(st, {}); });
    S().saveNow();
    active = null;
    const pct = Math.round(score / c.n * 100), next = LEVELS[c.lv];
    const wrong = qs.filter(function (q) { return q.answer !== q.correct; });
    const review = wrong.length && !abandoned ? '<details class="exam-review"><summary>Revisar as ' + wrong.length + ' questão(ões) que errou ou não respondeu</summary><ol>' + wrong.map(function (q) {
      return '<li><p class="rv-q">' + global.UI.rich(q.q) + '</p>' + (q.answer != null ? '<p class="rv-a">' + icon('x') + 'Sua resposta: ' + global.UI.rich(q.opts[q.answer].t) + '</p>' : '<p class="rv-a">' + icon('x') + 'Sem resposta</p>') +
        '<p class="rv-c">' + icon('check') + 'Correta: ' + global.UI.rich(q.opts[q.correct].t) + '</p><p class="muted sm">' + global.UI.rich(q.exp) + ' · ' + esc(q.topic) + '</p></li>';
    }).join('') + '</ol></details>' : '';
    overlay.innerHTML = shell(t, c,
      '<div class="exam-result ' + (pass ? 'pass' : 'fail') + '">' +
        (pass ? '<div class="sk-win">' + seal(t, c.lv, { size: 120 }) + '</div>' : '<div class="score-ring" style="--p:0"><div class="score-core"><b data-count>0</b><span>de ' + c.n + '</span></div></div>') +
        (pass
          ? '<p class="eyebrow">' + score + ' de ' + c.n + ' · ' + pct + '% de acerto</p><h2>Skill ' + esc(c.nome) + ' conquistada!</h2>' +
            '<p class="muted">Você comprovou o nível ' + esc(c.nome) + ' em ' + esc(t.nome) + '.' + (next ? ' O desafio <b>' + next.nome + '</b> está liberado.' : ' Você conquistou as três skills deste tema.') + '</p>' +
            '<div class="help-row center">' + (next ? '<button class="btn btn-primary lg" data-next>' + icon('play') + 'Ver desafio ' + next.nome + '</button>' : '') + '<button class="btn btn-ghost" data-back>Voltar aos desafios</button></div>'
          : '<p class="eyebrow">' + (abandoned ? 'Desafio encerrado' : timeout ? 'Tempo esgotado · ' + pct + '% de acerto' : pct + '% de acerto') + '</p><h2>' + (abandoned ? 'Tentativa encerrada' : 'Ainda não foi desta vez') + '</h2>' +
            '<p class="muted">' + (abandoned ? 'O desafio foi encerrado antes do fim e conta como tentativa não aprovada.' : 'Eram necessários ' + c.pass + ' acertos (70%).') + ' Nova tentativa disponível em <b>' + c.wait + ' dia' + (c.wait > 1 ? 's' : '') + '</b> (' + fmtDate(r.lockUntil) + ').</p>' +
            '<div class="help-row center"><button class="btn btn-primary" data-back>Voltar aos desafios</button></div>') +
        review +
      '</div>');
    overlay.querySelector('[data-x]').onclick = function () { close(); };
    const ring = overlay.querySelector('.score-ring');
    if (ring) {
      const num = overlay.querySelector('[data-count]'), t0 = performance.now(), dur = 1000;
      (function tick(tt) { if (!overlay) return; const k = Math.min(1, (tt - t0) / dur), e = 1 - Math.pow(1 - k, 3); ring.style.setProperty('--p', (score / c.n * e * 100).toFixed(1)); num.textContent = Math.round(score * e); if (k < 1) requestAnimationFrame(tick); else ring.classList.add('done'); })(t0);
    }
    if (pass) {
      setTimeout(function () { global.Sfx.play(c.lv === 3 ? 'legend' : 'promotion'); confetti(c.lv === 3 ? 'legend' : null); }, 250);
      if (first) setTimeout(function () { toast('Skill conquistada: <b>' + esc(t.short + ' · ' + c.nome) + '</b>', 'success', 4500); }, 900);
    } else if (global.Sfx && global.Sfx.answer) global.Sfx.answer('no');
    got.newAchievements.forEach(function (a, k) { setTimeout(function () { toast('Conquista desbloqueada: <b>' + esc(a.nome) + '</b>', 'success', 4200); }, 1600 + k * 700); });
    const bn = overlay.querySelector('[data-next]'); if (bn) bn.onclick = function () { close(false); open(t.id, c.lv + 1); };
    overlay.querySelector('[data-back]').onclick = function () { close(); };
  }

  /* ------------------------------ Páginas ------------------------------ */
  function card(t, lv, compact) {
    const s = status(t.id, lv), c = s.cfg;
    const label = { done: 'Conquistada', open: 'Disponível', wait: 'Aguardando', locked: 'Bloqueada' }[s.state];
    const foot = s.state === 'done' ? '<span class="sk-ok">' + icon('check') + 'Conquistada em ' + fmtDate(s.rec.passedAt) + ' · ' + s.best + '/' + c.n + '</span>'
      : s.state === 'wait' ? '<span class="sk-wait">' + icon('clock') + 'Nova tentativa em ' + waitText(s.waitMs) + '</span>'
      : s.state === 'locked' ? '<span class="sk-lock">' + icon('lock') + 'Conquiste o ' + LEVELS[lv - 2].nome + ' para liberar</span>'
      : '<button class="btn btn-primary sm" data-skill="' + t.id + ':' + lv + '">' + icon('play') + (s.attempts ? 'Tentar de novo' : 'Iniciar desafio') + '</button>';
    return '<article class="sk-card glass st-' + s.state + (compact ? ' compact' : '') + '" style="--ta:' + t.color.a + ';--tb:' + t.color.b + '">' +
      seal(t, lv, { size: compact ? 54 : 78, state: s.state === 'done' ? null : s.state }) +
      '<div class="sk-txt"><span class="sk-st">' + label + '</span><b>' + esc(c.nome) + '</b>' +
        (compact ? '' : '<ul class="sk-rules"><li>' + icon('list') + c.n + ' questões</li><li>' + icon('clock') + c.min + ' min</li><li>' + icon('target') + c.pass + ' acertos (70%)</li><li>' + icon('refresh') + 'Espera de ' + c.wait + ' dia' + (c.wait > 1 ? 's' : '') + '</li></ul>') +
        (s.attempts && !compact ? '<span class="muted sm">' + s.attempts + ' tentativa(s) · melhor ' + s.best + '/' + c.n + '</span>' : '') +
        foot + '</div></article>';
  }
  function bind(view) {
    view.querySelectorAll('[data-skill]').forEach(function (b) { b.onclick = function () { const p = b.dataset.skill.split(':'); open(p[0], +p[1]); }; });
  }
  function count(t) { return LEVELS.filter(function (c) { return status(t.id, c.lv).passed; }).length; }
  /** Página do tema: os 3 desafios. */
  function render(view, st) {
    const t = global.Tracks.active();
    settle(t.id);
    const hist = [];
    LEVELS.forEach(function (c) { ((prog(t.id).skills || {})[c.lv] || {}).history && prog(t.id).skills[c.lv].history.forEach(function (h) { hist.push({ c: c, h: h }); }); });
    hist.sort(function (a, b) { return String(b.h.at).localeCompare(String(a.h.at)); });
    view.innerHTML =
      '<section class="page-h stack"><p class="eyebrow">Desafios de Skills · ' + esc(t.nome) + '</p><h1>Comprove o que você sabe</h1>' +
      '<p class="muted">Avaliações diretas, sem conteúdo, liberadas em sequência. Conquiste com 70% de acerto. ' + count(t) + ' de 3 skills conquistadas.</p></section>' +
      '<div class="sk-grid">' + LEVELS.map(function (c) { return card(t, c.lv); }).join('') + '</div>' +
      (hist.length ? '<section class="card glass sk-hist"><h3 class="card-k">' + icon('clock') + 'Histórico de tentativas</h3><ul>' + hist.slice(0, 10).map(function (x) {
        return '<li><span>' + esc(x.c.nome) + '</span><span class="muted sm">' + fmtDate(x.h.at) + '</span><b class="' + (x.h.pass ? 'ok' : 'no') + '">' + (x.h.abandoned ? 'Encerrado' : x.h.score + '/' + x.h.n) + '</b></li>';
      }).join('') + '</ul></section>' : '');
    bind(view);
  }
  /** Visão geral: os 3 desafios de cada tema. */
  function renderOverview(view, st) {
    const tracks = global.Tracks.TRACKS.filter(function (t) { return t.status === 'ativo'; });
    tracks.forEach(function (t) { settle(t.id); });
    const total = tracks.reduce(function (s, t) { return s + count(t); }, 0);
    view.innerHTML =
      '<section class="page-h stack"><p class="eyebrow">Desafios de Skills · Visão geral</p><h1>' + total + ' de ' + tracks.length * 3 + ' skills conquistadas</h1>' +
      '<p class="muted">Cada tema tem 3 desafios (Iniciante, Intermediário e Avançado), liberados em sequência. Sem conteúdo: é direto para a avaliação.</p>' +
      '<ul class="sk-legend">' + LEVELS.map(function (c) { return '<li><b>' + c.nome + '</b><span>' + c.n + ' questões · ' + c.min + ' min · espera de ' + c.wait + ' dia' + (c.wait > 1 ? 's' : '') + ' se não conquistar</span></li>'; }).join('') + '</ul></section>' +
      '<div class="sk-tracks">' + tracks.map(function (t) {
        return '<section class="sk-track glass" style="--ta:' + t.color.a + ';--tb:' + t.color.b + '"><header><span class="hub-ic">' + icon(t.icon) + '</span><b>' + esc(t.nome) + '</b><span class="muted sm">' + count(t) + '/3</span></header>' +
          '<div class="sk-row">' + LEVELS.map(function (c) { return card(t, c.lv, true); }).join('') + '</div></section>';
      }).join('') + '</div>';
    bind(view);
  }

  global.Skills = { LEVELS: LEVELS, open: open, close: close, render: render, renderOverview: renderOverview, status: status, seal: seal, build: build, pool: pool, settle: settle, count: count };
})(window);
