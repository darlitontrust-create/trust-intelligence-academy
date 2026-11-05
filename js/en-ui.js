/* =====================================================================
   en-ui.js — Tela de prática da trilha de Inglês
   ---------------------------------------------------------------------
   Tipos: choice · fill · build · listen · dictation · order · classify
   • Áudio em inglês pelo Narrator.sayEn (voz gravada, se houver, ou a
     melhor voz inglesa do aparelho), com opção de ouvir devagar.
   • Correção tolerante: ignora maiúsculas, pontuação e contrações
     (I'm = I am, don't = do not…) e aceita números em algarismos.
   • Prática de fala: depois de acertar, o aluno pode ouvir o modelo e
     falar a frase (reconhecimento de voz do navegador, quando existe).
   ===================================================================== */
(function (global) {
  'use strict';
  const { esc, icon } = global.UI;
  const R = function (s) { return global.UI.rich(s); };
  const plain = function (s) { return global.UI.plain(s); };
  const LET = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

  /* ------------------------- Embaralhamento fixo ------------------------- */
  function seed(str) { let h = 2166136261; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function rng(s) { return function () { s |= 0; s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function shuffled(n, key) {
    const a = []; for (let i = 0; i < n; i++) a.push(i);
    const Rn = rng(seed(key));
    for (let i = n - 1; i > 0; i--) { const j = Math.floor(Rn() * (i + 1)); const t = a[i]; a[i] = a[j]; a[j] = t; }
    if (n > 1 && a.every(function (v, i) { return v === i; })) a.push(a.shift());
    return a;
  }

  /* --------------------------- Normalização --------------------------- */
  const CONTR = {
    "i'm": 'i am', "you're": 'you are', "we're": 'we are', "they're": 'they are', "he's": 'he is', "she's": 'she is', "it's": 'it is',
    "that's": 'that is', "what's": 'what is', "there's": 'there is', "where's": 'where is', "who's": 'who is', "how's": 'how is', "here's": 'here is',
    "isn't": 'is not', "aren't": 'are not', "wasn't": 'was not', "weren't": 'were not', "don't": 'do not', "doesn't": 'does not', "didn't": 'did not',
    "can't": 'cannot', "won't": 'will not', "wouldn't": 'would not', "shouldn't": 'should not', "couldn't": 'could not', "mustn't": 'must not',
    "haven't": 'have not', "hasn't": 'has not', "hadn't": 'had not', "i've": 'i have', "you've": 'you have', "we've": 'we have', "they've": 'they have',
    "i'll": 'i will', "you'll": 'you will', "he'll": 'he will', "she'll": 'she will', "we'll": 'we will', "they'll": 'they will', "it'll": 'it will',
    "i'd": 'i would', "you'd": 'you would', "he'd": 'he would', "she'd": 'she would', "we'd": 'we would', "they'd": 'they would', "let's": 'let us',
  };
  const NUM = { zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19, twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90, hundred: 100 };
  function norm(s) {
    let t = plain(s).toLowerCase().replace(/[’‘`´]/g, "'").replace(/\s+'/g, "'");
    t = t.replace(/[.,!?;:"“”()…–—-]/g, ' ').replace(/\s+/g, ' ').trim();
    t = t.split(' ').map(function (w) { return CONTR[w] || (NUM[w] != null ? String(NUM[w]) : w); }).join(' ');
    return t.replace(/\bcan not\b/g, 'cannot').replace(/'s\b/g, ' is').replace(/\s+/g, ' ').trim();
  }
  function lev(a, b) {
    const m = a.length, n = b.length; if (!m) return n; if (!n) return m;
    let prev = []; for (let j = 0; j <= n; j++) prev[j] = j;
    for (let i = 1; i <= m; i++) { const cur = [i]; for (let j = 1; j <= n; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); prev = cur; }
    return prev[n];
  }

  /* ------------------------------ Textos ------------------------------ */
  function filled(ex, word) { return String(ex.q).replace(/_{2,}/, word); }
  /** Resposta correta em texto (para gabarito e revisão). */
  function answerText(ex) {
    if (ex.kind === 'choice' || ex.kind === 'listen') return ex.opts[0];
    if (ex.kind === 'fill') return filled(ex, ex.a[0]);
    if (ex.kind === 'build') return ex.a;
    if (ex.kind === 'dictation') return ex.say;
    if (ex.kind === 'order') return ex.items.join(' ');
    return '';
  }
  /** Frase para praticar em voz alta (ou null). */
  function practiceText(ex) {
    const t = ex.sp || (ex.kind === 'fill' ? filled(ex, ex.a[0]) : ex.kind === 'build' ? ex.a : (ex.kind === 'dictation' || ex.kind === 'listen') ? ex.say : null);
    return t ? plain(t) : null;
  }
  /** A resposta é uma frase em inglês (para o botão de ouvir)? */
  function speakAnswer(ex) {
    if (ex.kind === 'fill' || ex.kind === 'build' || ex.kind === 'dictation') return true;
    if (ex.kind === 'choice') return /⟦/.test(ex.opts[0]);
    return false;
  }
  function tiles(ex) { return ex.a.split(/\s+/).concat(ex.xw || []); }

  /* ------------------------------ Estado ------------------------------ */
  function blank(ex) {
    if (ex.kind === 'choice' || ex.kind === 'listen') return { sel: null };
    if (ex.kind === 'order') return { ord: shuffled(ex.items.length, ex.id + ':o') };
    if (ex.kind === 'classify') return { cat: {} };
    if (ex.kind === 'build') return { pick: [] };
    return { v: '' };
  }
  function solution(ex) {
    if (ex.kind === 'choice' || ex.kind === 'listen') return { sel: 0 };
    if (ex.kind === 'order') return { ord: ex.items.map(function (_, i) { return i; }) };
    if (ex.kind === 'classify') { const c = {}; ex.items.forEach(function (it, i) { c[i] = it[1]; }); return { cat: c }; }
    if (ex.kind === 'build') { const n = ex.a.split(/\s+/).length, order = shuffled(tiles(ex).length, ex.id + ':t'); const pick = []; for (let k = 0; k < n; k++) pick.push(order.indexOf(k)); return { pick: pick }; }
    if (ex.kind === 'fill') return { v: ex.a[0] };
    return { v: plain(ex.say) };
  }
  function load(ex, raw) {
    try {
      const s = JSON.parse(raw);
      if (s && typeof s === 'object') {
        if (ex.kind === 'order' && (!s.ord || s.ord.length !== ex.items.length)) return blank(ex);
        if (ex.kind === 'build' && !Array.isArray(s.pick)) return blank(ex);
        return s;
      }
    } catch (e) { /* rascunho antigo ou vazio */ }
    return blank(ex);
  }

  /* ------------------------------ Correção ------------------------------ */
  function grade(ex, s) {
    if (ex.kind === 'choice' || ex.kind === 'listen') {
      if (s.sel == null) return { status: 'empty', explain: 'Escolha uma das alternativas.' };
      if (s.sel === 0) return { status: 'correct' };
      const why = ex.w && ex.w[s.sel - 1];
      return { status: 'wrong', title: ex.kind === 'listen' ? 'Não foi isso que você ouviu' : 'Não é a melhor resposta', explain: why ? plain(why) + ' Tente de novo.' : ex.kind === 'listen' ? 'Ouça de novo, se precisar no modo devagar, e preste atenção nas palavras-chave.' : 'Releia a situação: qual opção é correta e natural para esse contexto?' };
    }
    if (ex.kind === 'order') {
      const good = s.ord.map(function (v, i) { return v === i; });
      const n = good.filter(Boolean).length;
      if (n === ex.items.length) return { status: 'correct', good: good };
      return { status: 'wrong', good: good, title: n + ' de ' + ex.items.length + ' falas na posição certa', explain: 'A primeira fala fora do lugar é a ' + (good.indexOf(false) + 1) + 'ª. Pense em como a conversa avança: quem pergunta, quem responde.' };
    }
    if (ex.kind === 'classify') {
      const left = ex.items.filter(function (_, i) { return s.cat[i] == null; }).length;
      if (left) return { status: 'empty', explain: 'Classifique todos os itens antes de verificar (faltam ' + left + ').' };
      const bad = ex.items.map(function (it, i) { return s.cat[i] !== it[1]; });
      const nb = bad.filter(Boolean).length;
      if (!nb) return { status: 'correct', bad: bad };
      return { status: 'wrong', bad: bad, title: (ex.items.length - nb) + ' de ' + ex.items.length + ' itens na categoria certa', explain: 'Os itens marcados em vermelho estão na categoria errada. Revise as frases-chave da aula.' };
    }
    if (ex.kind === 'build') {
      if (!s.pick.length) return { status: 'empty', explain: 'Toque nas palavras, na ordem certa, para montar a frase.' };
      const T = tiles(ex);
      const said = norm(s.pick.map(function (k) { return T[order(ex)[k]]; }).join(' '));
      const goods = [ex.a].concat(ex.alt || []).map(norm);
      if (goods.indexOf(said) >= 0) return { status: 'correct' };
      const want = ex.a.split(/\s+/).map(norm), got = s.pick.map(function (k) { return norm(T[order(ex)[k]]); });
      let pre = 0; while (pre < want.length && got[pre] === want[pre]) pre++;
      const extra = (ex.xw || []).map(norm).filter(function (w) { return got.indexOf(w) >= 0; });
      return { status: 'wrong', title: pre ? 'As ' + pre + ' primeiras palavras estão certas' : 'A frase ainda não está certa',
        explain: (extra.length ? 'Atenção: há palavra sobrando que não entra na frase. ' : '') + (got.length < want.length ? 'Faltam palavras. ' : '') + 'Revise a ordem: em inglês, a estrutura costuma ser sujeito + verbo + complemento (nas perguntas, o auxiliar vem antes do sujeito).' };
    }
    if (ex.kind === 'fill') {
      const v = String(s.v || '').trim();
      if (!v) return { status: 'empty', explain: 'Digite a palavra que completa a frase.' };
      const got = norm(filled(ex, v));
      const goods = ex.a.map(function (a) { return norm(filled(ex, a)); });
      if (goods.indexOf(got) >= 0) return { status: 'correct' };
      const near = ex.a.some(function (a) { return lev(norm(a), norm(v)) === 1 && norm(a).length > 3; });
      return { status: 'wrong', title: near ? 'Quase: confira a grafia' : 'Essa palavra não completa a frase', explain: near ? 'Falta ou sobra uma letra. Confira a grafia da palavra.' : 'Pense na regra da aula: qual palavra combina com o sujeito e com o tempo da frase?' };
    }
    // dictation
    const v = String(s.v || '').trim();
    if (!v) return { status: 'empty', explain: 'Ouça o áudio e escreva o que ouviu.' };
    if (ex.digits && v.replace(/\D/g, '') === ex.digits) return { status: 'correct' };
    const got = norm(v), goods = [ex.say].concat(ex.alt || []).map(norm);
    if (goods.indexOf(got) >= 0) return { status: 'correct' };
    const best = goods.reduce(function (m, g) { const d = lev(g, got); return d < m.d ? { d: d, g: g } : m; }, { d: 1e9, g: goods[0] });
    if (best.d <= (best.g.length < 20 ? 1 : Math.max(2, Math.floor(best.g.length / 20)))) return { status: 'correct', typo: true };
    const want = best.g.split(' '), gotW = got.split(' ');
    const right = want.filter(function (w, i) { return gotW[i] === w; }).length;
    return { status: 'wrong', title: right + ' de ' + want.length + ' palavras no lugar certo', explain: 'Ouça de novo (use o modo devagar) e confira palavra por palavra. Contrações como ⟦I\'m⟧ ou ⟦I am⟧ valem as duas.' };
  }
  const orders = {};
  function order(ex) { return orders[ex.id] || (orders[ex.id] = shuffled(tiles(ex).length, ex.id + ':t')); }

  /* --------------------------- Prática de fala --------------------------- */
  const SR = global.SpeechRecognition || global.webkitSpeechRecognition;
  function practiceHtml(text) {
    return '<section class="card glass en-practice"><header class="card-h"><h3 class="card-k">' + icon('mic') + 'Pratique em voz alta</h3><span class="muted sm">opcional</span></header>' +
      '<p class="en-model" lang="en">' + esc(text) + '</p>' +
      '<div class="help-row"><button type="button" class="btn btn-ghost sm" data-say="' + esc(text) + '">' + icon('volume') + 'Ouvir modelo</button><button type="button" class="btn btn-ghost sm" data-say="' + esc(text) + '" data-slow>' + icon('volume') + 'Devagar</button>' +
      (SR ? '<button type="button" class="btn btn-primary sm" data-speak>' + icon('mic') + 'Falar a frase</button>' : '') + '</div>' +
      '<p class="en-heard muted sm" aria-live="polite">' + (SR ? 'Toque em “Falar a frase” e repita em inglês. O microfone só é usado enquanto você fala.' : 'Ouça o modelo e repita em voz alta algumas vezes. (Este navegador não reconhece fala; no Chrome ou no Edge você recebe uma nota de pronúncia.)') + '</p></section>';
  }
  function bindPractice(host, text) {
    const btn = host.querySelector('[data-speak]'), out = host.querySelector('.en-heard');
    if (!btn || !SR) return;
    let rec = null;
    btn.onclick = function () {
      if (rec) { try { rec.stop(); } catch (e) { /* ignora */ } return; }
      if (global.Narrator) global.Narrator.stop(true);
      rec = new SR(); rec.lang = 'en-US'; rec.interimResults = false; rec.maxAlternatives = 3;
      btn.classList.add('rec'); btn.innerHTML = icon('mic') + 'Ouvindo… toque para parar';
      out.textContent = 'Fale agora…';
      rec.onresult = function (e) {
        const alts = Array.prototype.map.call(e.results[0], function (a) { return a.transcript; });
        const want = norm(text).split(' ');
        let best = { p: -1, t: '' };
        alts.forEach(function (t) { const got = norm(t).split(' '); const hit = want.filter(function (w) { return got.indexOf(w) >= 0; }).length; const p = Math.round(hit / want.length * 100); if (p > best.p) best = { p: p, t: t }; });
        out.innerHTML = '<b>Entendi:</b> “<span lang="en">' + esc(best.t) + '</span>” · ' + (best.p >= 85 ? '<span class="ok">' + best.p + '% das palavras. Muito bem!</span>' : best.p >= 60 ? '<span class="warn">' + best.p + '% das palavras. Quase: ouça o modelo e tente de novo.</span>' : '<span class="no">' + best.p + '% das palavras. Ouça o modelo devagar e repita por partes.</span>');
      };
      rec.onerror = function (e) { out.textContent = e.error === 'not-allowed' ? 'O microfone foi bloqueado. Libere o acesso nas configurações do navegador.' : e.error === 'no-speech' ? 'Não ouvi nada. Tente de novo, mais perto do microfone.' : 'Não foi possível reconhecer a fala agora (' + e.error + ').'; };
      rec.onend = function () { rec = null; btn.classList.remove('rec'); btn.innerHTML = icon('mic') + 'Falar a frase'; };
      try { rec.start(); } catch (e) { rec = null; out.textContent = 'Não foi possível usar o microfone.'; }
    };
  }

  /* -------------------------------- Tela -------------------------------- */
  function render(view, ex, ctx) {
    const st = ctx.st, S = ctx.S, G = global.Gamification;
    const solvedRec = st.progress.solved[ex.id];
    const xpVal = G.XP[ex.diff];
    const pack = global.Lessons.packOf(ex);
    const tags = pack.tags(ex);
    let state = solvedRec ? solution(ex) : load(ex, st.progress.drafts[ex.id]);
    const optOrder = (ex.kind === 'choice' || ex.kind === 'listen') ? shuffled(ex.opts.length, ex.id + ':c') : null;
    let marks = null;
    const audio = ex.kind === 'listen' || ex.kind === 'dictation';
    const kindHelp = { choice: 'Escolha uma alternativa', listen: 'Ouça e escolha', fill: 'Digite a palavra que falta', build: 'Toque nas palavras na ordem certa', dictation: 'Escreva o que ouviu', order: 'Use as setas para ordenar', classify: 'Escolha a categoria de cada item' }[ex.kind];

    view.innerHTML = ctx.header +
      '<div class="ex-grid gq en-x">' +
        '<div class="ex-brief">' +
          '<section class="card glass"><h3 class="card-k">Situação</h3><p class="story">' + R(ex.s) + '</p>' +
            '<div class="goal">' + icon('target') + '<div><h3 class="card-k">Sua missão</h3><p>' + R(ex.g) + '</p></div></div>' +
            '<ul class="xl-facts">' + tags.map(function (t) { return '<li>' + icon(t.icon) + esc(t.label) + '</li>'; }).join('') + '</ul>' +
          '</section>' +
          (audio ? '<section class="card glass en-audio"><header class="card-h"><h3 class="card-k">' + icon('headphones') + 'Áudio</h3><span class="muted sm">inglês</span></header>' +
            '<div class="en-play"><button type="button" class="en-big" data-say="' + esc(plain(ex.say)) + '" aria-label="Ouvir o áudio">' + icon('play') + '</button>' +
            '<div><b>Toque para ouvir</b><span class="muted sm">Ouça quantas vezes quiser.</span><button type="button" class="link-btn" data-say="' + esc(plain(ex.say)) + '" data-slow>' + icon('volume') + 'Ouvir devagar</button></div></div>' +
            '<p class="en-novoice muted sm" hidden>' + icon('bulb') + 'Este aparelho não tem voz em inglês. <button type="button" class="link-btn" data-show-text>Mostrar o texto do áudio</button></p><p class="en-transcript" lang="en" hidden></p></section>' : '') +
          '<section class="card glass hint-card"><header class="card-h"><h3 class="card-k">Ajuda</h3></header>' +
            '<div class="help-row"><button class="btn btn-ghost sm" id="b-hint">' + icon('bulb') + 'Ver dica</button><button class="btn btn-ghost sm" id="b-solution">' + icon('eye') + 'Gabarito</button></div>' +
            '<div id="help-out"></div>' +
          '</section>' +
        '</div>' +
        '<div class="ex-work">' +
          '<section class="card glass gq-answer">' +
            '<header class="editor-h"><span class="ed-title">' + icon('check') + 'Sua resposta</span><span class="muted sm hide-sm">' + esc(kindHelp) + '</span></header>' +
            '<div id="gq-input" class="gq-input"></div>' +
            '<div class="editor-actions"><button class="btn btn-primary" id="b-submit">' + icon('send') + 'Verificar resposta</button><button class="btn btn-quiet" id="b-clear">' + icon('eraser') + 'Limpar</button></div>' +
          '</section>' +
          '<section id="feedback" aria-live="polite"></section>' +
          '<section id="gq-why"></section>' +
          '<div id="en-practice"></div>' +
        '</div>' +
      '</div>';

    const host = view.querySelector('#gq-input'), fb = view.querySelector('#feedback'), why = view.querySelector('#gq-why'), prac = view.querySelector('#en-practice');
    let draftTimer = null;
    function save() { clearTimeout(draftTimer); draftTimer = setTimeout(function () { st.progress.drafts[ex.id] = JSON.stringify(state); S.save(); }, 300); }
    ctx.setCleanup(function () { if (global.Narrator) global.Narrator.stop(true); clearTimeout(draftTimer); st.progress.drafts[ex.id] = JSON.stringify(state); S.save(); });
    function changed() { marks = null; save(); paint(); }

    // sem voz inglesa nem áudio gravado: oferece o texto
    if (audio) {
      const checkVoice = function () { const N = global.Narrator; const nv = view.querySelector('.en-novoice'); if (nv) nv.hidden = !!(N && N.hasEnglish); };
      setTimeout(checkVoice, 900);
      const sb = view.querySelector('[data-show-text]');
      if (sb) sb.onclick = function () { const tr = view.querySelector('.en-transcript'); tr.textContent = plain(ex.say); tr.hidden = false; };
    }

    /* ---- Desenho da resposta ---- */
    function paint() {
      if (ex.kind === 'choice' || ex.kind === 'listen') {
        host.innerHTML = '<div class="gq-opts" role="radiogroup" aria-label="Alternativas">' + optOrder.map(function (oi, k) {
          const on = state.sel === oi;
          return '<button type="button" class="gq-opt' + (on ? ' on' : '') + '" role="radio" aria-checked="' + on + '" data-o="' + oi + '">' +
            '<span class="gq-let">' + LET[k] + '</span><span>' + R(ex.opts[oi]) + '</span></button>';
        }).join('') + '</div>';
        host.querySelectorAll('.gq-opt').forEach(function (b) {
          b.onclick = function () { state.sel = +b.dataset.o; changed(); const nb = host.querySelector('[data-o="' + b.dataset.o + '"]'); if (nb) nb.focus(); };
        });
      } else if (ex.kind === 'order') {
        host.innerHTML = '<ol class="gq-order">' + state.ord.map(function (oi, pos) {
          const ok = marks && marks.good ? (marks.good[pos] ? ' good' : ' bad') : '';
          return '<li class="gq-oi' + ok + '" data-p="' + pos + '" tabindex="0" aria-label="Posição ' + (pos + 1) + ': ' + esc(plain(ex.items[oi])) + '. Use Alt + seta para mover.">' +
            '<span class="gq-n">' + (pos + 1) + '</span><span class="gq-ot">' + R(ex.items[oi]) + '</span>' +
            '<span class="gq-mv"><button type="button" class="icon-btn sm" data-mv="-1" aria-label="Subir"' + (pos ? '' : ' disabled') + '>' + icon('chevR', 'up') + '</button>' +
            '<button type="button" class="icon-btn sm" data-mv="1" aria-label="Descer"' + (pos < state.ord.length - 1 ? '' : ' disabled') + '>' + icon('chevR', 'down') + '</button></span></li>';
        }).join('') + '</ol>';
        const move = function (pos, d) {
          const np = pos + d; if (np < 0 || np >= state.ord.length) return;
          const t = state.ord[pos]; state.ord[pos] = state.ord[np]; state.ord[np] = t;
          changed();
          const li = host.querySelector('[data-p="' + np + '"]'); if (li) li.focus();
        };
        host.querySelectorAll('.gq-oi').forEach(function (li) {
          const pos = +li.dataset.p;
          li.querySelectorAll('[data-mv]').forEach(function (b) { b.onclick = function (e) { e.stopPropagation(); move(pos, +b.dataset.mv); }; });
          li.onkeydown = function (e) { if (e.altKey && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) { e.preventDefault(); move(pos, e.key === 'ArrowUp' ? -1 : 1); } };
        });
      } else if (ex.kind === 'classify') {
        host.innerHTML = '<ul class="gq-cls">' + ex.items.map(function (it, i) {
          const cur = state.cat[i];
          const mk = marks && marks.bad ? (marks.bad[i] ? ' bad' : ' good') : '';
          return '<li class="gq-ci' + mk + '"><span class="gq-ct">' + R(it[0]) + '</span><div class="gq-chips" role="radiogroup" aria-label="Categoria de: ' + esc(plain(it[0])) + '">' + ex.cats.map(function (c, k) { return '<button type="button" class="gq-chip' + (cur === k ? ' on' : '') + '" role="radio" aria-checked="' + (cur === k) + '" data-i="' + i + '" data-k="' + k + '">' + R(c) + '</button>'; }).join('') + '</div></li>';
        }).join('') + '</ul>';
        host.querySelectorAll('.gq-chip').forEach(function (b) { b.onclick = function () { state.cat[+b.dataset.i] = +b.dataset.k; changed(); const nb = host.querySelector('.gq-chip[data-i="' + b.dataset.i + '"][data-k="' + b.dataset.k + '"]'); if (nb) nb.focus(); }; });
      } else if (ex.kind === 'build') {
        const T = tiles(ex), ord = order(ex);
        const used = {}; state.pick.forEach(function (k) { used[k] = 1; });
        host.innerHTML = '<div class="en-built' + (marks ? (marks.status === 'correct' ? ' good' : ' bad') : '') + '" aria-label="Sua frase">' +
            (state.pick.length ? state.pick.map(function (k, i) { return '<button type="button" class="en-tile in" data-out="' + i + '" lang="en" aria-label="Remover: ' + esc(T[ord[k]]) + '">' + esc(T[ord[k]]) + '</button>'; }).join('') : '<span class="muted sm">Toque nas palavras abaixo para montar a frase.</span>') +
          '</div>' +
          '<div class="en-bank" aria-label="Palavras disponíveis">' + ord.map(function (ti, k) { return used[k] ? '<span class="en-tile ghost" aria-hidden="true">' + esc(T[ti]) + '</span>' : '<button type="button" class="en-tile" data-in="' + k + '" lang="en">' + esc(T[ti]) + '</button>'; }).join('') + '</div>' +
          '<div class="help-row"><button type="button" class="btn btn-quiet sm" data-undo' + (state.pick.length ? '' : ' disabled') + '>' + icon('backspace') + 'Desfazer</button>' + (state.pick.length ? '<button type="button" class="btn btn-quiet sm" data-say="' + esc(state.pick.map(function (k) { return T[ord[k]]; }).join(' ')) + '">' + icon('volume') + 'Ouvir minha frase</button>' : '') + '</div>';
        host.querySelectorAll('[data-in]').forEach(function (b) { b.onclick = function () { state.pick.push(+b.dataset.in); changed(); const nb = host.querySelector('[data-in]'); if (nb) nb.focus(); }; });
        host.querySelectorAll('[data-out]').forEach(function (b) { b.onclick = function () { state.pick.splice(+b.dataset.out, 1); changed(); }; });
        host.querySelector('[data-undo]').onclick = function () { state.pick.pop(); changed(); };
      } else if (ex.kind === 'fill') {
        const parts = String(ex.q).split(/_{2,}/);
        host.innerHTML = '<p class="en-fill" lang="en">' + esc(parts[0]) + '<input id="en-blank" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Palavra que falta" value="' + esc(state.v) + '" size="' + Math.max(6, (ex.a[0] || '').length + 2) + '">' + esc(parts[1] || '') + '</p>' +
          '<p class="muted sm">Digite só a palavra (ou palavras) que falta. Maiúsculas e contrações não fazem diferença.</p>';
        const inp = host.querySelector('#en-blank');
        inp.oninput = function () { state.v = inp.value; marks = null; save(); };
        inp.onkeydown = function (e) { if (e.key === 'Enter') { e.preventDefault(); doSubmit(); } };
      } else {
        host.innerHTML = '<textarea id="en-dict" class="en-dict" rows="3" autocomplete="off" autocapitalize="sentences" spellcheck="false" lang="en" placeholder="Escreva aqui o que você ouviu…">' + esc(state.v) + '</textarea>' +
          '<p class="muted sm">Pontuação, maiúsculas e contrações não contam. Números podem ir em algarismos.</p>';
        const ta = host.querySelector('#en-dict');
        ta.oninput = function () { state.v = ta.value; marks = null; save(); };
        ta.onkeydown = function (e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); doSubmit(); } };
      }
    }

    function explainHtml(title, extra) {
      const ans = ex.kind === 'classify' || ex.kind === 'order' ? '' : answerText(ex);
      return '<div class="card glass gq-why-card"><h3 class="card-k">' + icon('bulb') + esc(title) + '</h3>' +
        (ans && ex.kind !== 'listen' ? '<p class="gq-ans en-ans">' + R(ans) + (speakAnswer(ex) ? ' <button type="button" class="en-say" data-say="' + esc(plain(ans)) + '" aria-label="Ouvir a resposta">' + icon('volume') + '</button>' : '') + '</p>' : '') +
        (audio ? '<p class="en-ans muted sm">Áudio: “<span lang="en">' + esc(plain(ex.say)) + '</span>” <button type="button" class="en-say" data-say="' + esc(plain(ex.say)) + '" aria-label="Ouvir de novo">' + icon('volume') + '</button></p>' : '') +
        (extra || '') + '<p>' + R(ex.x) + '</p></div>';
    }
    function showPractice() {
      const t = practiceText(ex);
      if (!t) { prac.innerHTML = ''; return; }
      prac.innerHTML = practiceHtml(t);
      bindPractice(prac, t);
    }

    function errorPanel(r) {
      const tries = st.progress.attempts[ex.id] || 0;
      if (r.status === 'empty') { fb.innerHTML = '<div class="fb fb-warn glass"><div class="fb-h">' + icon('bulb') + '<div><b>Resposta incompleta</b><span>' + esc(r.explain) + '</span></div></div></div>'; return; }
      fb.innerHTML = '<div class="fb fb-err glass">' +
        '<div class="fb-h">' + icon('x') + '<div><b>❌ Resposta incorreta</b><span>' + esc(r.title || '') + '</span></div></div>' +
        '<p class="fb-explain">' + R(r.explain) + '</p>' +
        '<div class="fb-actions"><button class="btn btn-primary sm" data-a="retry">' + icon('refresh') + 'Tentar novamente</button><button class="btn btn-quiet sm" data-a="clear">' + icon('eraser') + 'Limpar resposta</button></div>' +
        (tries >= 2 && !st.progress.solved[ex.id] ? '<p class="fb-tip">' + icon('bulb') + (tries >= 3 ? 'Travou? A dica e o gabarito estão em Ajuda (o gabarito vale metade do XP).' : 'Experimente a dica no painel Ajuda.') + '</p>' : '') +
        '</div>';
      fb.querySelector('[data-a=retry]').onclick = function () { fb.innerHTML = ''; const f = host.querySelector('input, textarea, button'); if (f) f.focus(); };
      fb.querySelector('[data-a=clear]').onclick = clear;
    }

    function doSubmit() {
      const r = grade(ex, state);
      if (r.status === 'empty') { errorPanel(r); return; }
      st.progress.attempts[ex.id] = (st.progress.attempts[ex.id] || 0) + 1;
      st.progress.drafts[ex.id] = JSON.stringify(state);
      marks = r; paint();
      if (r.status !== 'correct') { st.progress.firstTryStreak = 0; S.save(); if (global.Sfx) global.Sfx.answer('no'); why.innerHTML = ''; errorPanel(r); return; }
      ctx.onSolved(fb, '✅ Resposta correta', r.typo ? 'Certo! Só confira a grafia na resposta abaixo.' : { choice: 'Resposta correta e natural para a situação.', listen: 'Você entendeu o áudio.', fill: 'A frase ficou completa e correta.', build: 'Frase montada na ordem certa.', dictation: 'Você escreveu exatamente o que ouviu.', order: 'O diálogo está na ordem certa.', classify: 'Todos os itens na categoria certa.' }[ex.kind]);
      why.innerHTML = explainHtml('Por que esta é a resposta');
      showPractice();
    }
    function clear() { state = blank(ex); marks = null; fb.innerHTML = ''; why.innerHTML = ''; save(); paint(); }
    view.querySelector('#b-submit').onclick = doSubmit;
    view.querySelector('#b-clear').onclick = clear;
    view.addEventListener('keydown', function (e) { if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); doSubmit(); } });

    /* ---- Ajuda ---- */
    const helpOut = view.querySelector('#help-out');
    view.querySelector('#b-hint').onclick = function () {
      const les = global.Lessons.forExercise(ex);
      helpOut.innerHTML = '<p class="help-txt">' + icon('bulb') + R(ex.h || ('Revise a aula “' + les.titulo + '”: ' + les.notas[0])) + '</p>';
    };
    view.querySelector('#b-solution').onclick = function () {
      const reveal = function () {
        st.progress.revealed[ex.id] = true; S.save();
        let ans;
        if (ex.kind === 'order') ans = '<ol class="gq-anslist num">' + ex.items.map(function (t) { return '<li>' + R(t) + '</li>'; }).join('') + '</ol>';
        else if (ex.kind === 'classify') ans = '<ul class="gq-anslist">' + ex.items.map(function (it) { return '<li><span>' + R(it[0]) + '</span><b>' + R(ex.cats[it[1]]) + '</b></li>'; }).join('') + '</ul>';
        else ans = '<p class="gq-ans" lang="en">' + icon('check') + R(answerText(ex)) + '</p>';
        helpOut.innerHTML = ans + '<p class="muted sm">' + R(ex.x) + '</p><button class="btn btn-ghost sm" id="b-fill">' + icon('copy') + 'Preencher a resposta</button>';
        helpOut.querySelector('#b-fill').onclick = function () { state = solution(ex); marks = null; save(); paint(); };
      };
      if (st.progress.solved[ex.id] || st.progress.revealed[ex.id]) return reveal();
      helpOut.innerHTML = '<div class="confirm"><p>Ver o gabarito reduz o XP deste exercício para <b>' + Math.round(xpVal / 2) + ' XP</b>. Deseja continuar?</p>' +
        '<div class="help-row"><button class="btn btn-primary sm" id="b-yes">Mostrar gabarito</button><button class="btn btn-quiet sm" id="b-no">Cancelar</button></div></div>';
      helpOut.querySelector('#b-yes').onclick = reveal;
      helpOut.querySelector('#b-no').onclick = function () { helpOut.innerHTML = ''; };
    };

    paint();
    if (solvedRec) { why.innerHTML = explainHtml('Por que esta é a resposta'); showPractice(); }
    setTimeout(function () { const f = host.querySelector('input, textarea, .gq-opt, .gq-oi, .gq-chip, .en-tile'); if (f && global.innerWidth > 900) f.focus({ preventScroll: true }); }, 60);
  }

  global.EnPractice = { render: render, grade: grade, solution: solution, blank: blank, norm: norm, answerText: answerText, practiceText: practiceText, speakAnswer: speakAnswer, tiles: tiles };
})(window);
