/* =====================================================================
   cloud.js — Login com Google e progresso na nuvem (Firebase)
   ---------------------------------------------------------------------
   • Login: Firebase Authentication com Google (popup; redirect no
     celular quando o popup é bloqueado).
   • Progresso: documento users/{uid} no Firestore, gravado alguns
     segundos após cada salvamento local. O LocalStorage continua como
     cópia local; sem internet, as gravações ficam na fila (IndexedDB)
     e são enviadas quando a conexão volta.
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
  let uid = null, saveTimer = null, pendingState = null;
  let status = 'idle';
  const listeners = [];
  const boards = {}, boardAt = {};

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
      try { await db.enablePersistence({ synchronizeTabs: true }); } catch (e) { /* outra aba ou navegador sem IndexedDB */ }
      return true;
    })();
    ready.catch(function () { ready = null; });
    return ready;
  }
  function withTimeout(p, ms) { return Promise.race([p, new Promise(function (_, rej) { setTimeout(function () { rej(new Error('timeout')); }, ms); })]); }

  /** Usuário já logado (sessão guardada pelo Firebase), ou null. */
  async function currentUser() {
    await init();
    if (sessionStorage.getItem(REDIRECT_FLAG)) {
      sessionStorage.removeItem(REDIRECT_FLAG);
      try { const r = await auth.getRedirectResult(); if (r && r.user) return r.user; } catch (e) { emit('error', mapError(e)); }
    }
    return new Promise(function (res) { const un = auth.onAuthStateChanged(function (u) { un(); res(u); }); });
  }
  function redirectPending() { try { return !!sessionStorage.getItem(REDIRECT_FLAG); } catch (e) { return false; } }

  /** Abre o login do Google. Devolve o usuário (ou null se for por redirect). */
  async function signIn() {
    await withTimeout(init(), 15000);
    const provider = new global.firebase.auth.GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    try {
      const r = await auth.signInWithPopup(provider);
      return r.user;
    } catch (e) {
      if (e && (e.code === 'auth/popup-blocked' || e.code === 'auth/operation-not-supported-in-this-environment')) {
        sessionStorage.setItem(REDIRECT_FLAG, '1');
        await auth.signInWithRedirect(provider);
        return null;
      }
      throw new Error(mapError(e));
    }
  }
  function mapError(e) {
    const c = (e && e.code) || '';
    if (c === 'auth/popup-closed-by-user' || c === 'auth/cancelled-popup-request') return 'Login cancelado.';
    if (c === 'auth/unauthorized-domain') return 'Este endereço ainda não está autorizado no Firebase (Authentication → Configurações → Domínios autorizados).';
    if (c === 'auth/network-request-failed') return 'Sem conexão com a internet.';
    if (c === 'permission-denied') return 'O banco recusou a gravação. Confira as regras do Firestore.';
    return (e && e.message) || 'Erro ao conectar com a nuvem.';
  }
  function profileFrom(u) {
    const parts = String(u.displayName || '').trim().split(/\s+/);
    return { provider: 'google', email: u.email || '', picture: u.photoURL || '', nome: parts[0] || '', sobrenome: parts.slice(1).join(' ') };
  }

  /** Lê o progresso salvo na nuvem (ou null se ainda não existir). */
  async function load(fbUid) {
    await init();
    const snap = await withTimeout(db.collection('users').doc(fbUid).get(), 12000);
    if (!snap.exists) return null;
    const d = snap.data();
    try { return d && d.payload ? JSON.parse(d.payload) : null; } catch (e) { return null; }
  }

  /* ------------------------------ Gravação ------------------------------ */
  function attach(fbUid) { uid = fbUid; emit('idle'); }
  function detach() { flush(); uid = null; pendingState = null; }
  function queueSave(state) {
    if (!uid || !db) return;
    pendingState = state;
    emit('pending');
    clearTimeout(saveTimer);
    saveTimer = setTimeout(flush, 2500);
  }
  function rankDoc(st) {
    const xp = {};
    Object.keys(st.tracks || {}).forEach(function (k) { xp[k] = st.tracks[k].xp || 0; });
    const total = Object.keys(xp).reduce(function (s, k) { return s + xp[k]; }, 0);
    return { nome: st.profile.apelido || st.profile.nome || 'Aluno', avatar: st.profile.avatar || '', xp: xp, total: total, updatedAt: global.firebase.firestore.FieldValue.serverTimestamp() };
  }
  function flush() {
    clearTimeout(saveTimer); saveTimer = null;
    if (!uid || !db || !pendingState) return Promise.resolve();
    const st = pendingState; pendingState = null;
    const ts = global.firebase.firestore.FieldValue.serverTimestamp();
    const batch = db.batch();
    batch.set(db.collection('users').doc(uid), { payload: JSON.stringify(st), savedAt: st.savedAt || null, updatedAt: ts });
    batch.set(db.collection('leaderboard').doc(uid), rankDoc(st));
    emit('syncing');
    // com a persistência offline, a gravação fica na fila mesmo sem internet
    return batch.commit().then(function () { emit('synced'); })
      .catch(function (e) { emit('error', mapError(e)); });
  }

  /* ------------------------------ Ranking ------------------------------ */
  function board(track) { return boards[track] || null; }
  /** Busca os 50 melhores da trilha (no máximo a cada 20 segundos). */
  async function refreshBoard(track, force) {
    if (!uid || !db) return null;
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
    uid = null;
    if (auth) { try { await auth.signOut(); } catch (e) { /* ignora */ } }
    Object.keys(boards).forEach(function (k) { delete boards[k]; delete boardAt[k]; });
  }

  if (typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', function () { if (document.hidden) flush(); });
    global.addEventListener('pagehide', function () { flush(); });
    global.addEventListener('online', function () { if (uid) emit('idle'); });
  }

  global.Cloud = {
    enabled: enabled, init: init, currentUser: currentUser, redirectPending: redirectPending, signIn: signIn, signOut: signOut,
    profileFrom: profileFrom, load: load, attach: attach, detach: detach, queueSave: queueSave, flush: flush,
    board: board, refreshBoard: refreshBoard, on: on,
    get uid() { return uid; }, get status() { return status; },
  };
})(window);
