/* =====================================================================
   storage.js — Persistência local da jornada
   ---------------------------------------------------------------------
   • Salva perfil e progresso no LocalStorage (um registro por usuário).
   • Progresso separado por tema: state.tracks[idDoTema].
     `state.progress` é um atalho (não salvo) para o tema atual.
   • Salvamento automático com debounce + gravação imediata ao sair da
     página ou trocar de aba (sistema anti-perda).
   • Mantém uma cópia de segurança da versão anterior: se o registro
     principal corromper, a cópia é restaurada automaticamente.
   • Migra automaticamente dados da versão anterior (NexusSQL).
   • Se o navegador bloquear o armazenamento (aba anônima, por exemplo),
     o app continua funcionando em memória e avisa o usuário.
   • Backup manual: exporta/importa um código de texto com todo o progresso.
   ===================================================================== */
(function (global) {
  'use strict';

  const PREFIX = 'trustacademy:v1:';
  const LEGACY_PREFIX = 'nexussql:v1:';   // versão anterior da plataforma
  const SESSION_KEY = PREFIX + 'session';
  const BACKUP_TAG = 'TRUST1.';
  const memory = {};          // fallback quando o LocalStorage não está disponível
  let available = true;
  let state = null;           // estado do usuário logado
  let uid = null;
  let timer = null;
  let remote = null;          // gravação na nuvem (Cloud.queueSave), quando o login é com Google
  const listeners = [];

  /* --------------------- Acesso seguro ao LocalStorage --------------------- */
  function read(key) {
    try { return global.localStorage.getItem(key); }
    catch (e) { available = false; return memory[key] || null; }
  }
  function write(key, value) {
    try { global.localStorage.setItem(key, value); }
    catch (e) { available = false; memory[key] = value; }
  }
  function remove(key) {
    try { global.localStorage.removeItem(key); } catch (e) { /* ignora */ }
    delete memory[key];
  }
  try { const k = PREFIX + '__t'; global.localStorage.setItem(k, '1'); global.localStorage.removeItem(k); }
  catch (e) { available = false; }

  /* ----------------------------- Estado padrão ----------------------------- */
  function defaultProgress() {
    return {
      solved: {},        // { '1-01': { xp, at, attempts, usedSolution } }
      attempts: {},      // tentativas por exercício
      revealed: {},      // gabaritos revelados
      drafts: {},        // rascunhos do editor por exercício
      lessonsSeen: {},   // conteúdos (carrosséis) concluídos por exercício
      exams: {},         // provas dos certificados: { certId: { attempts, best, score, passedAt, last } }
      xp: 0,
      history: [],       // [{ at, id, xp }] usado no gráfico de evolução
      promotions: [],    // [{ key, at }]
      achievements: {},  // { key: dataISO }
      firstTryStreak: 0,
      lastExercise: null,
      completedAt: null,
    };
  }
  function defaultState(profile) {
    return {
      version: 2,
      profile: Object.assign({ nome: '', sobrenome: '', apelido: '', email: '', provider: 'local', picture: '', photo: '', avatar: '', bio: '', hobbies: [], createdAt: new Date().toISOString() }, profile || {}),
      tracks: {},
      currentTrack: 'sql',
      settings: { freeMode: false, showLessons: true },
      savedAt: null,
    };
  }

  /** Converte estados antigos (progresso único) para o formato por tema. */
  function migrate(data) {
    if (data && data.progress && !data.tracks) { data.tracks = { sql: data.progress }; }
    if (data) delete data.progress;
    return data;
  }
  /** Garante campos novos em cada tema e cria o atalho `progress`. */
  function finalize(st) {
    Object.keys(st.tracks).forEach(function (k) { st.tracks[k] = merge(defaultProgress(), st.tracks[k]); });
    Object.defineProperty(st, 'progress', {
      enumerable: false, configurable: true,
      get: function () {
        if (!this.tracks[this.currentTrack]) this.tracks[this.currentTrack] = defaultProgress();
        return this.tracks[this.currentTrack];
      },
    });
    return st;
  }

  /* ------------------------------- Sessão ------------------------------- */
  function getSession() {
    try { return JSON.parse(read(SESSION_KEY) || read(LEGACY_PREFIX + 'session') || 'null'); } catch (e) { return null; }
  }
  function setSession(s) {
    if (s) write(SESSION_KEY, JSON.stringify(s)); else { remove(SESSION_KEY); remove(LEGACY_PREFIX + 'session'); }
  }

  /* --------------------------- Carregar / salvar --------------------------- */
  function keyFor(id) { return PREFIX + 'user:' + id; }

  /** Lê o estado salvo de um usuário sem ativá-lo (ou null). */
  function peek(id) { try { return JSON.parse(read(keyFor(id)) || 'null'); } catch (e) { return null; } }

  /**
   * Carrega (ou cria) o estado do usuário. Restaura do backup se necessário.
   * cloudData: estado vindo da nuvem; vence a cópia local se for mais recente.
   */
  function load(id, profileSeed, cloudData) {
    uid = id;
    let raw = read(keyFor(id)) || read(LEGACY_PREFIX + 'user:' + id);
    let parsed = null;
    try { parsed = raw ? JSON.parse(raw) : null; } catch (e) { parsed = null; }
    if (!parsed && raw) {
      try { parsed = JSON.parse(read(keyFor(id) + ':bak') || read(LEGACY_PREFIX + 'user:' + id + ':bak') || 'null'); } catch (e) { parsed = null; }
      if (parsed) emit('restored');
    }
    if (cloudData && cloudData.profile && (!parsed || String(cloudData.savedAt || '') >= String(parsed.savedAt || ''))) parsed = cloudData;
    state = finalize(parsed ? merge(defaultState(), migrate(parsed)) : defaultState(profileSeed));
    if (profileSeed && parsed) {
      ['email', 'picture', 'provider'].forEach(function (k) { if (profileSeed[k]) state.profile[k] = profileSeed[k]; });
    }
    setSession({ uid: id });
    saveNow();
    return state;
  }

  /** Mescla profunda simples para tolerar estados antigos. */
  function merge(base, extra) {
    Object.keys(extra || {}).forEach(function (k) {
      if (extra[k] && typeof extra[k] === 'object' && !Array.isArray(extra[k]) && base[k] && typeof base[k] === 'object' && !Array.isArray(base[k])) merge(base[k], extra[k]);
      else base[k] = extra[k];
    });
    return base;
  }

  /** Grava imediatamente, guardando a versão anterior como backup. */
  function saveNow() {
    if (!state || !uid) return;
    clearTimeout(timer); timer = null;
    state.savedAt = new Date().toISOString();
    const prev = read(keyFor(uid));
    if (prev) write(keyFor(uid) + ':bak', prev);
    write(keyFor(uid), JSON.stringify(state));
    emit('saved');
    if (remote) { try { remote(state); } catch (e) { /* ignora */ } }
  }
  /** Agenda um salvamento (debounce de 600 ms). */
  function save() { clearTimeout(timer); timer = setTimeout(saveNow, 600); }

  /** Troca o tema atual. */
  function setTrack(id) { state.currentTrack = id; void state.progress; saveNow(); }

  /* ------------------------------ Backup manual ------------------------------ */
  function exportBackup() { return BACKUP_TAG + btoa(unescape(encodeURIComponent(JSON.stringify(state)))); }
  function importBackup(code) {
    const clean = String(code || '').trim().replace(/^(TRUST1|NXSQL1)\./, '');
    const data = migrate(JSON.parse(decodeURIComponent(escape(atob(clean)))));
    if (!data || !data.tracks || !data.profile) throw new Error('Código de backup inválido');
    state = finalize(merge(defaultState(), data));
    saveNow();
    return state;
  }

  /** Apaga o progresso do tema atual (mantém perfil e outros temas). */
  function resetProgress() {
    state.tracks[state.currentTrack] = defaultProgress();
    saveNow();
    return state;
  }

  function logout() { saveNow(); remote = null; setSession(null); state = null; uid = null; }
  function setRemote(fn) { remote = fn; }

  /* ------------------------------- Eventos ------------------------------- */
  function on(fn) { listeners.push(fn); }
  function emit(type) { listeners.forEach(function (fn) { try { fn(type); } catch (e) { /* ignora */ } }); }

  if (typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', function () { if (document.hidden) saveNow(); });
    global.addEventListener('pagehide', saveNow);
    global.addEventListener('beforeunload', saveNow);
  }

  global.AppStorage = {
    get state() { return state; },
    get uid() { return uid; },
    get available() { return available; },
    getSession: getSession, load: load, peek: peek, setRemote: setRemote, save: save, saveNow: saveNow, setTrack: setTrack,
    exportBackup: exportBackup, importBackup: importBackup, resetProgress: resetProgress, logout: logout, on: on,
  };
})(window);
