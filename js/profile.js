/* =====================================================================
   profile.js — Bloco de perfil: foto ou avatar, bio e hobbies
   ---------------------------------------------------------------------
   • Foto: o arquivo é reduzido no navegador para 256×256 (JPEG) e
     salvo no perfil local. Nada é enviado para servidores.
   • Avatares prontos: 12 ícones neon.
   • Bio: até 280 caracteres.
   • Hobbies: até 5, escolhidos da lista ou digitados.
   ===================================================================== */
(function (global) {
  'use strict';
  const { esc, icon, toast } = global.UI;
  const P = global.UI.ICON_PATHS;

  const AVATARS = [
    { id: 'db', a: '#2fd8f0', b: '#4d7cff' }, { id: 'table', a: '#4ade80', b: '#10b981' }, { id: 'bars', a: '#ffd76a', b: '#f2a900' },
    { id: 'code', a: '#fff59d', b: '#c9b416' }, { id: 'sparkle', a: '#d8b4fe', b: '#a46bff' }, { id: 'bell', a: '#d6dbe8', b: '#8e94b0' },
    { id: 'flame', a: '#ff9d5c', b: '#ff5c7a' }, { id: 'star', a: '#ff5ccf', b: '#a46bff' }, { id: 'target', a: '#2fd8f0', b: '#10b981' },
    { id: 'trophy', a: '#ffd27a', b: '#ff9d5c' }, { id: 'moon', a: '#7aa2ff', b: '#5b3fd6' }, { id: 'heart', a: '#ff7aa8', b: '#ff4d6d' },
  ];
  const HOBBIES = ['Leitura', 'Games', 'Música', 'Cinema e séries', 'Esportes', 'Corrida', 'Academia', 'Ciclismo', 'Viagens', 'Culinária',
    'Fotografia', 'Desenho', 'Programação', 'Xadrez', 'Tecnologia', 'Natureza', 'Pets', 'Idiomas', 'Voluntariado', 'Dança',
    'Podcasts', 'Futebol', 'Jardinagem', 'Investimentos'];
  const MAX_HOBBIES = 5, MAX_BIO = 280;

  function avatarSvg(id) {
    const av = AVATARS.find(function (a) { return a.id === id; }) || AVATARS[0];
    const gid = 'avg-' + av.id;
    return '<svg viewBox="0 0 48 48" aria-hidden="true"><defs><linearGradient id="' + gid + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + av.a + '"/><stop offset="1" stop-color="' + av.b + '"/></linearGradient></defs>' +
      '<rect width="48" height="48" fill="#0b0e1a"/><circle cx="24" cy="24" r="22" fill="url(#' + gid + ')" opacity=".22"/><circle cx="24" cy="24" r="21" fill="none" stroke="url(#' + gid + ')" stroke-width="2"/>' +
      '<g transform="translate(9 9) scale(1.25)" fill="none" stroke="' + av.a + '" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">' + (P[av.id] || '') + '</g></svg>';
  }
  /** HTML do avatar: foto enviada > avatar escolhido > foto do Google > inicial. */
  function avatarHtml(p) {
    if (p.photo) return '<img src="' + esc(p.photo) + '" alt="">';
    if (p.avatar) return avatarSvg(p.avatar);
    if (p.picture) return '<img src="' + esc(p.picture) + '" alt="" referrerpolicy="no-referrer">';
    return '<span class="av-initial">' + esc((p.apelido || p.nome || '?').charAt(0).toUpperCase()) + '</span>';
  }

  /** Reduz a imagem para um quadrado de 256 px (recorte central). */
  function resizeImage(file) {
    return new Promise(function (res, rej) {
      if (!/^image\//.test(file.type)) return rej(new Error('Escolha um arquivo de imagem (JPG, PNG ou WebP).'));
      if (file.size > 15 * 1024 * 1024) return rej(new Error('A imagem tem mais de 15 MB. Escolha uma menor.'));
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = function () {
        const s = Math.min(img.naturalWidth, img.naturalHeight), size = 256;
        const cv = document.createElement('canvas'); cv.width = size; cv.height = size;
        const c = cv.getContext('2d'); c.imageSmoothingQuality = 'high';
        c.drawImage(img, (img.naturalWidth - s) / 2, (img.naturalHeight - s) / 2, s, s, 0, 0, size, size);
        URL.revokeObjectURL(url);
        res(cv.toDataURL('image/jpeg', 0.86));
      };
      img.onerror = function () { URL.revokeObjectURL(url); rej(new Error('Não foi possível ler esta imagem.')); };
      img.src = url;
    });
  }

  /**
   * Bloco "Perfil público" na página de perfil.
   * onChange é chamado após cada alteração (para atualizar o topo).
   */
  function mount(host, st, S, onChange) {
    const p = st.profile;
    if (!Array.isArray(p.hobbies)) p.hobbies = [];
    // rascunho: as alterações só valem ao clicar em "Salvar alterações"
    const snap = function () { return { photo: p.photo || '', avatar: p.avatar || '', bio: p.bio || '', hobbies: p.hobbies.slice() }; };
    let d = snap();
    const dirty = function () { const o = snap(); return o.photo !== d.photo || o.avatar !== d.avatar || o.bio !== d.bio.trim() || o.hobbies.join('|') !== d.hobbies.join('|'); };

    function paint() {
      const custom = d.hobbies.filter(function (h) { return HOBBIES.indexOf(h) < 0; }).concat(p.hobbies.filter(function (h) { return HOBBIES.indexOf(h) < 0 && d.hobbies.indexOf(h) < 0; }));
      const full = d.hobbies.length >= MAX_HOBBIES;
      const prev = { photo: d.photo, avatar: d.avatar, apelido: p.apelido, nome: p.nome, picture: p.picture };
      host.innerHTML =
        '<header class="card-h"><h2>Perfil público</h2><span class="pf-saved" aria-live="polite"></span></header>' +
        '<div class="pf-grid">' +
          '<div class="pf-photo">' +
            '<div class="pf-avatar">' + avatarHtml(prev) + '</div>' +
            '<div class="pf-photo-actions">' +
              '<label class="btn btn-primary sm">' + icon('camera') + 'Carregar foto<input type="file" accept="image/*" id="pf-file" hidden></label>' +
              (d.photo || d.avatar ? '<button class="btn btn-quiet sm" id="pf-remove">' + icon('x') + 'Remover</button>' : '') +
            '</div>' +
            '<p class="muted sm">A foto é reduzida para 256 px.</p>' +
          '</div>' +
          '<div class="pf-fields">' +
            '<span class="pf-label">Ou escolha um avatar</span>' +
            '<div class="av-grid" role="radiogroup" aria-label="Avatares">' + AVATARS.map(function (a) {
              const on = !d.photo && d.avatar === a.id;
              return '<button class="av-opt' + (on ? ' on' : '') + '" role="radio" aria-checked="' + on + '" data-av="' + a.id + '" aria-label="Avatar ' + a.id + '">' + avatarSvg(a.id) + '</button>';
            }).join('') + '</div>' +
            '<label class="field"><span class="pf-label">Bio <small class="muted" id="bio-count">' + d.bio.length + '/' + MAX_BIO + '</small></span>' +
              '<textarea id="pf-bio" rows="3" maxlength="' + MAX_BIO + '" placeholder="Conte em poucas linhas quem você é, o que estuda e seus objetivos com dados.">' + esc(d.bio) + '</textarea></label>' +
          '</div>' +
        '</div>' +
        '<div class="pf-hobbies">' +
          '<span class="pf-label">Hobbies <small class="muted">' + d.hobbies.length + '/' + MAX_HOBBIES + (full ? ' · limite atingido' : ' · escolha até 5') + '</small></span>' +
          '<div class="chips" role="group" aria-label="Hobbies">' +
            HOBBIES.concat(custom).map(function (h) {
              const on = d.hobbies.indexOf(h) >= 0;
              return '<button class="chip' + (on ? ' on' : '') + '" aria-pressed="' + on + '" data-h="' + esc(h) + '"' + (!on && full ? ' disabled' : '') + '>' + (on ? icon('check') : '') + esc(h) + '</button>';
            }).join('') +
          '</div>' +
          '<form class="pf-add" id="pf-add"><input id="pf-hobby" maxlength="24" placeholder="Outro hobby"' + (full ? ' disabled' : '') + '><button class="btn btn-ghost sm"' + (full ? ' disabled' : '') + '>' + icon('plus') + 'Adicionar</button></form>' +
        '</div>' +
        '<div class="pf-savebar" id="pf-savebar" hidden><span>' + icon('bulb') + 'Você tem alterações não salvas.</span>' +
          '<div class="pf-savebar-btns"><button class="btn btn-quiet sm" id="pf-discard">Descartar</button><button class="btn btn-primary sm" id="pf-save">' + icon('check') + 'Salvar alterações</button></div></div>';
      bind(); refreshBar();
    }
    function refreshBar() {
      const bar = host.querySelector('#pf-savebar'); if (!bar) return;
      const on = dirty(); bar.hidden = !on; host.classList.toggle('pf-dirty', on);
    }
    function flash(msg) { const f = host.querySelector('.pf-saved'); if (!f) return; f.textContent = msg; f.classList.add('on'); clearTimeout(f._t); f._t = setTimeout(function () { f.classList.remove('on'); }, 2200); }
    function commit(quiet) {
      p.photo = d.photo; p.avatar = d.avatar; p.bio = d.bio.trim(); p.hobbies = d.hobbies.slice();
      S.saveNow(); if (onChange) onChange();
      if (!quiet) { const a = document.activeElement; if (a && a.blur) a.blur(); toast('Perfil salvo.', 'success'); }
      d = snap(); paint(); if (!quiet) flash('Alterações salvas');
    }
    function bind() {
      host.querySelector('#pf-file').onchange = function (e) {
        const f = e.target.files && e.target.files[0]; if (!f) return;
        resizeImage(f).then(function (data) { d.photo = data; d.avatar = ''; paint(); }).catch(function (err) { toast(err.message, 'error'); });
      };
      const rm = host.querySelector('#pf-remove');
      if (rm) rm.onclick = function () { d.photo = ''; d.avatar = ''; paint(); };
      host.querySelectorAll('[data-av]').forEach(function (b) { b.onclick = function () { d.avatar = b.dataset.av; d.photo = ''; paint(); }; });
      const bio = host.querySelector('#pf-bio'), cnt = host.querySelector('#bio-count');
      bio.oninput = function () { d.bio = bio.value; cnt.textContent = bio.value.length + '/' + MAX_BIO; refreshBar(); };
      host.querySelectorAll('[data-h]').forEach(function (b) {
        b.onclick = function () {
          const h = b.dataset.h, i = d.hobbies.indexOf(h);
          if (i >= 0) d.hobbies.splice(i, 1);
          else if (d.hobbies.length >= MAX_HOBBIES) { toast('Você pode escolher até 5 hobbies.', 'warn'); return; }
          else d.hobbies.push(h);
          paint();
        };
      });
      host.querySelector('#pf-add').onsubmit = function (e) {
        e.preventDefault();
        const inp = host.querySelector('#pf-hobby');
        const v = inp.value.trim().replace(/\s+/g, ' ');
        if (!v) return;
        if (d.hobbies.some(function (h) { return h.toLowerCase() === v.toLowerCase(); })) { toast('Esse hobby já está na sua lista.', 'info'); return; }
        if (d.hobbies.length >= MAX_HOBBIES) { toast('Você pode escolher até 5 hobbies.', 'warn'); return; }
        const preset = HOBBIES.find(function (h) { return h.toLowerCase() === v.toLowerCase(); });
        d.hobbies.push(preset || v.charAt(0).toUpperCase() + v.slice(1));
        paint();
        const again = host.querySelector('#pf-hobby'); if (again && !again.disabled) again.focus();
      };
      host.querySelector('#pf-save').onclick = function () { commit(false); };
      host.querySelector('#pf-discard').onclick = function () { const a = document.activeElement; if (a && a.blur) a.blur(); d = snap(); paint(); flash('Alterações descartadas'); };
    }
    paint();
    // ao sair da página com alterações pendentes, elas são salvas para não se perderem
    return function () { if (dirty()) { commit(true); toast('Alterações do perfil salvas.', 'info'); } };
  }


  /** Cartão de perfil para o Painel: foto/avatar, nome, bio e hobbies. */
  function summaryHtml(p) {
    const hob = Array.isArray(p.hobbies) ? p.hobbies : [];
    return '<section class="pf-strip glass">' +
      '<a class="pf-strip-av" href="#perfil" aria-label="Abrir perfil">' + avatarHtml(p) + '</a>' +
      '<div class="pf-strip-main"><div class="pf-strip-name"><b>' + esc((p.nome || '') + ' ' + (p.sobrenome || '')) + '</b>' + (p.apelido ? '<span class="muted">@' + esc(p.apelido) + '</span>' : '') + '</div>' +
        (p.bio ? '<p class="pf-strip-bio">' + esc(p.bio) + '</p>' : '<p class="pf-strip-bio muted">Você ainda não escreveu uma bio. <a href="#perfil">Conte quem você é</a>.</p>') +
        (hob.length ? '<ul class="pf-strip-hob" aria-label="Hobbies">' + hob.map(function (h) { return '<li>' + esc(h) + '</li>'; }).join('') + '</ul>' : '<p class="muted sm pf-strip-nohob"><a href="#perfil">Escolha até 5 hobbies</a> para mostrar aqui.</p>') +
      '</div>' +
      '<a class="btn btn-ghost sm pf-strip-edit" href="#perfil">' + icon('user') + 'Editar perfil</a>' +
    '</section>';
  }

  global.Profile = { summaryHtml: summaryHtml, AVATARS: AVATARS, HOBBIES: HOBBIES, MAX_HOBBIES: MAX_HOBBIES, avatarHtml: avatarHtml, avatarSvg: avatarSvg, mount: mount, resizeImage: resizeImage };
})(window);
