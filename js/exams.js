/* =====================================================================
   exams.js — Provas para liberar certificados
   ---------------------------------------------------------------------
   • 15 questões sorteadas das aulas do escopo do certificado (etapa,
     nível ou trilha), distribuídas entre as aulas e com alternativas
     embaralhadas. Cada tentativa sorteia uma nova prova.
   • Aprovação: mínimo de 11 acertos (70%).
   • Aprovado: som, confete, medalha animada e botão para o certificado.
   • Reprovado: revisão dos erros com explicação e botão para refazer.
   • Resultado salvo em progress.exams[certId].
   ===================================================================== */
(function (global) {
  'use strict';
  const { esc, icon, toast, confetti } = global.UI;
  const N = 15, PASS = 11;
  const LETTERS = ['A', 'B', 'C', 'D'];

  /** A questão envolve conta? (vários números no enunciado ou alternativas numéricas) */
  function needsCalc(q) {
    if (global.Tracks && global.Tracks.activeId() === 'ingles') return false;   // inglês não tem questões de conta
    const nums = (String(q.q).match(/\d+(?:[.,]\d+)*/g) || []).length;
    const numericOpts = q.opts.filter(function (o) { const t = String(o.t); return /\d/.test(t) && t.replace(/[^\d]/g, '').length >= t.replace(/\s/g, '').length * 0.4; }).length;
    return nums >= 2 || numericOpts >= 3;
  }
  function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); const t = a[i]; a[i] = a[j]; a[j] = t; } return a; }

  function pack() { return global.Lessons.PACKS[global.Tracks.activeId()]; }
  function questionsOf(key) {
    const les = pack().LESSONS[key];
    return (les && les.quiz || []).map(function (q) { return { key: key, lesson: les.titulo, raw: q }; });
  }

  /* ---- Sem repetição dentro da tentativa ----
     Duas questões contam como "iguais" quando têm o mesmo enunciado (ignorando
     maiúsculas, acentos e espaços), enunciados quase idênticos ou a mesma
     resposta correta longa. Primeiro tenta montar só com questões distintas;
     se faltar questão, completa apenas com enunciados diferentes. */
  function normTxt(s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ').replace(/[\s.?!:]+$/, '').trim(); }
  function words(s) { return normTxt(s).split(/[^a-z0-9%/*+<>=_-]+/).filter(function (w) { return w.length > 2; }); }
  function similar(a, b) {
    const A = words(a), B = words(b); if (!A.length || !B.length) return false;
    const setB = {}; B.forEach(function (w) { setB[w] = 1; });
    const setA = {}; A.forEach(function (w) { setA[w] = 1; });
    const inter = Object.keys(setA).filter(function (w) { return setB[w]; }).length;
    const uni = Object.keys(Object.assign({}, setA, setB)).length;
    return uni > 3 && inter / uni >= 0.8;
  }
  /** Escolhe até n questões de `cands` (já na ordem de preferência) sem repetir. qOf/aOf leem enunciado e resposta. */
  function distinct(cands, n, qOf, aOf, taken) {
    const out = taken || [], usedQ = {}, usedA = {};
    out.forEach(function (c) { usedQ[normTxt(qOf(c))] = 1; usedA[normTxt(aOf(c))] = 1; });
    cands.forEach(function (c) {
      if (out.length >= n) return;
      const q = normTxt(qOf(c)), a = normTxt(aOf(c));
      if (usedQ[q] || (a.length > 12 && usedA[a])) return;
      if (out.some(function (o) { return similar(qOf(o), qOf(c)); })) return;
      usedQ[q] = 1; usedA[a] = 1; out.push(c);
    });
    // completa, se preciso, só com enunciados diferentes
    cands.forEach(function (c) {
      if (out.length >= n || out.indexOf(c) >= 0) return;
      const q = normTxt(qOf(c)); if (usedQ[q]) return;
      usedQ[q] = 1; out.push(c);
    });
    return out;
  }

  /** Ordem de sorteio: uma questão de cada aula por vez (rodízio), para variar os temas. */
  function roundRobin(keys) {
    const buckets = shuffle(keys).map(function (k) { return shuffle(questionsOf(k)); }).filter(function (b) { return b.length; }), seq = [];
    while (buckets.some(function (b) { return b.length; })) buckets.forEach(function (b) { const q = b.pop(); if (q) seq.push(q); });
    return seq;
  }
  /** Monta uma prova para o certificado (completa com aulas do nível e da trilha se faltar questão), sem repetir questões. */
  function build(cert) {
    const bank = global.ExerciseBank.EXERCISES;
    const lvKeys = bank.filter(function (e) { return e.level === cert.level; }).map(function (e) { return global.Lessons.forExercise(e).key; })
      .filter(function (k, i, a) { return a.indexOf(k) === i && cert.lessons.indexOf(k) < 0; });
    const all = Object.keys(pack().LESSONS).filter(function (k) { return cert.lessons.indexOf(k) < 0 && lvKeys.indexOf(k) < 0; });
    const qOf = function (q) { return q.raw[0]; }, aOf = function (q) { return q.raw[1]; };
    let out = distinct(roundRobin(cert.lessons), N, qOf, aOf);
    if (out.length < N) out = distinct(roundRobin(lvKeys), N, qOf, aOf, out);
    if (out.length < N) out = distinct(roundRobin(all), N, qOf, aOf, out);
    return shuffle(out).map(function (q) {
      const r = q.raw;
      const opts = shuffle([{ t: r[1], ok: true }, { t: r[2] }, { t: r[3] }, { t: r[4] }]);
      return { q: r[0], opts: opts, exp: r[5], lesson: q.lesson, correct: opts.findIndex(function (o) { return o.ok; }), answer: null };
    });
  }

  /* --------------------------------- Tela --------------------------------- */
  let overlay = null, keyHandler = null;
  function close(refresh) {
    if (global.Calculator) global.Calculator.close();
    if (keyHandler) document.removeEventListener('keydown', keyHandler);
    keyHandler = null;
    if (overlay) { overlay.classList.add('out'); const o = overlay; setTimeout(function () { o.remove(); }, 220); }
    overlay = null;
    document.body.classList.remove('exam-open');
    if (refresh !== false && location.hash === '#certificado') global.dispatchEvent(new HashChangeEvent('hashchange'));
  }

  function start(certId) {
    const st = global.AppStorage.state;
    const cert = global.Certificate.find(st, certId);
    if (!cert) return;
    if (!cert.eligible) { toast('Conclua os exercícios para liberar esta prova.', 'warn'); return; }
    close(false);
    overlay = document.createElement('div');
    overlay.className = 'exam-overlay';
    overlay.setAttribute('role', 'dialog'); overlay.setAttribute('aria-modal', 'true'); overlay.setAttribute('aria-label', 'Prova do certificado');
    overlay.style.setProperty('--ta', cert.track.color.a); overlay.style.setProperty('--tb', cert.track.color.b);
    document.body.appendChild(overlay);
    document.body.classList.add('exam-open');
    intro(st, cert);
  }

  function shell(cert, inner, sub) {
    const name = cert.type === 'final' ? global.Gamification.FINAL.nome : cert.title;
    return '<div class="exam glass">' +
      '<header class="exam-h"><div><span class="eyebrow">Prova · ' + esc(cert.kicker) + '</span><b>' + esc(name) + '</b>' + (sub ? '<small class="muted">' + sub + '</small>' : '') + '</div>' +
      '<button class="icon-btn" data-x aria-label="Sair da prova">' + icon('x') + '</button></header>' + inner + '</div>';
  }
  function bindClose(running) {
    overlay.querySelector('[data-x]').onclick = function () {
      if (!running()) return close();
      const box = overlay.querySelector('.exam-confirm');
      if (box) return;
      overlay.querySelector('.exam').insertAdjacentHTML('beforeend', '<div class="exam-confirm"><p>Sair agora encerra esta tentativa sem nota. Deseja sair?</p><div class="help-row"><button class="btn btn-danger sm" data-yes>Sair da prova</button><button class="btn btn-ghost sm" data-no>Continuar</button></div></div>');
      overlay.querySelector('[data-yes]').onclick = function () { close(); };
      overlay.querySelector('[data-no]').onclick = function () { overlay.querySelector('.exam-confirm').remove(); };
    };
  }

  function intro(st, cert) {
    const e = cert.exam;
    overlay.innerHTML = shell(cert,
      '<div class="exam-intro">' +
        '<div class="exam-medal m-' + cert.medal.name.toLowerCase() + '"><span>' + icon('award') + '</span></div>' +
        '<h2>Prova para liberar o certificado</h2>' +
        '<p class="muted">As questões são sorteadas dos conteúdos ' + (cert.type === 'stage' ? 'desta etapa' : cert.type === 'level' ? 'deste nível' : 'de toda a trilha') + ' de ' + esc(cert.track.nome) + '. A cada tentativa, uma prova nova.</p>' +
        '<ul class="exam-rules"><li><b>' + N + '</b><span>questões</span></li><li><b>' + PASS + '</b><span>acertos para aprovar (70%)</span></li><li><b>' + cert.medal.name + '</b><span>medalha do certificado</span></li></ul>' +
        (e && e.attempts ? '<p class="muted sm">Tentativas anteriores: ' + e.attempts + ' · melhor nota ' + e.best + '/' + N + '</p>' : '') +
        '<button class="btn btn-primary lg" data-go>' + icon('play') + 'Começar prova</button>' +
      '</div>');
    bindClose(function () { return false; });
    overlay.querySelector('[data-go]').onclick = function () { run(st, cert, build(cert)); };
    setTimeout(function () { const b = overlay && overlay.querySelector('[data-go]'); if (b) b.focus(); }, 50);
  }

  function run(st, cert, qs) {
    let i = 0, done = false, shown = -1;
    function dots() {
      return '<ol class="exam-dots">' + qs.map(function (q, k) {
        const cls = q.answer == null ? (k === i ? 'cur' : '') : (q.answer === q.correct ? 'ok' : 'no');
        return '<li class="' + cls + '"></li>';
      }).join('') + '</ol>';
    }
    function paint() {
      const q = qs[i];
      const hits = qs.filter(function (x) { return x.answer != null && x.answer === x.correct; }).length;
      overlay.innerHTML = shell(cert,
        '<div class="exam-body">' +
          '<div class="exam-prog"><span>Questão <b>' + (i + 1) + '</b> de ' + N + '</span>' + (needsCalc(q) && global.Calculator ? '<button class="btn btn-ghost sm exam-calc" data-calc>' + icon('grid') + 'Calculadora</button>' : '') + '<span class="muted sm">' + hits + ' acerto(s)</span></div>' + dots() +
          '<span class="tag tag-topic">' + icon('book') + esc(q.lesson) + '</span>' +
          '<h2 class="exam-q">' + global.UI.rich(q.q) + '</h2>' +
          '<div class="exam-opts" role="group">' + q.opts.map(function (o, k) {
            let cls = '';
            if (q.answer != null) { if (k === q.correct) cls = ' right'; else if (k === q.answer) cls = ' wrong'; else cls = ' dim'; }
            else if (q.pick === k) cls = ' picked';
            return '<button class="exam-opt' + cls + '" data-o="' + k + '"' + (q.answer != null ? ' disabled' : ' aria-pressed="' + (q.pick === k) + '"') + '><span class="eo-l">' + LETTERS[k] + '</span><span>' + global.UI.rich(o.t) + '</span></button>';
          }).join('') + '</div>' +
          (q.answer == null ? '<div class="exam-next"><span class="muted sm hide-sm">' + (q.pick == null ? 'Escolha uma alternativa' : 'Você pode trocar a alternativa antes de confirmar') + '</span><button class="btn btn-primary" data-confirm' + (q.pick == null ? ' disabled' : '') + '>' + icon('check') + 'Confirmar resposta</button></div>' : '') +
          (q.answer != null ? '<div class="exam-exp ' + (q.answer === q.correct ? 'ok' : 'no') + '">' + icon(q.answer === q.correct ? 'check' : 'x') + '<p><b>' + (q.answer === q.correct ? 'Correto.' : 'Incorreto.') + '</b> ' + global.UI.rich(q.exp) + '</p></div>' +
            '<div class="exam-next"><button class="btn btn-primary" data-next>' + (i < N - 1 ? 'Próxima questão' + icon('chevR') : icon('award') + 'Ver resultado') + '</button></div>' : '') +
        '</div>');
      // sem "pulo" a cada clique: o cartão só anima ao abrir; ao trocar de questão, um esmaecer curto
      const fresh = shown !== i; shown = i;
      if (fresh) { const b = overlay.querySelector('.exam-body'); if (b) b.classList.add('swap'); }
      overlay.classList.add('steady');
      bindClose(function () { return !done; });
      overlay.querySelectorAll('[data-o]').forEach(function (b) { b.onclick = function () { pick(+b.dataset.o); }; });
      const cf = overlay.querySelector('[data-confirm]'); if (cf) cf.onclick = confirm;
      const cb = overlay.querySelector('[data-calc]'); if (cb) cb.onclick = function () { global.Calculator.open({ title: 'Calculadora · questão ' + (i + 1) }); };
      if (!needsCalc(qs[i]) && global.Calculator) global.Calculator.close();
      const nx = overlay.querySelector('[data-next]');
      if (nx) { nx.onclick = next; nx.focus(); }
      else { const f = overlay.querySelector(qs[i].pick != null ? '[data-o="' + qs[i].pick + '"]' : '[data-o]'); if (f) f.focus(); }
    }
    // escolher marca a alternativa; só o botão Confirmar registra a resposta
    function pick(k) { if (qs[i].answer != null) return; qs[i].pick = k; paint(); }
    function confirm() { const q = qs[i]; if (q.answer != null || q.pick == null) return; q.answer = q.pick; if (global.Sfx && global.Sfx.answer) global.Sfx.answer(q.answer === q.correct ? 'ok' : 'no'); paint(); }
    function next() { if (qs[i].answer == null) return; if (i < N - 1) { i++; paint(); } else { done = true; finish(st, cert, qs); } }
    keyHandler = function (e) {
      if (!overlay || done) return;
      if (global.Calculator && global.Calculator.isOpen()) return;   // o teclado é da calculadora
      if (e.key === 'Escape') { overlay.querySelector('[data-x]').click(); return; }
      const k = '1234'.indexOf(e.key) >= 0 ? +e.key - 1 : 'abcd'.indexOf(e.key.toLowerCase());
      if (k >= 0 && e.key.length === 1 && qs[i].answer == null) { e.preventDefault(); pick(k); }
      else if (e.key === 'Enter' && qs[i].answer == null && qs[i].pick != null) { e.preventDefault(); confirm(); }
      else if (e.key === 'Enter' && qs[i].answer != null && document.activeElement && !document.activeElement.matches('[data-next]')) { e.preventDefault(); next(); }
    };
    document.addEventListener('keydown', keyHandler);
    paint();
  }

  function save(st, cert, score) {
    const now = new Date().toISOString();
    const ex = st.progress.exams[cert.id] || { attempts: 0, best: 0, history: [] };
    ex.attempts += 1; ex.score = score; ex.best = Math.max(ex.best || 0, score); ex.last = now;
    ex.history = (ex.history || []).concat([{ at: now, score: score }]).slice(-20);
    if (score >= PASS && !ex.passedAt) ex.passedAt = now;
    st.progress.exams[cert.id] = ex;
    const got = global.Gamification.evaluate(st, {});
    global.AppStorage.saveNow();
    return got;
  }

  function finish(st, cert, qs) {
    if (keyHandler) { document.removeEventListener('keydown', keyHandler); keyHandler = null; }
    const score = qs.filter(function (q) { return q.answer === q.correct; }).length;
    const pass = score >= PASS;
    const firstPass = pass && !(cert.exam && cert.exam.passedAt);
    const got = save(st, cert, score);
    const pct = Math.round(score / N * 100);
    const wrong = qs.filter(function (q) { return q.answer !== q.correct; });
    const review = wrong.length ? '<details class="exam-review"' + (pass ? '' : ' open') + '><summary>' + (pass ? 'Revisar as ' + wrong.length + ' questão(ões) que errou' : 'Revise o que errou (' + wrong.length + ')') + '</summary><ol>' + wrong.map(function (q) {
      return '<li><p class="rv-q">' + global.UI.rich(q.q) + '</p><p class="rv-a">' + icon('x') + 'Sua resposta: ' + global.UI.rich(q.opts[q.answer].t) + '</p><p class="rv-c">' + icon('check') + 'Correta: ' + global.UI.rich(q.opts[q.correct].t) + '</p><p class="muted sm">' + global.UI.rich(q.exp) + ' · Aula: ' + esc(q.lesson) + '</p></li>';
    }).join('') + '</ol></details>' : '';
    overlay.innerHTML = shell(cert,
      '<div class="exam-result ' + (pass ? 'pass' : 'fail') + '">' +
        '<div class="score-ring" style="--p:0"><div class="score-core"><b data-count>0</b><span>de ' + N + '</span></div></div>' +
        (pass
          ? '<div class="pass-badge m-' + cert.medal.name.toLowerCase() + '"><span class="pb-rays"></span><span class="pb-medal">' + icon('check') + '</span></div>' +
            '<p class="eyebrow">Aprovado com ' + pct + '%</p><h2>Certificado liberado!</h2>' +
            '<p class="muted">Você acertou ' + score + ' de ' + N + ' questões e conquistou a medalha <b>' + cert.medal.name + '</b> em ' + esc(cert.track.nome) + '.</p>' +
            '<div class="help-row center"><button class="btn btn-primary lg" data-cert>' + icon('award') + 'Ver certificado liberado</button><button class="btn btn-ghost" data-again>' + icon('refresh') + 'Fazer de novo</button></div>'
          : '<p class="eyebrow">' + pct + '% de acerto</p><h2>Quase lá!</h2>' +
            '<p class="muted">Você precisa de pelo menos ' + PASS + ' acertos (70%) para liberar o certificado. Revise os pontos abaixo e tente de novo: a próxima prova terá novas questões.</p>' +
            '<div class="help-row center"><button class="btn btn-primary lg" data-again>' + icon('refresh') + 'Refazer prova</button><button class="btn btn-ghost" data-back>Voltar aos estudos</button></div>') +
        review +
      '</div>', pass ? '' : 'Melhor nota: ' + st.progress.exams[cert.id].best + '/' + N);
    bindClose(function () { return false; });
    // animação do placar
    const ring = overlay.querySelector('.score-ring'), num = overlay.querySelector('[data-count]');
    const t0 = performance.now(), dur = 1100;
    (function tick(t) {
      if (!overlay) return;
      const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      ring.style.setProperty('--p', (score / N * e * 100).toFixed(1));
      num.textContent = Math.round(score * e);
      if (k < 1) requestAnimationFrame(tick); else ring.classList.add('done');
    })(t0);
    if (pass) {
      setTimeout(function () {
        global.Sfx.play(cert.type === 'final' ? 'legend' : 'promotion');
        confetti(cert.type === 'final' ? 'legend' : null);
        if (cert.type !== 'stage') setTimeout(function () { confetti(cert.type === 'final' ? 'legend' : null); }, 700);
      }, dur - 150);
      if (firstPass) setTimeout(function () { toast('Certificado liberado: <b>' + esc(cert.type === 'final' ? cert.title : cert.kicker + ' · ' + cert.title) + '</b>', 'success', 4500); }, dur + 200);
    }
    got.newAchievements.forEach(function (a, i) { setTimeout(function () { toast('Conquista desbloqueada: <b>' + esc(a.nome) + '</b>', 'success', 4200); }, dur + 900 + i * 700); });
    const bc = overlay.querySelector('[data-cert]');
    if (bc) bc.onclick = function () { close(false); global.Certificate.open(cert.id); };
    const ba = overlay.querySelector('[data-again]');
    if (ba) ba.onclick = function () { const c2 = global.Certificate.find(st, cert.id); run(st, c2, build(c2)); };
    const bb = overlay.querySelector('[data-back]');
    if (bb) bb.onclick = function () { close(); };
  }

  global.Exams = { start: start, build: build, close: close, N: N, PASS: PASS };
})(window);
