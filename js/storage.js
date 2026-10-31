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

  /* ---------------------- Junção de dois aparelhos ---------------------- */
  // Quando o mesmo aluno usa dois aparelhos, nada é descartado: os exercícios,
  // provas, promoções e conquistas dos dois são unidos. Em campos de valor único
  // (configurações, rascunhos, tema atual) vale o aparelho salvo mais recentemente.
  function earliest(a, b) { if (!a) return b || null; if (!b) return a; return String(a) <= String(b) ? a : b; }
  function latest(a, b) { if (!a) return b || null; if (!b) return a; return String(a) >= String(b) ? a : b; }
  function sumSolved(p) { return Object.keys(p.solved || {}).reduce(function (s, k) { return s + ((p.solved[k] && p.solved[k].xp) || 0); }, 0); }
  function mergeProgress(n, o) {
    n = merge(defaultProgress(), JSON.parse(JSON.stringify(n || {})));
    o = merge(defaultProgress(), JSON.parse(JSON.stringify(o || {})));
    const out = defaultProgress();
    const keys = function (a, b) { return Object.keys(Object.assign({}, a || {}, b || {})); };
    keys(n.solved, o.solved).forEach(function (k) {
      const a = n.solved[k], b = o.solved[k];
      out.solved[k] = !a ? b : !b ? a : (a.xp !== b.xp ? (a.xp > b.xp ? a : b) : (String(a.at) <= String(b.at) ? a : b));
    });
    keys(n.attempts, o.attempts).forEach(function (k) { out.attempts[k] = Math.max(n.attempts[k] || 0, o.attempts[k] || 0); });
    keys(n.revealed, o.revealed).forEach(function (k) { out.revealed[k] = !!(n.revealed[k] || o.revealed[k]); });
    out.drafts = Object.assign({}, o.drafts, n.drafts);
    keys(n.lessonsSeen, o.lessonsSeen).forEach(function (k) { out.lessonsSeen[k] = earliest(n.lessonsSeen[k], o.lessonsSeen[k]); });
    keys(n.achievements, o.achievements).forEach(function (k) { out.achievements[k] = earliest(n.achievements[k], o.achievements[k]); });
    keys(n.exams, o.exams).forEach(function (k) {
      const a = n.exams[k] || {}, b = o.exams[k] || {};
      const hist = (a.history || []).concat(b.history || []).filter(function (h, i, arr) { return arr.findIndex(function (x) { return x.at === h.at; }) === i; })
        .sort(function (x, y) { return String(x.at).localeCompare(String(y.at)); }).slice(-20);
      out.exams[k] = { attempts: Math.max(a.attempts || 0, b.attempts || 0, hist.length), best: Math.max(a.best || 0, b.best || 0),
        score: a.score != null ? a.score : b.score, last: latest(a.last, b.last), passedAt: earliest(a.passedAt, b.passedAt), history: hist };
    });
    const promos = {};
    (o.promotions || []).concat(n.promotions || []).forEach(function (p) { promos[p.key] = promos[p.key] ? { key: p.key, at: earliest(promos[p.key].at, p.at) } : p; });
    out.promotions = Object.keys(promos).map(function (k) { return promos[k]; }).sort(function (x, y) { return String(x.at).localeCompare(String(y.at)); });
    const hist = {};
    (o.history || []).concat(n.history || []).forEach(function (h) { if (!hist[h.id] || String(h.at) < String(hist[h.id].at)) hist[h.id] = h; });
    out.history = Object.keys(hist).map(function (k) { return hist[k]; }).filter(function (h) { return out.solved[h.id]; })
      .sort(function (x, y) { return String(x.at).localeCompare(String(y.at)); });
    const bonus = Math.max(0, (n.xp || 0) - sumSolved(n), (o.xp || 0) - sumSolved(o));
    out.xp = sumSolved(out) + bonus;
    out.firstTryStreak = n.firstTryStreak || 0;
    out.lastExercise = n.lastExercise || o.lastExercise;
    out.completedAt = earliest(n.completedAt, o.completedAt);
    return out;
  }
  /** Une dois estados do mesmo aluno (de aparelhos diferentes). */
  function mergeStates(A, B) {
    if (!A) return B; if (!B) return A;
    const newer = String(A.savedAt || '') >= String(B.savedAt || '') ? A : B, older = newer === A ? B : A;
    const out = JSON.parse(JSON.stringify(newer));
    const pn = newer.profile || {}, po = older.profile || {};
    out.profile = Object.assign({}, po, pn);
    Object.keys(po).forEach(function (k) {   // campos vazios no mais novo herdam do outro
      const v = pn[k];
      if (v === undefined || v === null || v === '' || (Array.isArray(v) && !v.length)) out.profile[k] = po[k];
    });
    out.profile.createdAt = earliest(pn.createdAt, po.createdAt);
    out.tracks = {};
    Object.keys(Object.assign({}, newer.tracks || {}, older.tracks || {})).forEach(function (k) {
      out.tracks[k] = mergeProgress((newer.tracks || {})[k], (older.tracks || {})[k]);
    });
    return out;
  }
  /** Representação para comparar estados ignorando a hora do salvamento. */
  function signature(st) { return st ? JSON.stringify(Object.assign({}, st, { savedAt: 0 })) : ''; }
  function plain() { return state ? JSON.parse(JSON.stringify(state)) : null; }

  /**
   * Aplica um estado vindo de outro aparelho (já unido), sem trocar os objetos
   * que as telas abertas estão usando. Não reenvia para a nuvem.
   */
  function applyRemote(remote) {
    if (!state || !remote) return false;
    const merged = mergeStates(plain(), remote);
    if (signature(merged) === signature(plain())) return false;
    Object.assign(state.profile, merged.profile);
    Object.keys(merged.tracks).forEach(function (k) {
      if (state.tracks[k]) { Object.keys(state.tracks[k]).forEach(function (f) { delete state.tracks[k][f]; }); Object.assign(state.tracks[k], merged.tracks[k]); }
      else state.tracks[k] = merged.tracks[k];
    });
    state.settings = merged.settings || state.settings;
    saveNow(true);
    emit('remote');
    return true;
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
    if (cloudData && cloudData.profile) parsed = parsed ? mergeStates(migrate(parsed), migrate(cloudData)) : cloudData;
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
  function saveNow(skipRemote) {
    if (!state || !uid) return;
    clearTimeout(timer); timer = null;
    state.savedAt = new Date().toISOString();
    const prev = read(keyFor(uid));
    if (prev) write(keyFor(uid) + ':bak', prev);
    write(keyFor(uid), JSON.stringify(state));
    emit('saved');
    if (remote && skipRemote !== true) { try { remote(state); } catch (e) { /* ignora */ } }
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
    getSession: getSession, load: load, peek: peek, setRemote: setRemote, mergeStates: mergeStates, applyRemote: applyRemote, signature: signature, plain: plain, save: save, saveNow: saveNow, setTrack: setTrack,
    exportBackup: exportBackup, importBackup: importBackup, resetProgress: resetProgress, logout: logout, on: on,
  };
})(window);
