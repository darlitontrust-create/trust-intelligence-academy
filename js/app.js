/* =====================================================================
   app.js — Orquestração da plataforma
   ---------------------------------------------------------------------
   Carrega bibliotecas (SQLite e CodeMirror), controla login, rotas,
   layout (menu lateral, barra global de progresso) e as telas:
   Painel, Trilha, Exercício, Conquistas, Ranking, Certificado e Perfil.
   ===================================================================== */
(function (global) {
  'use strict';
  const { esc, fmt, fmtDate, icon, toast, modal, dataTable, highlightSql, confetti, copyText } = global.UI;
  const G = global.Gamification;
  const BANK = global.ExerciseBank;
  const S = global.AppStorage;
  const app = document.getElementById('app');

  /* ----------------------------- Bibliotecas ----------------------------- */
  const CM = 'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/';
  const CM_FILES = ['codemirror.min.js', 'mode/sql/sql.min.js', 'addon/hint/show-hint.min.js', 'addon/hint/sql-hint.min.js', 'addon/edit/matchbrackets.min.js', 'addon/edit/closebrackets.min.js', 'addon/selection/active-line.min.js'];
  const SQLJS = ['https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/sql-asm.js', 'https://cdn.jsdelivr.net/npm/sql.js@1.10.3/dist/sql-asm.js'];

  function loadScript(src) {
    return new Promise(function (res, rej) {
      const s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = function () { rej(new Error(src)); };
      document.head.appendChild(s);
    });
  }
  async function loadFirst(list) {
    for (const src of list) { try { await loadScript(src); return true; } catch (e) { /* tenta o próximo */ } }
    return false;
  }
  function setLoader(text, pct) {
    const t = document.getElementById('loader-text'); if (t) t.textContent = text;
    const b = document.getElementById('loader-bar'); if (b) b.style.width = pct + '%';
  }

  /* -------------------------------- Boot -------------------------------- */
  async function boot() {
    setLoader('Carregando motor SQLite…', 15);
    const okSql = await loadFirst(SQLJS);
    if (!okSql) return fatal('Não foi possível carregar o motor SQLite. Verifique sua conexão e recarregue a página.');
    setLoader('Preparando banco da NexusMarket…', 55);
    try { await global.SQLEngine.init(); global.SQLEngine.getSchema(); }
    catch (e) { return fatal('Falha ao iniciar o SQLite: ' + e.message); }
    setLoader('Carregando editor…', 75);
    try { for (const f of CM_FILES) await loadScript(CM + f); } catch (e) { /* editor simples será usado */ }
    setLoader('Recuperando seu progresso…', 95);
    S.on(onStorageEvent);
    const sess = S.getSession();
    const C = global.Cloud;
    let cloudUser = null, cloudData = null, offline = false;
    if (C && C.enabled() && ((sess && String(sess.uid).indexOf('fb:') === 0) || C.redirectPending())) {
      setLoader('Conectando à nuvem…', 97);
      try {
        cloudUser = await Promise.race([C.currentUser(), new Promise(function (r) { setTimeout(function () { r('timeout'); }, 12000); })]);
        if (cloudUser === 'timeout') { cloudUser = null; offline = true; }
        if (cloudUser) cloudData = await C.load(cloudUser.uid).catch(function () { offline = true; return null; });
      } catch (e) { offline = true; }
    }
    document.getElementById('loader').classList.add('out');
    setTimeout(function () { const l = document.getElementById('loader'); if (l) l.remove(); }, 500);
    const mode = cloudUser && C.lastRedirectMode();
    if (cloudUser && mode === 'upgrade' && sess && sess.uid && String(sess.uid).indexOf('fb:') !== 0) {
      const local = S.peek(sess.uid);   // veio do "Salvar na nuvem" por redirect: une o progresso local
      if (local) {
        local.profile = Object.assign({}, local.profile, { provider: 'google', email: cloudUser.email || '' });
        cloudData = cloudData ? S.mergeStates(local, cloudData) : local;
      }
    }
    if (cloudUser) startSession('fb:' + cloudUser.uid, C.profileFrom(cloudUser), cloudData);
    else if (sess && sess.uid && String(sess.uid).indexOf('fb:') === 0 && !offline) { S.logout(); showLogin(); }
    else if (sess && sess.uid) { startSession(sess.uid); if (offline) toast('Sem conexão com a nuvem: usando a cópia salva neste navegador. Tudo será enviado quando a internet voltar.', 'warn', 6000); }
    else showLogin();
  }
  function fatal(msg) {
    setLoader(msg, 100);
    document.getElementById('loader').classList.add('error');
  }

  function onStorageEvent(type) {
    if (type === 'saved') {
      const el = document.getElementById('save-state');
      const hm = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      const C = global.Cloud;
      if (el && C && C.enabled() && !C.uid) {
        C.preload();
        el.innerHTML = icon('shield') + 'Salvo só neste navegador ' + hm + ' · <button class="link-btn" id="go-cloud">Salvar na nuvem</button>';
        el.querySelector('#go-cloud').onclick = upgradeToCloud;
      } else if (el) el.innerHTML = icon('shield') + (S.available ? 'Salvo ' : 'Em memória ') + hm;
    }
    if (type === 'restored') toast('Recuperamos seu progresso a partir da cópia de segurança.', 'warn', 5000);
    if (type === 'remote') onRemoteProgress();
  }
  /** Outro aparelho enviou progresso: atualiza a tela sem atrapalhar quem está digitando. */
  let remoteToastAt = 0;
  function onRemoteProgress() {
    if (!document.getElementById('view')) return;
    refreshChrome();
    const h = (location.hash || '#temas').slice(1);
    const busy = h.indexOf('ex-') === 0 || h === 'perfil' || document.body.classList.contains('exam-open') || document.querySelector('.modal-wrap');
    if (!busy) { const y = global.scrollY; route({ quiet: true }); global.scrollTo(0, y); }
    if (!remoteToastAt) { remoteToastAt = Date.now(); toast('Progresso sincronizado com seus outros aparelhos.', 'info'); }
  }
  function onCloudEvent(type, info) {
    const el = document.getElementById('save-state'); if (!el) return;
    const hm = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    if (type === 'synced') { el.innerHTML = icon('shield') + 'Salvo na nuvem ' + hm; el.classList.remove('warn'); }
    else if (type === 'syncing' || type === 'pending') el.innerHTML = icon('refresh') + 'Sincronizando…';
    else if (type === 'error') { el.innerHTML = icon('shield') + 'Salvo neste aparelho · nuvem pendente'; el.classList.add('warn'); el.title = info || ''; }
  }
  if (global.Cloud) global.Cloud.on(onCloudEvent);

  /* ------------------------------ Sessão ------------------------------ */
  /** Leva quem está sem login (ou com perfil local) para a conta Google, junto com o progresso. */
  function upgradeToCloud() {
    const C = global.Cloud;
    S.saveNow(true);
    C.signIn({ upgrade: true }).then(function (u) {
      if (!u) return;   // seguiu por redirect; o boot conclui a troca
      const seed = C.profileFrom(u);
      return C.load(u.uid).catch(function () { return null; }).then(function (cloud) {
        const cur = S.plain();
        cur.profile = Object.assign({}, cur.profile, { provider: 'google', email: seed.email, picture: cur.profile.picture || seed.picture });
        // une o progresso deste navegador com o que já existe na conta (nada é perdido)
        const data = cloud ? S.mergeStates(cur, cloud) : cur;
        toast(cloud ? 'Juntamos o progresso deste navegador com o da sua conta.' : 'Pronto! Seu progresso agora fica salvo na sua conta Google.', 'success', 5000);
        S.logout();
        startSession('fb:' + u.uid, seed, data);
      });
    }).catch(function (e) { if (e.message !== 'Login cancelado.') toast(esc(e.message), 'error', 6000); });
  }
  function showLogin() {
    document.body.classList.add('is-login');
    if (global.Cloud) global.Cloud.preload();
    global.Auth.renderLogin(app, function (res) {
      if (!res.cloud) return startSession(res.id, res.profile);
      const fbUid = res.id.slice(3);
      global.Cloud.load(fbUid).catch(function () { return null; }).then(function (data) {
        // primeiro acesso com Google: oferece trazer o progresso feito sem login neste navegador
        const guest = !data && !S.peek(res.id) && S.peek('guest');
        const hasGuest = guest && guest.tracks && Object.keys(guest.tracks).some(function (k) { return Object.keys(guest.tracks[k].solved || {}).length; });
        if (hasGuest) {
          guest.profile = Object.assign({}, guest.profile, { provider: 'google', email: res.profile.email, picture: res.profile.picture || guest.profile.picture || '' });
          data = guest; data.savedAt = new Date().toISOString();
          toast('Levamos para a sua conta o progresso que estava salvo neste navegador.', 'success', 6000);
        }
        startSession(res.id, res.profile, data);
      });
    });
  }
  function startSession(uid, profileSeed, cloudData) {
    const isCloud = String(uid).indexOf('fb:') === 0 && global.Cloud;
    if (isCloud) { global.Cloud.attach(uid.slice(3)); S.setRemote(function (state) { global.Cloud.queueSave(state); }); }
    const st = S.load(uid, profileSeed, cloudData);
    if (isCloud) { global.Cloud.queueSave(st); global.Cloud.refreshBoard(st.currentTrack); }
    document.body.classList.remove('is-login');
    global.Auth.ensureProfile(st, function () {
      mountShell();
      if (!S.available) toast('Seu navegador bloqueou o armazenamento local. O progresso vale só nesta aba; gere um backup em Perfil.', 'warn', 7000);
      if (!location.hash || location.hash === '#') location.hash = 'temas'; else route();
    });
    // enquanto o modal obrigatório estiver aberto, mostra o fundo do app
    if (!(st.profile.nome && st.profile.sobrenome && st.profile.apelido)) app.innerHTML = '<div class="onboard-bg"></div>';
  }

  /* ------------------------------ Layout ------------------------------ */
  const NAV = [
    { id: 'temas', label: 'Temas', ic: 'grid' },
    { id: 'dashboard', label: 'Painel', ic: 'home' },
    { id: 'trilha', label: 'Trilha', ic: 'map' },
    { id: 'conquistas', label: 'Conquistas', ic: 'trophy' },
    { id: 'ranking', label: 'Ranking', ic: 'bars' },
    { id: 'certificado', label: 'Certificados', ic: 'award' },
    { id: 'perfil', label: 'Perfil', ic: 'user' },
  ];
  function mountShell() {
    app.innerHTML =
      '<div class="shell">' +
        '<aside class="side">' +
          '<a class="brand" href="#temas">' + global.UI.logo('sm') + '<span class="brand-2l"><b>Trust Intelligence</b><small>Academy</small></span></a>' +
          '<a class="track-switch" href="#temas" id="track-switch"></a>' +
          '<nav class="nav" aria-label="Principal">' + NAV.map(function (n) { return '<a href="#' + n.id + '" data-nav="' + n.id + '">' + icon(n.ic) + '<span>' + n.label + '</span></a>'; }).join('') + '</nav>' +
          '<div class="side-card" id="side-card"></div>' +
        '</aside>' +
        '<div class="main">' +
          '<header class="top">' +
            '<div class="top-progress" title="Progresso global"><i id="gp-bar"></i></div>' +
            '<div class="top-inner">' +
              '<div class="top-left"><span class="gp-label" id="gp-label"></span></div>' +
              '<div class="top-right"><span class="save-state" id="save-state"></span><button class="icon-btn sm" id="sound-btn" aria-pressed="true"></button><span class="xp-chip" id="xp-chip"></span>' +
              '<a class="avatar" href="#perfil" id="avatar" aria-label="Perfil"></a></div>' +
            '</div>' +
          '</header>' +
          '<main id="view" class="view" tabindex="-1"></main>' +
        '</div>' +
        '<nav class="bottom-nav" aria-label="Navegação">' + NAV.filter(function (n) { return ['temas', 'dashboard', 'trilha', 'conquistas', 'ranking', 'certificado'].indexOf(n.id) >= 0; }).map(function (n) { return '<a href="#' + n.id + '" data-nav="' + n.id + '">' + icon(n.ic) + '<span>' + n.label + '</span></a>'; }).join('') + '</nav>' +
      '</div>' +
      '<div id="print-area"></div>';
    refreshChrome();
    onStorageEvent('saved');
    const sb = document.getElementById('sound-btn');
    const paintSound = function () {
      const on = global.Sfx.enabled();
      sb.innerHTML = icon(on ? 'volume' : 'mute');
      sb.setAttribute('aria-pressed', on ? 'true' : 'false');
      sb.setAttribute('aria-label', on ? 'Desligar sons de vitória' : 'Ligar sons de vitória');
      sb.title = on ? 'Sons de vitória ligados' : 'Sons de vitória desligados';
      sb.classList.toggle('off', !on);
    };
    sb.onclick = function () {
      const on = !global.Sfx.enabled(); global.Sfx.setEnabled(on); paintSound();
      if (on) global.Sfx.play('goal');
      toast(on ? 'Sons de vitória ligados.' : 'Sons de vitória desligados.', 'info');
    };
    paintSound();
  }
  /** Atualiza barra global, chip de XP, avatar e card lateral. */
  function refreshChrome() {
    const st = S.state; if (!st || !document.getElementById('gp-bar')) return;
    if (global.Overview.isOverview(st)) return overviewChrome(st);
    const solved = G.solvedList(st).length;
    document.getElementById('gp-bar').style.width = (solved / 150 * 100) + '%';
    document.getElementById('gp-label').innerHTML = '<b>' + solved + '</b>/150 exercícios<span class="hide-sm"> · ' + Math.round(solved / 1.5) + '% da trilha</span>';
    const role = G.currentRole(st);
    document.getElementById('xp-chip').innerHTML = icon('sparkle') + '<b>' + fmt(st.progress.xp) + '</b> XP';
    const av = document.getElementById('avatar');
    av.innerHTML = global.Profile.avatarHtml(st.profile);
    const next = G.nextRole(st);
    const tr = global.Tracks.get(st.currentTrack) || global.Tracks.TRACKS[0];
    document.getElementById('track-switch').innerHTML = icon(tr.icon) + '<span><small>Tema atual</small><b>' + esc(tr.nome) + '</b></span>' + icon('chevR');
    document.getElementById('side-card').innerHTML =
      '<span class="eyebrow">Cargo atual</span><b class="side-role">' + esc(role.nome) + '</b>' +
      (next ? '<div class="mini-bar"><i style="width:' + next.pct * 100 + '%"></i></div><span class="muted sm">Próximo: ' + esc(next.role.nome) + '</span>' : '<span class="muted sm">Topo da carreira alcançado</span>');
  }

  /** Topo, XP e card lateral somando todas as trilhas. */
  function overviewChrome(st) {
    const o = global.Overview.chrome(st), T = o.T;
    document.getElementById('gp-bar').style.width = (T.total ? T.solved / T.total * 100 : 0) + '%';
    document.getElementById('gp-label').innerHTML = '<b>' + T.solved + '</b>/' + T.total + ' exercícios<span class="hide-sm"> · ' + Math.round(T.total ? T.solved / T.total * 100 : 0) + '% da academia</span>';
    document.getElementById('xp-chip').innerHTML = icon('sparkle') + '<b>' + fmt(T.xp) + '</b> XP';
    document.getElementById('avatar').innerHTML = global.Profile.avatarHtml(st.profile);
    document.getElementById('track-switch').innerHTML = icon('grid') + '<span><small>Visão geral</small><b>Todas as trilhas</b></span>' + icon('chevR');
    document.getElementById('side-card').innerHTML = '<span class="eyebrow">Cargos atuais</span><ul class="side-roles">' + o.sum.map(function (s) {
      return '<li style="--ta:' + s.t.color.a + '"><i></i><span><small>' + esc(s.t.short) + '</small><b>' + esc(s.role.nome) + '</b></span></li>';
    }).join('') + '</ul>';
  }

  /* ------------------------------- Rotas ------------------------------- */
  global.addEventListener('hashchange', route);
  // celular: com o teclado aberto, a barra de navegação inferior sai da frente do editor
  (function () {
    const isField = function (el) { return el && (el.matches('input:not([type=checkbox]):not([type=radio]):not([type=file]), textarea, select') || el.isContentEditable); };
    document.addEventListener('focusin', function (e) { if (isField(e.target)) document.body.classList.add('kb-open'); });
    document.addEventListener('focusout', function () { setTimeout(function () { if (!isField(document.activeElement)) document.body.classList.remove('kb-open'); }, 80); });
  })();
  let currentCleanup = null;
  /** Desenha a tela do endereço atual. quiet: redesenho da mesma tela (troca de escopo, sincronização)
      — sem animação de entrada e sem voltar ao topo, para a atualização passar quase despercebida. */
  function route(opts) {
    const quiet = !!(opts && opts.quiet === true);
    if (!S.state || !document.getElementById('view')) return;
    const h = (location.hash || '#temas').slice(1);
    const view = document.getElementById('view');
    if (currentCleanup) { currentCleanup(); currentCleanup = null; }
    const navId = h.indexOf('ex-') === 0 ? 'trilha' : h;
    document.querySelectorAll('[data-nav]').forEach(function (a) { a.classList.toggle('on', a.dataset.nav === navId); });
    if (!quiet) { view.classList.remove('enter'); void view.offsetWidth; view.classList.add('enter'); } else view.classList.remove('enter');
    const O = global.Overview;
    const page = O.PAGES.indexOf(h) >= 0 ? h : (h === 'temas' || h === 'perfil' || h.indexOf('ex-') === 0) ? null : 'dashboard';
    if (h.indexOf('ex-') === 0) {
      // abrir um exercício seleciona o tema dele
      const tid = O.trackOfExercise(h.slice(3));
      if (tid && (tid !== S.state.currentTrack || O.isOverview(S.state))) O.focus(tid);
    }
    if (h === 'temas') renderHub(view);
    else if (h.indexOf('ex-') === 0) renderExercise(view, h.slice(3));
    else if (h === 'perfil') renderProfile(view);
    else if (O.isOverview(S.state)) O.render(view, page, rerender);
    else if (page === 'trilha') renderTrail(view);
    else if (page === 'conquistas') renderAchievements(view);
    else if (page === 'ranking') renderRanking(view);
    else if (page === 'certificado') global.Certificate.render(view, S.state);
    else global.Dashboard.render(view, S.state);
    if (page) { view.insertAdjacentHTML('afterbegin', O.scopeBar(S.state, page)); O.bindScope(view, page, rerender); }
    if (!quiet) { view.scrollTop = 0; global.scrollTo(0, 0); }
    trackColors();
    refreshChrome();
  }
  /** Redesenha a página atual mantendo a rolagem (troca de escopo). */
  /** Cores da trilha atual para as telas compartilhadas (Gestão e Lean Six Sigma usam a mesma tela). */
  function trackColors() {
    const id = S.state && !global.Overview.isOverview(S.state) ? S.state.currentTrack : null;
    const de = document.documentElement.style;
    if (id === 'sixsigma') { de.setProperty('--tk-a', '#5eead4'); de.setProperty('--tk-b', '#14b8a6'); de.setProperty('--tk-c', '#99f6e4'); de.setProperty('--tk-ink', '#042f2e'); }
    else if (id === 'estatistica') { de.setProperty('--tk-a', '#a5b4fc'); de.setProperty('--tk-b', '#6366f1'); de.setProperty('--tk-c', '#c7d2fe'); de.setProperty('--tk-ink', '#0f1240'); }
    else ['--tk-a', '--tk-b', '--tk-c', '--tk-ink'].forEach(function (k) { de.removeProperty(k); });
  }
  function rerender() {
    const y = global.scrollY;
    route({ quiet: true });
    global.scrollTo(0, Math.min(y, 120));
  }

  /* ---------------------------- Desbloqueio ---------------------------- */
  function isUnlocked(st, ex) {
    if (st.settings.freeMode || ex.index === 0 || st.progress.solved[ex.id]) return true;
    return !!st.progress.solved[BANK.EXERCISES[ex.index - 1].id];
  }

  /** Cursos relacionados (hub e painel): botões que levam ao outro tema. */
  function relatedHtml(t, big) {
    const list = (t.related || []).map(function (r) { return { r: r, t: global.Tracks.get(r.id) }; }).filter(function (x) { return x.t && x.t.status === 'ativo'; });
    if (!list.length) return '';
    return '<div class="related' + (big ? ' big' : '') + '"><span class="related-k">' + icon('book') + 'Cursos relacionados</span>' + list.map(function (x) {
      return '<button type="button" class="related-b" data-related="' + x.t.id + '" style="--ta:' + x.t.color.a + ';--tb:' + x.t.color.b + '"><i>' + icon(x.t.icon) + '</i><span><small>' + esc(x.r.label) + '</small><b>' + esc(x.t.nome) + '</b></span></button>';
    }).join('') + '</div>';
  }
  function bindRelated(root) {
    root.querySelectorAll('[data-related]').forEach(function (b) { b.onclick = function (e) { e.stopPropagation(); global.Overview.focus(b.dataset.related); location.hash = 'dashboard'; global.dispatchEvent(new HashChangeEvent('hashchange')); }; });
  }
  global.Related = { html: relatedHtml, bind: bindRelated };

  /* ---------------------------- Hub de temas ---------------------------- */
  function renderHub(view) {
    const st = S.state;
    /** Executa fn com a trilha `id` como atual (para ler progresso e carreira dela). */
    function withTrack(id, fn) { const prev = st.currentTrack; st.currentTrack = id; try { return fn(); } finally { st.currentTrack = prev; } }
    view.innerHTML =
      '<section class="hub-hero">' +
        '<img class="hub-logo" src="assets/logo.png" alt="Logo Trust Intelligence Academy" width="132" height="132">' +
        '<div><p class="eyebrow">Trust Intelligence Academy</p><h1>Olá, ' + esc(st.profile.apelido || st.profile.nome) + '. O que vamos aprender hoje?</h1>' +
        '<p class="muted">Dados, BI e IA em trilhas práticas. Cada uma tem progresso, carreira, conquistas, provas e certificados próprios.</p></div>' +
      '</section>' +
      '<section class="hub-grid">' + global.Tracks.TRACKS.map(function (t) {
        const active = t.status === 'ativo';
        const tp = st.tracks[t.id];
        const solved = tp ? Object.keys(tp.solved).length : 0;
        let prog = '';
        if (active) {
          prog = withTrack(t.id, function () {
            const role = G.currentRole(st);
            const pack = global.Lessons.PACKS[t.id];
            const nLessons = pack ? Object.keys(pack.LESSONS).length : 0;
            const certs = global.Certificate.catalog(st);
            const gotC = certs.filter(function (c) { return c.unlocked; }).length;
            return '<div class="hub-prog"><div class="hub-prog-h"><span>' + esc(role.nome) + '</span><b>' + solved + '/' + t.total + '</b></div>' +
              '<div class="mini-bar lg"><i style="width:' + (solved / t.total * 100) + '%"></i></div></div>' +
              '<ul class="hub-levels">' + BANK.LEVELS.map(function (l) {
                const c = G.levelCount(st, l.id);
                const ps = G.PROMOTIONS.filter(function (p) { return p.level === l.id; }).map(function (p) { return p.nome; });
                return '<li><span class="hl-n">' + l.id + '</span><span class="hl-t"><b>' + esc(l.nome) + '</b><small>' + esc(ps.join(' · ')) + '</small></span><span class="hl-c">' + c + '/50</span></li>';
              }).join('') + '</ul>' +
              '<ul class="hub-feats"><li>' + icon('book') + nLessons + ' aulas narradas</li><li>' + icon('code') + (t.kind === 'excel' ? 'Planilha com correção automática' : t.kind === 'powerbi' ? 'Editor DAX com correção automática' : t.kind === 'gestao' ? 'Casos práticos com correção automática' : t.kind === 'sixsigma' ? 'Casos com dados reais e estatística na hora' : t.kind === 'estatistica' ? 'Cálculos e gráficos com dados reais' : t.kind === 'python' ? 'Python no navegador com correção automática' : t.kind === 'ingles' ? 'Diálogos com áudio e prática de fala' : 'Editor com correção automática') + '</li>' +
              '<li>' + icon('award') + gotC + '/' + certs.length + ' certificados com prova</li><li>' + icon('trophy') + 'Carreira até ' + esc(G.FINAL.nome) + '</li></ul>';
          });
        }
        return '<article class="hub-card glass ' + (active ? 'on' : 'soon') + '" style="--ta:' + t.color.a + ';--tb:' + t.color.b + '">' +
          '<div class="hub-card-h"><span class="hub-ic">' + icon(t.icon) + '</span><span class="hub-tag">' + (active ? esc(t.tag) : 'Em breve') + '</span></div>' +
          '<h2>' + esc(t.nome) + '</h2><p class="muted">' + esc(t.desc) + '</p>' +
          '<ul class="hub-facts">' + t.facts.map(function (f) { return '<li>' + esc(f) + '</li>'; }).join('') + '</ul>' +
          prog + relatedHtml(t) +
          (active ? '<button class="btn btn-primary" data-track="' + t.id + '">' + icon('play') + (solved ? 'Continuar' : 'Começar') + '</button>'
                  : '<button class="btn btn-ghost" disabled>' + icon('lock') + 'Disponível em breve</button>') +
        '</article>';
      }).join('') + '</section>';
    bindRelated(view);
    view.querySelectorAll('[data-track]').forEach(function (b) {
      b.onclick = function () { global.Overview.focus(b.dataset.track); location.hash = global.Tracks.get(b.dataset.track).start; };
    });
  }

  /* ------------------------------- Trilha ------------------------------- */
  function renderTrail(view) {
    const st = S.state;
    view.innerHTML = '<header class="page-h"><div><p class="eyebrow">Trilha de carreira</p><h1>150 exercícios em 3 níveis</h1>' +
      '<p class="muted">Cada exercício libera o próximo. Os dados são da NexusMarket, com data de referência 30/06/2026.</p></div></header>' +
      BANK.LEVELS.map(function (lv) {
        const list = BANK.EXERCISES.filter(function (e) { return e.level === lv.id; });
        const c = G.levelCount(st, lv.id);
        const promos = G.PROMOTIONS.filter(function (p) { return p.level === lv.id; });
        return '<section class="level glass">' +
          '<header class="level-h"><div><span class="eyebrow">Nível ' + lv.id + '</span><h2>' + lv.nome + '</h2></div>' +
          '<div class="level-meta"><b>' + c + '</b>/50<div class="mini-bar lg"><i style="width:' + (c * 2) + '%"></i>' +
          promos.map(function (p) { return '<span class="pm' + (c >= p.need ? ' got' : '') + '" style="left:' + (p.need * 2) + '%" title="' + esc(p.nome) + ' aos ' + p.need + '"></span>'; }).join('') + '</div></div></header>' +
          '<div class="promo-row">' + promos.map(function (p) { return '<span class="role-chip' + (c >= p.need ? '' : ' dim') + '">' + icon(c >= p.need ? 'award' : 'lock') + esc(p.nome) + ' · ' + p.need + '</span>'; }).join('') + '</div>' +
          '<ol class="tiles">' + list.map(function (e) {
            const done = st.progress.solved[e.id], open = isUnlocked(st, e);
            return '<li><a class="tile ' + (done ? 'done' : open ? 'open' : 'locked') + ' d-' + e.diff + '" ' + (open ? 'href="#ex-' + e.id + '"' : 'aria-disabled="true"') + ' title="' + esc(e.pos + '. ' + e.n + ' · ' + e.t) + '">' +
              '<span class="tn">' + e.pos + '</span>' + (done ? icon('check') : open ? '' : icon('lock')) + '<span class="tt">' + esc(e.t) + '</span></a></li>';
          }).join('') + '</ol>' +
        '</section>';
      }).join('');
  }

  /* ------------------------------ Exercício ------------------------------ */
  function createEditor(host, value, handlers) {
    if (global.CodeMirror) {
      const schema = global.SQLEngine.getSchema();
      const cm = global.CodeMirror(host, {
        value: value, mode: 'text/x-sqlite', theme: 'nexus', lineNumbers: true, indentUnit: 2, tabSize: 2, smartIndent: true,
        matchBrackets: true, autoCloseBrackets: true, styleActiveLine: true, lineWrapping: false, viewportMargin: Infinity,
        hintOptions: { tables: schema.cols, completeSingle: false },
        extraKeys: {
          Tab: function (c) { if (c.somethingSelected()) c.indentSelection('add'); else c.replaceSelection('  ', 'end'); },
          'Shift-Tab': function (c) { c.indentSelection('subtract'); },
          'Ctrl-Space': 'autocomplete',
          'Ctrl-Enter': handlers.run, 'Cmd-Enter': handlers.run,
          'Shift-Ctrl-Enter': handlers.submit, 'Shift-Cmd-Enter': handlers.submit,
        },
      });
      cm.on('inputRead', function (c, ch) {
        if (!/[\w.]/.test(ch.text[0] || '')) return;
        const tok = c.getTokenAt(c.getCursor());
        if (tok.string.length >= 2 || ch.text[0] === '.') c.showHint({ completeSingle: false });
      });
      let mark = null;
      cm.on('change', function () { if (mark) { cm.removeLineClass(mark, 'background', 'cm-err-line'); mark = null; } handlers.change(cm.getValue()); });
      setTimeout(function () { cm.refresh(); }, 30);
      return {
        get: function () { return cm.getValue(); }, set: function (v) { cm.setValue(v); },
        focus: function () { cm.focus(); },
        goTo: function (line, col) { cm.focus(); cm.setCursor({ line: line - 1, ch: Math.max(0, col - 1) }); cm.scrollIntoView(null, 80); },
        markError: function (line) { if (mark) cm.removeLineClass(mark, 'background', 'cm-err-line'); mark = cm.addLineClass(Math.max(0, line - 1), 'background', 'cm-err-line'); },
      };
    }
    // Editor alternativo (se o CodeMirror não carregar): textarea com Tab/Shift+Tab
    host.innerHTML = '<textarea class="plain-editor" spellcheck="false" aria-label="Editor SQL"></textarea>';
    const ta = host.querySelector('textarea'); ta.value = value;
    ta.addEventListener('keydown', function (e) {
      if (e.key === 'Tab') {
        e.preventDefault();
        const s = ta.selectionStart, en = ta.selectionEnd;
        if (e.shiftKey) { const ls = ta.value.lastIndexOf('\n', s - 1) + 1; if (ta.value.substr(ls, 2) === '  ') { ta.value = ta.value.slice(0, ls) + ta.value.slice(ls + 2); ta.selectionStart = ta.selectionEnd = Math.max(ls, s - 2); } }
        else { ta.value = ta.value.slice(0, s) + '  ' + ta.value.slice(en); ta.selectionStart = ta.selectionEnd = s + 2; }
        handlers.change(ta.value);
      } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); (e.shiftKey ? handlers.submit : handlers.run)(); }
      else if (e.key === 'Enter') {
        e.preventDefault(); const s = ta.selectionStart; const ls = ta.value.lastIndexOf('\n', s - 1) + 1;
        const ind = ta.value.slice(ls).match(/^\s*/)[0]; ta.value = ta.value.slice(0, s) + '\n' + ind + ta.value.slice(ta.selectionEnd);
        ta.selectionStart = ta.selectionEnd = s + 1 + ind.length; handlers.change(ta.value);
      }
    });
    ta.addEventListener('input', function () { handlers.change(ta.value); });
    return {
      get: function () { return ta.value; }, set: function (v) { ta.value = v; }, focus: function () { ta.focus(); },
      goTo: function (line, col) { const lines = ta.value.split('\n'); let idx = 0; for (let i = 0; i < line - 1; i++) idx += lines[i].length + 1; ta.focus(); ta.selectionStart = ta.selectionEnd = idx + col - 1; },
      markError: function () {},
    };
  }

  function starterCode(ex) {
    return '-- ' + ex.levelName + ' ' + ex.pos + '/50 · ' + ex.n + '\n-- Ctrl+Enter executa · Ctrl+Shift+Enter envia para correção\n\n';
  }

  /** Cabeçalho comum do exercício (usado no conteúdo e na prática). */
  function exHeader(st, ex, extra) {
    const prevEx = BANK.EXERCISES[ex.index - 1], nextEx = BANK.EXERCISES[ex.index + 1];
    const solved = st.progress.solved[ex.id];
    return '<header class="ex-h">' +
        '<div class="ex-h-l">' +
          '<nav class="crumbs"><a href="#trilha">Trilha</a>' + icon('chevR') + '<span>' + ex.levelName + '</span>' + icon('chevR') + '<span>' + ex.pos + ' de 50</span></nav>' +
          '<h1>' + esc(ex.n) + '</h1>' +
          '<div class="tags"><span class="tag tag-topic">' + icon('code') + esc(ex.t) + '</span><span class="tag d-' + ex.diff + '">' + G.DIFF_LABEL[ex.diff] + ' · ' + G.XP[ex.diff] + ' XP</span>' +
          (solved ? '<span class="tag tag-ok">' + icon('check') + 'Resolvido · +' + solved.xp + ' XP</span>' : '') + '</div>' +
        '</div>' +
        '<div class="ex-nav">' + (extra || '') +
          (prevEx ? '<a class="icon-btn" href="#ex-' + prevEx.id + '" aria-label="Exercício anterior">' + icon('chevL') + '</a>' : '') +
          (nextEx ? '<a class="icon-btn' + (isUnlocked(st, nextEx) ? '' : ' disabled') + '" ' + (isUnlocked(st, nextEx) ? 'href="#ex-' + nextEx.id + '"' : 'aria-disabled="true"') + ' aria-label="Próximo exercício">' + icon('chevR') + '</a>' : '') +
        '</div>' +
      '</header>';
  }

  /** Etapa de conteúdo: carrossel de 5 slides antes da prática. */
  function renderLessonStage(view, ex) {
    const st = S.state;
    view.innerHTML = exHeader(st, ex) + '<div id="lesson-host"></div>';
    const cleanup = global.Lessons.mount(view.querySelector('#lesson-host'), ex, {
      onStart: function () {
        st.progress.lessonsSeen[ex.id] = new Date().toISOString();
        const got = G.evaluate(st, {});
        S.saveNow();
        got.newAchievements.forEach(function (a) { toast('Conquista desbloqueada: <b>' + esc(a.nome) + '</b>', 'success', 4200); });
        renderExercise(view, ex.id, 'practice');
        global.scrollTo(0, 0);
      },
    });
    currentCleanup = cleanup;
    setTimeout(function () { const l = view.querySelector('.lesson'); if (l) l.focus({ preventScroll: true }); }, 50);
  }

  function renderExercise(view, id, mode) {
    const st = S.state;
    const ex = BANK.EXERCISES.find(function (e) { return e.id === id; });
    if (!ex) { view.innerHTML = '<div class="empty glass"><h2>Exercício não encontrado</h2><a class="btn btn-ghost" href="#trilha">Voltar para a trilha</a></div>'; return; }
    if (!isUnlocked(st, ex)) {
      const prev = BANK.EXERCISES[ex.index - 1];
      view.innerHTML = '<div class="empty glass">' + icon('lock', 'big') + '<h2>Exercício bloqueado</h2><p class="muted">Resolva o exercício ' + prev.levelName + ' ' + prev.pos + ' para liberar este.</p><a class="btn btn-primary" href="#ex-' + prev.id + '">Ir para o exercício anterior</a></div>';
      return;
    }
    st.progress.lastExercise = ex.id; S.save();
    if (currentCleanup) { currentCleanup(); currentCleanup = null; }
    const wantsLesson = mode === 'lesson' || (!mode && st.settings.showLessons !== false && !st.progress.solved[ex.id] && !st.progress.lessonsSeen[ex.id]);
    if (wantsLesson) return renderLessonStage(view, ex);
    if (ex.track === 'excel' || ex.track === 'powerbi' || ex.track === 'gestao' || ex.track === 'python' || ex.track === 'ingles' || ex.track === 'sixsigma' || ex.track === 'estatistica') {
      ({ excel: global.ExcelPractice, powerbi: global.DaxPractice, gestao: global.GQPractice, python: global.PyPractice, ingles: global.EnPractice, sixsigma: global.GQPractice, estatistica: global.GQPractice })[ex.track].render(view, ex, {
        st: st, S: S,
        header: exHeader(st, ex, '<button class="btn btn-ghost sm" id="b-lesson">' + icon('book') + 'Conteúdo</button>'),
        setCleanup: function (fn) { currentCleanup = fn; },
        onSolved: function (fb, t, sub) { onSolved(view, ex, fb, t, sub); },
      });
      view.querySelector('#b-lesson').onclick = function () { renderExercise(view, ex.id, 'lesson'); global.scrollTo(0, 0); };
      return;
    }
    const nextEx = BANK.EXERCISES[ex.index + 1];
    const solved = st.progress.solved[ex.id];
    const xpVal = G.XP[ex.diff];
    const tables = global.SQLEngine.tablesOf(ex);

    view.innerHTML =
      exHeader(st, ex, '<button class="btn btn-ghost sm" id="b-lesson">' + icon('book') + 'Conteúdo</button>') +
      '<div class="ex-grid">' +
        '<div class="ex-brief">' +
          '<section class="card glass"><h3 class="card-k">Cenário</h3><p class="story">' + esc(ex.s) + '</p>' +
            '<div class="goal">' + icon('target') + '<div><h3 class="card-k">Objetivo da consulta</h3><p>' + esc(ex.g) + '</p></div></div>' +
            '<div class="req">' + (ex.k || []).map(function (k) { return '<span class="kbd">' + (k === 'SUBQUERY' ? 'SUBCONSULTA' : esc(k)) + '</span>'; }).join('') + '<span class="muted sm">comandos esperados</span></div>' +
          '</section>' +
          '<section class="card glass">' +
            '<header class="card-h"><h3 class="card-k">Tabelas envolvidas</h3></header>' +
            '<div class="tabs" role="tablist">' + tables.map(function (t, i) { return '<button role="tab" class="tab' + (i ? '' : ' on') + '" data-t="' + t + '">' + icon('table') + t + '</button>'; }).join('') + '</div>' +
            '<div class="seg" role="group"><button class="seg-b on" data-m="ddl">Estrutura</button><button class="seg-b" data-m="data">Dados de exemplo</button></div>' +
            '<div id="tbl-view"></div>' +
          '</section>' +
          '<section class="card glass hint-card" id="hint-card">' +
            '<header class="card-h"><h3 class="card-k">Ajuda</h3></header>' +
            '<div class="help-row"><button class="btn btn-ghost sm" id="b-hint">' + icon('bulb') + 'Ver dica</button><button class="btn btn-ghost sm" id="b-expected">' + icon('eye') + 'Resultado esperado</button><button class="btn btn-ghost sm" id="b-solution">' + icon('code') + 'Gabarito</button></div>' +
            '<div id="help-out"></div>' +
          '</section>' +
        '</div>' +
        '<div class="ex-work">' +
          '<section class="card glass editor-card">' +
            '<header class="editor-h"><span class="ed-title">' + icon('code') + 'consulta.sql</span><span class="muted sm hide-sm">Tab indenta · Shift+Tab recua · Ctrl+Espaço sugere</span></header>' +
            '<div class="editor-host" id="editor"></div>' +
            '<div class="editor-actions">' +
              '<button class="btn btn-ghost" id="b-run">' + icon('play') + 'Executar</button>' +
              '<button class="btn btn-primary" id="b-submit">' + icon('send') + 'Enviar resposta</button>' +
              '<button class="btn btn-quiet" id="b-clear">' + icon('eraser') + 'Limpar</button>' +
            '</div>' +
          '</section>' +
          '<section id="feedback" aria-live="polite"></section>' +
          '<section class="card glass result-card">' +
            '<header class="card-h"><h3 class="card-k">Resultado</h3><span class="muted sm" id="res-meta">Execute a consulta para ver o resultado</span></header>' +
            '<div id="result"><div class="empty-mini">' + icon('table') + 'O resultado aparece aqui, com busca, ordenação e paginação.</div></div>' +
          '</section>' +
        '</div>' +
      '</div>';

    /* ---- Tabelas: estrutura e dados ---- */
    let curTable = tables[0], curMode = 'ddl';
    function paintTable() {
      const out = view.querySelector('#tbl-view');
      if (!curTable) { out.innerHTML = ''; return; }
      if (curMode === 'ddl') out.innerHTML = '<pre class="code-block">' + highlightSql(global.SEED.creates[curTable]) + '</pre>';
      else dataTable(out, global.SQLEngine.tableData(curTable), { pageSize: 8 });
    }
    view.querySelectorAll('.tab').forEach(function (b) { b.onclick = function () { view.querySelectorAll('.tab').forEach(function (x) { x.classList.toggle('on', x === b); }); curTable = b.dataset.t; paintTable(); }; });
    view.querySelectorAll('.seg-b').forEach(function (b) { b.onclick = function () { view.querySelectorAll('.seg-b').forEach(function (x) { x.classList.toggle('on', x === b); }); curMode = b.dataset.m; paintTable(); }; });
    paintTable();

    /* ---- Editor ---- */
    let draftTimer = null;
    const editor = createEditor(view.querySelector('#editor'), st.progress.drafts[ex.id] || starterCode(ex), {
      change: function (v) { clearTimeout(draftTimer); draftTimer = setTimeout(function () { st.progress.drafts[ex.id] = v; S.save(); }, 400); },
      run: function () { doRun(); }, submit: function () { doSubmit(); },
    });
    currentCleanup = function () { clearTimeout(draftTimer); st.progress.drafts[ex.id] = editor.get(); S.save(); };

    const fb = view.querySelector('#feedback');
    const resultBox = view.querySelector('#result'), resMeta = view.querySelector('#res-meta');
    function showResult(r, ms) {
      if (!r) { resultBox.innerHTML = '<div class="empty-mini">' + icon('check') + 'Comando executado sem retornar linhas.</div>'; resMeta.textContent = ms != null ? 'executado em ' + ms.toFixed(0) + ' ms' : ''; return; }
      dataTable(resultBox, r); resMeta.textContent = fmt(r.values.length) + ' linha(s)' + (ms != null ? ' · ' + ms.toFixed(0) + ' ms' : '');
    }

    function errorPanel(r, graded) {
      const tries = st.progress.attempts[ex.id] || 0;
      fb.innerHTML = '<div class="fb fb-err glass">' +
        '<div class="fb-h">' + icon('x') + '<div><b>❌ Consulta incorreta</b>' + (r.title && r.title !== 'Consulta incorreta' ? '<span>' + esc(r.title) + '</span>' : '') + '</div>' +
        (r.line ? '<span class="pos-chip">Linha ' + r.line + ', coluna ' + r.col + '</span>' : '') + '</div>' +
        '<p class="fb-explain">' + esc(r.explain || '') + '</p>' +
        (r.message ? '<details class="tech"><summary>Mensagem técnica do SQLite</summary><code>' + esc(r.message) + '</code></details>' : '') +
        '<div class="fb-actions"><button class="btn btn-primary sm" data-a="retry">' + icon('refresh') + 'Tentar novamente</button>' +
        (r.line ? '<button class="btn btn-ghost sm" data-a="fix">' + icon('wrench') + 'Corrigir código</button>' : '<button class="btn btn-ghost sm" data-a="fix">' + icon('wrench') + 'Corrigir código</button>') +
        '<button class="btn btn-quiet sm" data-a="clear">' + icon('eraser') + 'Limpar editor</button></div>' +
        (graded && tries >= 2 && !st.progress.solved[ex.id] ? '<p class="fb-tip">' + icon('bulb') + (tries >= 3 ? 'Travou? A dica e o gabarito estão em Ajuda (o gabarito vale metade do XP).' : 'Experimente a dica no painel Ajuda.') + '</p>' : '') +
        '</div>';
      if (r.line) editor.markError(r.line);
      fb.querySelector('[data-a=retry]').onclick = function () { doSubmit(); };
      fb.querySelector('[data-a=fix]').onclick = function () { editor.goTo(r.line || 1, r.col || 1); };
      fb.querySelector('[data-a=clear]').onclick = clearEditor;
    }

    function doRun() {
      const r = global.SQLEngine.run(editor.get(), ex);
      if (r.ok) { fb.innerHTML = ''; showResult(r.result, r.ms); }
      else errorPanel(r, false);
    }

    function doSubmit() {
      const code = editor.get();
      st.progress.attempts[ex.id] = (st.progress.attempts[ex.id] || 0) + 1;
      const r = global.SQLEngine.evaluate(ex, code);
      if (r.result !== undefined) showResult(r.result, r.ms);
      if (r.status !== 'correct') { st.progress.firstTryStreak = 0; S.save(); errorPanel(r, true); return; }
      onSolved(view, ex, fb, '✅ Consulta correta', 'Resultado idêntico ao esperado e comandos corretos.');
    }

    function clearEditor() { editor.set(starterCode(ex)); fb.innerHTML = ''; editor.focus(); }

    view.querySelector('#b-lesson').onclick = function () { renderExercise(view, ex.id, 'lesson'); global.scrollTo(0, 0); };
    view.querySelector('#b-run').onclick = doRun;
    view.querySelector('#b-submit').onclick = doSubmit;
    view.querySelector('#b-clear').onclick = clearEditor;

    /* ---- Ajuda ---- */
    const helpOut = view.querySelector('#help-out');
    view.querySelector('#b-hint').onclick = function () {
      helpOut.innerHTML = '<p class="help-txt">' + icon('bulb') + esc(ex.h || defaultHint(ex)) + '</p>';
    };
    view.querySelector('#b-expected').onclick = function () {
      const exp = global.SQLEngine.expectedFor(ex);
      helpOut.innerHTML = '<p class="muted sm">Resultado que sua consulta deve produzir' + (ex.c ? ' (após a verificação automática)' : '') + ':</p><div id="exp-table"></div>';
      dataTable(helpOut.querySelector('#exp-table'), exp, { pageSize: 6 });
    };
    view.querySelector('#b-solution').onclick = function () {
      const show = function () {
        st.progress.revealed[ex.id] = true; S.save();
        helpOut.innerHTML = '<pre class="code-block">' + highlightSql(ex.q) + '</pre><button class="btn btn-ghost sm" id="b-copy">' + icon('copy') + 'Copiar para o editor</button>';
        helpOut.querySelector('#b-copy').onclick = function () { editor.set(ex.q.replace(/; /g, ';\n')); editor.focus(); };
      };
      if (st.progress.solved[ex.id] || st.progress.revealed[ex.id]) return show();
      helpOut.innerHTML = '<div class="confirm"><p>Ver o gabarito reduz o XP deste exercício para <b>' + Math.round(xpVal / 2) + ' XP</b>. Deseja continuar?</p>' +
        '<div class="help-row"><button class="btn btn-primary sm" id="b-yes">Mostrar gabarito</button><button class="btn btn-quiet sm" id="b-no">Cancelar</button></div></div>';
      helpOut.querySelector('#b-yes').onclick = show;
      helpOut.querySelector('#b-no').onclick = function () { helpOut.innerHTML = ''; };
    };
    if (st.progress.solved[ex.id]) setTimeout(function () { doRun(); }, 50);
  }

  /** Registra o acerto, dá XP e comemora (comum a SQL e Excel). */
  function onSolved(view, ex, fb, okTitle, okSub) {
    const st = S.state, xpVal = G.XP[ex.diff];
    const already = !!st.progress.solved[ex.id];
    let gained = 0, unlocked = { newPromotions: [], newAchievements: [] };
    if (!already) {
      const used = !!st.progress.revealed[ex.id];
      gained = used ? Math.round(xpVal / 2) : xpVal;
      const attempts = st.progress.attempts[ex.id] || 1;
      st.progress.solved[ex.id] = { xp: gained, at: new Date().toISOString(), attempts: attempts, usedSolution: used };
      st.progress.xp += gained;
      st.progress.history.push({ at: new Date().toISOString(), id: ex.id, xp: gained });
      st.progress.firstTryStreak = attempts === 1 && !used ? st.progress.firstTryStreak + 1 : 0;
      unlocked = G.evaluate(st, { justSolved: true });
      S.saveNow();
    }
    const lvCount = G.levelCount(st, ex.level);
    const nx = BANK.EXERCISES[ex.index + 1];
    fb.innerHTML = '<div class="fb fb-ok glass">' +
      '<div class="fb-h">' + icon('check') + '<div><b>' + okTitle + '</b><span>' + (already ? 'Você já tinha resolvido este exercício.' : okSub) + '</span></div>' +
      (gained ? '<span class="xp-pop">+' + gained + ' XP</span>' : '') + '</div>' +
      '<div class="fb-progress"><span>' + ex.levelName + '</span><div class="mini-bar"><i style="width:' + (lvCount * 2) + '%"></i></div><b>' + lvCount + '/50</b></div>' +
      '<div class="fb-actions">' + (nx ? '<a class="btn btn-primary sm" href="#ex-' + nx.id + '">Próximo exercício' + icon('chevR') + '</a>' : '<a class="btn btn-primary sm" href="#certificado">' + icon('award') + 'Ver certificado</a>') +
      '<a class="btn btn-ghost sm" href="#dashboard">Ver painel</a></div></div>';
    refreshChrome();
    if (!already) {
      const head = view.querySelector('.tags');
      head.insertAdjacentHTML('beforeend', '<span class="tag tag-ok">' + icon('check') + 'Resolvido · +' + gained + ' XP</span>');
      const nextBtn = view.querySelector('.ex-nav .disabled'); if (nextBtn && nx) { nextBtn.classList.remove('disabled'); nextBtn.setAttribute('href', '#ex-' + nx.id); nextBtn.removeAttribute('aria-disabled'); }
      toast('+' + gained + ' XP · ' + esc(ex.n), 'xp');
      unlocked.newAchievements.forEach(function (a, i) { setTimeout(function () { toast('Conquista desbloqueada: <b>' + esc(a.nome) + '</b>', 'success', 4200); }, 500 + i * 700); });
      unlocked.newPromotions.forEach(function (p, i) { setTimeout(function () { promotionModal(p); }, 700 + i * 400); });
      if (!unlocked.newPromotions.length) { confetti(); global.Sfx.play('goal'); }
    }
  }


  function defaultHint(ex) {
    const k = (ex.k || []).map(function (x) { return x === 'SUBQUERY' ? 'uma subconsulta' : x; }).join(', ');
    return 'Comece pelo FROM com as tabelas citadas, depois escreva o SELECT com as colunas do objetivo. Este exercício pede: ' + k + '. Compare com o "Resultado esperado" para ajustar colunas e filtros.';
  }

  /* --------------------------- Modal de promoção --------------------------- */
  function promotionModal(p) {
    const legend = !!p.final;
    confetti(legend ? 'legend' : null);
    global.Sfx.play(legend ? 'legend' : 'promotion');
    if (legend) setTimeout(function () { confetti('legend'); }, 900);
    // certificados liberados por esta promoção (etapa, nível e/ou final)
    const all = global.Certificate.catalog(S.state);
    const certs = global.Certificate.forPromotion(p.key).map(function (id) { return all.find(function (c) { return c.id === id; }); }).filter(Boolean);
    const main = certs[certs.length - 1];
    const label = function (c) { return c.type === 'final' ? G.FINAL.nome : c.title; };
    const m = modal('<div class="promo' + (legend ? ' legend' : '') + '">' +
      '<div class="promo-ring"><div class="promo-core">' + icon(legend ? 'trophy' : 'award') + '</div></div>' +
      '<p class="eyebrow">' + (legend ? 'Promoção final' : 'Promoção conquistada') + '</p>' +
      '<h2>' + esc(p.nome) + '</h2><p class="muted">' + esc(p.desc) + '</p>' +
      (certs.length ? '<ul class="promo-certs">' + certs.map(function (c) { return '<li class="t-' + c.type + '">' + icon('target') + '<span>Prova liberada · ' + esc(c.kicker) + ': <b>' + esc(label(c)) + '</b> <small class="muted">(medalha ' + c.medal.name + ')</small></span></li>'; }).join('') + '</ul>' +
        '<p class="muted sm">Acerte pelo menos 11 de 15 questões (70%) para liberar o certificado.</p>' : '') +
      '<div class="help-row promo-actions">' + (main ? '<button class="btn btn-primary" id="go-cert">' + icon('play') + 'Fazer prova agora</button>' : '') +
      '<button class="btn ' + (main ? 'btn-ghost' : 'btn-primary') + '" id="go-on">' + (main ? 'Fazer depois' : 'Continuar jornada') + '</button></div>' +
      '</div>', {});
    m.el.querySelector('#go-on').onclick = function () { m.close(); };
    const gc = m.el.querySelector('#go-cert');
    if (gc) gc.onclick = function () { m.close(); global.Exams.start(certs[0].id); };
  }

  /* ------------------------------ Conquistas ------------------------------ */
  function renderAchievements(view) {
    const st = S.state, a = st.progress.achievements;
    const got = G.ACHIEVEMENTS.filter(function (x) { return a[x.key]; }).length;
    view.innerHTML = '<header class="page-h"><div><p class="eyebrow">Conquistas</p><h1>' + got + ' de ' + G.ACHIEVEMENTS.length + ' desbloqueadas</h1></div></header>' +
      '<section class="medals big">' + G.MEDALS.map(function (m) {
        const c = G.levelCount(st, m.level), ok = c >= 50;
        return '<div class="medal glass ' + (ok ? 'got tone-' + m.tone : 'locked') + '">' + icon(ok ? 'medal' : 'lock') + '<b>' + m.nome + '</b><span>' + m.desc + '</span><div class="mini-bar"><i style="width:' + c * 2 + '%"></i></div><span class="muted sm">' + c + '/50</span></div>';
      }).join('') + '</section>' +
      '<section class="ach-grid">' + G.ACHIEVEMENTS.map(function (x) {
        const on = a[x.key];
        return '<div class="ach glass ' + (on ? 'on' : 'off') + '"><div class="ach-ic">' + icon(on ? x.icon : 'lock') + '</div><div><b>' + esc(x.nome) + '</b><p>' + esc(x.desc) + '</p><span class="muted sm">' + (on ? 'Desbloqueada em ' + fmtDate(on) : 'Bloqueada') + '</span></div></div>';
      }).join('') + '</section>';
  }

  /* ------------------------------- Ranking ------------------------------- */
  function renderRanking(view) {
    const st = S.state; const board = G.leaderboard(st); const tier = G.tierOf(st.progress.xp);
    const nextTier = G.TIERS.find(function (t) { return t.min > st.progress.xp; });
    const C = global.Cloud, real = C && C.uid && C.board(st.currentTrack);
    const seen = JSON.stringify(real || null);
    if (C && C.uid) C.refreshBoard(st.currentTrack).then(function (b) { if (b && JSON.stringify(b) !== seen && location.hash === '#ranking' && !global.Overview.isOverview(S.state)) rerender(); });
    view.innerHTML = '<header class="page-h"><div><p class="eyebrow">Ranking · ' + esc(global.Tracks.active().nome) + '</p><h1>Liga Trust</h1><p class="muted">' + (real ? 'Sua posição entre os alunos da Trust Intelligence Academy nesta trilha (apelido e XP).' : 'Sua posição entre jogadores de referência (perfis fictícios usados como parâmetro de ritmo). Entre com Google para disputar com alunos reais.') + '</p></div></header>' +
      '<div class="rank-grid">' +
        '<section class="card glass"><ol class="board">' + board.map(global.Dashboard.boardRow).join('') + '</ol></section>' +
        '<section class="card glass"><header class="card-h"><h2>Faixas de XP</h2></header>' +
          '<div class="tier-badge tone-' + tier.tone + '">' + icon('shield') + '<div><b>' + tier.nome + '</b><span>' + (nextTier ? 'Faltam ' + fmt(nextTier.min - st.progress.xp) + ' XP para ' + nextTier.nome : 'Faixa máxima') + '</span></div></div>' +
          '<ul class="tiers">' + G.TIERS.map(function (t) { return '<li class="' + (t.nome === tier.nome ? 'cur' : '') + '"><span class="tier-dot tone-' + t.tone + '"></span>' + t.nome + '<b>' + fmt(t.min) + ' XP</b></li>'; }).join('') + '</ul>' +
          '<p class="muted sm">XP por exercício: fácil 10 · média 20 · difícil 30. Total possível: ' + fmt(G.MAX_XP) + ' XP.</p>' +
        '</section>' +
      '</div>';
  }

  /* -------------------------------- Perfil -------------------------------- */
  function renderProfile(view) {
    const st = S.state, p = st.profile;
    const prov = { google: 'Google', local: 'Perfil local (e-mail)', guest: 'Visitante' }[p.provider] || p.provider;
    view.innerHTML = '<header class="page-h pf-head"><div class="pf-head-l"><span class="pf-head-av" id="pf-head-av">' + global.Profile.avatarHtml(p) + '</span><div><p class="eyebrow">Perfil</p><h1>' + esc(p.nome + ' ' + p.sobrenome) + '</h1><p class="muted">Chamado na jornada de <b>' + esc(p.apelido) + '</b></p></div></div>' +
      '<button class="btn btn-ghost" id="pf-edit">' + icon('user') + 'Editar dados</button></header>' +
      '<div class="profile-grid">' +
        '<section class="card glass pf-card" id="pf-public"></section>' +
        '<section class="card glass"><h2>Conta</h2><dl class="cert-dl">' +
          '<div><dt>Acesso</dt><dd>' + esc(prov) + '</dd></div><div><dt>E-mail</dt><dd>' + esc(p.email || '—') + '</dd></div>' +
          '<div><dt>Início da jornada</dt><dd>' + fmtDate(p.createdAt) + '</dd></div>' +
          '<div><dt>Armazenamento</dt><dd>' + (global.Cloud && global.Cloud.uid ? 'Nuvem (sua conta Google) · cópia neste navegador' : S.available ? 'LocalStorage deste navegador · salvamento automático' : 'Somente memória (armazenamento bloqueado)') + '</dd></div></dl>' +
          (global.Cloud && global.Cloud.enabled() && !global.Cloud.uid ? '<div class="cloud-cta"><p>' + icon('shield') + '<span>Seu progresso está salvo só neste navegador. Entre com Google para guardar tudo na nuvem e continuar em qualquer aparelho.</span></p><button class="btn btn-google sm" id="pf-cloud">' + icon('google') + 'Entrar com Google e salvar na nuvem</button></div>' : '') +
          '<button class="btn btn-quiet" id="pf-logout">' + icon('logout') + 'Sair</button></section>' +
        '<section class="card glass"><h2>Backup do progresso</h2><p class="muted">Copie o código para guardar sua evolução ou levá-la para outro navegador.</p>' +
          '<div class="help-row"><button class="btn btn-primary sm" id="bk-copy">' + icon('copy') + 'Copiar código de backup</button></div>' +
          '<label class="field"><span>Restaurar de um código</span><textarea id="bk-in" rows="3" placeholder="Cole aqui um código que começa com TRUST1."></textarea></label>' +
          '<button class="btn btn-ghost sm" id="bk-restore">' + icon('upload') + 'Restaurar progresso</button></section>' +
        '<section class="card glass"><h2>Preferências de estudo</h2><p class="muted">Libera todos os exercícios fora de ordem. O certificado continua exigindo os 150 resolvidos.</p>' +
          '<label class="switch"><input type="checkbox" id="free-mode"' + (st.settings.freeMode ? ' checked' : '') + '><span></span>Desbloquear todos os exercícios</label>' +
          '<div class="help-row sfx-row"><span class="muted sm">Ouvir comemorações:</span><button class="btn btn-ghost sm" data-sfx="goal">' + icon('volume') + 'Acerto</button><button class="btn btn-ghost sm" data-sfx="promotion">' + icon('volume') + 'Promoção</button><button class="btn btn-ghost sm" data-sfx="legend">' + icon('volume') + esc(G.FINAL.nome) + '</button></div>' +
          '<label class="switch"><input type="checkbox" id="show-lessons"' + (st.settings.showLessons !== false ? ' checked' : '') + '><span></span>Mostrar o conteúdo em slides antes de cada exercício</label></section>' +
        '<section class="card glass danger"><h2>Recomeçar do zero</h2><p class="muted">Apaga XP, exercícios, conquistas e promoções do tema atual. Seu nome e os outros temas são mantidos.</p><div id="reset-zone"><button class="btn btn-danger sm" id="pf-reset">Apagar progresso</button></div></section>' +
      '</div>';
    currentCleanup = global.Profile.mount(view.querySelector('#pf-public'), st, S, function () {
      refreshChrome();
      const h = view.querySelector('#pf-head-av'); if (h) h.innerHTML = global.Profile.avatarHtml(st.profile);
    });
    view.querySelector('#pf-edit').onclick = function () { global.Auth.ensureProfile(st, function () { route(); }, true); };
    const pc = view.querySelector('#pf-cloud'); if (pc) pc.onclick = upgradeToCloud;
    view.querySelector('#pf-logout').onclick = function () {
      const C = global.Cloud;
      const done = function () { S.logout(); location.hash = ''; showLogin(); };
      if (C && C.uid) { S.saveNow(); C.signOut().then(done, done); } else done();
    };
    view.querySelector('#bk-copy').onclick = function () { copyText(S.exportBackup(), 'Código de backup copiado.'); };
    view.querySelector('#bk-restore').onclick = function () {
      try { S.importBackup(view.querySelector('#bk-in').value); toast('Progresso restaurado.', 'success'); route(); }
      catch (e) { toast('Código inválido. Confira se copiou o texto inteiro, começando por TRUST1.', 'error', 5000); }
    };
    view.querySelectorAll('[data-sfx]').forEach(function (b) { b.onclick = function () { if (!global.Sfx.enabled()) { toast('Os sons estão desligados. Ligue pelo ícone de alto-falante no topo.', 'warn'); return; } global.Sfx.play(b.dataset.sfx); }; });
    view.querySelector('#show-lessons').onchange = function (e) { st.settings.showLessons = e.target.checked; S.saveNow(); toast(e.target.checked ? 'O conteúdo aparecerá antes de cada exercício novo.' : 'Os exercícios abrirão direto na prática.', 'info'); };
    view.querySelector('#free-mode').onchange = function (e) { st.settings.freeMode = e.target.checked; S.saveNow(); toast(e.target.checked ? 'Modo prática ativado.' : 'Ordem da trilha restaurada.', 'info'); };
    view.querySelector('#pf-reset').onclick = function () {
      const z = view.querySelector('#reset-zone');
      z.innerHTML = '<p><b>Tem certeza?</b> Esta ação não pode ser desfeita.</p><div class="help-row"><button class="btn btn-danger sm" id="r-yes">Sim, apagar tudo</button><button class="btn btn-quiet sm" id="r-no">Cancelar</button></div>';
      z.querySelector('#r-yes').onclick = function () { S.resetProgress(); toast('Progresso apagado. Boa nova jornada!', 'info'); location.hash = 'dashboard'; route(); };
      z.querySelector('#r-no').onclick = function () { renderProfile(view); };
    };
  }

  boot();
})(window);
