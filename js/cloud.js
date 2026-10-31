/* =====================================================================
   cloud.js — Login com Google e progresso na nuvem (Firebase)
   ---------------------------------------------------------------------
   • Login: Firebase Authentication com Google (popup; redirect no
     celular quando o popup é bloqueado).
   • Progresso: documento users/{uid} no Firestore. Cada gravação é uma
     transação que UNE o progresso deste aparelho com o que já está na
     nuvem (AppStorage.mergeStates): nenhum aparelho apaga o avanço do
     outro. Sem internet, o envio fica pendente e é refeito sozinho.
   • Tempo real: um ouvinte recebe o que outro aparelho gravou e junta
     com o progresso aberto nesta tela.
   • Ranking: leaderboard/{uid} com apelido e XP por trilha.
   • A configuração abaixo é pública por natureza (identifica o
     projeto). Quem protege os dados são as regras do Firestore.
   • Dentro de um visualizador (iframe) a nuvem fica desligada e a
     plataforma funciona só com o LocalStorage.
   ===================================================================== */
(function (global) {
  'use strict';

  const FIREBASE_CONFIG = {
    apiKey: 'AIzaSyCn36Tj2Ffc26bN2KHuISpOZD11YWQnvxc',
    authDomain: 'trust-intelligence-academy.firebaseapp.com',
    projectId: 'trust-intelligence-academy',
    storageBucket: 'trust-intelligence-academy.firebasestorage.app',
    messagingSenderId: '785565376404',
    appId: '1:785565376404:web:58d2a87063e0a0867ef981',
  };
  const SDK_VERSION = '10.12.2';
  const REDIRECT_FLAG = 'trustacademy:redirect';

  let ready = null, auth = null, db = null;
  let uid = null, saveTimer = null, retryTimer = null, pendingState = null, writing = false;
  let lastSig = '', unwatch = null, redirectMode = null;
  let status = 'idle';
  const listeners = [];
  const boards = {}, boardAt = {};

  function S() { return global.AppStorage; }
  function enabled() { return !!FIREBASE_CONFIG.apiKey && !(global.UI && global.UI.framed); }
  function emit(s, info) { status = s; listeners.forEach(function (fn) { try { fn(s, info); } catch (e) { /* ignora */ } }); }
  function on(fn) { listeners.push(fn); }

  function loadScript(src) {
    return new Promise(function (res, rej) {
      const s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = function () { rej(new Error(src)); };
      document.head.appendChild(s);
    });
  }
  async function loadSdk(name) {
    const urls = ['https://www.gstatic.com/firebasejs/' + SDK_VERSION + '/firebase-' + name + '-compat.js',
      'https://cdn.jsdelivr.net/npm/firebase@' + SDK_VERSION + '/firebase-' + name + '-compat.js'];
    for (const u of urls) { try { await loadScript(u); return; } catch (e) { /* tenta o próximo */ } }
    throw new Error('Não foi possível carregar o Firebase (' + name + ').');
  }

  /** Carrega o SDK e inicializa Auth e Firestore (uma vez). */
  function init() {
    if (!enabled()) return Promise.reject(new Error('Nuvem indisponível neste ambiente.'));
    if (ready) return ready;
    ready = (async function () {
      await loadSdk('app'); await loadSdk('auth'); await loadSdk('firestore');
      const fb = global.firebase;
      if (!fb.apps.length) fb.initializeApp(FIREBASE_CONFIG);
      auth = fb.auth();
      await auth.setPersistence(fb.auth.Auth.Persistence.LOCAL).catch(function () {});
      db = fb.firestore();
      return true;
    })();
    ready.catch(function () { ready = null; });
    return ready;
  }
  /** Carrega o SDK antes do clique, para o popup do Google abrir na hora (celulares bloqueiam popups atrasados). */
  function preload() { if (enabled()) init().catch(function () {}); }
  function withTimeout(p, ms) { return Promise.race([p, new Promise(function (_, rej) { setTimeout(function () { rej(new Error('timeout')); }, ms); })]); }

  /** Usuário já logado (sessão guardada pelo Firebase), ou null. */
  async function currentUser() {
    await init();
    let mode = null;
    try { mode = sessionStorage.getItem(REDIRECT_FLAG); sessionStorage.removeItem(REDIRECT_FLAG); } catch (e) { /* ignora */ }
    if (mode) {
      redirectMode = mode;
      try { const r = await auth.getRedirectResult(); if (r && r.user) return r.user; } catch (e) { emit('error', mapError(e)); }
    }
    return new Promise(function (res) { const un = auth.onAuthStateChanged(function (u) { un(); res(u); }); });
  }
  function redirectPending() { try { return !!sessionStorage.getItem(REDIRECT_FLAG); } catch (e) { return false; } }
  /** 'upgrade' quando a volta do redirect veio do botão "Salvar na nuvem". */
  function lastRedirectMode() { const m = redirectMode; redirectMode = null; return m; }

  /** Abre o login do Google. Devolve o usuário (ou null se for por redirect). */
  function signIn(opts) {
    const go = function () {
      const provider = new global.firebase.auth.GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      return auth.signInWithPopup(provider).then(function (r) { return r.user; }, function (e) {
        if (e && (e.code === 'auth/popup-blocked' || e.code === 'auth/operation-not-supported-in-this-environment')) {
          try { sessionStorage.setItem(REDIRECT_FLAG, opts && opts.upgrade ? 'upgrade' : 'login'); } catch (x) { /* ignora */ }
          return auth.signInWithRedirect(provider).then(function () { return null; });
        }
        throw new Error(mapError(e));
      });
    };
    // com o SDK já carregado, o popup abre no mesmo clique
    if (auth) return go();
    return withTimeout(init(), 15000).then(go);
  }
  function mapError(e) {
    const c = (e && e.code) || '';
    if (c === 'auth/popup-closed-by-user' || c === 'auth/cancelled-popup-request') return 'Login cancelado.';
    if (c === 'auth/unauthorized-domain') return 'Este endereço ainda não está autorizado no Firebase (Authentication → Configurações → Domínios autorizados).';
    if (c === 'auth/network-request-failed' || c === 'unavailable') return 'Sem conexão com a internet.';
    if (c === 'permission-denied') return 'O banco recusou a gravação. Confira as regras do Firestore.';
    return (e && e.message) || 'Erro ao conectar com a nuvem.';
  }
  function profileFrom(u) {
    const parts = String(u.displayName || '').trim().split(/\s+/);
    return { provider: 'google', email: u.email || '', picture: u.photoURL || '', nome: parts[0] || '', sobrenome: parts.slice(1).join(' ') };
  }
  function parsePayload(d) { try { return d && d.payload ? JSON.parse(d.payload) : null; } catch (e) { return null; } }

  /** Lê o progresso salvo na nuvem (ou null se ainda não existir). Lança erro se não conseguir ler. */
  async function load(fbUid) {
    await init();
    const snap = await withTimeout(db.collection('users').doc(fbUid).get(), 12000);
    return snap.exists ? parsePayload(snap.data()) : null;
  }

  /* ------------------------------ Gravação ------------------------------ */
  function attach(fbUid) {
    uid = fbUid; lastSig = ''; emit('idle');
    if (db) watch();
    else init().then(function () { if (uid === fbUid) watch(); }).catch(function () {});
  }
  function detach() {
    if (unwatch) { try { unwatch(); } catch (e) { /* ignora */ } unwatch = null; }
    uid = null; pendingState = null; lastSig = '';
    clearTimeout(saveTimer); clearTimeout(retryTimer);
  }
  function queueSave(state) {
    if (!uid) return;
    const plain = JSON.parse(JSON.stringify(state));
    if (S().signature(plain) === lastSig) return;   // nada novo para enviar
    pendingState = plain;
    emit('pending');
    clearTimeout(saveTimer);
    saveTimer = setTimeout(flush, 2500);
  }
  function rankDoc(st) {
    const xp = {};
    Object.keys(st.tracks || {}).forEach(function (k) { xp[k] = st.tracks[k].xp || 0; });
    const total = Object.keys(xp).reduce(function (s, k) { return s + xp[k]; }, 0);
    return { nome: (st.profile && (st.profile.apelido || st.profile.nome)) || 'Aluno', avatar: (st.profile && st.profile.avatar) || '', xp: xp, total: total, updatedAt: global.firebase.firestore.FieldValue.serverTimestamp() };
  }
  /** Envia o progresso: lê a nuvem, une com este aparelho e grava o resultado (transação). */
  function flush() {
    clearTimeout(saveTimer); saveTimer = null;
    if (!uid || !pendingState) return Promise.resolve();
    if (!db) { init().then(flush).catch(retryLater); return Promise.resolve(); }
    if (writing) { saveTimer = setTimeout(flush, 1000); return Promise.resolve(); }
    const local = pendingState; pendingState = null; writing = true;
    const me = uid;
    const ref = db.collection('users').doc(me);
    emit('syncing');
    return db.runTransaction(function (tx) {
      return tx.get(ref).then(function (snap) {
        const remote = snap.exists ? parsePayload(snap.data()) : null;
        const merged = remote ? S().mergeStates(local, remote) : local;
        tx.set(ref, { payload: JSON.stringify(merged), savedAt: merged.savedAt || null, updatedAt: global.firebase.firestore.FieldValue.serverTimestamp() });
        tx.set(db.collection('leaderboard').doc(me), rankDoc(merged));
        return merged;
      });
    }).then(function (merged) {
      writing = false;
      if (uid !== me) return;
      lastSig = S().signature(merged);
      S().applyRemote(merged);   // traz para esta tela o que veio do outro aparelho
      emit('synced');
    }).catch(function (e) {
      writing = false;
      if (uid !== me) return;
      pendingState = pendingState || local;
      emit('error', mapError(e));
      retryLater();
    });
  }
  function retryLater() { clearTimeout(retryTimer); retryTimer = setTimeout(function () { if (pendingState) flush(); }, 15000); }

  /** Recebe em tempo real o que outro aparelho gravou. */
  function watch() {
    if (unwatch || !uid || !db) return;
    const me = uid;
    unwatch = db.collection('users').doc(me).onSnapshot(function (snap) {
      if (uid !== me || snap.metadata.hasPendingWrites || !snap.exists) return;
      const remote = parsePayload(snap.data());
      if (!remote) return;
      const sig = S().signature(remote);
      if (sig === lastSig) return;
      lastSig = sig;
      if (S().applyRemote(remote)) {
        // se este aparelho tinha algo que a nuvem não tinha, envia a união
        const cur = S().plain();
        if (S().signature(cur) !== sig) queueSave(cur);
      }
    }, function () { unwatch = null; });
  }

  /* ------------------------------ Ranking ------------------------------ */
  function board(track) { return boards[track] || null; }
  /** Busca os 50 melhores da trilha (no máximo a cada 20 segundos). */
  async function refreshBoard(track, force) {
    if (!uid) return null;
    try { await init(); } catch (e) { return null; }
    if (!force && boardAt[track] && Date.now() - boardAt[track] < 20000) return boards[track];
    boardAt[track] = Date.now();
    try {
      const snap = await withTimeout(db.collection('leaderboard').orderBy('xp.' + track, 'desc').limit(50).get(), 10000);
      boards[track] = snap.docs.map(function (d) { const v = d.data(); return { uid: d.id, nome: v.nome || 'Aluno', xp: (v.xp && v.xp[track]) || 0 }; })
        .filter(function (r) { return r.xp > 0 || r.uid === uid; });
      return boards[track];
    } catch (e) { return boards[track] || null; }
  }

  async function signOut() {
    await flush();
    detach();
    if (auth) { try { await auth.signOut(); } catch (e) { /* ignora */ } }
    Object.keys(boards).forEach(function (k) { delete boards[k]; delete boardAt[k]; });
  }

  if (typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', function () { if (document.hidden) flush(); });
    global.addEventListener('pagehide', function () { flush(); });
    global.addEventListener('online', function () { if (uid && pendingState) flush(); });
  }

  global.Cloud = {
    enabled: enabled, init: init, preload: preload, currentUser: currentUser, redirectPending: redirectPending, lastRedirectMode: lastRedirectMode,
    signIn: signIn, signOut: signOut, profileFrom: profileFrom, load: load, attach: attach, detach: detach, queueSave: queueSave, flush: flush,
    board: board, refreshBoard: refreshBoard, on: on,
    get uid() { return uid; }, get status() { return status; },
  };
})(window);
