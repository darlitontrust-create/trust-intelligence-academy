/* =====================================================================
   deck.js — Exporta o conteúdo como apresentação do PowerPoint (.pptx)
   ---------------------------------------------------------------------
   • Deck.export(t, scope): scope = { kind: 'course' } | { kind: 'level', lv }
     | { kind: 'stage', lv, stage } | { kind: 'lesson', key }.
   • Conteúdo adaptado para slides (16:9): capa (nome do curso, logo do curso
     e logo da plataforma), agenda, divisória por etapa e, para cada aula,
     Conceito · Como fazer · Lado a lado (se houver) · Exemplo e cuidados,
     com notas do apresentador. Fecha com um slide de encerramento.
   • Transição "Transformar" (Morph) em todos os slides: os elementos que se
     repetem (faixa, brilho, logo, títulos) têm o mesmo nome (!!nome) e
     deslizam de um slide para o outro. O PptxGenJS não escreve transições,
     então o arquivo é reaberto com o JSZip (que vem no mesmo pacote) e a
     transição é inserida no XML de cada slide. Versões antigas do PowerPoint
     sem Morph usam Esmaecer (fallback).
   • Visuais: o exemplo ao vivo de cada aula (tabela de resultado, planilha,
     gráfico, saída do Python…) e os visuais dos exercícios entram como imagem,
     renderizados com o próprio CSS da plataforma (html-to-image), no tema escuro.
     Quando a aula tem visual, os cuidados ganham um slide próprio com o erro
     comum, para nenhum slide ficar com área vazia.
   • Bibliotecas (carregadas só quando o usuário exporta): assets/vendor/
     pptxgen.bundle.js (PptxGenJS 4, MIT, inclui o JSZip) e html-to-image.js (MIT).
   ===================================================================== */
(function (global) {
  'use strict';
  const LV = { 1: 'Iniciante', 2: 'Intermediário', 3: 'Avançado' };
  const W = 13.333, H = 7.5;
  const C = { bg: '0B0F1A', panel: '141A2B', panel2: '1B2236', code: '070A12', ink: 'EEF1FA', ink2: 'C3C9DE', ink3: '8C93AE', line: '2A3350' };
  const FONT = 'Segoe UI', SERIF = 'Georgia', MONO = 'Consolas';

  /* ------------------------------ utilidades ------------------------------ */
  const plain = function (s) { return String(s == null ? '' : s).replace(/[⟦⟧]/g, ''); };
  const hex = function (c) { return String(c || '#4d7cff').replace('#', '').toUpperCase(); };
  function loadScript(src) {
    return new Promise(function (ok, fail) {
      const s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = function () { fail(new Error('Não foi possível carregar ' + src)); };
      document.head.appendChild(s);
    });
  }
  function lib() {
    return Promise.all([
      global.PptxGenJS ? 1 : loadScript('assets/vendor/pptxgen.bundle.js'),
      global.htmlToImage ? 1 : loadScript('assets/vendor/html-to-image.js'),
    ]);
  }

  /* ------------------------- visuais como imagem ------------------------- */
  function lines(txt) { return String(txt || '').replace(/\n+$/, '').split('\n').length; }
  /** Renderiza um trecho de HTML da plataforma (com o CSS dela) como PNG. */
  async function shot(stage, html, width) {
    stage.style.width = width + 'px';
    stage.innerHTML = html;
    await new Promise(function (r) { requestAnimationFrame(function () { requestAnimationFrame(r); }); });
    const node = stage.firstElementChild;
    if (!node || !node.offsetHeight) return null;
    // sem rolagem: tudo cresce até mostrar o conteúdo inteiro
    node.querySelectorAll('*').forEach(function (el) {
      const cs = getComputedStyle(el);
      if (/(auto|scroll|hidden)/.test(cs.overflow + cs.overflowX + cs.overflowY) && el.tagName !== 'svg') { el.style.setProperty('overflow', 'visible', 'important'); }
      if (cs.maxHeight !== 'none') el.style.setProperty('max-height', 'none', 'important');
      if (cs.maxWidth !== 'none' && el.tagName !== 'IMG') el.style.setProperty('max-width', 'none', 'important');
    });
    // tabelas: primeira coluna (rótulos) à esquerda, valores centralizados
    node.querySelectorAll('table').forEach(function (tb) {
      tb.style.setProperty('width', '100%', 'important');
      tb.querySelectorAll('tr').forEach(function (tr) {
        Array.prototype.forEach.call(tr.children, function (c, i) {
          const first = i === 0 && tr.children.length > 1 && !/^[\s\d.,%R$+\-−()]+$/.test(c.textContent.trim());
          c.style.setProperty('text-align', first ? 'left' : 'center', 'important');
          // textos curtos e números ficam numa linha só; frases longas quebram para a tabela não ficar estreita demais
          c.style.setProperty('white-space', c.textContent.trim().length > 22 ? 'normal' : 'nowrap', 'important');
          if (c.textContent.trim().length > 22) c.style.setProperty('min-width', '150px', 'important');
        });
      });
    });
    await new Promise(function (r) { requestAnimationFrame(r); });
    // se uma tabela larga passar da largura, a área cresce junto (nada fica cortado)
    const inner = Math.max.apply(null, [node.scrollWidth].concat(Array.prototype.map.call(node.querySelectorAll('table'), function (t) { return t.scrollWidth + 40; })));
    if (inner > node.offsetWidth) { stage.style.width = inner + 'px'; await new Promise(function (r) { requestAnimationFrame(r); }); }
    const w = node.offsetWidth, h = node.offsetHeight;
    try {
      const data = await global.htmlToImage.toPng(node, { pixelRatio: 2, backgroundColor: '#121829', skipFonts: true, cacheBust: false, width: w, height: h });
      return { data: data, w: w, h: h };
    } catch (e) { return null; }
  }
  /** Gera as imagens de todas as aulas do escopo: exemplo ao vivo + visuais dos exercícios. */
  async function visuals(t, keys, onStep) {
    const L = global.Lessons, pack = L.PACKS[t.id], ix = global.Library.index(t.id), out = {};
    const de = document.documentElement, theme = de.getAttribute('data-theme');
    const stage = document.createElement('div');
    stage.className = 'deck-stage';
    stage.setAttribute('aria-hidden', 'true');
    document.body.appendChild(stage);
    if (theme === 'light') de.removeAttribute('data-theme');      // os slides são escuros: renderiza no tema escuro
    try {
      for (let i = 0; i < keys.length; i++) {
        const k = keys[i], it = ix.byKey[k], les = it.les, v = { code: '', ex: null, figs: [] };
        if (onStep) onStep(i + 1, keys.length);
        let exm = null;
        try { exm = pack.example(les, it.exs[0]); } catch (e) { exm = null; }
        if (exm) {
          v.code = typeof exm.code === 'string' ? exm.code : '';
          if (exm.liveHtml && !/^\s*<p class="muted">/.test(exm.liveHtml)) v.ex = await shot(stage, '<div class="lesson deck-shot"><div class="ls-live">' + exm.liveHtml + '</div></div>', !v.code ? 600 : 560);
        }
        const figs = global.Library.figuresOf ? global.Library.figuresOf(t, it.exs) : [];
        for (const f of figs) {
          const img = await shot(stage, '<div class="deck-shot"><div class="gq-data">' + f.html + '</div></div>', /<table/i.test(f.html) && !/<svg/i.test(f.html) ? 440 : 600);
          if (img) { img.title = f.ex.n; img.sub = 'Exercício ' + f.ex.pos + ' · Nível ' + LV[f.ex.level]; v.figs.push(img); }
        }
        out[k] = v;
      }
    } finally {
      if (theme === 'light') de.setAttribute('data-theme', 'light');
      stage.remove();
    }
    return out;
  }
  function imgData(src) {
    return new Promise(function (ok) {
      const im = new Image(); im.onload = function () { const cv = document.createElement('canvas'); cv.width = im.naturalWidth; cv.height = im.naturalHeight; cv.getContext('2d').drawImage(im, 0, 0); ok(cv.toDataURL('image/png')); };
      im.onerror = function () { ok(null); }; im.src = src;
    });
  }
  /** Logo do curso: selo arredondado com o gradiente da trilha e o ícone dela em branco. */
  function courseBadge(t) {
    return new Promise(function (ok) {
      const S = 256, cv = document.createElement('canvas'); cv.width = cv.height = S;
      const c = cv.getContext('2d'), g = c.createLinearGradient(0, 0, S, S);
      g.addColorStop(0, t.color.a); g.addColorStop(1, t.color.b);
      c.fillStyle = g; c.beginPath();
      const r = 60; c.moveTo(r, 0); c.arcTo(S, 0, S, S, r); c.arcTo(S, S, 0, S, r); c.arcTo(0, S, 0, 0, r); c.arcTo(0, 0, S, 0, r); c.fill();
      const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="300" height="300" fill="none" stroke="#ffffff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' + ((global.UI.ICON_PATHS || {})[t.icon] || '') + '</svg>';
      const im = new Image();
      im.onload = function () { c.drawImage(im, 53, 53, 150, 150); ok(cv.toDataURL('image/png')); };
      im.onerror = function () { ok(cv.toDataURL('image/png')); };
      im.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    });
  }
  /** Altura estimada (pol.) de um texto numa caixa de largura w com a fonte fs. */
  function estH(text, w, fs, mono) {
    const cw = fs / 72 * (mono ? 0.6 : 0.5), lh = fs / 72 * 1.32, perLine = Math.max(8, Math.floor((w - 0.3) / cw));
    return String(text).split('\n').reduce(function (a, l) { return a + Math.max(1, Math.ceil(l.length / perLine)); }, 0) * lh;
  }
  /** Tamanho de fonte que cabe na caixa (estimativa por linhas e caracteres). */
  function fitSize(text, w, h, max, min, mono) {
    const lines = String(text).split('\n');
    for (let fs = max; fs >= min; fs -= 1) {
      const cw = fs / 72 * (mono ? 0.6 : 0.5), lh = fs / 72 * 1.32;
      const perLine = Math.max(8, Math.floor((w - 0.3) / cw));
      const n = lines.reduce(function (a, l) { return a + Math.max(1, Math.ceil(l.length / perLine)); }, 0);
      if (n * lh <= h - 0.2) return fs;
    }
    return min;
  }
  function bullets(list) { return (list || []).map(function (x) { return plain(x); }).filter(Boolean); }

  /* ------------------------------- montagem ------------------------------- */
  function build(t, scope, assets) {
    const P = new global.PptxGenJS();
    P.layout = 'LAYOUT_WIDE';
    P.author = 'Trust Intelligence Academy'; P.company = 'Trust Intelligence Academy';
    P.title = t.nome;
    const A = hex(t.color.a), B = hex(t.color.b);
    const L = global.Lessons, ix = global.Library.index(t.id), pack = L.PACKS[t.id];

    // elementos comuns, com nomes fixos para a transição Transformar
    function frame(s, o) {
      o = o || {};
      s.background = { color: C.bg };
      s.addShape(P.ShapeType.ellipse, { objectName: '!!glow', x: o.glowX == null ? 9.2 : o.glowX, y: o.glowY == null ? -2.4 : o.glowY, w: o.glowW || 6.4, h: o.glowW || 6.4, fill: { color: A, transparency: 86 }, line: { type: 'none' } });
      s.addShape(P.ShapeType.ellipse, { objectName: '!!glow2', x: o.glow2X == null ? -2.2 : o.glow2X, y: o.glow2Y == null ? 5.2 : o.glow2Y, w: 4.6, h: 4.6, fill: { color: B, transparency: 90 }, line: { type: 'none' } });
      if (assets.logo) s.addImage({ objectName: '!!logo', data: assets.logo, x: o.logoX == null ? W - 1.05 : o.logoX, y: o.logoY == null ? 0.32 : o.logoY, w: o.logoW || 0.62, h: o.logoW || 0.62 });
      if (!o.cover) {
        s.addShape(P.ShapeType.rect, { objectName: '!!bar', x: 0.55, y: 0.5, w: 0.09, h: 0.62, fill: { color: A }, line: { type: 'none' } });
        if (assets.badge) s.addImage({ objectName: '!!badge', data: assets.badge, x: 0.55, y: H - 0.62, w: 0.32, h: 0.32 });
        s.addText(t.nome + '  ·  Trust Intelligence Academy', { objectName: '!!foot', x: 0.95, y: H - 0.66, w: 8, h: 0.4, fontFace: FONT, fontSize: 10, color: C.ink3 });
      }
    }
    function head(s, kicker, title, kw) {
      s.addText(kicker.toUpperCase(), { objectName: '!!kicker', x: 0.8, y: 0.42, w: 10.6, h: 0.32, fontFace: FONT, fontSize: 11, bold: true, color: A, charSpacing: 2 });
      const parts = kw && title.indexOf(':') > 0 ? [{ text: title.split(':')[0], options: { color: A, italic: true } }, { text: ':' + title.split(':').slice(1).join(':'), options: { color: C.ink } }] : [{ text: title, options: { color: C.ink } }];
      s.addText(parts, { objectName: '!!title', x: 0.8, y: 0.72, w: 11.2, h: 0.75, fontFace: SERIF, fontSize: fitSize(title, 11.2, 0.75, 32, 22), valign: 'middle', margin: 0 });
    }
    /* grade dos slides: margens, colunas e respiro iguais em todos os slides */
    const X0 = 0.8, X1 = W - 0.8, GAP = 0.25, TOP = 1.65, BOT = 5.65, RES_Y = 5.9, END = 6.55;
    const LW = 7.45, RX = X0 + LW + GAP, RW = X1 - RX;      // coluna esquerda e direita
    /** Parágrafo: justificado quando é longo. */
    function para(s, txt, x, y, w, h, o) {
      const t2 = plain(txt), fs = fitSize(t2, w, h, o.max || 18, o.min || 10);
      s.addText(o.runs || t2, Object.assign({ x: x, y: y, w: w, h: h, fontFace: FONT, fontSize: fs, color: o.color || C.ink, valign: o.valign || 'top', margin: 0, align: t2.length > 110 ? 'justify' : 'left', paraSpaceAfter: 4 }, o.extra || {}));
      return fs;
    }
    function box(s, x, y, w, h, fill, lineC) { s.addShape(P.ShapeType.roundRect, { x: x, y: y, w: w, h: h, rectRadius: 0.12, fill: { color: fill || C.panel }, line: { color: lineC || C.line, width: 0.75 } }); }
    function label(s, txt, x, y, w, color) { s.addText(txt.toUpperCase(), { x: x, y: y, w: w, h: 0.3, fontFace: FONT, fontSize: 10, bold: true, color: color || C.ink3, charSpacing: 2, margin: 0 }); }
    function list(s, items, x, y, w, h, o) {
      if (!items.length) return;
      const txt = items.join('\n');
      const fs = fitSize(txt, w - 0.3, h - items.length * 0.09, Math.min((o && o.max) || 16, 17), 10);   // desconta o recuo do marcador e o espaço entre itens
      s.addText(items.map(function (b) { return { text: b, options: { bullet: { indent: 16 }, paraSpaceAfter: 6 } }; }), { x: x, y: y, w: w, h: h, fontFace: FONT, fontSize: fs, color: (o && o.color) || C.ink2, valign: 'top', margin: 0.05 });
    }
    function code(s, txt, x, y, w, h, name) {
      box(s, x, y, w, h, C.code, '262E48');
      s.addShape(P.ShapeType.ellipse, { x: x + 0.2, y: y + 0.17, w: 0.12, h: 0.12, fill: { color: 'F87171' }, line: { type: 'none' } });
      s.addShape(P.ShapeType.ellipse, { x: x + 0.38, y: y + 0.17, w: 0.12, h: 0.12, fill: { color: 'FBBF24' }, line: { type: 'none' } });
      s.addShape(P.ShapeType.ellipse, { x: x + 0.56, y: y + 0.17, w: 0.12, h: 0.12, fill: { color: '34D399' }, line: { type: 'none' } });
      if (name) s.addText(name, { x: x + 0.8, y: y + 0.08, w: w - 1, h: 0.3, fontFace: MONO, fontSize: 9, color: C.ink3, margin: 0 });
      const t2 = plain(txt);
      s.addText(t2, { x: x + 0.15, y: y + 0.45, w: w - 0.3, h: h - 0.55, fontFace: MONO, fontSize: fitSize(t2, w - 0.3, h - 0.55, 17, 9, true), color: 'E8EBF6', valign: 'top', margin: 0.05, paraSpaceAfter: 2 });
    }
    function picture(s, img, x, y, w, h) {
      const k = Math.min(w / img.w, h / img.h), iw = img.w * k, ih = img.h * k;
      s.addImage({ data: img.data, x: x + (w - iw) / 2, y: y + (h - ih) / 2, w: iw, h: ih });
    }
    function errBox(s, e, x, y, w, h) {
      box(s, x, y, w, h, C.panel, 'FBBF24');
      label(s, e.c ? 'Erro comum' : 'Equívoco comum', x + 0.25, y + 0.2, w - 0.5, 'FBBF24');
      let yy = y + 0.6;
      if (e.c) { box(s, x + 0.25, yy, w - 0.5, 0.75, C.code, '262E48'); s.addText(plain(e.c), { x: x + 0.35, y: yy, w: w - 0.7, h: 0.75, fontFace: MONO, fontSize: fitSize(e.c, w - 0.7, 0.75, 13, 8, true), color: 'E8EBF6', valign: 'middle', margin: 0 }); yy += 0.9; if (e.m) { s.addText(plain(e.m), { x: x + 0.25, y: yy, w: w - 0.5, h: 0.45, fontFace: MONO, fontSize: 11, color: 'F87171', margin: 0 }); yy += 0.5; } }
      else if (e.q) { s.addText('“' + plain(e.q) + '”', { x: x + 0.25, y: yy, w: w - 0.5, h: 0.9, fontFace: FONT, fontSize: fitSize(e.q, w - 0.5, 0.9, 18, 11), italic: true, color: C.ink, valign: 'top', margin: 0 }); yy += 1.0; }
      const rest = y + h - yy - 0.15;
      s.addText([{ text: 'Por quê: ', options: { bold: true, color: 'FBBF24' } }, { text: plain(e.y || ''), options: { color: C.ink2, breakLine: true } }, { text: 'Faça assim: ', options: { bold: true, color: '34D399' } }, { text: plain(e.x || ''), options: { color: C.ink2 } }],
        { x: x + 0.25, y: yy, w: w - 0.5, h: rest, fontFace: FONT, fontSize: fitSize((e.y || '') + '\n' + (e.x || ''), w - 0.5, rest, 17, 10), valign: 'top', margin: 0, paraSpaceAfter: 6, align: 'justify' });
    }
    function resumo(s, txt, y) {
      if (!txt) return;
      box(s, X0, y, X1 - X0, 0.62, C.panel2, A);
      s.addText([{ text: 'Em resumo   ', options: { bold: true, color: A } }, { text: plain(txt), options: { color: C.ink } }], { x: X0 + 0.25, y: y, w: X1 - X0 - 0.5, h: 0.62, fontFace: FONT, fontSize: fitSize(txt, W - 4, 0.62, 15, 11), valign: 'middle', margin: 0 });
    }
    function flowRow(s, f, y) {
      if (!f || f.length < 2) return;
      const steps = f.slice(1), n = steps.length, gap = 0.12, w = (W - 1.6 - gap * (n - 1)) / n;
      label(s, plain(f[0]), 0.8, y - 0.36, 8);
      steps.forEach(function (st, i) {
        const hot = /^[*!]/.test(st), txt = plain(st.replace(/^[*!]/, '').split('|')[0]);
        s.addShape(P.ShapeType.chevron, { x: 0.8 + i * (w + gap), y: y, w: w, h: 0.62, fill: { color: hot ? A : C.panel2 }, line: { color: hot ? A : C.line, width: 0.75 } });
        s.addText(txt, { x: 0.8 + i * (w + gap) + 0.22, y: y, w: w - 0.44, h: 0.62, fontFace: FONT, fontSize: fitSize(txt, w - 0.44, 0.62, 13, 9), bold: hot, color: hot ? '0B0F1A' : C.ink, align: 'center', valign: 'middle', margin: 0 });
      });
    }

    /* --------------------------- slides fixos --------------------------- */
    const groups = scope.kind === 'course' ? ix.groups : scope.kind === 'level' ? ix.groups.filter(function (g) { return g.lv === scope.lv; })
      : scope.kind === 'stage' ? ix.groups.filter(function (g) { return g.lv === scope.lv && g.stage === scope.stage; })
      : ix.groups.filter(function (g) { return g.keys.indexOf(scope.key) >= 0; });
    const onlyKey = scope.kind === 'lesson' ? scope.key : null;
    const scopeTxt = scope.kind === 'course' ? 'Curso completo · ' + ix.order.length + ' aulas' : scope.kind === 'level' ? 'Nível ' + LV[scope.lv]
      : scope.kind === 'stage' ? 'Nível ' + LV[scope.lv] + ' · Etapa ' + scope.stage : 'Aula · ' + plain(ix.byKey[onlyKey].les.titulo);

    // capa
    const cv = P.addSlide();
    frame(cv, { cover: true, glowX: 6.8, glowY: -1.6, glowW: 8.6, glow2X: -1.6, glow2Y: 4.2, logoX: W - 2.15, logoY: 0.55, logoW: 1.5 });
    if (assets.badge) cv.addImage({ objectName: '!!badge', data: assets.badge, x: 0.9, y: 1.25, w: 1.55, h: 1.55 });
    cv.addText('TRUST INTELLIGENCE ACADEMY', { objectName: '!!kicker', x: 0.9, y: 3.15, w: 9, h: 0.35, fontFace: FONT, fontSize: 13, bold: true, color: A, charSpacing: 3 });
    cv.addText(t.nome, { objectName: '!!title', x: 0.9, y: 3.5, w: 11.5, h: 1.3, fontFace: SERIF, fontSize: fitSize(t.nome, 11.5, 1.3, 54, 36), color: C.ink, valign: 'middle', margin: 0 });
    cv.addText(scopeTxt, { x: 0.9, y: 4.85, w: 11, h: 0.5, fontFace: FONT, fontSize: 20, color: C.ink2, margin: 0 });
    if (t.desc) cv.addText(plain(t.desc), { x: 0.9, y: 5.45, w: 9.6, h: 0.9, fontFace: FONT, fontSize: 14, color: C.ink3, valign: 'top', margin: 0 });
    cv.addShape(P.ShapeType.rect, { objectName: '!!bar', x: 0.9, y: 6.65, w: 2.4, h: 0.08, fill: { color: A }, line: { type: 'none' } });
    cv.addText('Material de estudo · ' + new Date().toLocaleDateString('pt-BR'), { objectName: '!!foot', x: 3.5, y: 6.5, w: 7, h: 0.38, fontFace: FONT, fontSize: 11, color: C.ink3, margin: 0 });

    // agenda (curso e nível)
    if (scope.kind === 'course' || scope.kind === 'level') {
      const lvls = [1, 2, 3].filter(function (lv) { return groups.some(function (g) { return g.lv === lv; }); });
      lvls.forEach(function (lv) {
        const s = P.addSlide(); frame(s);
        head(s, scope.kind === 'course' ? 'Agenda do curso' : 'Agenda do nível', 'Nível ' + LV[lv]);
        const gs = groups.filter(function (g) { return g.lv === lv; }), cw = (W - 1.6 - 0.3 * (gs.length - 1)) / gs.length;
        gs.forEach(function (g, i) {
          const x = 0.8 + i * (cw + 0.3);
          box(s, x, 1.75, cw, 4.85, C.panel);
          s.addText('Etapa ' + g.stage, { x: x + 0.25, y: 1.9, w: cw - 0.5, h: 0.45, fontFace: SERIF, fontSize: 22, color: A, margin: 0 });
          s.addText('Exercícios ' + g.range[0] + ' a ' + g.range[1], { x: x + 0.25, y: 2.35, w: cw - 0.5, h: 0.3, fontFace: FONT, fontSize: 11, color: C.ink3, margin: 0 });
          const items = g.keys.map(function (k) { return plain(ix.byKey[k].les.titulo); });
          s.addText(items.map(function (b, j) { return { text: (ix.order.indexOf(g.keys[j]) + 1) + '. ' + b, options: { paraSpaceAfter: 6, breakLine: true } }; }), { x: x + 0.25, y: 2.8, w: cw - 0.5, h: 3.65, fontFace: FONT, fontSize: fitSize(items.join('\n'), cw - 0.5, 3.65, 15, 10), color: C.ink2, valign: 'top', margin: 0 });
        });
      });
    }

    /* ---------------------------- por etapa/aula ---------------------------- */
    groups.forEach(function (g) {
      const keys = onlyKey ? [onlyKey] : g.keys;
      if (!onlyKey) {
        const s = P.addSlide(); frame(s, { glowX: 7.8, glowY: 1.0, glowW: 7.2 });
        s.addText('NÍVEL ' + LV[g.lv].toUpperCase(), { objectName: '!!kicker', x: 0.8, y: 2.1, w: 8, h: 0.4, fontFace: FONT, fontSize: 14, bold: true, color: A, charSpacing: 3 });
        s.addText('Etapa ' + g.stage, { objectName: '!!title', x: 0.8, y: 2.5, w: 8, h: 1.4, fontFace: SERIF, fontSize: 66, color: C.ink, margin: 0 });
        s.addText(g.keys.map(function (k) { return { text: plain(ix.byKey[k].les.titulo), options: { bullet: { indent: 16 }, paraSpaceAfter: 6 } }; }), { x: 0.85, y: 4.05, w: 7.6, h: 2.6, fontFace: FONT, fontSize: fitSize(g.keys.map(function (k) { return ix.byKey[k].les.titulo; }).join('\n'), 7.6, 2.6, 17, 11), color: C.ink2, valign: 'top', margin: 0 });
        s.addText(g.keys.length + ' aulas · exercícios ' + g.range[0] + ' a ' + g.range[1], { x: 8.9, y: 5.9, w: 3.6, h: 0.4, fontFace: FONT, fontSize: 12, color: C.ink3, align: 'right', margin: 0 });
      }
      keys.forEach(function (k) {
        const it = ix.byKey[k], les = it.les, px = L.plusOf(it.exs[0] || { track: t.id }, les) || {};
        const n = ix.order.indexOf(k) + 1, kick = 'Nível ' + LV[g.lv] + ' · Etapa ' + g.stage + ' · Aula ' + n;
        const title = plain(les.titulo);

        // 1) Conceito — ideia + analogia à esquerda, objetivos à direita; as duas colunas terminam em BOT
        let s = P.addSlide(); frame(s);
        head(s, kick + ' · Conceito', title, les.kw);
        let ay = BOT;
        if (les.analogia) {
          const afs = fitSize(les.analogia, LW - 0.5, 1.4, 16, 10), ah = Math.min(1.7, Math.max(0.95, estH('Para lembrar ' + les.analogia, LW - 0.5, afs) + 0.35));
          ay = BOT - ah;
          box(s, X0, ay, LW, ah, C.panel2, A);
          para(s, les.analogia, X0 + 0.25, ay + 0.12, LW - 0.5, ah - 0.24, { max: 16, valign: 'middle', runs: [{ text: 'Para lembrar  ', options: { bold: true, color: A } }, { text: plain(les.analogia), options: { italic: true, color: C.ink2 } }] });
          ay -= GAP;
        }
        label(s, 'A ideia', X0, TOP, LW);
        para(s, les.ideia, X0, TOP + 0.35, LW, ay - TOP - 0.35, { max: 20 });
        box(s, RX, TOP, RW, BOT - TOP, C.panel);
        const hasU = px.u && px.u.length, goals = bullets(px.o && px.o.length ? px.o : les.notas);
        label(s, px.o && px.o.length ? 'Você vai saber' : 'Pontos-chave', RX + 0.25, TOP + 0.2, RW - 0.5, A);
        list(s, goals, RX + 0.25, TOP + 0.55, RW - 0.5, hasU ? 2.0 : BOT - TOP - 0.75, { max: 16 });
        if (hasU) { label(s, 'Onde se usa', RX + 0.25, TOP + 2.7, RW - 0.5, A); list(s, bullets(px.u), RX + 0.25, TOP + 3.05, RW - 0.5, BOT - TOP - 3.2, { max: 15 }); }
        resumo(s, px.r || (px.v && px.v.r) || les.notas[0], RES_Y);
        s.addNotes(plain(les.ideia) + '\n\n' + plain(les.analogia || ''));

        // 2) Como fazer — código (+ “Pratique” se sobrar espaço) à esquerda, anotações à direita, mesma altura
        s = P.addSlide(); frame(s);
        head(s, kick + ' · ' + (pack.syntaxTitle || 'Sintaxe'), title, les.kw);
        const hasFlow = px.f && px.f.length > 2, bottom = hasFlow ? 5.2 : END, area = bottom - TOP;
        const synFs = fitSize(plain(les.sintaxe), LW - 0.3, area - 0.55, 17, 9, true);
        const need = Math.max(1.9, estH(plain(les.sintaxe), LW - 0.3, synFs, true) + 0.85), prat = it.exs[0];
        if (prat && area - need - GAP >= 1.0) {
          const ph = Math.min(1.5, area - need - GAP), ch = area - ph - GAP;
          code(s, les.sintaxe, X0, TOP, LW, ch, (pack.syntaxTitle || 'Sintaxe').toLowerCase());
          const py = TOP + ch + GAP;
          box(s, X0, py, LW, ph, C.panel2, B);
          para(s, prat.n + ' ' + (prat.g || ''), X0 + 0.25, py + 0.12, LW - 0.5, ph - 0.24, { max: 16, valign: 'middle', runs: [{ text: 'Pratique  ', options: { bold: true, color: B } }, { text: plain(prat.n) + (prat.g ? ' — ' + plain(prat.g) : ''), options: { color: C.ink2 } }] });
        } else code(s, les.sintaxe, X0, TOP, LW, area, (pack.syntaxTitle || 'Sintaxe').toLowerCase());
        box(s, RX, TOP, RW, area, C.panel);
        label(s, 'Anote', RX + 0.25, TOP + 0.2, RW - 0.5, A);
        list(s, bullets(les.notas), RX + 0.25, TOP + 0.55, RW - 0.5, area - 0.75, { max: 16 });
        if (hasFlow) flowRow(s, px.f, 5.85);
        s.addNotes(plain(les.notas.join('\n')));

        // 3) Lado a lado — duas colunas idênticas
        if (px.v) {
          s = P.addSlide(); frame(s);
          head(s, kick + ' · Lado a lado', plain(px.v.t), true);
          if (px.v.s) s.addText(plain(px.v.s), { x: X0, y: 1.45, w: X1 - X0, h: 0.35, fontFace: FONT, fontSize: 14, color: C.ink3, margin: 0 });
          const y0 = 1.95, cw = (X1 - X0 - GAP) / 2;
          [px.v.a, px.v.b].forEach(function (col, i) {
            if (!col) return;
            const x = X0 + i * (cw + GAP), tone = i ? B : A, hasC = !!col.c;
            box(s, x, y0, cw, BOT - y0, C.panel, tone);
            s.addShape(P.ShapeType.rect, { x: x, y: y0, w: cw, h: 0.08, fill: { color: tone }, line: { type: 'none' } });
            s.addText(plain(col.h), { x: x + 0.25, y: y0 + 0.2, w: cw - 0.5, h: 0.45, fontFace: MONO, fontSize: fitSize(plain(col.h), cw - 0.5, 0.45, 20, 12, true), bold: true, color: tone, margin: 0 });
            s.addText(plain(col.d || ''), { x: x + 0.25, y: y0 + 0.7, w: cw - 0.5, h: 0.45, fontFace: FONT, fontSize: fitSize(plain(col.d || ''), cw - 0.5, 0.45, 15, 10), color: C.ink2, margin: 0 });
            const cy = BOT - 0.25 - 1.0;
            list(s, bullets(col.u), x + 0.25, y0 + 1.25, cw - 0.5, (hasC ? cy - GAP : BOT - 0.25) - (y0 + 1.25), { max: 16 });
            if (hasC) { box(s, x + 0.25, cy, cw - 0.5, 1.0, C.code, '262E48'); s.addText(plain(col.c), { x: x + 0.4, y: cy, w: cw - 0.8, h: 1.0, fontFace: MONO, fontSize: fitSize(col.c, cw - 0.8, 1.0, 15, 9, true), color: 'E8EBF6', valign: 'middle', margin: 0 }); }
          });
          resumo(s, px.v.r, RES_Y);
        }

        // 4) Exemplo (código + visual ao vivo) e cuidados — todos os blocos terminam em BOT
        const ex = les.exemplo || {}, V = (assets.vis && assets.vis[k]) || {};
        const exCode = V.code || (typeof ex.c === 'string' ? ex.c : (ex.fig && ex.fig.code) || '');
        const vis = V.ex, res = px.r || (px.v && px.v.r) || les.notas[0];
        const cuidados = function (s2, x, y, w, h) { box(s2, x, y, w, h, C.panel, 'F87171'); label(s2, 'Cuidados', x + 0.25, y + 0.2, w - 0.5, 'F87171'); list(s2, bullets(les.cuidados), x + 0.25, y + 0.55, w - 0.5, h - 0.75, { max: 17 }); };
        const visBox = function (s2, x, y, w, h) { box(s2, x, y, w, h, C.panel); picture(s2, vis, x + 0.2, y + 0.2, w - 0.4, h - 0.4); };
        s = P.addSlide(); frame(s);
        head(s, kick + ' · Exemplo', title, les.kw);
        const y1 = ex.p ? 1.95 : TOP, hh = BOT - y1;
        if (ex.p) s.addText(plain(ex.p), { x: X0, y: 1.5, w: X1 - X0, h: 0.35, fontFace: FONT, fontSize: 14, color: C.ink2, margin: 0 });
        const shortCode = exCode && lines(exCode) <= 7 && exCode.split('\n').every(function (l) { return l.length <= 46; });
        let cuidadosShown = !vis;
        if (exCode && vis && shortCode && vis.w / vis.h < 3.4) {
          // código curto em cima e cuidados embaixo, na coluna estreita; visual grande ao lado
          const cfs = fitSize(plain(exCode), 4.1, hh - 0.55, 15, 9, true), ch = Math.min(hh - 1.6, Math.max(1.3, estH(plain(exCode), 4.1, cfs, true) + 0.8));
          code(s, exCode, X0, y1, 4.4, ch, 'exemplo');
          cuidados(s, X0, y1 + ch + GAP, 4.4, hh - ch - GAP);
          cuidadosShown = true;
          visBox(s, X0 + 4.4 + GAP, y1, X1 - X0 - 4.4 - GAP, hh);
        } else if (exCode && vis && lines(exCode) <= 7 && vis.w / vis.h >= 3.4) {
          const ch = Math.min(2.1, Math.max(1.1, 0.7 + lines(exCode) * 0.27));
          code(s, exCode, X0, y1, X1 - X0, ch, 'exemplo');
          visBox(s, X0, y1 + ch + GAP, X1 - X0, hh - ch - GAP);
        } else if (exCode && vis) {
          const cw2 = (X1 - X0 - GAP) / 2;
          code(s, exCode, X0, y1, cw2, hh, 'exemplo');
          visBox(s, X0 + cw2 + GAP, y1, cw2, hh);
        } else if (vis) {
          visBox(s, X0, y1, LW, hh);
          cuidados(s, RX, y1, RW, hh);
        } else if (exCode) {
          code(s, exCode, X0, y1, LW, hh, 'exemplo');
          cuidados(s, RX, y1, RW, hh);
        } else {
          cuidados(s, X0, y1, X1 - X0, hh);
        }
        resumo(s, res, RES_Y);
        s.addNotes('Exemplo: ' + plain(ex.p || '') + '\n\nCuidados:\n' + bullets(les.cuidados).join('\n'));

        // 4b) Cuidados em slide próprio quando o exemplo ocupou o slide inteiro
        if (exCode && vis && (!cuidadosShown || px.e)) {
          s = P.addSlide(); frame(s);
          head(s, kick + (cuidadosShown ? ' · Erro comum' : ' · Cuidados'), title, les.kw);
          const cw3 = (X1 - X0 - GAP) / 2;
          if (cuidadosShown) {
            box(s, X0, TOP, cw3, BOT - TOP, C.panel, A); label(s, 'Pontos-chave', X0 + 0.25, TOP + 0.2, cw3 - 0.5, A);
            list(s, bullets(les.notas), X0 + 0.25, TOP + 0.55, cw3 - 0.5, BOT - TOP - 0.75, { max: 17 });
          } else cuidados(s, X0, TOP, cw3, BOT - TOP);
          if (px.e) errBox(s, px.e, X0 + cw3 + GAP, TOP, cw3, BOT - TOP);
          else {
            box(s, X0 + cw3 + GAP, TOP, cw3, BOT - TOP, C.panel, A); label(s, 'Pontos-chave', X0 + cw3 + GAP + 0.25, TOP + 0.2, cw3 - 0.5, A);
            list(s, bullets(les.notas), X0 + cw3 + GAP + 0.25, TOP + 0.55, cw3 - 0.5, BOT - TOP - 0.75, { max: 17 });
          }
          resumo(s, res, RES_Y);
        }

        // 5) Visuais dos exercícios da aula (até 2 por slide, caixas com a mesma altura)
        const figs = V.figs || [];
        for (let i = 0; i < figs.length; i += 2) {
          s = P.addSlide(); frame(s);
          head(s, kick + ' · Visuais dos exercícios', title, les.kw);
          const pair = figs.slice(i, i + 2), cw = pair.length === 2 ? (X1 - X0 - GAP) / 2 : X1 - X0;
          pair.forEach(function (f, j) {
            const x = X0 + j * (cw + GAP);
            box(s, x, TOP, cw, END - TOP, C.panel);
            s.addText([{ text: plain(f.title), options: { bold: true, color: C.ink, breakLine: true } }, { text: f.sub, options: { color: C.ink3, fontSize: 11 } }], { x: x + 0.25, y: TOP + 0.15, w: cw - 0.5, h: 0.65, fontFace: FONT, fontSize: 15, valign: 'top', margin: 0 });
            picture(s, f, x + 0.25, TOP + 0.95, cw - 0.5, END - TOP - 1.2);
          });
        }
      });
    });

    // encerramento
    const end = P.addSlide();
    frame(end, { cover: true, glowX: 3.4, glowY: -0.6, glowW: 6.6, logoX: (W - 1.4) / 2, logoY: 1.25, logoW: 1.4 });
    end.addText('Bons estudos!', { objectName: '!!title', x: 0.8, y: 2.95, w: W - 1.6, h: 1.1, fontFace: SERIF, fontSize: 54, color: C.ink, align: 'center', margin: 0 });
    end.addText('Pratique os exercícios na plataforma para fixar cada aula.', { x: 0.8, y: 4.1, w: W - 1.6, h: 0.5, fontFace: FONT, fontSize: 18, color: C.ink2, align: 'center', margin: 0 });
    end.addText('TRUST INTELLIGENCE ACADEMY · ' + t.nome.toUpperCase(), { objectName: '!!kicker', x: 0.8, y: 4.75, w: W - 1.6, h: 0.4, fontFace: FONT, fontSize: 12, bold: true, color: A, align: 'center', charSpacing: 3 });
    if (assets.badge) end.addImage({ objectName: '!!badge', data: assets.badge, x: (W - 0.9) / 2, y: 5.5, w: 0.9, h: 0.9 });
    return P;
  }

  /* ----------------------- transição Transformar ----------------------- */
  const MORPH = '<mc:AlternateContent xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006">' +
    '<mc:Choice xmlns:p159="http://schemas.microsoft.com/office/powerpoint/2015/09/main" Requires="p159">' +
    '<p:transition xmlns:p14="http://schemas.microsoft.com/office/powerpoint/2010/main" spd="slow" p14:dur="1250"><p159:morph option="byObject"/></p:transition></mc:Choice>' +
    '<mc:Fallback><p:transition spd="slow"><p:fade/></p:transition></mc:Fallback></mc:AlternateContent>';
  async function addMorph(buf) {
    const zip = await global.JSZip.loadAsync(buf);
    const names = Object.keys(zip.files).filter(function (n) { return /^ppt\/slides\/slide\d+\.xml$/.test(n); });
    for (const n of names) {
      let x = await zip.file(n).async('string');
      x = x.replace(/<p:transition[\s\S]*?<\/p:transition>|<p:transition[^>]*\/>/g, '');
      // a transição vem depois de <p:clrMapOvr> e antes de <p:timing>/<p:extLst>
      if (/<\/p:clrMapOvr>/.test(x)) x = x.replace('</p:clrMapOvr>', '</p:clrMapOvr>' + MORPH);
      else if (/<p:timing/.test(x)) x = x.replace('<p:timing', MORPH + '<p:timing');
      else x = x.replace('</p:sld>', MORPH + '</p:sld>');
      zip.file(n, x);
    }
    // imagens repetidas (logo e selo em todos os slides): mantém um arquivo só e aponta todos os slides para ele
    const media = Object.keys(zip.files).filter(function (n) { return /^ppt\/media\/./.test(n) && !zip.files[n].dir; }), seen = {}, alias = {};
    for (const m of media) {
      const b64 = await zip.file(m).async('base64'), k = b64.length + ':' + b64.slice(0, 200) + b64.slice(-200);
      if (seen[k] && (await zip.file(seen[k]).async('base64')) === b64) { alias[m.replace('ppt/', '../')] = seen[k].replace('ppt/', '../'); zip.remove(m); }
      else seen[k] = m;
    }
    if (Object.keys(alias).length) {
      const rels = Object.keys(zip.files).filter(function (n) { return /^ppt\/(slides|slideLayouts|slideMasters)\/_rels\/.*\.rels$/.test(n); });
      for (const r of rels) {
        let x = await zip.file(r).async('string'), changed = false;
        x = x.replace(/Target="(\.\.\/media\/[^"]+)"/g, function (all, tg) { if (alias[tg]) { changed = true; return 'Target="' + alias[tg] + '"'; } return all; });
        if (changed) zip.file(r, x);
      }
    }
    return zip.generateAsync({ type: 'blob', mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation', compression: 'DEFLATE' });
  }

  /* ------------------------------- export ------------------------------- */
  let busy = false;
  async function exportDeck(t, scope) {
    if (busy) return; busy = true;
    const toast = global.UI.toast;
    toast('Montando a apresentação…', 'info', 2500);
    try {
      await lib();
      const assets = { logo: await imgData('assets/logo-256.png'), badge: await courseBadge(t) };
      const ix = global.Library.index(t.id);
      const keys = scope.kind === 'course' ? ix.order : scope.kind === 'lesson' ? [scope.key]
        : ix.groups.filter(function (g) { return g.lv === scope.lv && (scope.kind === 'level' || g.stage === scope.stage); }).reduce(function (a, g) { return a.concat(g.keys); }, []);
      let lastToast = 0;
      assets.vis = await visuals(t, keys, function (i, n) { if (n > 4 && Date.now() - lastToast > 2500) { lastToast = Date.now(); toast('Preparando os visuais: aula ' + i + ' de ' + n + '…', 'info', 2400); } });
      const P = build(t, scope, assets);
      const buf = await P.write({ outputType: 'arraybuffer' });
      const blob = await addMorph(buf);
      const slug = function (s) { return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); };
      const name = slug(t.nome) + '-' + (scope.kind === 'course' ? 'curso' : scope.kind === 'level' ? 'nivel-' + scope.lv : scope.kind === 'stage' ? 'nivel-' + scope.lv + '-etapa-' + scope.stage : slug(scope.key)) + '.pptx';
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 4000);
      toast('Apresentação baixada: <b>' + name + '</b>', 'success', 4000);
      global.__lastDeck = blob;   // usado nos testes automáticos
      return blob;
    } catch (e) {
      console.error(e);
      toast('Não foi possível gerar a apresentação. Confira a internet e tente de novo.', 'error', 6000);
    } finally { busy = false; }
  }

  global.Deck = { export: exportDeck, build: build };
})(window);
