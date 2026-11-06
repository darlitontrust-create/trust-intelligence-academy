/* =====================================================================
   ui.js — Componentes visuais reutilizáveis
   ---------------------------------------------------------------------
   Ícones, toasts, modais, tabela de resultados (busca, ordenação,
   paginação), realce de SQL para blocos estáticos e confete.
   ===================================================================== */
(function (global) {
  'use strict';

  /* ------------------------------ Utilidades ------------------------------ */
  const esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; });
  };
  const nf = new Intl.NumberFormat('pt-BR');
  const fmt = function (n) { return nf.format(n); };
  const fmtCell = function (v) {
    if (v === null || v === undefined) return '<span class="null">NULL</span>';
    if (typeof v === 'number') return '<span class="num">' + esc(Number.isInteger(v) ? v : Math.round(v * 100) / 100) + '</span>';
    return esc(v);
  };
  const fmtDate = function (iso) { return iso ? new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'; };

  /* -------------------------------- Ícones -------------------------------- */
  // Traços desenhados à mão no grid 24x24, estilo linha fina.
  const P = {
    home: '<path d="M4 11.5 12 5l8 6.5V19a1 1 0 0 1-1 1h-4.5v-5h-5v5H5a1 1 0 0 1-1-1z"/>',
    map: '<path d="M9 5 4 7v12l5-2 6 2 5-2V5l-5 2-6-2z"/><path d="M9 5v12M15 7v12"/>',
    trophy: '<path d="M8 4h8v5a4 4 0 0 1-8 0z"/><path d="M8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v3M9 20h6M10 16h4v4h-4z"/>',
    bars: '<path d="M5 20V11M10 20V5M15 20v-7M20 20V9"/>',
    award: '<circle cx="12" cy="9" r="5"/><path d="m9 13.5-1.5 6.5 4.5-2.5 4.5 2.5-1.5-6.5"/>',
    user: '<circle cx="12" cy="8.5" r="3.5"/><path d="M5 20a7 7 0 0 1 14 0"/>',
    play: '<path d="M8 5.5v13l10-6.5z"/>',
    send: '<path d="M4 12 20 4l-5 16-3.5-6.5z"/><path d="m11.5 13.5 3-3"/>',
    check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    lock: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
    bulb: '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V16h5v-.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z"/>',
    eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="2.8"/>',
    cycle: '<path d="M20 12a8 8 0 0 1-13.7 5.6"/><path d="M4 12a8 8 0 0 1 13.7-5.6"/><path d="M18.2 3.6v3.2H15"/><path d="M5.8 20.4v-3.2H9"/><circle cx="12" cy="12" r="2.2"/>',
    backspace: '<path d="M21 6.5v11a1.5 1.5 0 0 1-1.5 1.5H8.6a1.5 1.5 0 0 1-1.1-.5L2.5 12l5-6.5a1.5 1.5 0 0 1 1.1-.5h10.9A1.5 1.5 0 0 1 21 6.5z"/><path d="M11.5 9.5l5 5M16.5 9.5l-5 5"/>',
    refresh: '<path d="M19.5 12a7.5 7.5 0 1 1-2.2-5.3"/><path d="M19.5 4.5v4.2h-4.2"/>',
    eraser: '<path d="m14 5 5 5-8.5 8.5H6L3.5 16a1.5 1.5 0 0 1 0-2.1z"/><path d="M9 10l5 5M12 18.5h8"/>',
    wrench: '<path d="M14.5 6.5a4 4 0 0 0 5 5L13 18a2.1 2.1 0 0 1-3-3z"/><path d="M14.5 6.5 17 4l3 3-2.5 2.5"/>',
    copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>',
    share: '<circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="m8.2 10.8 7.6-3.6M8.2 13.2l7.6 3.6"/>',
    download: '<path d="M12 4v11M7.5 10.5 12 15l4.5-4.5M5 19.5h14"/>',
    printer: '<path d="M7 9V4h10v5"/><rect x="4" y="9" width="16" height="7" rx="2"/><path d="M7 14h10v6H7z"/>',
    chevR: '<path d="m9.5 6 6 6-6 6"/>', chevL: '<path d="m14.5 6-6 6 6 6"/>',
    search: '<circle cx="11" cy="11" r="6"/><path d="m20 20-4.5-4.5"/>',
    db: '<ellipse cx="12" cy="6" rx="7" ry="2.5"/><path d="M5 6v12c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5V6M5 12c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5"/>',
    flame: '<path d="M12 21a6 6 0 0 0 6-6c0-4-3-5.5-3.5-9.5C12 7 10 9.5 10.5 12 9 11.5 8.3 10 8.3 9 6.8 10.5 6 12.6 6 15a6 6 0 0 0 6 6z"/>',
    star: '<path d="m12 4 2.4 5 5.4.6-4 3.7 1.1 5.3L12 16l-4.9 2.6 1.1-5.3-4-3.7 5.4-.6z"/>',
    logout: '<path d="M10 4H6a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h4M15 8l4 4-4 4M19 12H9"/>',
    sparkle: '<path d="M12 3c.7 4.6 2.4 6.3 7 7-4.6.7-6.3 2.4-7 7-.7-4.6-2.4-6.3-7-7 4.6-.7 6.3-2.4 7-7z"/>',
    table: '<rect x="4" y="5" width="16" height="14" rx="2"/><path d="M4 10h16M10 10v9"/>',
    code: '<path d="m8.5 8-4 4 4 4M15.5 8l4 4-4 4M13.5 5.5l-3 13"/>',
    clock: '<circle cx="12" cy="12" r="8"/><path d="M12 7.5V12l3 2"/>',
    shield: '<path d="M12 3.5 19 6v5.5c0 4.2-3 7.6-7 9-4-1.4-7-4.8-7-9V6z"/><path d="m9 12 2 2 4-4"/>',
    upload: '<path d="M12 15V4M7.5 8.5 12 4l4.5 4.5M5 19.5h14"/>',
    medal: '<circle cx="12" cy="14.5" r="5"/><path d="M8.5 10.5 6 3.5h4l2 4.5 2-4.5h4l-2.5 7"/>',
    moon: '<path d="M19 14.5A7.5 7.5 0 0 1 9.5 5a7.5 7.5 0 1 0 9.5 9.5z"/>',
    target: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1"/>',
    volume: '<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/>',
    mute: '<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="m16 9.5 5 5M21 9.5l-5 5"/>',
    pause: '<path d="M8.5 5.5v13M15.5 5.5v13"/>',
    book: '<path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H11v15H5.5A1.5 1.5 0 0 0 4 20.5z"/><path d="M20 5.5A1.5 1.5 0 0 0 18.5 4H13v15h5.5a1.5 1.5 0 0 1 1.5 1.5z"/>',
    nodes: '<circle cx="5" cy="6" r="2"/><circle cx="5" cy="18" r="2"/><circle cx="12" cy="12" r="2.2"/><circle cx="19" cy="6" r="2"/><circle cx="19" cy="18" r="2"/><path d="M6.7 7.2l3.5 3.4M6.7 16.8l3.5-3.4M13.8 10.6l3.5-3.4M13.8 13.4l3.5 3.4"/>',
    slides: '<rect x="3" y="4" width="18" height="12" rx="1.5"/><path d="M12 16v4M8 20h8"/><path d="M7 12l3-3 2 2 4-4"/>',
    list: '<path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r="1"/><circle cx="4.5" cy="12" r="1"/><circle cx="4.5" cy="18" r="1"/>',
    bookmark: '<path d="M6 3h12v18l-6-4-6 4z"/>',
    printer: '<path d="M7 9V3h10v6"/><rect x="3" y="9" width="18" height="8" rx="2"/><path d="M7 14h10v7H7z"/>',
    calendar: '<rect x="4" y="5.5" width="16" height="14.5" rx="2.5"/><path d="M4 10h16M8.5 3.5v4M15.5 3.5v4"/><path d="M8 13.5h.01M12 13.5h.01M16 13.5h.01M8 16.8h.01M12 16.8h.01"/>',
    info: '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5M12 7.6v.1"/>',
    dots: '<circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/>',
    flag: '<path d="M5 21V4"/><path d="M5 4h11l-2 4 2 4H5"/>',
    bell: '<path d="M3 19.5h18"/><path d="M3.5 18.5c3.5 0 4.6-11 8.5-11s5 11 8.5 11"/><path d="M8 19.5v-4M16 19.5v-4"/>',
    camera: '<path d="M4 8.5A1.5 1.5 0 0 1 5.5 7h2.2L9.5 5h5l1.8 2h2.2A1.5 1.5 0 0 1 20 8.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 17.5z"/><circle cx="12" cy="13" r="3.3"/>',
    chat: '<path d="M4 5.5h11a2 2 0 0 1 2 2V13a2 2 0 0 1-2 2H9l-4 3.5V15H4a2 2 0 0 1-2-2V7.5a2 2 0 0 1 2-2z"/><path d="M19 9.5h1a2 2 0 0 1 2 2V17a2 2 0 0 1-2 2h-1v2.5L16 19h-4"/>',
    mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0"/><path d="M12 17.5V21"/>',
    headphones: '<path d="M4 15v-3a8 8 0 0 1 16 0v3"/><rect x="3" y="14" width="4" height="6.5" rx="1.6"/><rect x="17" y="14" width="4" height="6.5" rx="1.6"/>',
    heart: '<path d="M12 19.5s-7.5-4.4-7.5-10A4 4 0 0 1 12 7a4 4 0 0 1 7.5 2.5c0 5.6-7.5 10-7.5 10z"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    grid: '<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>',
    google: '<path d="M20.5 12.2c0-.6-.1-1.2-.2-1.8H12v3.4h4.8a4.1 4.1 0 0 1-1.8 2.7v2.2h2.9c1.7-1.6 2.6-3.9 2.6-6.5z"/><path d="M12 21c2.4 0 4.5-.8 5.9-2.2L15 16.6c-.8.5-1.8.9-3 .9-2.3 0-4.3-1.6-5-3.7H4v2.3A9 9 0 0 0 12 21z"/><path d="M7 13.8a5.4 5.4 0 0 1 0-3.5V8H4a9 9 0 0 0 0 8.1z"/><path d="M12 6.6c1.3 0 2.5.5 3.4 1.3L18 5.4A9 9 0 0 0 4 8l3 2.3c.7-2.1 2.7-3.7 5-3.7z"/>',
  };
  function icon(name, cls) {
    return '<svg class="ic ' + (cls || '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (P[name] || '') + '</svg>';
  }

  /** Logo da Trust Intelligence Academy (imagem publicada em assets/). */
  function logo(size) { return '<img class="logo logo-' + (size || 'sm') + '" src="assets/logo-256.png" alt="" width="40" height="40">'; }

  /* -------------------------------- Toasts -------------------------------- */
  function toast(msg, type, ms) {
    let box = document.getElementById('toasts');
    if (!box) { box = document.createElement('div'); box.id = 'toasts'; box.setAttribute('aria-live', 'polite'); document.body.appendChild(box); }
    const el = document.createElement('div');
    el.className = 'toast toast-' + (type || 'info');
    const ic = { success: 'check', error: 'x', warn: 'bulb', info: 'sparkle', xp: 'star' }[type || 'info'];
    el.innerHTML = icon(ic) + '<span>' + msg + '</span>';
    box.appendChild(el);
    requestAnimationFrame(function () { el.classList.add('in'); });
    setTimeout(function () { el.classList.remove('in'); setTimeout(function () { el.remove(); }, 300); }, ms || 3200);
  }

  /* -------------------------------- Modais -------------------------------- */
  /** Abre um modal. `closable:false` impede fechar (ex.: cadastro obrigatório). */
  function modal(html, opts) {
    opts = opts || {};
    const wrap = document.createElement('div');
    wrap.className = 'modal-wrap' + (opts.wide ? ' wide' : '');
    wrap.innerHTML = '<div class="modal glass" role="dialog" aria-modal="true">' +
      (opts.closable === false ? '' : '<button class="icon-btn modal-x" aria-label="Fechar">' + icon('x') + '</button>') + html + '</div>';
    document.body.appendChild(wrap);
    requestAnimationFrame(function () { wrap.classList.add('in'); });
    const close = function () { wrap.classList.remove('in'); setTimeout(function () { wrap.remove(); }, 250); if (opts.onClose) opts.onClose(); };
    if (opts.closable !== false) {
      wrap.querySelector('.modal-x').onclick = close;
      wrap.addEventListener('mousedown', function (e) { if (e.target === wrap) close(); });
      const onKey = function (e) { if (e.key === 'Escape') { close(); document.removeEventListener('keydown', onKey); } };
      document.addEventListener('keydown', onKey);
    }
    const first = wrap.querySelector('input, button:not(.modal-x)');
    if (first) setTimeout(function () { first.focus(); }, 60);
    return { el: wrap, close: close };
  }

  /* ---------------------- Tabela de resultados (DataTable) ---------------------- */
  /**
   * Renderiza {columns, values} com busca, ordenação por coluna e paginação.
   */
  function dataTable(container, data, opts) {
    opts = opts || {};
    const pageSize = opts.pageSize || 10;
    let query = '', sortCol = -1, sortDir = 1, page = 0;
    container.innerHTML = '';
    if (!data || !data.columns) { container.innerHTML = '<div class="empty-mini">Nenhum resultado para exibir.</div>'; return; }
    const root = document.createElement('div');
    root.className = 'dt';
    root.innerHTML =
      '<div class="dt-bar">' +
        '<label class="dt-search">' + icon('search') + '<input type="search" placeholder="Buscar no resultado" aria-label="Buscar no resultado"></label>' +
        '<span class="dt-count"></span>' +
      '</div>' +
      '<div class="dt-scroll"><table><thead></thead><tbody></tbody></table></div>' +
      '<div class="dt-pager"><button class="icon-btn sm" data-p="-1" aria-label="Página anterior">' + icon('chevL') + '</button><span class="dt-page"></span><button class="icon-btn sm" data-p="1" aria-label="Próxima página">' + icon('chevR') + '</button></div>';
    container.appendChild(root);
    const thead = root.querySelector('thead'), tbody = root.querySelector('tbody');

    function rows() {
      let r = data.values.map(function (v, i) { return { v: v, i: i }; });
      if (query) { const q = query.toLowerCase(); r = r.filter(function (x) { return x.v.some(function (c) { return String(c == null ? 'null' : c).toLowerCase().indexOf(q) >= 0; }); }); }
      if (sortCol >= 0) r.sort(function (a, b) {
        const x = a.v[sortCol], y = b.v[sortCol];
        if (x === y) return a.i - b.i;
        if (x === null) return 1; if (y === null) return -1;
        return (typeof x === 'number' && typeof y === 'number' ? x - y : String(x).localeCompare(String(y), 'pt-BR', { numeric: true })) * sortDir;
      });
      return r;
    }
    function render() {
      thead.innerHTML = '<tr><th class="rn">#</th>' + data.columns.map(function (c, i) {
        const s = i === sortCol ? (sortDir > 0 ? ' ▲' : ' ▼') : '';
        return '<th><button data-c="' + i + '" aria-label="Ordenar por ' + esc(c) + '">' + esc(c) + '<span class="sort">' + s + '</span></button></th>';
      }).join('') + '</tr>';
      const r = rows();
      const pages = Math.max(1, Math.ceil(r.length / pageSize));
      page = Math.min(page, pages - 1);
      const slice = r.slice(page * pageSize, page * pageSize + pageSize);
      tbody.innerHTML = slice.length ? slice.map(function (x) {
        return '<tr><td class="rn">' + (x.i + 1) + '</td>' + x.v.map(function (c) { return '<td>' + fmtCell(c) + '</td>'; }).join('') + '</tr>';
      }).join('') : '<tr><td colspan="' + (data.columns.length + 1) + '" class="empty-mini">' + (data.values.length ? 'Nada encontrado para "' + esc(query) + '".' : 'A consulta não retornou linhas.') + '</td></tr>';
      root.querySelector('.dt-count').textContent = fmt(r.length) + (r.length === 1 ? ' linha' : ' linhas') + ' · ' + data.columns.length + (data.columns.length === 1 ? ' coluna' : ' colunas');
      root.querySelector('.dt-page').textContent = (page + 1) + ' / ' + pages;
      root.querySelector('.dt-pager').hidden = pages <= 1;
    }
    root.querySelector('input').addEventListener('input', function (e) { query = e.target.value; page = 0; render(); });
    thead.addEventListener('click', function (e) {
      const b = e.target.closest('button[data-c]'); if (!b) return;
      const c = +b.dataset.c;
      if (sortCol === c) { if (sortDir === 1) sortDir = -1; else { sortCol = -1; sortDir = 1; } } else { sortCol = c; sortDir = 1; }
      render();
    });
    root.querySelector('.dt-pager').addEventListener('click', function (e) {
      const b = e.target.closest('button[data-p]'); if (!b) return;
      page = Math.max(0, page + (+b.dataset.p)); render();
    });
    render();
  }

  /* ----------------------- Realce de SQL (blocos estáticos) ----------------------- */
  const KW = 'SELECT|FROM|WHERE|AND|OR|NOT|IN|IS|NULL|AS|ON|JOIN|LEFT|RIGHT|INNER|OUTER|FULL|GROUP|BY|ORDER|HAVING|LIMIT|DISTINCT|UNION|ALL|INTERSECT|EXCEPT|CASE|WHEN|THEN|ELSE|END|WITH|RECURSIVE|CREATE|TABLE|VIEW|INDEX|TRIGGER|PROCEDURE|BEGIN|INSERT|INTO|VALUES|UPDATE|SET|DELETE|PRIMARY|KEY|REFERENCES|INTEGER|TEXT|REAL|AUTOINCREMENT|DESC|ASC|BETWEEN|LIKE|EXISTS|OVER|PARTITION|ROWS|PRECEDING|CURRENT|ROW|AFTER|BEFORE|EACH|CONFLICT|DO|EXEC|DEFAULT';
  const kwRe = new RegExp('\\b(' + KW + ')\\b', 'gi');
  function highlightSql(code) {
    // separa strings e comentários antes de escapar, para não colorir entidades HTML
    return String(code).split(/('(?:[^']|'')*'|--[^\n]*)/g).map(function (part, i) {
      if (i % 2) return '<span class="' + (part.charAt(0) === "'" ? 't-str' : 't-com') + '">' + esc(part) + '</span>';
      return esc(part).replace(kwRe, '<span class="t-kw">$1</span>')
        .replace(/\b(\d+(?:\.\d+)?)\b/g, '<span class="t-num">$1</span>');
    }).join('');
  }

  /* -------------------------------- Confete -------------------------------- */
  function confetti(intensity) {
    if (global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const cv = document.createElement('canvas');
    cv.className = 'confetti';
    document.body.appendChild(cv);
    const ctx = cv.getContext('2d');
    const dpr = global.devicePixelRatio || 1;
    cv.width = innerWidth * dpr; cv.height = innerHeight * dpr; ctx.scale(dpr, dpr);
    const colors = ['#4d7cff', '#a46bff', '#2fd8f0', '#e9ecff', '#f5c86b'];
    const n = intensity === 'legend' ? 320 : 150;
    const parts = Array.from({ length: n }, function () {
      return { x: innerWidth / 2 + (Math.random() - 0.5) * 200, y: innerHeight * 0.35, vx: (Math.random() - 0.5) * 16, vy: -Math.random() * 15 - 4,
        s: Math.random() * 7 + 3, r: Math.random() * 6, vr: (Math.random() - 0.5) * 0.3, c: colors[(Math.random() * colors.length) | 0], life: 0 };
    });
    let frame = 0;
    (function tick() {
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      parts.forEach(function (p) {
        p.vy += 0.32; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.r += p.vr;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.fillStyle = p.c; ctx.globalAlpha = Math.max(0, 1 - frame / 170);
        ctx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); ctx.restore();
      });
      if (++frame < 180) requestAnimationFrame(tick); else cv.remove();
    })();
  }

  /** Copia texto com fallback por seleção manual. */
  function copyText(text, okMsg) {
    const fallback = function () {
      const ta = document.createElement('textarea'); ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      let ok = false; try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
      ta.remove();
      toast(ok ? okMsg : 'Não foi possível copiar automaticamente. Selecione o texto e copie manualmente.', ok ? 'success' : 'warn');
    };
    try {
      navigator.clipboard.writeText(text).then(function () { toast(okMsg, 'success'); }, fallback);
    } catch (e) { fallback(); }
  }

  /** O app está rodando dentro de um visualizador (iframe)? Downloads/impressão podem estar bloqueados. */
  const framed = (function () { try { return global.self !== global.top; } catch (e) { return true; } })();

  /** Texto com trechos em inglês marcados por ⟦…⟧ → HTML (inglês destacado e com lang="en"). */
  function rich(s) { return esc(s).replace(/⟦([^⟧]*)⟧/g, '<span class="en" lang="en">$1</span>'); }
  /** Remove as marcas de inglês. */
  function plain(s) { return String(s == null ? '' : s).replace(/[⟦⟧]/g, ''); }
  global.UI = { ICON_PATHS: P, logo: logo, esc: esc, rich: rich, plain: plain, fmt: fmt, fmtDate: fmtDate, icon: icon, toast: toast, modal: modal, dataTable: dataTable, highlightSql: highlightSql, confetti: confetti, copyText: copyText, framed: framed };
})(window);
